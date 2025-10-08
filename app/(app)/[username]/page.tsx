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
import { FiTrash2 } from "react-icons/fi";

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

    fetchProfile();
    fetchCampaigns();
  }, [username]);

  if (profileLoading || authLoading) {
    return <div className="p-8 text-white">⏳ Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-white">❌ User not found</div>;
  }

  const isOwner = user?.uid === profile.uid;
  const canCreateCampaign = campaigns.length < 3;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleCampaignDelete = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      } else {
        alert("Failed to delete campaign");
      }
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      alert("Failed to delete campaign");
    }
  };

  const handleDescriptionUpdate = async (description: string) => {
    try {
      const res = await fetch(`/api/users/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (res.ok) {
        setProfile((prev: any) => ({ ...prev, description }));
      } else {
        alert("Failed to update description");
      }
    } catch (err) {
      console.error("Failed to update description:", err);
      alert("Failed to update description");
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
          <UserProfile 
            profile={profile} 
            supportersCount={campaigns.reduce((sum, c) => sum + (c.supportersCount || 0), 0)}
            isOwner={isOwner}
            onDescriptionUpdate={handleDescriptionUpdate}
          />
        </section>

        {/* Campaigns */}
        <section className="bg-black p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Campaigns</h2>
            {isOwner && (
              <div className="relative group">
                <button
                  type="button"
                  className={`cursor-pointer text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
                    canCreateCampaign 
                      ? "bg-blue-700 hover:bg-blue-800" 
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => canCreateCampaign && setOpen(true)}
                  disabled={!canCreateCampaign}
                >
                  Create Campaign ({campaigns.length}/3)
                </button>
                {!canCreateCampaign && (
                  <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Maximum 3 campaigns allowed
                  </div>
                )}
              </div>
            )}
          </div>

          <CreateCampaignModal open={open} onClose={() => setOpen(false)}
           fetchCampaigns={fetchCampaigns}
           />

          <div className="mt-6">
            {campaigns?.length ? (
              <ul className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {campaigns.map((c, i) => (
                  <li key={i} className="rounded-lg overflow-hidden group bg-white/5 border border-white/10 hover:border-white/20 transition relative">
                    <Link 
                      href={`/campaign/${c.id}`}
                      className="block cursor-pointer"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          className="h-full w-full object-fill transition-transform duration-300 group-hover:scale-105"
                          src={c.book.cover || "/book123.png"}
                          alt={(c.book?.name || c.book?.title || "Book Cover") as string}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4">
                        <h5 className="mb-1 text-lg font-semibold text-white line-clamp-2">
                          {(c.book?.name || c.book?.title || "Untitled Book") as string}
                        </h5>
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-300">
                          <span className="capitalize">{c.status}</span>
                          <span>
                            ₹{c.currentAmount} / <span className="text-gray-200">₹{c.targetAmount}</span>
                          </span>
                        </div>
                        <div className="mt-3 w-full rounded-md bg-green-600 hover:bg-green-700 text-white py-2 text-sm transition text-center">
                          {isOwner ? "View Campaign" : "Donate"}
                        </div>
                      </div>
                    </Link>
                    
                    {/* Delete button for owner */}
                    {isOwner && (
                      <button
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCampaignDelete(c.id);
                        }}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
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
