"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { FiSearch, FiBookOpen, FiTrendingUp, FiUsers, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  publishedAt: string;
  url: string;
  source: string;
}

export default function Explore() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch articles from Dev.to API
  const fetchArticles = async (loadMore = false) => {
    if (articlesLoading) return;
    
    setArticlesLoading(true);
    try {
      const bookRelatedTags = [
        "books",
        "learning", 
        "education",
        "programming",
        "tutorial",
        "beginners",
        "lifelessons",
        "python",
        "startups",
        "AI"
      ];
      
      // Pick a random tag to get variety
      const randomTag = bookRelatedTags[Math.floor(Math.random() * bookRelatedTags.length)];
      
      const response = await fetch(
        `https://dev.to/api/articles?tag=${randomTag}&per_page=8&page=${currentPage}`
      );
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const formattedArticles = data.map((article: any, index: number) => ({
          id: article.id || `article-${Date.now()}-${index}`,
          title: article.title,
          excerpt: article.description || article.body_markdown?.substring(0, 150) + '...' || "Read more about this interesting topic...",
          category: getCategoryFromTags(article.tag_list) || getRandomCategory(),
          readTime: `${Math.ceil(article.reading_time_minutes || Math.random() * 8 + 2)} min read`,
          image: article.cover_image || article.social_image || getRandomBookImage(),
          publishedAt: formatTimeAgo(article.published_at),
          url: article.url,
          source: "Dev.to"
        }));
        
        if (loadMore) {
          setArticles(prev => [...prev, ...formattedArticles]);
        } else {
          setArticles(formattedArticles);
        }
        
        // Check if there are more articles available
        setHasMoreArticles(data.length === 8);
        setCurrentPage(prev => prev + 1);
      } else {
        if (!loadMore) {
          setArticles(getMockArticles());
        }
        setHasMoreArticles(false);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      if (!loadMore) {
        setArticles(getMockArticles());
      }
      setHasMoreArticles(false);
    } finally {
      setArticlesLoading(false);
    }
  };

  const getCategoryFromTags = (tags: string[]) => {
    if (!tags || !Array.isArray(tags)) return null;
    
    const tagString = tags.join(' ').toLowerCase();
    
    if (tagString.includes('book') || tagString.includes('reading') || tagString.includes('literature')) {
      return "Book Reviews";
    }
    if (tagString.includes('education') || tagString.includes('learning') || tagString.includes('tutorial') || tagString.includes('beginners')) {
      return "Education";
    }
    if (tagString.includes('productivity') || tagString.includes('life') || tagString.includes('lesson')) {
      return "Life Lessons";
    }
    if (tagString.includes('psychology') || tagString.includes('mental') || tagString.includes('mind')) {
      return "Psychology";
    }
    if (tagString.includes('javascript') || tagString.includes('python') || tagString.includes('programming') || tagString.includes('webdev')) {
      return "AI & Technology";
    }
    if (tagString.includes('writing') || tagString.includes('author') || tagString.includes('novel')) {
      return "Reading Tips";
    }
    
    return null;
  };

  const getCategoryFromKeywords = (keywords: string[]) => {
    if (!keywords || !Array.isArray(keywords)) return null;
    
    const keywordString = keywords.join(' ').toLowerCase();
    
    if (keywordString.includes('book') || keywordString.includes('reading') || keywordString.includes('literature')) {
      return "Book Reviews";
    }
    if (keywordString.includes('education') || keywordString.includes('learning') || keywordString.includes('school')) {
      return "Education";
    }
    if (keywordString.includes('life') || keywordString.includes('lesson') || keywordString.includes('wisdom')) {
      return "Life Lessons";
    }
    if (keywordString.includes('psychology') || keywordString.includes('mental') || keywordString.includes('mind')) {
      return "Psychology";
    }
    if (keywordString.includes('technology') || keywordString.includes('ai') || keywordString.includes('digital')) {
      return "AI & Technology";
    }
    if (keywordString.includes('writing') || keywordString.includes('author') || keywordString.includes('novel')) {
      return "Reading Tips";
    }
    
    return null;
  };

  const getRandomCategory = () => {
    const categories = ["AI & Technology", "Life Lessons", "Reading Tips", "Psychology", "Book Reviews", "Education"];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const getRandomBookImage = () => {
    // Using free book cover images from Unsplash
    const images = [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      "/book1.jpg", "/book2.jpg", "/book3.jpg", "/book4.jpg", "/book123.png"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  };

  const getMockArticles = () => [
    {
      id: "1",
      title: "Try Refreshing the page",
      excerpt: "dummy article",
      readTime: "5 min read",
      image: "/book1.jpg",
      publishedAt: "infinity",
      url: "#",
      source: "BuyMeABook"
    }
  ];

  useEffect(() => {
    fetchArticles();
    fetchUsers();
  }, []);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (articlesLoading || !hasMoreArticles) return;
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 1000; // Load when 1000px from bottom
    
    if (isNearBottom) {
      fetchArticles(true);
    }
  }, [articlesLoading, hasMoreArticles]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/explore");
      const data = await res.json();
      setUsers(data.users || data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setLoading(true);
    try {
      // Call real API for user search
      const response = await fetch(`/api/users/explore?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.users) {
        setSearchResults(data.users.slice(0, 5));
        setShowSearchResults(true);
      } else {
        // Fallback to local search
        const filtered = users.filter((u) =>
          u.username.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 5));
        setShowSearchResults(true);
      }
    } catch (err) {
      console.error("Search failed:", err);
      // Fallback to local search
      const filtered = users.filter((u) =>
        u.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
      setShowSearchResults(true);
    } finally {
      setLoading(false);
    }
  }, [users]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, searchUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101212] to-[#08201D] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Explore & Discover 📚
          </h1>
          <p className="text-gray-300 text-lg">
            Find readers, discover articles, and explore the world of books
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="relative mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by username..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              {searchResults.map((user) => (
                <Link
                  key={user.id}
                  href={`/${user.username}`}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                >
                  <Image
                    src={user.photoURL || "/default-avatar.png"}
                    width={40}
                    height={40}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{user.displayName}</h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Articles Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <FiBookOpen className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
            </div>

            <div className="space-y-6">
              {articlesLoading && articles.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <span className="ml-3 text-white">Loading fresh articles...</span>
                </div>
              ) : (
                articles.map((article) => (
                <div key={article.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="flex gap-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-24 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {article.category}
                        </span>
                        <span className="text-gray-400 text-sm">{article.readTime}</span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{article.publishedAt}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                      >
                        Read More
                        <FiArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            {/* Loading indicator */}
            {articlesLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-3 text-white">Loading more articles...</span>
              </div>
            )}
            
            {/* End of articles indicator */}
            {!hasMoreArticles && articles.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  You've reached the end of available articles
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <FiTrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Trending Topics</h3>
              </div>
              <div className="space-y-2">
                {["AI in Education", "Classic Literature", "Reading Habits", "Book Reviews", "Learning Tips"].map((topic) => (
                  <div key={topic} className="flex items-center justify-between p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                    <span className="text-gray-300">{topic}</span>
                    <FiArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <FiUsers className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Community</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Readers</span>
                  <span className="text-white font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Books Shared</span>
                  <span className="text-white font-semibold">5,678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Campaigns</span>
                  <span className="text-white font-semibold">890</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
