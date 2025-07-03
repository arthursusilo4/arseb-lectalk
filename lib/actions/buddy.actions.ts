"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createBuddy = async (formData: CreateBuddy) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("buddies")
    .insert({ ...formData, author })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create a buddy");

  return data[0];
};

export const getAllBuddies = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllBuddies) => {
  const supabase = createSupabaseClient();

  let query = supabase.from("buddies").select();

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: buddies, error } = await query;

  if (error) throw new Error(error.message);

  return buddies;
};

// NEW: Get user's own buddies with filtering
export const getUserBuddiesWithFilters = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllBuddies) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();

  let query = supabase.from("buddies").select().eq("author", userId);

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: buddies, error } = await query;

  if (error) throw new Error(error.message);

  return buddies;
};

export const getBuddy = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("buddies").select().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error(error.message || "Failed to fetch buddy");
  }

  // Also handle case where no data is found
  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};

// NEW: Delete buddy function
export const deleteBuddy = async (buddyId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();

  // First verify the buddy belongs to the user
  const { data: buddy, error: fetchError } = await supabase
    .from("buddies")
    .select("author")
    .eq("id", buddyId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch buddy: ${fetchError.message}`);
  }

  if (!buddy || buddy.author !== userId) {
    throw new Error("You don't have permission to delete this buddy");
  }

  // Delete related records first (cascade delete)
  // Delete session history
  await supabase
    .from("session_history")
    .delete()
    .eq("buddy_id", buddyId);

  // Delete bookmarks
  await supabase
    .from("bookmarks")
    .delete()
    .eq("buddy_id", buddyId);

  // Finally delete the buddy
  const { error: deleteError } = await supabase
    .from("buddies")
    .delete()
    .eq("id", buddyId);

  if (deleteError) {
    throw new Error(`Failed to delete buddy: ${deleteError.message}`);
  }

  console.log("Buddy deleted successfully:", buddyId);
  revalidatePath(path);
  return true;
};

export const addSessionHistory = async (buddyId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("session_history").insert({
    buddy_id: buddyId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`buddies:buddy_id(*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ buddies }) => buddies);
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`buddies:buddy_id(*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ buddies }) => buddies);
};

//bookmarks - FIXED IMPLEMENTATION
export const addBookmark = async (buddyId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();

  // First check if bookmark already exists to prevent duplicates
  const { data: existing, error: checkError } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("buddy_id", buddyId)
    .eq("user_id", userId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 = no rows returned
    throw new Error(`Failed to check existing bookmark: ${checkError.message}`);
  }

  // If bookmark already exists, don't add another one
  if (existing) {
    console.log("Bookmark already exists, skipping insertion");
    revalidatePath(path);
    return existing;
  }

  // Add new bookmark
  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      buddy_id: buddyId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add bookmark: ${error.message}`);
  }

  console.log("Bookmark added successfully:", data);
  revalidatePath(path);
  return data;
};

export const removeBookmark = async (buddyId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = createSupabaseClient();

  // First, let's check if the bookmark exists
  const { data: existing, error: checkError } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("buddy_id", buddyId)
    .eq("user_id", userId);

  if (checkError) {
    throw new Error(`Failed to check existing bookmark: ${checkError.message}`);
  }

  if (!existing || existing.length === 0) {
    console.log("No bookmark found to remove");
    revalidatePath(path);
    return null;
  }

  console.log(`Found ${existing.length} bookmark(s) to remove:`, existing);

  // Delete the bookmark(s)
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("buddy_id", buddyId)
    .eq("user_id", userId)
    .select();

  if (error) {
    throw new Error(`Failed to remove bookmark: ${error.message}`);
  }

  console.log("Bookmark(s) removed successfully:", data);
  revalidatePath(path);
  return data;
};

// Helper function to check if a buddy is bookmarked (useful for getting initial state)
export const isBookmarked = async (buddyId: string) => {
  const { userId } = await auth();
  if (!userId) return false;

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("buddy_id", buddyId)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned
    console.error("Error checking bookmark status:", error);
    return false;
  }

  return !!data;
};

export const getBookmarkedBuddies = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`buddies:buddy_id (*)`)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }

  return data.map(({ buddies }) => buddies);
};

export const getUserBuddies = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("buddies")
    .select()
    .eq("author", userId);

  if (error) throw new Error(error.message);

  return data;
};

export const newBuddyPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  let limit = 0;

  if (has({ plan: "elite" })) {
    return true;
  } else if (has({ feature: "3_buddy_limit" })) {
    limit = 3;
  } else if (has({ feature: "10_buddy_limit" })) {
    limit = 5;
  }

  const { data, error } = await supabase
    .from("buddies")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const buddyCount = data?.length;

  if (buddyCount >= limit) {
    return false;
  } else {
    return true;
  }
};