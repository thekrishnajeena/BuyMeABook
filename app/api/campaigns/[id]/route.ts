import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";

// GET individual campaign
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;
    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
    }

    const campaignRef = doc(db, "campaigns", campaignId);
    const campaignSnap = await getDoc(campaignRef);

    if (!campaignSnap.exists()) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const campaignData = { id: campaignSnap.id, ...campaignSnap.data() };
    return NextResponse.json({ campaign: campaignData });
  } catch (err) {
    console.error("Error fetching campaign:", err);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

// DELETE campaign
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;
    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID required" }, { status: 400 });
    }

    const campaignRef = doc(db, "campaigns", campaignId);
    const campaignSnap = await getDoc(campaignRef);

    if (!campaignSnap.exists()) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // TODO: Add authorization check to ensure only campaign owner can delete
    await deleteDoc(campaignRef);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
