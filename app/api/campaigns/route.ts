import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/app/firebaseConfig";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, where } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { book, title, address, mobile, username } = body;

    if (!book || !title || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const campaignData = {
      book: {
        id: book.id,
        name: book.title,
        isbn: book.isbn,
        finalPrice: book.finalPrice
      },
      title,
      address,
      mobile: mobile || null,
      targetAmount: book.finalPrice || 0,
      currentAmount: 0,
      createdBy: "PUBLIC", // replace with user id if you have auth
      username: username,
      status: "open",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "campaigns"), campaignData);

    return NextResponse.json({ id: docRef.id, ...campaignData }, { status: 201 });
  } catch (err) {
    console.error("Error creating campaign:", err);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username"); // frontend passes the username
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    // Query campaigns where the 'username' field matches the current user
    const campaignsRef = collection(db, "campaigns");
    const q = query(
      campaignsRef,
      where("username", "==", username), // filter by username
      orderBy("createdAt", "desc")       // newest first
    );

    const snap = await getDocs(q);
    const campaigns = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}


