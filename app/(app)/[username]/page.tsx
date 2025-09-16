"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../../components/Profile";
import { signOut } from "firebase/auth";
import { useParams, useRouter } from "next/navigation";
import AvatarDropdown from "../../components/AvatarDeopdown";


export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const router = useRouter();
  const {username} = useParams<{username: string}>();

  useEffect(() => {
  
    if (!username){
      console.log("return")
       return;
      }

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
      <header className="flex items-center justify-between bg-white shadow px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-800">
          {isOwner ? "Dashboard" : `${profile.displayName}'s Profile`}
        </h1>
        {isOwner && <AvatarDropdown profile={profile} onLogout={handleLogout} />}
      </header>

      {/* Page Content */}
      <main className="p-6 overflow-y-auto">
        {/* Profile card always visible */}
        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <UserProfile profile={profile} />
        </section>

        {/* Campaigns */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Campaigns</h2>
            {isOwner && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                + Create Campaign
              </button>
            )}
          </div>

          <div className="mt-6">
            {profile.campaigns?.length ? (
              <ul className="mt-2">
                {profile.campaigns.map((c: any, i: number) => (
                  <li key={i} className="border p-4 rounded mt-2">
                    <h3 className="font-bold">{c.title}</h3>
                    <p>{c.description}</p>
                    <p>Goal: ₹{c.goal}</p>
                    <p>Raised: ₹{c.raised}</p>

                    {!isOwner && (
                      <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded">
                        Donate
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
