// TopicListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PlusCircle, Search, X, ListFilter, ThumbsUp, MessageSquare, ImageIcon, ChevronRight, AlertTriangle, Smile, FileText, Edit } from 'lucide-react';

export default function TopicListPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setPageLoading(true);
    setPageError(null);

    const loggedInUser = localStorage.getItem('loggedUser');
    if (!loggedInUser) {
      navigate('/login');
      return; // Important to return to prevent further execution
    } else {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (error) {
        console.error("Error parsing loggedUser:", error);
        setPageError("Sesi pengguna tidak valid. Silakan login kembali.");
        setPageLoading(false);
        // Optionally navigate to login or show error
        navigate('/login');
        return;
      }
    }
    
    loadTopics();
  }, [navigate]);

  const loadTopics = () => {
    try {
      let stored = localStorage.getItem('topics');
      if (!stored) {
        stored = localStorage.getItem('reviews'); // Fallback
        if (stored) {
          localStorage.setItem('topics', stored);
        }
      }
      
      if (stored) {
        const parsedTopics = JSON.parse(stored).map((topic, index) => ({
          ...topic,
          originalIndex: index, // Embed original index for stable navigation
          comments: topic.comments || [],
          likes: topic.likes || [],
          createdAt: topic.createdAt || new Date().toISOString(), // Ensure createdAt exists
          title: topic.title || "Tanpa Judul",
          content: topic.content || "",
          username: topic.username || "Anonim",
        }));
        setTopics(parsedTopics);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error('Error loading topics:', error);
      setPageError('Gagal memuat topik diskusi. Data mungkin korup atau tidak valid.');
      setTopics([]);
    } finally {
      setPageLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleTopicClick = (originalTopicIndex) => {
    navigate(`/topics/${originalTopicIndex}`);
  };

  const processedTopics = topics
    .filter(topic => 
      (topic.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (topic.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (topic.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostLikes':
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        case 'mostComments':
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const getContentPreview = (content) => {
    if (!content) return '';
    if (content.length <= 150) return content; // Adjusted length for preview
    return content.substring(0, 150) + '...';
  };

  // Skeleton Loader for list items
  const TopicListItemSkeleton = () => (
    <li className="p-4 animate-pulse">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-20 h-20 bg-gray-700 rounded-md"></div>
        </div>
        <div className="flex-grow">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2 mb-3"></div>
          <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6 mb-3"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
        <div className="flex-shrink-0 self-center hidden md:block ml-3">
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </li>
  );

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100">
        <Navbar />
        <div className="bg-cover bg-center py-12 px-4 text-center" style={{ backgroundImage: "url('/images/ff-forum-header.jpg')" }}>
          <div className="h-10 bg-gray-700/50 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-700/50 rounded w-3/4 mx-auto animate-pulse"></div>
        </div>
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Filter/Search Skeleton */}
          <div className="bg-gray-800 rounded-lg border border-blue-900/30 p-4 mb-6 animate-pulse">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="h-10 bg-gray-700 rounded w-48"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                <div className="h-10 bg-gray-700 rounded w-64"></div>
                <div className="h-10 bg-gray-700 rounded w-40"></div>
              </div>
            </div>
          </div>
          {/* List Skeleton */}
          <div className="bg-gray-800 rounded-lg border border-blue-900/30 overflow-hidden">
            <ul className="divide-y divide-gray-700">
              <TopicListItemSkeleton />
              <TopicListItemSkeleton />
              <TopicListItemSkeleton />
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100 flex flex-col items-center justify-center">
        <Navbar />
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-10 text-center max-w-lg mx-4 border border-red-500/30">
          <AlertTriangle className="text-red-400 mx-auto mb-6" size={64} />
          <h2 className="text-3xl font-bold text-red-300 mb-4">Oops! Terjadi Kesalahan</h2>
          <p className="text-gray-300 mb-8 text-lg">{pageError}</p>
          <button 
            onClick={() => {
              setPageError(null);
              setPageLoading(true);
              loadTopics(); // Try reloading topics
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mb-3"
          >
            Coba Lagi
          </button>
          <Link 
            to="/"
            className="text-blue-400 hover:text-blue-300"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100">
      <Navbar />
      
      <div className="bg-cover bg-center py-12 sm:py-16 px-4 text-center shadow-lg" style={{ backgroundImage: "url('/images/ff-forum-header-bg.jpg')" /* Replace with actual image path or keep as is if not available */ }}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-100 font-serif mb-3 sm:mb-4 drop-shadow-lg">Forum Diskusi Final Fantasy</h1>
        <p className="text-base sm:text-lg text-blue-200 max-w-2xl mx-auto drop-shadow-md">
          Berbagi pengalaman, pendapat, dan informasi seputar game Final Fantasy favorit Anda.
        </p>
      </div>

      <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-blue-700/30 p-4 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="w-full md:w-auto">
              <div className="w-full sm:w-48">
                <label htmlFor="sortBy" className="block text-xs text-blue-300 mb-1 font-medium flex items-center">
                  <ListFilter size={14} className="mr-1.5"/> Urutkan Berdasarkan
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2.5 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="mostLikes">Paling Disukai</option>
                  <option value="mostComments">Paling Banyak Komentar</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <label htmlFor="searchTerm" className="block text-xs text-blue-300 mb-1 font-medium">Cari Diskusi</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </span>
                  <input
                    id="searchTerm"
                    type="text"
                    placeholder="Judul, isi, atau pengguna..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-3 py-2.5 pl-10 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 p-1"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="w-full sm:w-auto sm:self-end pt-3 sm:pt-0">
                <Link
                  to="/topics/add"
                  className="flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-md transition-all duration-200 shadow-lg font-medium text-sm transform hover:scale-105"
                >
                  <Edit size={16} className="mr-2" /> Buat Topik Baru
                </Link>
              </div>
            </div>
          </div>
        </div>

        {topics.length === 0 && !searchTerm ? (
          <div className="text-center py-16 bg-gray-800/70 rounded-lg border border-dashed border-blue-700/30 shadow-xl">
            <FileText size={56} className="mx-auto text-blue-400/50 mb-4" />
            <p className="text-xl text-blue-200 mb-3">Belum Ada Diskusi Apapun</p>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Jadilah yang pertama memulai percakapan! Bagikan pemikiran, pertanyaan, atau temuan menarik Anda tentang Final Fantasy.
            </p>
            <Link
              to="/topics/add"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg font-semibold transform hover:scale-105"
            >
              <PlusCircle size={20} /> Buat Topik Diskusi
            </Link>
          </div>
        ) : processedTopics.length === 0 && searchTerm ? (
          <div className="text-center py-16 bg-gray-800/70 rounded-lg border border-dashed border-blue-700/30 shadow-xl">
            <Smile size={56} className="mx-auto text-yellow-400/60 mb-4" />
            <p className="text-xl text-blue-200 mb-3">Tidak Ada Hasil untuk "{searchTerm}"</p>
            <p className="text-gray-400">Coba gunakan kata kunci lain atau periksa ejaan Anda.</p>
          </div>
        ) : (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-blue-700/30 overflow-hidden shadow-xl">
            <ul className="divide-y divide-gray-700/50">
              {processedTopics.map((topic) => (
                <li 
                  key={topic.originalIndex} // Use originalIndex as key
                  onClick={() => handleTopicClick(topic.originalIndex)}
                  className="p-4 sm:p-5 hover:bg-gray-700/70 cursor-pointer transition duration-150 ease-in-out group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {topic.imageUrl ? (
                        <img 
                          src={topic.imageUrl} 
                          alt={topic.title} 
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md shadow-md border border-blue-500/20 transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-700 rounded-md flex items-center justify-center text-gray-500 border border-blue-500/20 shadow-md">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0"> {/* Added min-w-0 for better text truncation */}
                      {topic.editedAt && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-700/50 text-yellow-200 mb-1.5 border border-yellow-500/30">
                          Diedit
                        </span>
                      )}
                      <h3 className="text-base sm:text-lg font-semibold text-blue-300 group-hover:text-blue-200 mb-1 truncate" title={topic.title}>{topic.title}</h3>
                      
                      <div className="flex items-center text-xs sm:text-sm text-gray-400 mb-1.5">
                        <span className="font-medium text-blue-400">{topic.username}</span>
                        <span className="mx-1.5">•</span>
                        <span>{formatDate(topic.createdAt)}</span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                        {getContentPreview(topic.content)}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
                        <div className="flex items-center text-yellow-400">
                          <ThumbsUp size={14} className="mr-1" />
                          <span className="text-gray-300">{topic.likes?.length || 0} suka</span>
                        </div>
                        <div className="flex items-center text-blue-400">
                          <MessageSquare size={14} className="mr-1" />
                          <span className="text-gray-300">{topic.comments?.length || 0} balasan</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-center hidden md:block ml-3 transition-transform duration-200 group-hover:translate-x-1">
                      <ChevronRight size={20} className="text-gray-500 group-hover:text-blue-400" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {!pageLoading && processedTopics.length > 10 && ( // Show pagination only if many items and not loading
          <div className="mt-8 flex justify-center">
            {/* Placeholder for actual pagination component */}
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">Prev</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-blue-600 text-sm font-medium text-white">1</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">2</a>
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">Next</a>
            </nav>
          </div>
        )}
      </div>
      
      <footer className="bg-gray-900/70 backdrop-blur-sm text-gray-300 py-8 mt-12 border-t border-blue-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="text-base font-bold mb-3 text-blue-300 font-serif">Tentang Forum</h3>
              <p className="text-gray-400 leading-relaxed">
                Forum komunitas penggemar Final Fantasy di Indonesia. Berbagi pengalaman, diskusi, dan informasi terbaru tentang seri game Final Fantasy.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold mb-3 text-blue-300 font-serif">Final Fantasy</h3>
              <p className="text-gray-400 leading-relaxed">
                Final Fantasy adalah seri RPG ikonik oleh Square Enix, dikenal karena cerita mendalam, karakter tak terlupakan, dan inovasi gameplay sejak 1987.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold mb-3 text-blue-300 font-serif">Kontak Saya</h3>
              <p className="text-gray-400 leading-relaxed">
                Email: arifkedua264@gmail.com<br />
                Github: <a href="https://github.com/R-Reeve/uas-pemrograman-web-122140218.git" className="text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">R-Reeve</a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700/50 mt-8 pt-6 text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Final Fantasy Forum. All rights reserved. FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}