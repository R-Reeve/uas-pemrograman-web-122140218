// ReviewAddPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ReviewAddPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !review) {
      alert('Mohon lengkapi semua data.');
      return;
    }
    
    const newReview = {
      username: user.username,
      title,
      content: review,
      likes: [], // Array untuk menyimpan username user yang like
      createdAt: new Date().toISOString(),
    };

    // Tambahkan image jika ada
    if (imagePreview) {
      newReview.imageUrl = imagePreview; // Simpan gambar sebagai base64
    }

    const existingReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    existingReviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(existingReviews));

    alert('Review berhasil ditambahkan.');
    navigate('/reviews');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4 bg-white rounded-xl shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-6">Tulis Review</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nama Game</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
              placeholder="Masukkan nama game"
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-1">Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              className="w-full p-3 border rounded-lg min-h-32"
              placeholder="Tulis review Anda di sini"
            ></textarea>
          </div>
          
          <div>
            <label className="block font-semibold mb-1">Gambar (Opsional)</label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="border p-2 rounded w-full"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              )}
            </div>
            
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="mt-2 max-h-64 rounded border"
                />
              </div>
            )}
          </div>
          
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}