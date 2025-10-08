import { db } from "@/app/firebaseConfig";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("search");
    
    let q;
    if (searchQuery) {
      // Search by username (case-insensitive)
      q = query(
        collection(db, "users"),
        where("username", ">=", searchQuery.toLowerCase()),
        where("username", "<=", searchQuery.toLowerCase() + "\uf8ff"),
        limit(10)
      );
    } else {
      // Get all users ordered by display name
      q = query(collection(db, "users"), orderBy("displayName"), limit(20));
    }
    
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
