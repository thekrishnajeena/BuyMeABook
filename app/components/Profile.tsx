"use client";

import Image from "next/image";
import { useState } from "react";
import { FiEdit2, FiUsers } from "react-icons/fi";

interface UserProfileProps {
  profile: {
    uid: string;
    displayName?: string;
    photoURL?: string;
    description?: string;
  };
  supportersCount?: number;
  isOwner?: boolean;
  onDescriptionUpdate?: (description: string) => void;
}

export default function UserProfile({ 
  profile, 
  supportersCount = 0, 
  isOwner = false, 
  onDescriptionUpdate 
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(profile.description || "");

  const handleSave = async () => {
    if (onDescriptionUpdate) {
      await onDescriptionUpdate(editDescription);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditDescription(profile.description || "");
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {profile.photoURL ? (
            <Image
              src={profile.photoURL}
              width={60}
              height={60}
              alt={profile.displayName || "User"}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          )}

          <div>
            <h1 className="text-2xl text-white font-bold">
              @{profile.displayName || "anonymous"}
            </h1>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description..."
                  className="px-3 py-1 rounded border bg-white text-gray-900"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-2 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-white">
                  {profile.description || "No description yet"}
                </p>
                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Supporters count */}
        <div className="flex items-center gap-2 text-white">
          <FiUsers className="w-5 h-5" />
          <span className="text-sm">
            {supportersCount} supporter{supportersCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
