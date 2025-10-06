"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../../components/Profile";
import { signOut } from "firebase/auth";
import { useParams, useRouter } from "next/navigation";
import AvatarDropdown from "../../components/AvatarDeopdown";
import CreateCampaignModal from "@/app/components/CampaignModal";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { username } = useParams<{ username: string }>();

  // ✅ helper to get cover
  const getBookCover = async (isbn: string) => {
    try {
      const res = await fetch(
        `https://bookcover.longitood.com/bookcover/${isbn}`
      );
      console.log("URL: ", res)
      if (res.ok) {

        return res.url; // direct cover URL
      }
      return "/fallback-cover.jpg";
    } catch (err) {
      console.error("Failed to fetch book cover:", err);
      return "/fallback-cover.jpg";
    }
  };

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setProfileLoading(true);
      const ref = doc(db, "users", username);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        setProfile(null);
      }
      setProfileLoading(false);
    };

    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`/api/campaigns?username=${username}`);
        const data = await res.json();

        // enrich each campaign with cover
        const withCovers = await Promise.all(
          (data.campaigns || []).map(async (c: any) => {
            const cover = await getBookCover(c.book.isbn);
            return { ...c, cover };
          })
        );

        setCampaigns(withCovers);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };

    fetchProfile();
    fetchCampaigns();
  }, [username]);

  if (profileLoading || authLoading) {
    return <div className="p-8 text-gray-800">⏳ Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-gray-800">❌ User not found</div>;
  }

  const isOwner = user?.uid === profile.uid;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between rounded-md bg-black shadow px-4 py-3">
        <h1 className="text-lg font-semibold text-white">
          {isOwner ? "Dashboard" : `${profile.displayName}'s Profile`}
        </h1>
        {isOwner && <AvatarDropdown profile={profile} onLogout={handleLogout} />}
      </header>

      {/* Page Content */}
      <main className="p-6 overflow-y-auto">
        {/* Profile card */}
        <section className="bg-black p-6 rounded-lg shadow mb-6">
          <UserProfile profile={profile} />
        </section>

        {/* Campaigns */}
        <section className="bg-black p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Campaigns</h2>
            {isOwner && (
              <button
                type="button"
                className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                onClick={() => setOpen(true)}
              >
                Create Campaign
              </button>
            )}
          </div>

          <CreateCampaignModal open={open} onClose={() => setOpen(false)} />

          <div className="mt-6">
            {campaigns?.length ? (
              <ul className="mt-2">
                {campaigns.map((c, i) => (
                  <li key={i} className="p-4 rounded mt-2">
                    <Link
                      href="/"
                      className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <img
                        className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                        src={c.coverLink}
                        alt={c.book.title}
                      />
                      <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {c.book.title}
                        </h5>
                        <p>Status: {c.status}</p>
                        <p>Goal: ₹{c.targetAmount}</p>
                        <p>Raised: ₹{c.currentAmount}</p>

                        {!isOwner && (
                          <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded">
                            Donate
                          </button>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No campaigns yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
