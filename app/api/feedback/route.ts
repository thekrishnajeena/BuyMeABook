import { NextResponse } from "next/server";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";


// --- POST /api/feedback ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message?.trim();
    const email = body?.email?.trim() || null;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const feedback = {
      message,
      email,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "feedback"), feedback);
    console.log("Document written with ID: ", docRef.id)
    
    return NextResponse.json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
