// ikiEepep/src/pages/HomePage.jsx, my HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
      navigate('/login');
      return;
    }

    const fetchTopics = () => {
      try {
        const storedTopics = JSON.parse(localStorage.getItem('topics')) || [];
        setTopics(storedTopics);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        setTopics([]);
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [navigate]);

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const findTopicIndex = (targetTopic) => {
    return topics.findIndex(topic => 
      topic.title === targetTopic.title && 
      topic.username === targetTopic.username && 
      topic.createdAt === targetTopic.createdAt
    );
  };

  const getLatestTopics = () => {
    return [...topics]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  };

  const getPopularTopics = () => {
    return [...topics]
      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      .slice(0, 5);
  };

  const getFeaturedTopics = () => {
    const shuffled = [...topics].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const quickLinks = [
    { id: 1, name: "Final Fantasy Wiki", icon: "📖", url: "https://finalfantasy.fandom.com/" },
    { id: 2, name: "FF XIV Online", icon: "🎮", url: "https://www.finalfantasyxiv.com/" },
    { id: 3, name: "FF Portal", icon: "🌟", url: "https://www.finalfantasy.com/" },
    { id: 4, name: "Square Enix", icon: "🏢", url: "https://www.square-enix.com/" },
  ];

  const latestTopics = getLatestTopics();
  const popularTopics = getPopularTopics();
  const featuredTopics = getFeaturedTopics();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      <div className="relative">
        <div className="relative py-16 bg-gradient-to-b from-blue-900/90 to-gray-900/90" style={{ minHeight: "500px" }}>
          <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <div className="h-24 w-24 mx-auto relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-2 bg-blue-600 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute inset-4 bg-blue-700 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute inset-6 bg-blue-800 rounded-full opacity-80 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute inset-8 bg-blue-900 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">FF</span>
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg font-serif tracking-wide">
              Iki Epep
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl text-blue-200 drop-shadow-md">
              Diskusikan game Final Fantasy favorit, berbagi pengalaman, dan terhubung dengan komunitas Warrior of Light lainnya
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/topics"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Jelajahi Forum
              </Link>
              <Link
                to="/topics/add"
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Buat Topik
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {featuredTopics.length > 0 && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-300 font-serif">Featured Discussions</h2>
              <Link to="/topics" className="text-blue-400 hover:text-blue-300 transition-colors">
                View All →
              </Link>
            </div>
            
            {isLoading ? (
              <p className="text-center text-gray-500">Loading featured topics...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTopics.map((topic, idx) => {
                  const realIndex = findTopicIndex(topic);
                  return (
                    <Link 
                      to={`/topics/${realIndex >= 0 ? realIndex : idx}`} 
                      key={`featured-${idx}`} 
                      className="bg-gray-800 border border-blue-900/30 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-900/20"
                    >
                      <div className="h-48 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="w-16 h-16 rounded-full bg-blue-700/30 flex items-center justify-center z-10 backdrop-blur-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-blue-300 mb-2 line-clamp-2 leading-tight">
                          {topic.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {topic.content}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="truncate flex-1 mr-2">By {topic.username}</span>
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-yellow-500">★</span> 
                            {topic.likes?.length || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Latest Topics */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-300 font-serif">Diskusi Terbaru</h2>
              <Link to="/topics" className="text-blue-400 hover:text-blue-300 transition-colors">
                View All →
              </Link>
            </div>

            {isLoading ? (
              <p className="text-center text-gray-500">Loading topics...</p>
            ) : latestTopics.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-400">Belum ada topik diskusi.</p>
                <p className="text-sm mt-2 text-gray-500">Jadilah yang pertama membuat topik diskusi!</p>
                <Link 
                  to="/topics/add" 
                  className="inline-block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-200"
                >
                  Buat Topik Pertama
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {latestTopics.map((topic, index) => {
                  const realIndex = findTopicIndex(topic);
                  return (
                    <Link 
                      to={`/topics/${realIndex >= 0 ? realIndex : index}`}
                      key={`latest-${index}`} 
                      className="block bg-gray-800 border border-blue-900/30 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-lg flex items-center justify-center text-blue-300 shadow-md group-hover:shadow-lg transition-shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="text-lg font-bold text-blue-300 group-hover:text-blue-200 transition-colors line-clamp-2 leading-tight mb-2">
                            {topic.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-400 mb-2 flex-wrap gap-2">
                            <span className="truncate">Oleh: {topic.username}</span>
                            <span className="text-gray-600">•</span>
                            <span className="flex-shrink-0">{formatDate(topic.createdAt)}</span>
                          </div>
                          <p className="text-gray-300 line-clamp-2 leading-relaxed mb-3">
                            {topic.content}
                          </p>
                          <div className="flex items-center space-x-6">
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
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Topics */}
            <div>
              <h3 className="text-xl font-bold text-yellow-300 font-serif mb-4">Diskusi Populer</h3>
              <div className="bg-gray-800 rounded-lg border border-yellow-900/30 p-4">
                {popularTopics.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <p>Belum ada diskusi populer.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {popularTopics.map((topic, index) => {
                      const realIndex = findTopicIndex(topic);
                      return (
                        <Link 
                          to={`/topics/${realIndex >= 0 ? realIndex : index}`}
                          key={`popular-${index}`} 
                          className="block border-b border-gray-700 pb-3 last:border-0 last:pb-0 hover:bg-gray-700/30 px-3 py-2 rounded transition-all duration-200 group"
                        >
                          <h4 className="font-bold text-blue-300 group-hover:text-blue-200 transition-colors line-clamp-2 leading-tight mb-2">
                            {topic.title}
                          </h4>
                          <div className="flex gap-4 text-sm text-gray-400 mb-2">
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-1">★</span>
                              <span>{topic.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">💬</span>
                              <span>{topic.comments?.length || 0}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            Oleh: {topic.username}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold text-indigo-300 font-serif mb-4">Final Fantasy Links</h3>
              <div className="bg-gray-800 rounded-lg border border-indigo-900/30 p-4">
                <div className="space-y-3">
                  {quickLinks.map((link) => (
                    <a 
                      key={link.id}
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-300 hover:text-blue-200 transition-colors group py-2"
                    >
                      <span className="mr-3 text-lg">{link.icon}</span>
                      <span className="group-hover:underline">{link.name}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12 border-t border-blue-900">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Iki Epep - Final Fantasy Forum Community</p>
        </div>
      </footer>
    </div>
  );
}