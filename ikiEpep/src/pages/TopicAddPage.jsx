// my TopicAddPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function TopicAddPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const loggedInUser = localStorage.getItem('loggedUser');
        if (!loggedInUser) {
          navigate('/login');
          return;
        }
        setUser(JSON.parse(loggedInUser));
        setPageLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setPageLoading(false);
      }
    };

    initializePage();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar (JPG, PNG, GIF, dll)');
        return;
      }
      
      // Validate file size (2MB limit)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('Ukuran gambar terlalu besar. Maksimal 2MB.');
        return;
      }

      // Clear any previous errors
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous states
    setError(null);
    setSuccess(false);
    
    // Validation
    if (!title.trim()) {
      setError('Judul topik tidak boleh kosong.');
      return;
    }
    
    if (!content.trim()) {
      setError('Konten diskusi tidak boleh kosong.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTopic = {
        username: user.username,
        title: title.trim(),
        content: content.trim(),
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };

      if (imagePreview) {
        newTopic.imageUrl = imagePreview;
      }

      const existingTopics = JSON.parse(localStorage.getItem('topics')) || [];
      existingTopics.push(newTopic);
      localStorage.setItem('topics', JSON.stringify(existingTopics));

      setSuccess(true);
      
      // Navigate after showing success
      setTimeout(() => {
        navigate('/topics');
      }, 2000);
      
    } catch (err) {
      setError('Gagal menambahkan topik. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate('/topics');
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100">
        <Navbar />
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            {/* Back button skeleton */}
            <div className="h-10 w-32 bg-gray-700 rounded-lg"></div>
            
            {/* Card skeleton */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="h-8 bg-gray-700 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-12 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-12 bg-gray-700 rounded"></div>
                <div className="h-14 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !title && !content) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100 flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-12 text-center max-w-md mx-4 border border-red-500/30">
          <div className="text-8xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Oops!</h2>
          <p className="text-gray-300 mb-8 text-lg">{error}</p>
          <button 
            onClick={goBack}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ChevronLeft size={20} />
            Kembali ke Pustaka
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100 flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-12 text-center max-w-md mx-4 border border-green-500/30">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-green-400 mb-4">Berhasil!</h2>
          <p className="text-gray-300 mb-8 text-lg">Topik diskusi berhasil ditambahkan.</p>
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <Loader2 className="animate-spin" size={20} />
            <span>Mengalihkan ke pustaka...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100">
      <Navbar />
      
      <div className="max-w-3xl mx-auto py-8 px-4">
        <nav className="flex items-center gap-2 text-sm text-blue-300 mb-8">
          <button onClick={goBack} className="hover:text-blue-400 transition-colors font-medium">
            Pustaka
          </button>
          <span className="text-gray-500">/</span>
          <span className="text-blue-100 font-semibold">Buat Topik Baru</span>
        </nav>

        <Link 
          to="/topics" 
          className="inline-flex items-center px-4 py-2 mb-6 rounded-lg bg-blue-700 hover:bg-blue-600 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          <ChevronLeft size={20} className="mr-2" />
          Kembali ke Pustaka
        </Link>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-blue-500/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 px-6 py-4 border-b border-blue-500/30">
            <h1 className="text-2xl md:text-3xl font-bold font-fantasy text-blue-100 flex items-center">
              <Plus size={28} className="mr-3" />
              Buat Topik Diskusi Baru
            </h1>
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="mx-6 mt-6 bg-red-900/50 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
              <div className="text-red-300">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {/* Form content */}
          <div className="px-6 py-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-blue-300 font-medium mb-2">Judul Topik</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full p-4 border border-blue-500/50 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Masukkan judul topik diskusi yang menarik"
                />
              </div>
              
              <div>
                <label className="block text-blue-300 font-medium mb-2">Isi Diskusi</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full p-4 border border-blue-500/50 rounded-lg min-h-40 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  placeholder="Tulis isi diskusi Anda secara detail di sini..."
                ></textarea>
                <p className="mt-2 text-sm text-blue-400/70">
                  Tips: Tulis dengan jelas dan berikan detail yang cukup untuk mendapatkan diskusi yang berkualitas.
                </p>
              </div>
              
              <div>
                <label className="block text-blue-300 font-medium mb-2">Gambar (Opsional)</label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        disabled={isLoading}
                        className="w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:transition-colors border border-blue-500/50 rounded-lg bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={isLoading}
                        className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-500 transition-all duration-200 shadow-md text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={16} />
                        Hapus
                      </button>
                    )}
                  </div>
                  
                  {imagePreview && (
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-500/30">
                      <p className="text-sm text-blue-300 mb-3 flex items-center gap-2">
                        <Upload size={16} />
                        Preview Gambar:
                      </p>
                      <div className="relative group">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-64 rounded-lg mx-auto shadow-lg transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full py-4 rounded-lg shadow-lg font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 ${
                    isLoading 
                      ? 'bg-blue-700 cursor-not-allowed opacity-75' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Posting Diskusi
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-blue-400/70 text-sm pt-2">
                Dengan mengirimkan topik ini, Anda setuju untuk mematuhi aturan komunitas Final Fantasy Forum.
              </div>
            </form>
          </div>
        </div>

        {/* Guidelines section with improved styling */}
        <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            Tips Membuat Topik Diskusi yang Baik
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-gray-300 text-sm">Berikan judul yang jelas dan spesifik tentang topik yang ingin didiskusikan</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-gray-300 text-sm">Jelaskan pertanyaan atau pendapat Anda secara rinci dalam isi diskusi</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-gray-300 text-sm">Tambahkan gambar untuk memperjelas diskusi jika diperlukan</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-gray-300 text-sm">Gunakan bahasa yang sopan dan hormati pendapat anggota lain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}