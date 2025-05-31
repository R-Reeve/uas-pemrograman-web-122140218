// TopicDetailPage.jsx
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-blue-500/30 p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-blue-200 mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium transition-colors shadow-md"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-medium transition-colors shadow-md"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showDeleteTopicModal, setShowDeleteTopicModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  

  useEffect(() => {
    // Cek login
    const loggedInUser = localStorage.getItem('loggedUser');
    if (!loggedInUser) {
      //alert('Anda harus login terlebih dahulu.');
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
      //alert('Topik tidak ditemukan.');
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
    setCommentToDelete(commentIndex);
    setShowDeleteCommentModal(true);
  };
  
  const confirmDeleteComment = () => {
    const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
    const topicIndex = parseInt(id);
    
    topic.comments.splice(commentToDelete, 1);
    
    // Update state dan localStorage
    setTopic({...topic});
    allTopics[topicIndex] = topic;
    localStorage.setItem('topics', JSON.stringify(allTopics));
    
    setShowDeleteCommentModal(false);
    setCommentToDelete(null);
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
      //alert('Topik tidak boleh kosong!');
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
    const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
    const topicIndex = parseInt(id);
    
    allTopics.splice(topicIndex, 1);
    localStorage.setItem('topics', JSON.stringify(allTopics));
    
    setShowDeleteTopicModal(false);
    navigate('/topics');
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
        //alert('File harus berupa gambar (JPG, PNG, GIF, dll)');
        return;
      }
      
      // Batasi ukuran file (misalnya 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB dalam bytes
      if (file.size > maxSize) {
        //alert('Ukuran gambar terlalu besar. Maksimal 2MB.');
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
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <div className="animate-pulse flex justify-center">
            <div className="h-24 w-24">
              <svg className="animate-spin h-full w-full text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p className="mt-4 text-blue-300 font-fantasy">Mengambil data dari Crystal Library...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <p className="text-xl font-fantasy">Maaf, dokumen yang Anda cari tidak ada dalam database Shinra.</p>
          <Link to="/topics" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transition duration-300 font-bold">
            Kembali ke Perpustakaan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
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
            <div className="flex justify-between items-start">
              <h1 className="text-2xl md:text-3xl font-bold font-fantasy text-blue-100">{topic.title}</h1>
              
              {isOwnTopic() && !isEditing && (
                <div className="flex space-x-3">
                  <button 
                    onClick={startEdit}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors shadow-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button 
  onClick={() => setShowDeleteTopicModal(true)}
  className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition-colors shadow-md flex items-center"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
  Hapus
</button>
<ConfirmationModal
  isOpen={showDeleteTopicModal}
  onConfirm={deleteTopic}
  onCancel={() => setShowDeleteTopicModal(false)}
  title="Hapus Topik"
  message="Apakah Anda yakin ingin menghapus topik ini? Tindakan ini tidak dapat dibatalkan."
/>

<ConfirmationModal
  isOpen={showDeleteCommentModal}
  onConfirm={confirmDeleteComment}
  onCancel={() => {
    setShowDeleteCommentModal(false);
    setCommentToDelete(null);
  }}
  title="Hapus Komentar"
  message="Apakah Anda yakin ingin menghapus komentar ini???"
/>
                </div>
                
              )}
            </div>
            
            <div className="flex items-center text-blue-300 text-sm mt-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{topic.username}</span>
              </div>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{formatDate(topic.createdAt)}</span>
              </div>
              {topic.editedAt && (
                <span className="ml-2 text-blue-400/70 italic">(diedit)</span>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-5">
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-4 border border-blue-500/50 rounded-lg min-h-40 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-blue-300 mb-2">Gambar (Opsional)</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="file"
                        onChange={handleEditImageChange}
                        accept="image/*"
                        className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-500 border border-blue-500/50 rounded"
                      />
                    </div>
                    {editImagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveEditImage}
                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 transition-colors shadow-md text-sm"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  
                  {editImagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-blue-300 mb-2">Preview:</p>
                      <div className="border border-blue-500/30 rounded-lg p-2 bg-gray-900/50">
                        <img 
                          src={editImagePreview} 
                          alt="Preview" 
                          className="max-h-64 rounded mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button 
                    onClick={saveEdit} 
                    className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded font-medium transition-colors shadow-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Simpan
                  </button>
                  <button 
                    onClick={cancelEdit} 
                    className="px-5 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium transition-colors shadow-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mt-2 text-gray-200 leading-relaxed whitespace-pre-line font-light">
                  {topic.content}
                </div>
                
                {/* Tampilkan gambar jika ada */}
                {topic.imageUrl && (
                  <div className="mt-8">
                    <div className="border border-blue-500/30 rounded-lg p-3 bg-gray-900/50">
                      <img 
                        src={topic.imageUrl} 
                        alt={topic.title} 
                        className="max-w-full rounded-lg mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions section */}
            {!isEditing && (
              <div className="mt-8 pt-6 border-t border-blue-500/20">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleLike}
                    className="flex items-center gap-2 py-2 px-4 rounded-md bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all shadow-md"
                  >
                    <span className={`text-xl ${hasLiked() ? 'text-yellow-300' : 'text-gray-400'}`}>
                      ★
                    </span>
                    <span>
                      {topic.likes.length} {topic.likes.length === 1 ? 'Like' : 'Likes'}
                    </span>
                  </button>
                  
                  <div className="flex items-center text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    <span>{topic.comments.length} {topic.comments.length === 1 ? 'Komentar' : 'Komentar'}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Comments section */}
            {!isEditing && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4 text-blue-200 font-fantasy border-b border-blue-500/30 pb-2">
                  Komentar ({topic.comments.length})
                </h2>
                
                {/* Comment form */}
                <div className="mb-8 mt-6">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-4 border border-blue-500/50 rounded-lg min-h-32 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bagikan pemikiran Anda tentang topik ini..."
                  />
                  <button
                    onClick={addComment}
                    disabled={!commentText.trim()}
                    className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    Kirim Komentar
                  </button>
                </div>
                
                {/* Comments list */}
                {topic.comments.length > 0 ? (
                  <div className="space-y-6">
                    {topic.comments.map((comment, commentIdx) => (
                      <div key={commentIdx} className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-lg shadow-md border border-blue-500/20">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-medium text-white">
                              {comment.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-medium text-blue-200">{comment.username}</span>
                              <div className="text-xs text-blue-400/70">
                                {formatDateTime(comment.createdAt)}
                              </div>
                            </div>
                          </div>
                          {isOwnComment(comment.username) && (
                            <button
                              onClick={() => deleteComment(commentIdx)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <p className="mt-3 text-gray-300 whitespace-pre-line">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-800/50 rounded-lg border border-dashed border-blue-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-blue-300 italic mt-3">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}