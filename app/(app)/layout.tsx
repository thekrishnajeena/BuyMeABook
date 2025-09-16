"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FiHome } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";


function SidebarLink({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href || "#"}
      className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
        active ? "bg-gray-100 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isOwner = useAuth(); // add logic
  const router = useRouter(); 
  
  const username = localStorage.getItem("username")

  const pathname = usePathname()
  const navItems = [
    {name: "Home", href: `/${username || ""}`},
    {name: "Explore", href: `/explore`},
    {name: "Supporters", href: `/supporters`}
  ]

  // <-- dynamic route username

  const handleLogout = () =>{
    signOut(auth)
    router.replace("/");
    console.log("Logout clicked")};

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      {isOwner && (
        <>
          <div
            className={`fixed inset-y-0 left-0 transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:static transition-transform duration-200 ease-in-out w-64 bg-white shadow-lg z-50`}
          >
            <div className="p-4 font-bold text-xl border-b border-gray-200 text-gray-800">
              📚 BuyMeABook
            </div>
            <nav className="mt-4 flex flex-col space-y-2">

             { navItems.map((item) => {

              const isActive = pathname === item.href;
              return (<SidebarLink icon={<FiHome />} label={item.name} href={item.href} active={isActive}/>   )

              })}

                <button
                onClick={handleLogout}
                className="cursor-pointer text-gray-800 text-left px-4 py-2 hover:bg-gray-50 rounded-md"
              >
                Logout
              </button>
            </nav>
          </div>

          {/* Overlay on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
