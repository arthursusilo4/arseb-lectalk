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

//bookmarks
export const addBookmark = async (buddyId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    buddy_id: buddyId,
    user_id: userId,
  });
  if (error) {
    throw new Error(error.message);
  }
  // Revalidate the path to force a re-render of the page

  revalidatePath(path);
  return data;
};

export const removeBookmark = async (buddyId: string, path: string) => {
  
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
