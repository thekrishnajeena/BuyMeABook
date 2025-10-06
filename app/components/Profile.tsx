"use client";

import Image from "next/image";

interface UserProfileProps {
  profile: {
    uid: string;
    displayName?: string;
    photoURL?: string;
    description?: string;
  };
}

export default function UserProfile({ profile }: UserProfileProps) {
  return (
    <div className="p-8">
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
          {profile.description && (
            <p className="text-white">{profile.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
