"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiHome, FiLogOut, FiMenu } from "react-icons/fi";
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
        active ? "bg-gray-100 text-blue-600 font-semibold" : "text-white hover:bg-gray-50 hover:text-blue-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isOwner = useAuth(); // add logic
  const router = useRouter();
  const [username, setUsername] = useState("")

  useEffect(()=> {

    setUsername(localStorage.getItem("username") ?? "")

  }, [])
  const pathname = usePathname()
  const navItems = [
    {name: "Home", href: `/${username || ""}`},
    {name: "Explore", href: `/explore`},
    {name: "Supporters", href: `/supporters`},
    {name: "Campaigns", href: `/contribute`}
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
          {/* Mobile toggle button */}
          <button
            className="fixed top-4 left-4 z-50 md:hidden p-2 bg-black text-white rounded-md shadow"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu className="w-5 h-5" />
          </button>

          <div
            className={`fixed inset-y-0 left-0 transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:static transition-transform duration-200 ease-in-out w-64 bg-black shadow-lg z-40`}
          >
            <div className="p-4 font-bold text-xl border-b border-gray-700 text-white flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <img src="/bmab.png" alt="Logo" className="h-10 w-auto lg:h-14" />
                BuyMeABook
              </Link>
            </div>

            <nav className="mt-4 flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition ${
                      isActive ? "bg-gray-800" : ""
                    }`}
                  >
                    {<FiHome className="w-5 h-5" />}
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="cursor-pointer text-white text-left px-4 py-2 hover:bg-gray-700 rounded-md flex items-center gap-2"
              >
                <FiLogOut className="w-5 h-5" /> Logout
              </button>
            </nav>
          </div>

          {/* Overlay on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 md:hidden z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 bg-gradient-to-b from-[#101212] to-[#08201D]">
        {children}
      </main>
    </div>
  );

}
