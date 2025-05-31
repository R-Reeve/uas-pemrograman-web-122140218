// TopicListPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TopicListPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Cek login
    const loggedInUser = localStorage.getItem('loggedUser');
    if (!loggedInUser) {
      //alert('Anda harus login terlebih dahulu.');
      navigate('/login');
    } else {
      setUser(JSON.parse(loggedInUser));
    }
    
    // Load topics
    loadTopics();
  }, [navigate]);

  const loadTopics = () => {
    try {
      // Coba ambil dari key baru 'topics'
      let stored = localStorage.getItem('topics');
      if (!stored) {
        // Fallback ke key lama 'reviews' jika 'topics' belum ada
        stored = localStorage.getItem('reviews');
        // Jika data ditemukan di 'reviews', pindahkan ke 'topics'
        if (stored) {
          localStorage.setItem('topics', stored);
        }
      }
      
      if (stored) {
        const parsedTopics = JSON.parse(stored);
        
        // Memastikan setiap topik memiliki array comments dan likes
        parsedTopics.forEach(topic => {
          if (!topic.comments) topic.comments = [];
          if (!topic.likes) topic.likes = [];
        });
        
        setTopics(parsedTopics);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error('Error loading topics:', error);
      setTopics([]);
    }
    setLoading(false);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle click pada topik untuk navigasi ke detail
  const handleTopicClick = (index) => {
    // Find the actual index in the original topics array
    const originalIndex = topics.findIndex(topic => 
      topic.title === processedTopics[index].title && 
      topic.username === processedTopics[index].username && 
      topic.createdAt === processedTopics[index].createdAt
    );
    navigate(`/topics/${originalIndex >= 0 ? originalIndex : index}`);
  };

  // Filter dan sort topics
  const processedTopics = topics
    // Filter by search term
    .filter(topic => 
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Sort based on selected sort method
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

  // Fungsi untuk membuat preview konten
  const getContentPreview = (content) => {
    if (!content) return '';
    if (content.length <= 200) return content;
    return content.substring(0, 200) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      {/* Header dengan background FF-style */}
      <div className="bg-cover bg-center py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-blue-300 font-serif mb-4">Forum Diskusi Final Fantasy</h1>
        <p className="text-blue-200 max-w-2xl mx-auto">
          Berbagi pengalaman, pendapat, dan informasi seputar game Final Fantasy favorit Anda
        </p>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Filter dan Search Controls */}
        <div className="bg-gray-800 rounded-lg border border-blue-900/30 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Left Side - Sort */}
            <div className="w-full md:w-auto">
              <div className="w-full sm:w-48">
                <label htmlFor="sortBy" className="block text-sm text-gray-400 mb-1">Urutkan</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="mostLikes">Terpopuler</option>
                  <option value="mostComments">Terbanyak Balasan</option>
                </select>
              </div>
            </div>
            
            {/* Right Side - Search & New Topic */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <label htmlFor="searchTerm" className="block text-sm text-gray-400 mb-1">Cari Diskusi</label>
                <div className="relative">
                  <input
                    id="searchTerm"
                    type="text"
                    placeholder="Cari judul atau isi..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 pl-10 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      aria-label="Clear search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Tombol Buat Topik */}
              <div className="w-full sm:w-auto sm:self-end">
                <Link
                  to="/topics/add"
                  className="block w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors"
                >
                  + Buat Topik Diskusi
                </Link>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-400">Memuat diskusi...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-lg border border-blue-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <p className="text-gray-400 mb-4">Belum ada topik diskusi. Jadilah yang pertama membuat topik diskusi!</p>
            <Link
              to="/topics/add"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors"
            >
              Buat Topik Diskusi
            </Link>
          </div>
        ) : processedTopics.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-lg border border-blue-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400">Tidak ada topik diskusi yang sesuai dengan pencarian.</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-blue-900/30 overflow-hidden">
            <ul className="divide-y divide-gray-700">
              {processedTopics.map((topic, index) => (
                <li 
                  key={`${topic.title}-${topic.createdAt}-${index}`}
                  onClick={() => handleTopicClick(index)}
                  className="p-4 hover:bg-gray-700 cursor-pointer transition duration-150"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {topic.imageUrl ? (
                        <img 
                          src={topic.imageUrl} 
                          alt={topic.title} 
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {topic.editedAt && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            Diedit
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-blue-300 mb-1">{topic.title}</h3>
                      
                      <div className="flex items-center text-sm text-gray-400 mb-2">
                        <span className="font-medium">{topic.username}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(topic.createdAt)}</span>
                      </div>
                      
                      {/* Tampilkan preview konten diskusi */}
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {getContentPreview(topic.content)}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center text-yellow-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          <span className="text-gray-300">{topic.likes.length} likes</span>
                        </div>
                        <div className="flex items-center text-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                          <span className="text-gray-300">{topic.comments.length} balasan</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-center hidden md:block">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Pagination Placeholder (for future implementation) */}
        {!loading && processedTopics.length > 0 && (
          <div className="mt-6 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-blue-600 text-sm font-medium text-white">1</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">2</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">3</a>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400">...</span>
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-300 font-serif">Tentang Forum</h3>
              <p className="text-gray-400">
                Forum komunitas penggemar Final Fantasy di Indonesia. Berbagi pengalaman, diskusi, dan informasi terbaru tentang seri game Final Fantasy.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-300 font-serif">Final Fantasy</h3>
              <p className="text-gray-400">
                Final Fantasy adalah seri role-playing game yang dikembangkan dan diterbitkan oleh Square Enix (sebelumnya Square). Seri ini telah merilis lebih dari 15 game utama dan berbagai spin-off sejak 1987.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-300 font-serif">Kontak Saya</h3>
              <p className="text-gray-400">
                Email: arifkedua264@gmail.com<br />
                Github: <a href="https://github.com/R-Reeve" className="text-blue-300 hover:text-blue-200 transition-colors" target="_blank" rel="noopener noreferrer">R-Reeve</a>
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
            <p>© 2025 Final Fantasy Forum. All rights reserved. FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}