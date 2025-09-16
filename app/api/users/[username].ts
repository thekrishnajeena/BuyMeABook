import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  const ref = doc(db, "emails", email as string);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return res.status(404).json({ error: "User not found" });
  }

  const userna = snap.data().username;
  const refUser = doc(db, "users", userna as string)
  const snapUser = await getDoc(refUser)

  if(!snapUser.exists()){
    return res.status(404).json({error: "User not found"});
  }

  const { username: u, displayName, photoURL, description } = snapUser.data();

  res.status(200).json({ username: u, displayName, photoURL, description });
}
