import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BookSelector from "./BookSelector";
import { useParams } from "next/navigation";


export default function CreateCampaignModal({
  open,
  onClose,
  fetchCampaigns,
}: {
  open: boolean;
  onClose: () => void;
  fetchCampaigns: () => void;
}) {
  const [step, setStep] = useState<
    "select-book" | "details" | "review" | "loading"
  >("select-book");

  const {username} = useParams<{username: string}>();
  

  // central campaign data
  const [campaignData, setCampaignData] = useState<{
    book: any | null;
    title: string;
    address: string;
    mobile: string;
    username: string;
  }>({
    book: null,
    title: "",
    address: "",
    mobile: "",
    username: username
  });

  const handleConfirm = async () => {
    setStep("loading");
    try {
      // Example POST call
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });

      if (!res.ok) throw new Error("Failed to create campaign");

      // ✅ success → close modal
      setStep("select-book");
      onClose();
      fetchCampaigns();
    } catch (err) {
      alert("Error creating campaign: " + (err as Error).message);
      setStep("review"); // go back to review on error
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setStep("select-book");
        onClose();
      }}
    >
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Create a Campaign 📚</DialogTitle>
        </DialogHeader>

        {step === "select-book" && (
          <BookSelector
            onNext={(book) => {
              setCampaignData((prev) => ({ ...prev, book }));
              setStep("details");
            }}
          />
        )}

        {step === "details" && (
          <UserDetailsForm
            data={campaignData}
            onChange={(data) => setCampaignData((prev) => ({ ...prev, ...data }))}
            onNext={() => setStep("review")}
            onBack={() => setStep("select-book")}
          />
        )}

        {step === "review" && (
          <ReviewCampaign
            data={campaignData}
            onBack={() => setStep("details")}
            onConfirm={handleConfirm}
          />
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Creating campaign...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function UserDetailsForm({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: { title: string; address: string; mobile: string; description: string };
  onChange: (fields: Partial<typeof data>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          address: `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`,
        });
      },
      () => alert("Error fetching location")
    );
  };

  return (
    <div className="space-y-4">
      <input
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Your name"
        className="w-full p-2 rounded border"
      />
      <textarea
        value={data.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Description"
        className="w-full p-2 rounded border"
        rows={4}
      />
      <textarea
        value={data.address}
        onChange={(e) => onChange({ address: e.target.value })}
        placeholder="Delivery address"
        className="w-full p-2 rounded border"
        rows={4}
      />
      <input
        value={data.mobile}
        onChange={(e) => onChange({ mobile: e.target.value })}
        placeholder="Mobile number (optional)"
        className="w-full p-2 rounded border"
      />

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="outline" onClick={detectLocation}>
          📍 Detect My Location
        </Button>
        <Button onClick={onNext} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );
}

function ReviewCampaign({
  data,
  onBack,
  onConfirm,
}: {
  data: {
    book: any | null;
    description: string;
    title: string;
    address: string;
    mobile: string;
  };
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Your Campaign</h3>
      <p className="text-gray-600 dark:text-gray-300">
        Please confirm your campaign details before proceeding.
      </p>
      <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800">
        <p>
          📖 Book:{" "}
          <span className="font-medium">
            {data.book?.title || "No book selected"}
          </span>
        </p>
        <p>👤 Name: {data.title}</p>
        <p>📝 Description: {data.description}</p>
        <p>🏠 Address: {data.address}</p>
        <p>📱 Mobile: {data.mobile || "N/A"}</p>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onConfirm}>Confirm & Create</Button>
      </div>
    </div>
  );
}
