"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import { FiShare2, FiUsers, FiMapPin, FiPhone } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";

interface Campaign {
  id: string;
  username: string;
  book: {
    id: string;
    name?: string;
    title?: string;
    isbn: string;
    finalPrice?: number;
    cover?: string;
  };
  title: string;
  description?: string;
  address: string;
  mobile?: string;
  targetAmount: number;
  currentAmount: number;
  status: string;
  cover?: string;
  createdAt: any;
}

export default function PublicCampaignPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await fetch(`/api/campaigns/${id}`);
      const data = await res.json();

      if (data.campaign) {
        setCampaign(data.campaign);
      } else {
        setError("Campaign not found");
      }
    } catch (err) {
      console.error("Failed to fetch campaign:", err);
      setError("Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!campaign) return;
    
    const shareUrl = window.location.href;
    const shareData = {
      title: `Support ${campaign.book?.name || campaign.book?.title || 'this book campaign'}`,
      text: `Help @${campaign.username} get their book! ${campaign.description || ''}`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Campaign link copied to clipboard!");
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Campaign link copied to clipboard!");
      } catch (clipboardErr) {
        console.error("Failed to share or copy:", clipboardErr);
        alert("Failed to share campaign");
      }
    }
  };

  const handleContribute = () => {
    // TODO: Implement UPI payment integration
    alert("UPI payment integration coming soon! This will open a secure payment gateway.");
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#101212] to-[#08201D]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
            <p className="text-gray-300 mb-6">
              {error || "This campaign may have been deleted or the link is invalid."}
            </p>
            <a
              href="/contribute"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Browse Other Campaigns
            </a>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = campaign.targetAmount > 0 
    ? Math.min(100, (campaign.currentAmount / campaign.targetAmount) * 100)
    : 0;

  const bookTitle = campaign.book?.name || campaign.book?.title || "Untitled Book";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#101212] to-[#08201D]">
      <Header />
      
      <main className="flex-1 py-8 px-4 lg:px-8 mt-20 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Campaign Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={campaign.book.cover || "/book123.png"}
                    alt={bookTitle}
                    className="w-24 h-32 object-cover rounded-lg shadow-md"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {bookTitle}
                    </h1>
                    <p className="text-gray-600 mb-1">by @{campaign.username}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'open' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <FiShare2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Progress Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Campaign Progress</h3>
                  <span className="text-2xl font-bold text-blue-600">{progressPercentage.toFixed(1)}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{campaign.currentAmount?.toLocaleString() || 0} raised</span>
                  <span>of ₹{campaign.targetAmount?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Campaign Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Campaigner</h3>
                    <p className="text-gray-900">{campaign.title}</p>
                  </div>
                  
                  {campaign.description && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                      <p className="text-gray-900 leading-relaxed">{campaign.description}</p>
                    </div>
                  )}

{user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Privacy Note:</strong> Delivery address and contact details are only visible to the campaign creator for privacy and security.
                    </p>
                  </div>)}
                </div>
              </div>

              {/* Supporters Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUsers className="w-5 h-5" />
                  Supporters
                </h2>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Supporters feature coming soon! 
                  </p>
                  <p className="text-sm text-gray-500">
                    This will show who has contributed to this campaign.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contribute Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 max-h-screen overflow-y-auto">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Support?</h3>
                  <p className="text-gray-600 text-sm">
                    Help @{campaign.username} get their book by contributing to this campaign
                  </p>
                </div>

                <button
                  onClick={handleContribute}
                  className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 mb-4"
                >
                  💰 Contribute via UPI
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Secure payment • Instant confirmation
                  </p>
                  <p className="text-xs text-gray-400">
                    Help a reader's journey
                  </p>
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Goal Amount</span>
                    <span className="font-semibold">₹{campaign.targetAmount?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Raised</span>
                    <span className="font-semibold text-green-600">₹{campaign.currentAmount?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-semibold">₹{(campaign.targetAmount - campaign.currentAmount)?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold ${
                      campaign.status === 'open' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {campaign.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
