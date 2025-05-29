// ikiEepep/src/pages/TopicAddPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TopicAddPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedUser');
    if (!loggedInUser) {
      alert('Anda harus login terlebih dahulu.');
      navigate('/login');
    } else {
      setUser(JSON.parse(loggedInUser));
    }
  }, [navigate]);  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Pastikan file adalah gambar
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar (JPG, PNG, GIF, dll)');
        return;
      }
      
      // Batasi ukuran file (misalnya 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB dalam bytes
      if (file.size > maxSize) {
        alert('Ukuran gambar terlalu besar. Maksimal 2MB.');
        return;
      }

      // Buat preview image
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

    if (!title.trim()) {
      alert('Judul topik tidak boleh kosong.');
      return;
    }

    if (!content.trim()) {
      alert('Konten diskusi tidak boleh kosong.');
      return;
    }

    setIsLoading(true);

    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedUser')); // Assuming user info is in localStorage
      const token = loggedInUser?.token; // Example: Assuming a 'token' field

      const response = await fetch('localhost:6543/topics', { // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Example: Using a Bearer token
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (response.ok) {
        setIsLoading(false);
        alert('Topik diskusi berhasil ditambahkan.');
        navigate('/topics');
      } else {
        const errorData = await response.json();
        setIsLoading(false);
        alert(`Gagal menambahkan topik: ${errorData?.message || 'Terjadi kesalahan'}`);
        console.error('Error adding topic:', errorData);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Terjadi kesalahan: ${error.message}`);
      console.error('Error adding topic:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100">
      <Navbar />
      
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Link 
          to="/topics" 
          className="inline-flex items-center px-4 py-2 mb-6 rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Kembali ke Pustaka
        </Link>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-blue-500/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 px-6 py-4 border-b border-blue-500/30">
            <h1 className="text-2xl md:text-3xl font-bold font-fantasy text-blue-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Buat Topik Diskusi Baru
            </h1>
          </div>
          
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
                  className="w-full p-4 border border-blue-500/50 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan judul topik diskusi yang menarik"
                />
              </div>
              
              <div>
                <label className="block text-blue-300 font-medium mb-2">Isi Diskusi</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full p-4 border border-blue-500/50 rounded-lg min-h-40 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tulis isi diskusi Anda secara detail di sini..."
                ></textarea>
                <p className="mt-2 text-sm text-blue-400/70">
                  Tips: Tulis dengan jelas dan berikan detail yang cukup untuk mendapatkan diskusi yang berkualitas.
                </p>
              </div>
              
              <div>
                <label className="block text-blue-300 font-medium mb-2">Gambar (Opsional)</label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-500 border border-blue-500/50 rounded"
                    />
                  </div>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 transition-colors shadow-md text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-blue-300 mb-2">Preview:</p>
                    <div className="border border-blue-500/30 rounded-lg p-2 bg-gray-900/50">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-64 rounded mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg shadow-lg font-medium text-lg flex items-center justify-center
                    ${isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all'}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
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

        {/* Panduan membuat topik */}
        <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-5 border border-blue-500/30">
          <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Tips Membuat Topik Diskusi yang Baik
          </h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Berikan judul yang jelas dan spesifik tentang topik yang ingin didiskusikan</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Jelaskan pertanyaan atau pendapat Anda secara rinci dalam isi diskusi</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Tambahkan gambar untuk memperjelas diskusi jika diperlukan</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Gunakan bahasa yang sopan dan hormati pendapat anggota lain</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}