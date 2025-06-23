"use client";

import { addBookmark, removeBookmark } from "@/lib/actions/buddy.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";

interface BuddyCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}

const BuddyCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked: initialBookmarked,
}: BuddyCardProps) => {
  const pathname = usePathname(); // Fixed typo
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleBookmark = async () => {
    // Optimistic update - update UI immediately
    setIsBookmarked(!isBookmarked);

    startTransition(async () => {
      try {
        if (isBookmarked) {
          await removeBookmark(id, pathname);
          console.log(`Bookmark removed for buddy ${id}`);
        } else {
          await addBookmark(id, pathname);
          console.log(`Bookmark added for buddy ${id}`);
        }
      } catch (error) {
        // Revert optimistic update on error
        setIsBookmarked(isBookmarked);
        console.error("Failed to toggle bookmark:", error);
        // You might want to show a toast or error message here
      }
    });
  };

  return (
    <article
      className="buddy-card"
      style={{ "--buddy-color": color } as React.CSSProperties}
    >
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <button
          className="buddy-bookmark"
          onClick={handleBookmark}
          disabled={isPending}
        >
          <Image
            src={
              isBookmarked
                ? "/icons/bookmark-filled.svg"
                : "/icons/bookmark.svg"
            }
            alt="bookmark"
            width={12}
            height={14.5}
          />
        </button>
      </div>
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Image src="/icons/clock.svg" alt="duration" width={14} height={14} />
        <p className="text-sm">{duration} minutes</p>
      </div>

      <Link href={`/buddies/${id}`} className="w-full">
        <button className="btn-primary w-full justify-center">
          Mulai Sesi
        </button>
      </Link>
    </article>
  );
};

export default BuddyCard;
