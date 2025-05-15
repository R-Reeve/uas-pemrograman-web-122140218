// TopicDetailPage.jsx
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function TopicDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek login
    const loggedInUser = localStorage.getItem('loggedUser');
    if (!loggedInUser) {
      alert('Anda harus login terlebih dahulu.');
      navigate('/login');
      return;
    } else {
      setUser(JSON.parse(loggedInUser));
    }
    
    // Load topic dengan ID yang sesuai
    loadTopic();
  }, [id, navigate]);

  const loadTopic = () => {
    const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
    const topicIndex = parseInt(id);
    
    // Validasi index
    if (isNaN(topicIndex) || topicIndex < 0 || topicIndex >= allTopics.length) {
      alert('Topik tidak ditemukan.');
      navigate('/topics');
      return;
    }
    
    const foundTopic = allTopics[topicIndex];
    
    // Pastikan topic memiliki array comments
    if (!foundTopic.comments) {
      foundTopic.comments = [];
    }
    
    // Pastikan topic memiliki array likes
    if (!foundTopic.likes) {
      foundTopic.likes = [];
    }
    
    setTopic(foundTopic);
    setLoading(false);
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

  // Handle like/unlike
  const handleLike = () => {
    if (!topic) return;
    
    const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
    const topicIndex = parseInt(id);
    
    // Cek apakah user sudah memberikan like
    const likeIndex = topic.likes.indexOf(user.username);
    
    if (likeIndex === -1) {
      // Tambahkan like
      topic.likes.push(user.username);
    } else {
      // Hapus like
      topic.likes.splice(likeIndex, 1);
    }
    
    // Update state dan localStorage
    setTopic({...topic});
    allTopics[topicIndex] = topic;
    localStorage.setItem('topics', JSON.stringify(allTopics));
  };

  // Tambah komentar baru
  const addComment = () => {
    if (!commentText.trim()) return;
    
    const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
    const topicIndex = parseInt(id);
    
    // Tambahkan komentar baru
    const newComment = {
      username: user.username,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };
    
    topic.comments.push(newComment);
    
    // Update state dan localStorage
    setTopic({...topic});
    allTopics[topicIndex] = topic;
    localStorage.setItem('topics', JSON.stringify(allTopics));
    setCommentText('');
  };

  // Hapus komentar
  const deleteComment = (commentIndex) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
      const topicIndex = parseInt(id);
      
      topic.comments.splice(commentIndex, 1);
      
      // Update state dan localStorage
      setTopic({...topic});
      allTopics[topicIndex] = topic;
      localStorage.setItem('topics', JSON.stringify(allTopics));
    }
  };

  // Cek apakah pengguna sudah like topic ini
  const hasLiked = () => {
    if (!topic || !topic.likes) return false;
    return topic.likes.includes(user?.username);
  };

  // Fungsi untuk memulai edit topic
  const startEdit = () => {
    setIsEditing(true);
    setEditContent(topic.content);
    setEditImagePreview(topic.imageUrl || '');
  };

  // Fungsi untuk menyimpan hasil edit
  const saveEdit = () => {
    if (!editContent.trim()) {
      alert('Topik tidak boleh kosong!');
      return;
    }
    
    const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
    const topicIndex = parseInt(id);
    
    topic.content = editContent;
    
    // Update image jika ada perubahan
    if (editImagePreview !== topic.imageUrl) {
      topic.imageUrl = editImagePreview;
    }
    
    topic.editedAt = new Date().toISOString(); // Tambah info edit
    
    // Update state dan localStorage
    setTopic({...topic});
    allTopics[topicIndex] = topic;
    localStorage.setItem('topics', JSON.stringify(allTopics));
    
    setIsEditing(false);
    setEditImage(null);
    setEditImagePreview('');
  };

  // Fungsi untuk membatalkan edit
  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
    setEditImage(null);
    setEditImagePreview('');
  };

  // Fungsi untuk menghapus topic
  const deleteTopic = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus topik ini?')) {
      const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
      const topicIndex = parseInt(id);
      
      allTopics.splice(topicIndex, 1);
      localStorage.setItem('topics', JSON.stringify(allTopics));
      
      alert('Topik berhasil dihapus.');
      navigate('/topics');
    }
  };

  // Cek apakah topic milik user yang sedang login
  const isOwnTopic = () => {
    if (!topic || !user) return false;
    return user.username === topic.username;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <p>Topik tidak ditemukan.</p>
          <Link to="/topics" className="text-blue-600 hover:underline mt-4 inline-block">
            Kembali ke daftar topik
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link to="/topics" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Kembali ke daftar topik
        </Link>
        
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            
            {isOwnTopic() && !isEditing && (
              <div className="flex space-x-2">
                <button 
                  onClick={startEdit}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={deleteTopic}
                  className="text-red-600 hover:underline text-sm"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mt-1 mb-4">
            <span>Oleh: {topic.username}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(topic.createdAt)}</span>
            {topic.editedAt && (
              <span className="ml-2 text-gray-500 italic">(diedit)</span>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border rounded-lg min-h-32"
              />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar (Opsional)</label>
                <div className="flex items-center space-x-2">
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
                      className="mt-1 max-h-64 rounded border"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={saveEdit} 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Simpan
                </button>
                <button 
                  onClick={cancelEdit} 
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mt-4 text-gray-700 leading-relaxed">
                {topic.content}
              </div>
              
              {/* Tampilkan gambar jika ada */}
              {topic.imageUrl && (
                <div className="mt-6">
                  <img 
                    src={topic.imageUrl} 
                    alt={topic.title} 
                    className="max-w-full rounded-lg border"
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Actions section */}
          {!isEditing && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-2 py-2 px-3 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  <span className={`text-xl ${hasLiked() ? 'text-yellow-500' : 'text-gray-400'}`}>
                    ★
                  </span>
                  <span>
                    {topic.likes.length} Like
                  </span>
                </button>
              </div>
            </div>
          )}
          
          {/* Comments section */}
          {!isEditing && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Komentar ({topic.comments.length})</h2>
              
              {/* Comment form */}
              <div className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-3 border rounded-lg min-h-24"
                  placeholder="Tulis komentar Anda di sini..."
                />
                <button
                  onClick={addComment}
                  disabled={!commentText.trim()}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Kirim Komentar
                </button>
              </div>
              
              {/* Comments list */}
              {topic.comments.length > 0 ? (
                <div className="space-y-4">
                  {topic.comments.map((comment, commentIdx) => (
                    <div key={commentIdx} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.username}</span>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(comment.createdAt)}
                          </span>
                        </div>
                        {isOwnComment(comment.username) && (
                          <button
                            onClick={() => deleteComment(commentIdx)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}