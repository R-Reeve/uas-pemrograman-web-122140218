// HomePage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const navigate = useNavigate();
  const [latestReviews, setLatestReviews] = useState([]);
  const [popularReviews, setPopularReviews] = useState([]);
  
  useEffect(() => {
    // Redirect jika belum login
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
      navigate('/login');
      return;
    }
    
    // Load reviews dari localStorage
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    // Sort by date (newest first) untuk latest reviews
    const sortedByDate = [...reviews].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    ).slice(0, 3); // Ambil 3 terbaru
    
    // Sort by likes untuk popular reviews
    const sortedByLikes = [...reviews].sort((a, b) => 
      (b.likes?.length || 0) - (a.likes?.length || 0)
    ).slice(0, 3); // Ambil 3 terpopuler
    
    setLatestReviews(sortedByDate);
    setPopularReviews(sortedByLikes);
  }, [navigate]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-700 text-white">
        <div 
          className="relative py-12 bg-cover bg-center"
          style={{ 
            backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url('/api/placeholder/1200/400')",
            minHeight: "400px"
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Iki Epep
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md">
              Review game Final Fantasy favorit, baca ulasan teman, dan bagikan pengalamanmu dengan komunitas gaming
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Reviews */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white py-3 px-4 flex items-center">
                <span className="text-xl font-bold">Review Terbaru</span>
              </div>
              
              <div className="p-4">
                {latestReviews.length > 0 ? (
                  <div className="space-y-6">
                    {latestReviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            {review.imageUrl ? (
                              <img 
                                src={review.imageUrl} 
                                alt={review.title} 
                                className="w-20 h-20 object-cover rounded"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-bold text-blue-800">{review.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <span>Oleh: {review.username}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDate(review.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 line-clamp-2">
                              {review.content}
                            </p>
                            <div className="mt-2 flex items-center space-x-4">
                              <div className="flex items-center text-yellow-500">
                                <span className="mr-1">★</span>
                                <span className="text-gray-700">{review.likes?.length || 0} likes</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <span className="mr-1">💬</span>
                                <span>{review.comments?.length || 0} komentar</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Belum ada review. Jadilah yang pertama menulis review!</p>
                  </div>
                )}
                
                <div className="mt-4 text-center">
                  <Link 
                    to="/reviews" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Lihat Semua Review →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Only Popular Reviews */}
          <div>
            {/* Popular Reviews */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-yellow-500 text-white py-3 px-4">
                <span className="text-xl font-bold">Review Populer</span>
              </div>
              
              <div className="p-4">
                {popularReviews.length > 0 ? (
                  <div className="space-y-4">
                    {popularReviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                        <h3 className="font-bold text-blue-800">{review.title}</h3>
                        <div className="text-sm text-gray-500">
                          {review.likes?.length || 0} likes • {review.comments?.length || 0} komentar
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          Oleh: {review.username}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Belum ada review populer.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Kontak Saya</h3>
            <p className="text-blue-200">
              Email: arifkedua264@gmail.com<br />
              Github: <a href="https://github.com/R-Reeve" className="underline text-blue-400 hover:text-blue-600" target="_blank" rel="noopener noreferrer">R-Reeve</a>
            </p>
          </div>

          </div>
          <div className="border-t border-blue-700 mt-8 pt-4 text-center text-blue-200">
            <p>© 2025 Game Reviews. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}