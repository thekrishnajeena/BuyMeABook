import { db } from "@/app/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  const users = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(users);
}
