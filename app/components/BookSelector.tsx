import { useEffect, useState } from "react";
import {
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function BookSelector({
  onNext,
}: {
  onNext: (book: any) => void;
}) {
  const [books, setBooks] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Initial load + reset on search clear
  useEffect(() => {
    if (search.trim() === "") {
      loadBooks(true);
    } else {
      searchBooks(search);
    }
  }, [search]);

  const loadBooks = async (reset = false) => {
    setLoading(true);

    let q = query(collection(db, "booksnew"), orderBy("title"), limit(5));
    if (!reset && lastDoc) {
      q = query(
        collection(db, "booksnew"),
        orderBy("title"),
        startAfter(lastDoc),
        limit(5)
      );
    }

    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    setBooks(reset ? items : (prev) => [...prev, ...items]);
    setLastDoc(snap.docs[snap.docs.length - 1] || null);

    setLoading(false);
  };

  const searchBooks = async (term: string) => {
    if (!term.trim()) return;

    setLoading(true);
    const booksRef = collection(db, "booksnew");

    let q;
    if (/^\d+$/.test(term)) {
      // ISBN search
      q = query(
        booksRef,
        orderBy("isbn"),
        startAt(term),
        endAt(term + "\uf8ff")
      );
    } else {
      // Name search
      q = query(
        booksRef,
        orderBy("title"),
        startAt(term),
        endAt(term + "\uf8ff")
      );
    }

    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setBooks(items);
    setLastDoc(null); // disable pagination for search results
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search ISBN or title"
          className="w-full p-2 rounded border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {books.map((book) => (
          <div
            key={book.id}
            className="p-3 rounded flex justify-between border cursor-pointer hover:bg-blue-300"
            onClick={() => onNext(book)} // ✅ send book back up
          >

            <div className="flex flex-row gap-2 items-center">
              <img src={book.coverLink} alt={book.title} width={60} height={80}
              className="rounded"/>
              <div>
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm">By {book.author}</p>
              </div>
            </div>
          </div>
        ))}
        {books.length === 0 && !loading && (
          <p className="text-center text-gray-500">No results found</p>
        )}
      </div>

      {search.trim() === "" && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => loadBooks()}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
