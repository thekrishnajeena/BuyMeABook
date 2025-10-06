"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import { FiSearch } from "react-icons/fi";
import Loader from "../components/Loader";

// Dummy data for campaigns (replace with Firestore fetch later)

interface Book {
  title: string;
  author: string;
  cover: string;
  description: string;
}

interface Campaign {
  id: string;
  username: string;
  profileURL: string;
  description: string;
  book: Book;
  totalContribution: number;
  target: number;
}

export default function Contribute() {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);
   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

const filteredCampaigns = campaigns.filter((c) => {
  const username = (c.username ?? "").toLowerCase();
  const bookTitle = (c.book?.title ?? "").toLowerCase();
  const searchTerm = search.toLowerCase();
 
  return username.includes(searchTerm) || bookTitle.includes(searchTerm);
});


useEffect(() => {
  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/pubcampaigns");
      const data = await res.json();
      console.log(data.campaigns);
      if (data.campaigns) {
        setCampaigns(data.campaigns);
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
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex flex-col"
            >
            
              {/* User Info */}
              <div className="flex items-center gap-3">
                {/* <img
                  src={campaign.profileURL}
                  alt={campaign.username}
                  className="w-12 h-12 rounded-full object-cover"
                /> */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    @{campaign.username}
                  </h3>
                  <p className="text-sm text-gray-500">Running a campaign</p>
                </div>
              </div>

              {/* Campaign Description */}
              {/* <p className="mt-4 text-gray-700 leading-relaxed">
                {campaign.description}
              </p> */}

              {/* Book Card */}
              <div
                className="mt-6 bg-gray-50 border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setSelectedBook(campaign.book)}
              >
                {/* <img
                  src={campaign.book.cover}
                  alt={campaign.book.title}
                  className="w-16 h-20 object-cover rounded"
                /> */}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {campaign.book.title}
                    
                  </h4>
                  {/* <p className="text-sm text-gray-600">{campaign.book.author}</p> */}
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (campaign.totalContribution / campaign.target) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  ₹{campaign.totalContribution} raised of ₹{campaign.target}
                </p>
              </div>

              {/* Contribute Button */}
              <button
                onClick={() => alert("Redirect to UPI payment gateway...")}
                className="mt-6 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Contribute via UPI
              </button>
            </div>
          ))}
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
