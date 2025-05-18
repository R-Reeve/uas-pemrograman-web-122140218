// HomePage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const navigate = useNavigate();
  const [latestTopics, setLatestTopics] = useState([]);
  const [popularTopics, setPopularTopics] = useState([]);
  const [featuredTopics, setFeaturedTopics] = useState([]);
  
  useEffect(() => {
    // Redirect jika belum login
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
      navigate('/login');
      return;
    }
    
    // Load topics dari localStorage
    const topics = JSON.parse(localStorage.getItem('topics')) || [];
    
    // Sort by date (newest first) untuk latest topics
    const sortedByDate = [...topics].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    ).slice(0, 4); // Ambil 4 terbaru
    
    // Sort by likes untuk popular topics
    const sortedByLikes = [...topics].sort((a, b) => 
      (b.likes?.length || 0) - (a.likes?.length || 0)
    ).slice(0, 5); // Ambil 5 terpopuler

    // Featured topics (random selection with image, if available)
    const topicsWithImages = topics.filter(topic => topic.imageUrl);
    const randomFeatured = topicsWithImages.length > 0 
      ? [...topicsWithImages].sort(() => 0.5 - Math.random()).slice(0, 3)
      : [...topics].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    setLatestTopics(sortedByDate);
    setPopularTopics(sortedByLikes);
    setFeaturedTopics(randomFeatured);
  }, [navigate]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="relative py-16 bg-cover bg-center"
          style={{ 
            backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://i.imgur.com/WJ7TB4h.jpg')",
            minHeight: "500px"
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
            <div className="mb-6 animate-pulse">
              <img 
                src="https://i.imgur.com/J9lwPeH.png" 
                alt="Final Fantasy Logo" 
                className="h-24 mx-auto"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg font-serif tracking-wide">
              Final Fantasy Forum
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl text-blue-200 drop-shadow-md">
              Diskusikan game Final Fantasy favorit, berbagi pengalaman, dan terhubung dengan komunitas Warrior of Light lainnya
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/topics"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 transform hover:scale-105"
              >
                Jelajahi Forum
              </Link>
              <Link
                to="/topics/add"
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-300 transform hover:scale-105"
              >
                Buat Topik
              </Link>
            </div>
          </div>
        </div>

        {/* Crystal decorations */}
        <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
          <div className="flex space-x-8">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-12 h-24 bg-blue-500 opacity-60 transform rotate-12 skew-x-12 animate-pulse"
                style={{ 
                  animation: `pulse 3s infinite ${i * 0.5}s`,
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6, #93c5fd)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Topic Carousel */}
      {featuredTopics.length > 0 && (
        <div className="py-12 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-yellow-300 font-serif border-b border-yellow-600 pb-2 inline-block">
              Featured Discussions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {featuredTopics.map((topic, idx) => (
                <Link 
                  to={`/topics/${idx}`} 
                  key={idx} 
                  className="bg-gray-900/50 border border-blue-900/30 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/20"
                >
                  <div className="h-48 bg-cover bg-center" style={{ 
                    backgroundImage: topic.imageUrl 
                      ? `url(${topic.imageUrl})` 
                      : "url('https://i.imgur.com/WXpHPcN.jpg')"
                  }} />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-blue-300 mb-2 line-clamp-1">{topic.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{topic.content}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>By {topic.username}</span>
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span> 
                        {topic.likes?.length || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Topics */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-blue-900/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 px-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl font-bold font-serif">Diskusi Terbaru</span>
              </div>
              
              <div className="p-4">
                {latestTopics.length > 0 ? (
                  <div className="space-y-6">
                    {latestTopics.map((topic, index) => (
                      <Link 
                        to={`/topics/${index}`}
                        key={index} 
                        className="block border-b border-gray-700 pb-4 last:border-0 last:pb-0 hover:bg-gray-700/30 px-3 py-2 rounded-md transition-colors"
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
                              <div className="w-20 h-20 bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-bold text-blue-300">{topic.title}</h3>
                            <div className="flex items-center text-sm text-gray-400 mb-1">
                              <span>Oleh: {topic.username}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDate(topic.createdAt)}</span>
                            </div>
                            <p className="text-gray-300 line-clamp-2">
                              {topic.content}
                            </p>
                            <div className="mt-2 flex items-center space-x-4">
                              <div className="flex items-center text-yellow-500">
                                <span className="mr-1">★</span>
                                <span className="text-gray-400">{topic.likes?.length || 0} likes</span>
                              </div>
                              <div className="flex items-center text-gray-400">
                                <span className="mr-1">💬</span>
                                <span>{topic.comments?.length || 0} balasan</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Belum ada topik diskusi. Jadilah yang pertama membuat topik diskusi!</p>
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <Link 
                    to="/topics" 
                    className="inline-block px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Lihat Semua Diskusi
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Topics */}
            <div className="bg-gray-800 rounded-lg border border-yellow-900/50 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-800 to-yellow-600 text-white py-3 px-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-xl font-bold font-serif">Diskusi Populer</span>
                </div>
              </div>
              
              <div className="p-4">
                {popularTopics.length > 0 ? (
                  <div className="space-y-4">
                    {popularTopics.map((topic, index) => (
                      <Link 
                        to={`/topics/${index}`}
                        key={index} 
                        className="block border-b border-gray-700 pb-3 last:border-0 last:pb-0 hover:bg-gray-700/30 px-3 py-2 rounded transition-colors"
                      >
                        <h3 className="font-bold text-blue-300 line-clamp-1">{topic.title}</h3>
                        <div className="flex gap-3 text-sm text-gray-400 mt-1">
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{topic.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">💬</span>
                            <span>{topic.comments?.length || 0}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Oleh: {topic.username}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <p>Belum ada diskusi populer.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800 rounded-lg border border-blue-900/50 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-3 px-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xl font-bold font-serif">Final Fantasy Links</span>
                </div>
              </div>
              
              <div className="p-4">
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://finalfantasy.fandom.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Final Fantasy Wiki
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.square-enix.com/final-fantasy/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Square Enix Official
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://store.steampowered.com/search/?term=final+fantasy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      FF di Steam
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call-to-action Section */}
      <div className="py-12 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white font-serif">Bergabunglah dalam Diskusi</h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Berbagi pendapat dan pengalaman Anda tentang seri Final Fantasy. Jadilah bagian dari komunitas kami!
          </p>
          <Link 
            to="/topics/add" 
            className="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
          >
            Mulai Diskusi Baru
          </Link>
        </div>
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