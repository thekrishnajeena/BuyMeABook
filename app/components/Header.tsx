'use client';

import Link from "next/link";

import { useRouter } from "next/navigation";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import {doc, setDoc, getDoc, writeBatch} from "firebase/firestore";
import {db} from "../firebaseConfig";
import AvatarDropdown from "./AvatarDeopdown";

function Header(){


  const { user } = useAuth();
  const navigate = useRouter();

  const generateUsername = async (displayName: string) => {
  const base = displayName.toLowerCase().replace(/\s+/g, ""); // remove spaces
  let username = base;

  const userRef = doc(db, "users", username);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    // if exists → append timestamp
    const ts = Date.now().toString().slice(-4); // last 4 digits
    username = `${base}${ts}`;
  }

  return username;
};


  const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if(!user.email){
      throw new Error("No email found in user data");
    }

    // Save user in Firestore if not exists
    const userRef = doc(db, "emails", user.email || "user");
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
          // Generate username
    const username = await generateUsername(user.displayName || "user");

    const userDataRef = doc(db, "users", username);
    
    const batch = writeBatch(db);
    
    batch.set(userDataRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        description: "📖 A passionate reader",
        username: username,
        createdAt: new Date(),
    })
      batch.set(userRef, {
        username: username
      });

      await batch.commit();

      console.log("Setting username in localStorage:", username);
localStorage.setItem("username", username);
console.log("Stored username:", localStorage.getItem("username"));

      navigate.push(`/${username}`);
    }else{
      const {username }= snapshot.data();

      console.log("Setting username in localStorage:", username);
localStorage.setItem("username", username);
console.log("Stored username:", localStorage.getItem("username"));

      navigate.push(`/${username}`);
    }

    
  } catch (error) {
    console.error("Login error:", error);
  }
};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate.push("/")
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

return (
    <>
<header className="absolute inset-x-0 top-0 z-10 w-full">
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* <!-- lg+ --> */}
        <nav className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex-shrink-0">
                <Link href="/" title="" className="flex">
                    <img className="w-auto h-10 lg:h-20" src="/bmab.png" alt="" />
                </Link>
            </div>

            <button type="button" className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100">
                {/* <!-- Menu open: "hidden", Menu closed: "block" --> */}
                <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                </svg>

                {/* <!-- Menu open: "block", Menu closed: "hidden" --> */}
                <svg className="hidden w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

        
            <div className="items-center justify-center hidden px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 border-transparent rounded-md lg:inline-flex">
           
            {user ? (
        <>
            <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10 me-4">

                <Link href="/contribute" title="" className="text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Contribute </Link>

                <Link href="/about" title="" className="text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> About </Link>
            </div>

            <AvatarDropdown profile={user} onLogout={handleLogout}/>
        </>
      ) : (
<>
            <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10">

                <Link href="/contribute" title="" className="text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Contribute </Link>

                <Link href="/about" title="" className="text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> About </Link>
            </div>

        <button onClick={handleLogin} className="px-4 py-2 mx-4 bg-blue-500 text-white rounded cursor-pointer inline-flex items-center font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:bg-blue-700" role="button">
          Sign in with Google
        </button></>
      )}
        
            </div>
        </nav>

        {/* <!-- xs to lg --> */}
        <nav className="pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md lg:hidden">
            <div className="flow-root">
                <div className="flex flex-col px-6 -my-2 space-y-1">
     
                    <Link href="/contribute" title="" className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600 cursor-pointer"> Contribute </Link>

                    <Link href="/about" title="" className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600 cursor-pointer"> About </Link>
                </div>
            </div>

            <div className="px-6 mt-6">
                <Link href="/login" title="" className="cursor-pointer inline-flex justify-center px-4 py-3 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md tems-center hover:bg-blue-700 focus:bg-blue-700" role="button"> Get started now </Link>
            </div>
        </nav>
    </div>
</header>
</>
)
}

export default Header;
