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

  useEffect(() => {
    // Cek login
    const loggedInUser = localStorage.getItem('loggedUser');
    if (!loggedInUser) {
      alert('Anda harus login terlebih dahulu.');
      navigate('/login');
    } else {
      setUser(JSON.parse(loggedInUser));
    }
    
    // Load topics
    loadTopics();
  }, [navigate]);

  const loadTopics = () => {
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
      // Sort by newest first
      parsedTopics.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Memastikan setiap topik memiliki array comments dan likes
      parsedTopics.forEach(topic => {
        if (!topic.comments) topic.comments = [];
        if (!topic.likes) topic.likes = [];
      });
      
      setTopics(parsedTopics);
    }
    setLoading(false);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Filter topics berdasarkan judul
  const filteredTopics = topics.filter(topic => 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle click pada topik untuk navigasi ke detail
  const handleTopicClick = (index) => {
    navigate(`/topics/${index}`);
  };

  // Fungsi untuk membuat preview konten
  const getContentPreview = (content) => {
    // Jika konten kurang dari 150 karakter, tampilkan semuanya
    if (content.length <= 150) {
      return content;
    }
    // Jika lebih dari 150 karakter, potong dan tambahkan elipsis
    return content.substring(0, 150) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Forum Diskusi</h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Cari judul diskusi..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Tombol Buat Topik */}
            <Link
              to="/topics/add"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
            >
              + Buat Topik Diskusi
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p>Memuat...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-10 bg-white shadow-md rounded-lg">
            <p className="text-gray-500">Belum ada topik diskusi. Jadilah yang pertama membuat topik diskusi!</p>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-10 bg-white shadow-md rounded-lg">
            <p className="text-gray-500">Tidak ada topik diskusi yang sesuai dengan pencarian.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredTopics.map((topic, index) => (
                <li 
                  key={index} 
                  onClick={() => handleTopicClick(index)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {topic.imageUrl ? (
                        <img 
                          src={topic.imageUrl} 
                          alt={topic.title} 
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-blue-800">{topic.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <span>Oleh: {topic.username}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(topic.createdAt)}</span>
                        {topic.editedAt && <span className="ml-1 text-gray-500">(diedit)</span>}
                      </div>
                      
                      {/* Tampilkan preview konten diskusi */}
                      <p className="text-gray-700 mt-2 text-sm line-clamp-3">
                        {getContentPreview(topic.content)}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-1 text-yellow-500">★</span>
                          <span>{topic.likes.length} likes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">💬</span>
                          <span>{topic.comments.length} balasan</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-center">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}