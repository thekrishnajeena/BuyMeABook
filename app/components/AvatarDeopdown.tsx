'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";


type Profile = {
  photoURL?: string | null;
  displayName?: string | null;
};

export default function AvatarDropdown({
  profile,
  onLogout,
}: {
  profile: Profile;
  onLogout: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        menuRef.current &&
        btnRef.current &&
        !menuRef.current.contains(target) &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleToggle = () => setOpen((v) => !v);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleToggle}
        className="focus:outline-none"
        title={profile?.displayName || "User"}
      >
        {profile?.photoURL ? (
          <Image
            src={profile.photoURL}
            width={40}
            height={40}
            alt={profile.displayName || "User avatar"}
            className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer object-cover"
          />
        ) : (
          <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 cursor-pointer flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="avatar-button"
          className="absolute right-0 mt-2 w-44 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" role="none">
            <li>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                role="menuitem"
              >
                Profile Card
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                role="menuitem"
              >
                Create Campaign
              </a>
            </li>
          </ul>

          <div className="py-1">
            <button
              onClick={async () => {
                setOpen(false);
                await onLogout();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
