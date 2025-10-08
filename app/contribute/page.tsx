"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import { FiSearch } from "react-icons/fi";
import Loader from "../components/Loader";

// Types based on backend shape
interface CampaignBook { id: string; name?: string; title?: string; isbn: string; finalPrice?: number; cover?: string }
interface Campaign { id: string; username: string; book: CampaignBook; currentAmount: number; targetAmount: number; status: string; cover?: string }

export default function Contribute() {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

const filteredCampaigns = campaigns.filter((c) => {
  const username = (c.username ?? "").toLowerCase();
  const bookTitle = ((c.book?.name || c.book?.title) ?? "").toLowerCase();
  const searchTerm = search.toLowerCase();
  return username.includes(searchTerm) || bookTitle.includes(searchTerm);
});


// helper to resolve book cover by ISBN
const getBookCover = async (isbn: string) => {
  try {
    const res = await fetch(`https://bookcover.longitood.com/bookcover/${isbn}`);
    if (res.ok) return res.url;
  } catch {}
  return "/book123.png";
};

useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/pubcampaigns");
      const data = await res.json();
      if (data.campaigns) {
        const withCovers = await Promise.all(
          data.campaigns.map(async (c: Campaign) => ({
            ...c,
            cover: await getBookCover(c.book.isbn)
          }))
        );
        setCampaigns(withCovers);
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCampaigns();
}, []);


    if (loading) 
      return <Loader/>

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#101212] relative to-[#08201D]">
      <Header />

      <main className="flex-1 py-20 px-6 lg:px-12">
        {/* Page Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-100">
            Support a Reader’s Journey 📚
          </h1>
          <p className="mt-4 text-lg text-blue-50">
            Explore campaigns created by book lovers and contribute directly via UPI.  
            No login required — just share the joy of reading!
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-8 flex items-center border border-gray-300 rounded-lg bg-white px-4 py-2 shadow-sm">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>

        {/* Campaigns Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {filteredCampaigns.map((campaign, idx) => {
            const title = (campaign.book.name || campaign.book.title || "Untitled Book") as string;
            const raised = campaign.currentAmount ?? 0;
            const goal = campaign.targetAmount ?? campaign.book.finalPrice ?? 0;
            const pct = Math.max(0, Math.min(100, goal ? Math.round((raised / goal) * 100) : 0));
            return (
              <a 
                key={idx} 
                href={`/campaign/${campaign.id}`}
                className="block rounded-lg overflow-hidden group bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={campaign.book.cover || "/book123.png"}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-fill transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mr-2">{title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 capitalize">{campaign.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">@{campaign.username}</p>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
                      <span>₹{raised.toLocaleString()}</span>
                      <span className="text-gray-500">of ₹{goal.toLocaleString()} ({pct}%)</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full px-4 py-2 rounded-md bg-green-600 text-white font-medium text-center">
                    View & Contribute
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </main>

      {/* Book Popup Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-lg">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="flex gap-6">
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className="w-28 h-40 rounded object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedBook.title}
                </h2>
                <p className="text-sm text-gray-500">{selectedBook.author}</p>
                <p className="mt-4 text-gray-700">{selectedBook.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-white-500 text-sm mt-12">
        © {new Date().getFullYear()} BuyMeABook. Built with ❤️ for readers.
      </footer>
    </div>
  );

}
