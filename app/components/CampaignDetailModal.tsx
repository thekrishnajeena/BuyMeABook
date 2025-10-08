"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiShare2, FiX, FiTrash2 } from "react-icons/fi";

interface CampaignDetailModalProps {
  open: boolean;
  onClose: () => void;
  campaignId: string | null;
  isOwner?: boolean;
  onDelete?: (campaignId: string) => void;
}

export default function CampaignDetailModal({
  open,
  onClose,
  campaignId,
  isOwner = false,
  onDelete,
}: CampaignDetailModalProps) {
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (open && campaignId) {
      fetchCampaignDetails();
    }
  }, [open, campaignId]);

  const fetchCampaignDetails = async () => {
    if (!campaignId) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      const data = await res.json();
      
      if (data.campaign) {
        setCampaign(data.campaign);
      }
    } catch (err) {
      console.error("Failed to fetch campaign details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!campaignId || !onDelete) return;
    
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        onDelete(campaignId);
        onClose();
      } else {
        alert("Failed to delete campaign");
      }
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      alert("Failed to delete campaign");
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!campaignId) return;
    
    const shareUrl = `${window.location.origin}/campaign/${campaignId}`;
    const shareData = {
      title: `Support ${campaign.book?.name || campaign.book?.title || 'this book campaign'}`,
      text: `Help @${campaign.username} get their book! ${campaign.description || ''}`,
      url: shareUrl,
    };

    try {
      // Try native Web Share API first
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert("Campaign link copied to clipboard!");
      }
    } catch (err) {
      // Fallback to clipboard if share fails
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Campaign link copied to clipboard!");
      } catch (clipboardErr) {
        console.error("Failed to share or copy:", clipboardErr);
        alert("Failed to share campaign");
      }
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3">Loading campaign details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!campaign) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-12">
            <p className="text-gray-500">Campaign not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const progressPercentage = campaign.targetAmount > 0 
    ? Math.min(100, (campaign.currentAmount / campaign.targetAmount) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-bold">
            Campaign Details
          </DialogTitle>
          
          {/* Action buttons */}
          <div className="absolute top-0 right-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-1"
            >
              <FiShare2 className="w-4 h-4" />
              Share
            </Button>
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <FiTrash2 className="w-4 h-4" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-1"
            >
              <FiX className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Book Info */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <img
                src={campaign.book?.cover || "/book123.png"}
                alt={campaign.book?.name || campaign.book?.title || "Book Cover"}
                className="w-48 h-64 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {campaign.book?.name || campaign.book?.title || "Untitled Book"}
                </h2>
                <p className="text-gray-600">by @{campaign.username}</p>
              </div>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{campaign.currentAmount?.toLocaleString() || 0} raised</span>
                  <span>of ₹{campaign.targetAmount?.toLocaleString() || 0}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
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

          {/* Campaign Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Campaign Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Campaigner:</span>
                  <p className="text-gray-900">{campaign.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-900">{campaign.description || "No description provided"}</p>
                </div>
                
                {/* Private information - only visible to owner */}
                {isOwner ? (
                  <>
                    <div>
                      <span className="font-medium text-gray-700">Delivery Address:</span>
                      <p className="text-gray-900">{campaign.address}</p>
                      <span className="text-xs text-blue-600">(Private to you)</span>
                    </div>
                    {campaign.mobile && (
                      <div>
                        <span className="font-medium text-gray-700">Contact:</span>
                        <p className="text-gray-900">{campaign.mobile}</p>
                        <span className="text-xs text-blue-600">(Private to you)</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Private Information:</strong> Delivery address and contact details are only visible to the campaign creator for privacy and security.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supporters</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-center">
                  Supporters feature coming soon! 
                  <br />
                  This will show who has contributed to this campaign.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isOwner && (
            <div className="flex flex-col items-center gap-4 pt-6 border-t">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Support?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Help @{campaign.username} get their book by contributing to this campaign
                </p>
              </div>
              <Button
                onClick={() => {
                  // TODO: Implement UPI payment integration
                  alert("UPI payment integration coming soon! This will open a secure payment gateway.");
                }}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                💰 Contribute via UPI
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Secure payment • Instant confirmation • Help a reader's journey
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
