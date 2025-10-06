'use client';

import Link from "next/link";

import { useRouter } from "next/navigation";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import {doc, setDoc, getDoc, writeBatch} from "firebase/firestore";
import {db} from "../firebaseConfig";
import AvatarDropdown from "./AvatarDeopdown";
import { useState } from "react";

function Header(){


  const { user } = useAuth();
  const navigate = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);


  const generateUsername = async (displayName: string) => {
  const base = displayName.toLowerCase().replace(/\s+/g, ""); // remove spaces
  let username = base;

  const userRef = doc(db, "users", username);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    // if exists → append timestamp
    const ts = Date.now().toString().slice(-4); // last 4 digits
    username = `${base}${ts}`;
  }

  return username;
};


  const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if(!user.email){
      throw new Error("No email found in user data");
    }

    // Save user in Firestore if not exists
    const userRef = doc(db, "emails", user.email || "user");
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
          // Generate username
    const username = await generateUsername(user.displayName || "user");

    const userDataRef = doc(db, "users", username);
    
    const batch = writeBatch(db);
    
    batch.set(userDataRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        description: "📖 A passionate reader",
        username: username,
        createdAt: new Date(),
    })
      batch.set(userRef, {
        username: username
      });

      await batch.commit();

      console.log("Setting username in localStorage:", username);
localStorage.setItem("username", username);
console.log("Stored username:", localStorage.getItem("username"));

      navigate.push(`/${username}`);
    }else{
      const {username }= snapshot.data();

      console.log("Setting username in localStorage:", username);
localStorage.setItem("username", username);
console.log("Stored username:", localStorage.getItem("username"));

      navigate.push(`/${username}`);
    }

    
  } catch (error) {
    console.error("Login error:", error);
  }
};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate.push("/")
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

return (
    <header className="absolute inset-x-0 top-0 z-100 w-full bg-[#0B1120] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navbar */}
        <nav className="flex items-center justify-between h-16 lg:h-20 bg-[#0B1120] text-white shadow-md">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img src="/bmab.png" alt="Logo" className="h-10 w-auto lg:h-14" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden inline-flex p-2 rounded-md text-white hover:bg-blue-800 focus:bg-blue-800 transition-all"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 8h16M4 16h16"
                />
              </svg>
            )}
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-10">
            <Link
              href="/contribute"
              className="text-base font-medium text-white hover:text-blue-400 transition-all"
            >
              Contribute
            </Link>
            <Link
              href="/about"
              className="text-base font-medium text-white hover:text-blue-400 transition-all"
            >
              About
            </Link>

            {user ? (
              <AvatarDropdown profile={user} onLogout={handleLogout} />
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-all"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-gray-900 border-t border-gray-700 py-4 z-[100]">
            <div className="flex flex-col space-y-3 px-4">
              
              <Link
                href="/contribute"
                className="text-base font-medium text-white hover:text-blue-400"
              >
                Contribute
              </Link>
              <Link
                href="/about"
                className="text-base font-medium text-white hover:text-blue-400"
              >
                About
              </Link>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 
                  z-[100] rounded-lg font-semibold"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
