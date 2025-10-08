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
    <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-black rounded-lg">
      <div className="flex items-center gap-4">
        {profile.photoURL ? (
          <Image
            src={profile.photoURL}
            width={80}
            height={80}
            alt={profile.displayName || "User"}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-700 flex items-center justify-center">
            <FiUsers className="w-10 h-10 text-gray-400" />
          </div>
        )}

        <div>
          <h1 className="text-xl sm:text-2xl text-white font-bold">@{profile.displayName || "anonymous"}</h1>
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add a description..."
                className="px-3 py-1 rounded border bg-white text-gray-900 flex-1"
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
            <div className="flex items-center gap-2 mt-1">
              <p className="text-white">{profile.description || "No description yet"}</p>
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

      {/* Supporters */}
      <div className="flex items-center gap-2 text-white mt-2 sm:mt-0">
        <FiUsers className="w-5 h-5" />
        <span className="text-sm">{supportersCount} supporter{supportersCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
