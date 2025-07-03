"use client";

import {
  addBookmark,
  removeBookmark,
  deleteBuddy,
} from "@/lib/actions/buddy.actions";
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
  isOwner?: boolean; // Prop to determine if user owns this buddy
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  buddyName: string;
}

// Delete confirmation modal component
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  buddyName,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Image src="/icons/trash.svg" alt="delete" width={20} height={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Buddy</h3>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "
          <span className="font-medium">{buddyName}</span>"? This action cannot
          be undone and will permanently remove this buddy and all its
          associated data.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Success toast component
const SuccessToast = ({
  message,
  isVisible,
  onClose,
}: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top duration-300">
        <div className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const BuddyCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked: initialBookmarked,
  isOwner = false,
}: BuddyCardProps) => {
  const pathname = usePathname();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);

    startTransition(async () => {
      try {
        await deleteBuddy(id, pathname);
        setShowSuccessToast(true);
        console.log(`Buddy ${id} deleted successfully`);

        // Auto-hide toast after 3 seconds
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 3000);
      } catch (error) {
        console.error("Failed to delete buddy:", error);
        // You might want to show an error toast here
      }
    });
  };

  return (
    <>
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
              className="bookmark-icon"
            />
          </button>

          {/* Duration, Subject, and Delete - Right side */}
          <div className="flex items-center gap-2">
            {/* Duration */}
            <div className="flex items-center gap-1">
              <Image
                src="/icons/clock.svg"
                alt="duration"
                width={12}
                height={12}
                className="clock-icon"
              />
              <span className="text-xs">{duration}m</span>
            </div>

            {/* Subject Badge */}
            <div className="subject-badge-compact">{subject}</div>

            {/* Delete Button - Only show if user owns this buddy */}
            {isOwner && (
              <button
                className="buddy-delete-compact"
                onClick={handleDelete}
                disabled={isPending}
                title="Delete buddy"
              >
                <Image
                  src="/icons/trash.svg"
                  alt="delete"
                  width={12}
                  height={12}
                />
              </button>
            )}
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
            Begin Lecture
          </button>
        </Link>
      </article>

      {/* Delete confirmation modal - Only render if user is owner */}
      {isOwner && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          buddyName={name}
        />
      )}

      {/* Success toast - Only render if user is owner */}
      {isOwner && (
        <SuccessToast
          message="Your buddy has successfully been deleted"
          isVisible={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </>
  );
};

export default BuddyCard;
