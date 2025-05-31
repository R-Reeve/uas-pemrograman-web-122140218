// ikiEepep/src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
// No need to import useAuth here if only checking localStorage directly for navigation
// However, if you need isAuthenticated state or user object from context, import it:
// import { useAuth } from '../auth';

export default function HomePage() {
  const navigate = useNavigate();
  // const { isAuthenticated, user } = useAuth(); // Optional: if you need context based auth state
  const [latestTopics, setLatestTopics] = useState([]);
  const [popularTopics, setPopularTopics] = useState([]);
  const [featuredTopics, setFeaturedTopics] = useState([]);
  
  
  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
      navigate('/login'); // Redirect if not logged in
      return;
    }
    
    // Load topics from localStorage
    const topics = JSON.parse(localStorage.getItem('topics')) || [];
    
    const sortedByDate = [...topics].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // Ensure getTime() for proper comparison
    ).slice(0, 4);
    
    const sortedByLikes = [...topics].sort((a, b) => 
      (b.likes?.length || 0) - (a.likes?.length || 0)
    ).slice(0, 5);

    const shuffled = [...topics].sort(() => 0.5 - Math.random());
    const randomFeatured = shuffled.slice(0, 3);
    
    setLatestTopics(sortedByDate);
    setPopularTopics(sortedByLikes);
    setFeaturedTopics(randomFeatured);
  }, [navigate]);

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
      // console.warn("Invalid date for formatting:", dateString); // Log warning
      return 'Invalid Date';
    }
  };

  const findTopicIndex = (targetTopic) => {
    const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
    return allTopics.findIndex(topic => 
      topic.title === targetTopic.title && 
      topic.username === targetTopic.username && 
      topic.createdAt === targetTopic.createdAt
    );
  };

  // The rest of your JSX remains the same
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="relative py-16 bg-gradient-to-b from-blue-900/90 to-gray-900/90"
          style={{ minHeight: "500px" }}
        >
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
        <div className="absolute -bottom-10 left-0 right-0 flex justify-center overflow-hidden">
        </div>
      </div>
      
      {/* Featured Topic Carousel */}
      {featuredTopics.length > 0 && (
        <div className="py-12 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-yellow-300 font-serif border-b-2 border-yellow-600 pb-2 inline-block">
                Featured Discussions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTopics.map((topic, idx) => {
                const realIndex = findTopicIndex(topic);
                return (
                  <Link 
                    to={`/topics/${realIndex >= 0 ? realIndex : idx}`} 
                    key={`featured-${idx}`} 
                    className="bg-gray-900/50 border border-blue-900/30 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-900/20"
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
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Topics */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg border border-blue-900/50 overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-4 px-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl font-bold font-serif">Diskusi Terbaru</span>
              </div>
              
              <div className="p-6">
                {latestTopics.length > 0 ? (
                  <div className="space-y-6">
                    {latestTopics.map((topic, index) => {
                      const realIndex = findTopicIndex(topic);
                      return (
                        <Link 
                          to={`/topics/${realIndex >= 0 ? realIndex : index}`}
                          key={`latest-${index}`} 
                          className="block border-b border-gray-700 pb-6 last:border-0 last:pb-0 hover:bg-gray-700/30 px-4 py-3 rounded-md transition-all duration-200 group"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-lg flex items-center justify-center text-blue-300 shadow-md group-hover:shadow-lg transition-shadow">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <p className="text-lg">Belum ada topik diskusi.</p>
                    <p className="text-sm mt-2">Jadilah yang pertama membuat topik diskusi!</p>
                  </div>
                )}
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/topics" 
                    className="inline-block px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg"
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
            <div className="bg-gray-800 rounded-lg border border-yellow-900/50 overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-yellow-800 to-yellow-600 text-white py-4 px-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-xl font-bold font-serif">Diskusi Populer</span>
                </div>
              </div>
              
              <div className="p-6">
                {popularTopics.length > 0 ? (
                  <div className="space-y-4">
                    {popularTopics.map((topic, index) => {
                      const realIndex = findTopicIndex(topic);
                      return (
                        <Link 
                          to={`/topics/${realIndex >= 0 ? realIndex : index}`}
                          key={`popular-${index}`} 
                          className="block border-b border-gray-700 pb-4 last:border-0 last:pb-0 hover:bg-gray-700/30 px-3 py-2 rounded transition-all duration-200 group"
                        >
                          <h3 className="font-bold text-blue-300 group-hover:text-blue-200 transition-colors line-clamp-2 leading-tight mb-2">
                            {topic.title}
                          </h3>
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
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <div className="mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <p>Belum ada diskusi populer.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800 rounded-lg border border-blue-900/50 overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-4 px-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xl font-bold font-serif">Final Fantasy Links</span>
                </div>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="https://finalfantasy.fandom.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-300 hover:text-blue-200 transition-colors group py-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Final Fantasy Wiki
                    </a>
                  </li>
                  {/* ... other links */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12 border-t border-blue-900">
        {/* ... footer content ... */}
      </footer>
    </div>
  );
}