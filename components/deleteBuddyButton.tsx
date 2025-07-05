"use client";

import { deleteBuddy } from "@/lib/actions/buddy.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface DeleteBuddyButtonProps {
  buddyId: string;
  buddyName: string;
  redirectPath?: string; // Optional redirect path after deletion
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

const DeleteBuddyButton = ({
  buddyId,
  buddyName,
  redirectPath,
}: DeleteBuddyButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);

    startTransition(async () => {
      try {
        await deleteBuddy(buddyId, redirectPath || "/buddies");
        setShowSuccessToast(true);
        console.log(`Buddy ${buddyId} deleted successfully`);

        // Auto-hide toast after 2 seconds, then redirect if specified
        setTimeout(() => {
          setShowSuccessToast(false);
          if (redirectPath) {
            router.push(redirectPath);
          }
        }, 2000);
      } catch (error) {
        console.error("Failed to delete buddy:", error);
        // You might want to show an error toast here
      }
    });
  };

  return (
    <>
      <button
        className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
        onClick={handleDelete}
        disabled={isPending}
        title="Delete buddy"
      >
        <Image
          src="/icons/trash.svg"
          alt="delete"
          width={18}
          height={18}
          className="group-hover:opacity-80 transition-opacity"
        />
      </button>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        buddyName={buddyName}
      />

      <SuccessToast
        message="Your buddy has been successfully deleted"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
};

export default DeleteBuddyButton;