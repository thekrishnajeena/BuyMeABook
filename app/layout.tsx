import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

// Import fonts with variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // ensures SSR-safe fallback
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buy Me A Book",
  description: "Inspired by BuyMeACoffee.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Combine the variables statically, avoids client-server mismatch
  const bodyClass = `${geistSans.variable} ${geistMono.variable} antialiased`;

  return (
    <html lang="en">
      <body className={bodyClass}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
