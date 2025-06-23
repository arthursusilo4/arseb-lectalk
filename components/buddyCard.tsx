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
  const pathname = usePathname();
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
      className="buddy-card-compact"
      style={{ "--buddy-color": color } as React.CSSProperties}
    >
      {/* Header with bookmark and right-side info */}
      <div className="flex justify-between items-start mb-3">
        {/* Bookmark - Left side */}
        <button
          className="buddy-bookmark-compact"
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

        {/* Duration and Subject - Right side */}
        <div className="flex items-center gap-2">
          {/* Duration */}
          <div className="flex items-center gap-1">
            <Image
              src="/icons/clock.svg"
              alt="duration"
              width={12}
              height={12}
            />
            <span className="text-xs">{duration}m</span>
          </div>

          {/* Subject Badge */}
          <div className="subject-badge-compact">{subject}</div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold mb-2 leading-tight">{name}</h2>

      {/* Topic - Scrollable if too long */}
      <div className="topic-container">
        <p className="topic-text">{topic}</p>
      </div>

      {/* Action Button */}
      <Link href={`/buddies/${id}`} className="w-full mt-3">
        <button className="btn-primary w-full justify-center">
          Mulai Sesi
        </button>
      </Link>
    </article>
  );
};

export default BuddyCard;
