// ReviewListPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ReviewListPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  // State untuk komentar
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    // Cek login
    const loggedInUser = localStorage.getItem('loggedUser');
    if (!loggedInUser) {
      alert('Anda harus login terlebih dahulu.');
      navigate('/login');
    } else {
      setUser(JSON.parse(loggedInUser));
    }
    
    // Load reviews
    loadReviews();
  }, [navigate]);

  const loadReviews = () => {
    const stored = localStorage.getItem('reviews');
    if (stored) {
      const parsedReviews = JSON.parse(stored);
      // Sort by newest first
      parsedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Memastikan setiap review memiliki array comments
      parsedReviews.forEach(review => {
        if (!review.comments) {
          review.comments = [];
        }
      });
      
      setReviews(parsedReviews);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Format time untuk komentar
  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Toggle tampilan komentar
  const toggleComments = (index) => {
    setShowComments(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Handle like/unlike
  const handleLike = (index) => {
    const updatedReviews = [...reviews];
    const review = updatedReviews[index];
    
    // Cek apakah user sudah memberikan like
    const likeIndex = review.likes ? review.likes.indexOf(user.username) : -1;
    
    if (!review.likes) {
      review.likes = [];
    }
    
    if (likeIndex === -1) {
      // Tambahkan like
      review.likes.push(user.username);
    } else {
      // Hapus like
      review.likes.splice(likeIndex, 1);
    }
    
    // Update state dan localStorage
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  // Tambah komentar baru
  const addComment = (index) => {
    if (!commentText.trim()) return;
    
    const updatedReviews = [...reviews];
    const review = updatedReviews[index];
    
    // Pastikan ada array comments
    if (!review.comments) {
      review.comments = [];
    }
    
    // Tambahkan komentar baru
    review.comments.push({
      username: user.username,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    });
    
    // Update state dan localStorage
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    setCommentText('');
    
    // Pastikan tampilan komentar terbuka setelah posting
    setShowComments(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Hapus komentar
  const deleteComment = (reviewIndex, commentIndex) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      const updatedReviews = [...reviews];
      updatedReviews[reviewIndex].comments.splice(commentIndex, 1);
      setReviews(updatedReviews);
      localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    }
  };

  // Cek apakah pengguna sudah like review ini
  const hasLiked = (likes) => {
    if (!likes || !Array.isArray(likes)) return false;
    return likes.includes(user?.username);
  };

  // Fungsi untuk memulai edit review
  const startEdit = (index) => {
    setEditingId(index);
    setEditContent(reviews[index].content);
    setEditImagePreview(reviews[index].imageUrl || '');
  };

  // Fungsi untuk menyimpan hasil edit
  const saveEdit = (index) => {
    if (!editContent.trim()) {
      alert('Review tidak boleh kosong!');
      return;
    }
    
    const updatedReviews = [...reviews];
    updatedReviews[index].content = editContent;
    
    // Update image jika ada perubahan
    if (editImagePreview !== reviews[index].imageUrl) {
      updatedReviews[index].imageUrl = editImagePreview;
    }
    
    updatedReviews[index].editedAt = new Date().toISOString(); // Tambah info edit
    
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    setEditingId(null);
    setEditImage(null);
    setEditImagePreview('');
  };

  // Fungsi untuk membatalkan edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditImage(null);
    setEditImagePreview('');
  };

  // Fungsi untuk menghapus review
  const deleteReview = (index) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus review ini?')) {
      const updatedReviews = [...reviews];
      updatedReviews.splice(index, 1);
      setReviews(updatedReviews);
      localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    }
  };

  // Cek apakah review milik user yang sedang login
  const isOwnReview = (reviewUsername) => {
    return user?.username === reviewUsername;
  };

  // Cek apakah komentar milik user yang sedang login
  const isOwnComment = (commentUsername) => {
    return user?.username === commentUsername;
  };

  // Handle perubahan gambar saat edit
  const handleEditImageChange = (e) => {
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
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setEditImage(file);
    }
  };

  // Handle hapus gambar saat edit
  const handleRemoveEditImage = () => {
    setEditImage(null);
    setEditImagePreview('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Review Game</h1>
          <Link
            to="/reviews/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tulis Review
          </Link>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Belum ada review. Jadilah yang pertama menulis review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white shadow-md p-4 rounded">
                <h2 className="text-lg font-semibold">{rev.title}</h2>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700 italic mb-2">
                    oleh {rev.username} - {formatDate(rev.createdAt)}
                    {rev.editedAt && <span className="ml-1">(diedit)</span>}
                  </p>
                </div>
                
                {editingId === idx ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border rounded-lg min-h-24"
                    />
                    
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Gambar</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="file"
                          onChange={handleEditImageChange}
                          accept="image/*"
                          className="border p-2 rounded w-full text-sm"
                        />
                        {editImagePreview && (
                          <button
                            type="button"
                            onClick={handleRemoveEditImage}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      
                      {editImagePreview && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Preview:</p>
                          <img 
                            src={editImagePreview} 
                            alt="Preview" 
                            className="mt-1 max-h-48 rounded border"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => saveEdit(idx)} 
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Simpan
                      </button>
                      <button 
                        onClick={cancelEdit} 
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="mt-2 text-gray-700">{rev.content}</p>
                    
                    {/* Tampilkan gambar jika ada */}
                    {rev.imageUrl && (
                      <div className="mt-3">
                        <img 
                          src={rev.imageUrl} 
                          alt="Review Image" 
                          className="max-w-full max-h-96 rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleLike(idx)}
                      className="flex items-center gap-1 focus:outline-none"
                    >
                      <span className={`text-2xl ${hasLiked(rev.likes) ? 'text-yellow-500' : 'text-gray-400'}`}>
                        ★
                      </span>
                      <span className="text-sm text-gray-600">
                        {rev.likes ? rev.likes.length : 0} like
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => toggleComments(idx)}
                      className="flex items-center gap-1 focus:outline-none"
                    >
                      <span className="text-gray-500">💬</span>
                      <span className="text-sm text-gray-600">
                        {rev.comments?.length || 0} komentar
                      </span>
                    </button>
                  </div>
                  
                  {isOwnReview(rev.username) && editingId !== idx && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => startEdit(idx)}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteReview(idx)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Area Komentar */}
                {showComments[idx] && (
                  <div className="mt-4 border-t pt-3">
                    <h3 className="text-sm font-medium mb-2">Komentar ({rev.comments?.length || 0})</h3>
                    
                    {/* Daftar Komentar */}
                    {rev.comments && rev.comments.length > 0 ? (
                      <div className="space-y-3 mb-3">
                        {rev.comments.map((comment, commentIdx) => (
                          <div key={commentIdx} className="bg-gray-50 p-2 rounded text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium">{comment.username}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatDateTime(comment.createdAt)}
                                </span>
                              </div>
                              {isOwnComment(comment.username) && (
                                <button
                                  onClick={() => deleteComment(idx, commentIdx)}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                            <p className="mt-1 text-gray-700">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-3">Belum ada komentar.</p>
                    )}
                    
                    {/* Form Komentar Baru */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-grow p-2 border rounded text-sm"
                        placeholder="Tulis komentar..."
                      />
                      <button
                        onClick={() => addComment(idx)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        disabled={!commentText.trim()}
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}