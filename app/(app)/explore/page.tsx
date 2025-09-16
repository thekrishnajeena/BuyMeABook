"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Explore() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users/explore");
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
        className="w-full px-4 py-2 border rounded mb-4 text-gray-600"
      />

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow rounded-lg p-4 flex items-center gap-4"
          >
            <Image
              src={user.photoURL}
              width={40}
              height={40}
              alt={user.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-bold text-gray-800">{user.displayName}</h3>
              <p className="text-sm text-gray-600">@{user.username}</p>
              {user.campaigns?.length > 0 && (
                <p className="text-xs text-gray-500">
                  {user.campaigns.length} campaigns
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
