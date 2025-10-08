"use client";

import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";

export default function SupportersPage() {
  const [supporters, setSupporters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call your API route or Firestore query
    async function fetchSupporters() {
      try {
        const res = await fetch("/api/supporters");
        const data = await res.json();
        setSupporters(data.data);
      } catch (err) {
        console.error("Error fetching supporters:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSupporters();
  }, []);

  if (loading) {
    return <div className="p-6 text-white">⏳ Loading supporters...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FiHeart className="text-pink-500 text-2xl" />
        <h1 className="text-2xl font-bold text-white">Supporters</h1>
      </div>

      {/* Supporter list */}
      {supporters.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supporters.map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={s.avatar || "/bmab.png"}
                  alt={s.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-gray-800">{s.name}</h2>
                  <p className="text-sm text-gray-500">@{s.username || "buymeabook"}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  ₹{s.amount}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(s.lastDonation).toLocaleDateString()}
                </span>
              </div>

              {s.message && (
                <p className="mt-3 text-sm text-gray-600 italic">
                  “{s.message}”
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">No supporters yet. Be the first to donate!</p>
      )}
    </div>
  );
}
