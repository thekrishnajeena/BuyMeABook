import { useEffect, useState, useRef, useCallback } from "react";
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
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initial load + reset on search clear
  useEffect(() => {
    if (search.trim() === "") {
      loadBooks(true);
    } else {
      searchBooks(search);
    }
  }, [search]);

  const loadBooks = async (reset = false) => {
    if (loading || (!reset && !hasMore)) return;
    
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
    setHasMore(items.length === 5); // If we got less than 5, we've reached the end

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
    setHasMore(false); // disable infinite scroll for search results
    setLoading(false);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loading || !hasMore || search.trim() !== "") return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // Load when 100px from bottom
    
    if (isNearBottom) {
      loadBooks();
    }
  }, [loading, hasMore, search]);

  // Add scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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

      <div 
        ref={scrollContainerRef}
        className="space-y-3 max-h-64 overflow-y-auto"
      >
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
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            <span className="ml-2 text-sm text-gray-500">Loading more books...</span>
          </div>
        )}
        
        {/* End of results indicator */}
        {!hasMore && books.length > 0 && search.trim() === "" && (
          <div className="text-center py-4 text-sm text-gray-500">
            No more books to load
          </div>
        )}
        
        {books.length === 0 && !loading && (
          <p className="text-center text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
}
