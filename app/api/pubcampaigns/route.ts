import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";

export async function GET(req: NextRequest) {
  try {
    const campaignsRef = collection(db, "campaigns");
    const q = query(campaignsRef, orderBy("createdAt", "desc")); // newest first

    const snap = await getDocs(q);
    const campaigns = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log("API: ", campaigns);
    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}
