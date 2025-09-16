"use client";

import Header from "../components/Header";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#101212] relative to-[#08201D]">
      {/* Reuse your site header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold">
              About <span className="text-white-900">BuyMeABook</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto text-white-900">
              We believe books have the power to change lives. <br />  
              BuyMeABook is a platform where readers support readers —  
              helping each other get the books they dream of, one campaign at a time.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white-900">Our Mission</h2>
              <p className="mt-4 text-lg text-white-600 leading-relaxed">
                Not everyone has easy access to the books they want to read.  
                Whether it’s a student chasing knowledge, a writer exploring inspiration,  
                or a casual reader looking for their next adventure — BuyMeABook makes it possible  
                for people to fund each other’s reading journeys.
              </p>
              <p className="mt-4 text-lg text-white-600 leading-relaxed">
                Think of it like <span className="font-semibold">BuyMeACoffee</span>,  
                but instead of coffee, we’re fueling curiosity, imagination, and growth with books.
              </p>
            </div>
            <img
              src="/about-illustration.svg"
              alt="Books illustration"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-white-900">
              What Makes Us Different
            </h2>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Create Campaigns",
                  desc: "Start a campaign to fund your next book. Share your story, and let others help bring it to life.",
                },
                {
                  title: "Support Fellow Readers",
                  desc: "Contribute to campaigns and help someone else get access to the book they’ve been dreaming of.",
                },
                {
                  title: "AI-Powered Digital Library",
                  desc: "We’re exploring ways to use AI to build digital libraries, make reading easier, and connect readers worldwide.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-white text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to support or start your first campaign?
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Join a growing community of readers helping each other discover, fund,  
            and enjoy the books they love.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contribute"
              className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
            >
              Contribute Now
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-blue-500 font-semibold hover:bg-blue-700 transition"
            >
              Start a Campaign
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm border-t">
        © {new Date().getFullYear()} BuyMeABook. Built with ❤️ for readers.
      </footer>
    </div>
  );
}
