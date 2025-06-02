// TopicDetailPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChevronLeft, Edit3, Trash2, Heart, MessageSquare, Send, Image as ImageIcon, X, AlertCircle, CheckCircle, Loader2, User, CalendarDays, Check, XCircle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-blue-500/30 p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-blue-200 mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium transition-colors shadow-md disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-medium transition-colors shadow-md disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
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
  const [editImage, setEditImage] = useState(null); // File object
  const [editImagePreview, setEditImagePreview] = useState(''); // Data URL for preview

  const [commentText, setCommentText] = useState('');
  
  const [pageLoading, setPageLoading] = useState(true); // For initial topic load
  const [actionLoading, setActionLoading] = useState(false); // For form submissions, deletions etc.
  const [formError, setFormError] = useState(null); // For errors in edit/comment forms
  const [pageError, setPageError] = useState(null); // For critical page load errors
  const [successMessage, setSuccessMessage] = useState(null);

  const [showDeleteTopicModal, setShowDeleteTopicModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null); // Index of comment to delete

  const editFileInputRef = useRef(null);

  useEffect(() => {
    const initializePage = async () => {
      setPageLoading(true);
      setPageError(null);
      try {
        const loggedInUser = localStorage.getItem('loggedUser');
        if (!loggedInUser) {
          navigate('/login');
          return;
        }
        setUser(JSON.parse(loggedInUser));
        loadTopic(); // loadTopic will set its own errors and loading state
      } catch (err) {
        setPageError('Gagal memuat data pengguna. Silakan coba lagi.');
        setPageLoading(false);
      }
    };
    initializePage();
  }, [id, navigate]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadTopic = () => {
    setPageError(null);
    try {
      const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
      const topicIndex = parseInt(id);
      
      if (isNaN(topicIndex) || topicIndex < 0 || topicIndex >= allTopics.length) {
        setPageError('Maaf, dokumen yang Anda cari tidak ada dalam database Shinra.');
        setTopic(null);
        setPageLoading(false);
        return;
      }
      
      const foundTopic = { ...allTopics[topicIndex] }; // Create a new object reference
      
      if (!foundTopic.comments) {
        foundTopic.comments = [];
      }
      if (!foundTopic.likes) {
        foundTopic.likes = [];
      }
      
      setTopic(foundTopic);
    } catch (err) {
      console.error("Error loading topic:", err);
      setPageError('Gagal memuat topik. Data mungkin korup.');
      setTopic(null);
    } finally {
      setPageLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleLike = () => {
    if (!topic || !user) return;
    
    try {
      const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
      const topicIndex = parseInt(id);
      const currentTopic = allTopics[topicIndex];

      if (!currentTopic) {
          setFormError("Gagal menyukai: Topik tidak ditemukan lagi."); // Or pageError
          loadTopic(); // Reload to reflect current state
          return;
      }
      if (!currentTopic.likes) currentTopic.likes = [];


      const likeIndex = currentTopic.likes.indexOf(user.username);
      
      if (likeIndex === -1) {
        currentTopic.likes.push(user.username);
      } else {
        currentTopic.likes.splice(likeIndex, 1);
      }
      
      setTopic({...currentTopic}); // Update state for immediate UI response
      allTopics[topicIndex] = currentTopic;
      localStorage.setItem('topics', JSON.stringify(allTopics));
      setFormError(null);
    } catch (err) {
      console.error("Error liking topic:", err);
      setFormError('Gagal memperbarui status suka.');
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) {
      setFormError('Komentar tidak boleh kosong.');
      return;
    }
    
    setActionLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));

    try {
      const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
      const topicIndex = parseInt(id);
      const currentTopic = allTopics[topicIndex];

      if (!currentTopic) {
          setFormError("Gagal berkomentar: Topik tidak ditemukan lagi.");
          loadTopic();
          setActionLoading(false);
          return;
      }
      if (!currentTopic.comments) currentTopic.comments = [];
      
      const newComment = {
        username: user.username,
        text: commentText.trim(),
        createdAt: new Date().toISOString()
      };
      
      currentTopic.comments.push(newComment);
      
      setTopic({...currentTopic});
      allTopics[topicIndex] = currentTopic;
      localStorage.setItem('topics', JSON.stringify(allTopics));
      setCommentText('');
      setSuccessMessage('Komentar berhasil ditambahkan!');
    } catch (err) {
      console.error("Error adding comment:", err);
      setFormError('Gagal menambahkan komentar. Silakan coba lagi.');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleDeleteCommentRequest = (commentIndex) => {
    setCommentToDelete(commentIndex);
    setShowDeleteCommentModal(true);
  };
  
  const confirmDeleteComment = async () => {
    if (commentToDelete === null) return;

    setActionLoading(true);
    setFormError(null);
    setSuccessMessage(null);
    
    await new Promise(resolve => setTimeout(resolve, 700));

    try {
      const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
      const topicIndex = parseInt(id);
      const currentTopic = allTopics[topicIndex];

      if (!currentTopic || !currentTopic.comments || commentToDelete >= currentTopic.comments.length) {
          setFormError("Gagal menghapus: Komentar atau topik tidak ditemukan.");
          loadTopic(); // Reload to reflect current state
          setShowDeleteCommentModal(false);
          setCommentToDelete(null);
          setActionLoading(false);
          return;
      }
      
      currentTopic.comments.splice(commentToDelete, 1);
      
      setTopic({...currentTopic});
      allTopics[topicIndex] = currentTopic;
      localStorage.setItem('topics', JSON.stringify(allTopics));
      setSuccessMessage('Komentar berhasil dihapus.');
    } catch (err) {
      console.error("Error deleting comment:", err);
      setFormError('Gagal menghapus komentar. Silakan coba lagi.');
    } finally {
      setShowDeleteCommentModal(false);
      setCommentToDelete(null);
      setActionLoading(false);
    }
  };

  const hasLiked = () => {
    if (!topic || !topic.likes || !user) return false;
    return topic.likes.includes(user.username);
  };

  const startEdit = () => {
    setIsEditing(true);
    setEditContent(topic.content);
    setEditImagePreview(topic.imageUrl || '');
    setEditImage(null); // Reset file input
    if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
    }
    setFormError(null);
    setSuccessMessage(null);
  };

  const saveEdit = async () => {
    if (!editContent.trim()) {
      setFormError('Konten topik tidak boleh kosong!');
      return;
    }
    
    setActionLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
      const topicIndex = parseInt(id);
      const currentTopic = allTopics[topicIndex];

      if (!currentTopic) {
          setFormError("Gagal menyimpan: Topik tidak ditemukan lagi.");
          loadTopic();
          setActionLoading(false);
          setIsEditing(false);
          return;
      }

      currentTopic.content = editContent.trim();
      currentTopic.imageUrl = editImagePreview || null; // Use preview as source, or null if removed
      currentTopic.editedAt = new Date().toISOString();
      
      setTopic({...currentTopic});
      allTopics[topicIndex] = currentTopic;
      localStorage.setItem('topics', JSON.stringify(allTopics));
      
      setIsEditing(false);
      setEditImage(null);
      setEditImagePreview('');
      setSuccessMessage('Topik berhasil diperbarui!');
    } catch (err) {
      console.error("Error saving edit:", err);
      setFormError('Gagal menyimpan perubahan. Silakan coba lagi.');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
    setEditImage(null);
    setEditImagePreview('');
    setFormError(null);
  };

  const handleDeleteTopicRequest = () => {
    setShowDeleteTopicModal(true);
  };

  const confirmDeleteTopic = async () => {
    setActionLoading(true);
    setFormError(null); // Clear any previous form errors
    setPageError(null); // Clear page errors as we are navigating away or retrying

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const allTopics = JSON.parse(localStorage.getItem('topics')) || [];
      const topicIndex = parseInt(id);

      if (isNaN(topicIndex) || topicIndex < 0 || topicIndex >= allTopics.length) {
          setFormError("Gagal menghapus: Topik sudah tidak ada."); // Or pageError
          setShowDeleteTopicModal(false);
          setActionLoading(false);
          loadTopic(); // refresh
          return;
      }
      
      allTopics.splice(topicIndex, 1);
      // Re-index subsequent topics if IDs are array indices (not strictly necessary if not directly using index as persistent ID elsewhere)
      localStorage.setItem('topics', JSON.stringify(allTopics));
      
      // No success message needed as we navigate away
      navigate('/topics'); 
      // setSuccessMessage('Topik berhasil dihapus.'); // Not visible due to navigation
    } catch (err) {
      console.error("Error deleting topic:", err);
      setFormError('Gagal menghapus topik. Silakan coba lagi.'); // Show error on modal or page
      setShowDeleteTopicModal(false); // Keep modal context or close
    } finally {
      // Only set actionLoading to false if not navigating away successfully
      // If navigation happens, component might unmount.
      // If error, we need to stop loading.
      if (formError || pageError) {
          setActionLoading(false);
      }
      // If successful, navigation handles it. If error, actionLoading is reset.
    }
  };

  const isOwnTopic = () => {
    if (!topic || !user) return false;
    return user.username === topic.username;
  };

  const isOwnComment = (commentUsername) => {
    return user?.username === commentUsername;
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormError(null); // Clear previous image errors
      if (!file.type.startsWith('image/')) {
        setFormError('File harus berupa gambar (JPG, PNG, GIF, dll).');
        setEditImage(null);
        setEditImagePreview(topic.imageUrl || ''); // Revert to original or empty
        if(editFileInputRef.current) editFileInputRef.current.value = '';
        return;
      }
      
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setFormError('Ukuran gambar terlalu besar. Maksimal 2MB.');
        setEditImage(null);
        setEditImagePreview(topic.imageUrl || ''); // Revert
        if(editFileInputRef.current) editFileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setEditImage(file); // Store the file object if needed for actual upload later
    }
  };

  const handleRemoveEditImage = () => {
    setEditImage(null);
    setEditImagePreview('');
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
    }
    setFormError(null); // Clear image-related errors
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-10 w-40 bg-gray-700 rounded-lg mb-6"></div>
            
            {/* Card skeleton */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-blue-500/30">
              {/* Header skeleton */}
              <div className="h-8 bg-gray-700 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded mb-4 w-1/2"></div>
              
              {/* Content skeleton */}
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6"></div>
              </div>

              {/* Image skeleton */}
              <div className="h-64 bg-gray-700 rounded mt-6"></div>
              
              {/* Actions skeleton */}
              <div className="h-10 bg-gray-700 rounded mt-8 w-1/3"></div>

              {/* Comment section skeleton */}
              <div className="mt-10">
                <div className="h-6 bg-gray-700 rounded mb-4 w-1/4"></div>
                <div className="h-24 bg-gray-700 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-16 bg-gray-700 rounded"></div>
                  <div className="h-16 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-gray-100 flex items-center justify-center">
        <Navbar /> {/* Keep navbar for navigation if needed */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-10 text-center max-w-lg mx-4 border border-red-500/30">
          <AlertCircle className="text-red-400 mx-auto mb-6" size={64} />
          <h2 className="text-3xl font-bold text-red-300 mb-4">Terjadi Kesalahan</h2>
          <p className="text-gray-300 mb-8 text-lg">{pageError}</p>
          <button 
            onClick={() => navigate('/topics')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ChevronLeft size={20} />
            Kembali ke Pustaka
          </button>
        </div>
      </div>
    );
  }

  if (!topic) { // Should be covered by pageError, but as a fallback
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <p className="text-xl font-fantasy">Dokumen tidak valid atau tidak ditemukan.</p>
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
          className="inline-flex items-center px-4 py-2 mb-6 rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors shadow-lg text-sm"
        >
          <ChevronLeft size={18} className="mr-1.5" />
          Kembali ke Pustaka
        </Link>
        
        {/* Success Message Global */}
        {successMessage && (
            <div className="mb-6 bg-green-800/60 border border-green-500/70 text-green-200 px-4 py-3 rounded-lg flex items-center gap-3 shadow-md">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
        )}

        {/* Form Error for Edit/Comment sections if not handled inline */}
        {formError && !isEditing && ( // Show general form errors if not in editing mode (where it's shown inline)
            <div className="mb-6 bg-red-900/50 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
              <div className="text-red-300">
                <p className="font-medium">Error</p>
                <p className="text-sm">{formError}</p>
              </div>
            </div>
          )}

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-blue-500/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 px-6 py-4 border-b border-blue-500/30">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl md:text-3xl font-bold font-fantasy text-blue-100">{topic.title}</h1>
              
              {isOwnTopic() && !isEditing && (
                <div className="flex space-x-3">
                  <button 
                    onClick={startEdit}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors shadow-md flex items-center gap-1.5"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <button 
                    onClick={handleDeleteTopicRequest}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition-colors shadow-md flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center text-blue-300 text-sm mt-2 gap-x-3 gap-y-1">
              <div className="flex items-center">
                <User size={14} className="mr-1.5" />
                <span>{topic.username}</span>
              </div>
              <span className="hidden sm:inline mx-1">•</span>
              <div className="flex items-center">
                <CalendarDays size={14} className="mr-1.5" />
                <span>{formatDate(topic.createdAt)}</span>
              </div>
              {topic.editedAt && (
                <span className="ml-1 text-blue-400/70 italic text-xs">(diedit)</span>
              )}
            </div>
          </div>
          
          {/* Content / Edit Form */}
          <div className="px-6 py-5">
            {isEditing ? (
              <div className="mt-2">
                 {formError && (
                    <div className="mb-4 bg-red-900/50 border border-red-500/50 rounded-lg p-3 flex items-start gap-2.5 text-sm">
                      <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                      <div className="text-red-300">
                        <p className="font-medium">Gagal Validasi</p>
                        <p>{formError}</p>
                      </div>
                    </div>
                  )}
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  disabled={actionLoading}
                  className="w-full p-4 border border-blue-500/50 rounded-lg min-h-[160px] bg-gray-700/50 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60"
                />
                
                <div className="mt-5">
                  <label className="block text-sm font-medium text-blue-300 mb-1.5">Gambar (Opsional)</label>
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <input
                        type="file"
                        ref={editFileInputRef}
                        onChange={handleEditImageChange}
                        accept="image/*"
                        disabled={actionLoading}
                        className="w-full text-sm text-gray-300 file:mr-3 file:py-2.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:transition-colors border border-blue-500/50 rounded-lg bg-gray-700/50 disabled:opacity-60"
                      />
                    </div>
                    {editImagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveEditImage}
                        disabled={actionLoading}
                        className="bg-red-600 text-white px-3 py-2.5 rounded-md hover:bg-red-500 transition-colors shadow-sm text-sm disabled:opacity-60 flex items-center gap-1.5"
                      >
                        <X size={16} /> Hapus
                      </button>
                    )}
                  </div>
                  
                  {editImagePreview && (
                    <div className="mt-4">
                      <p className="text-xs text-blue-300 mb-1.5">Preview:</p>
                      <div className="border border-blue-500/30 rounded-lg p-2 bg-gray-900/50 max-w-md">
                        <img 
                          src={editImagePreview} 
                          alt="Preview" 
                          className="max-h-60 rounded mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button 
                    onClick={saveEdit} 
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-md font-medium transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={20}/> : <Check size={20} />}
                    {actionLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                  <button 
                    onClick={cancelEdit} 
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-gray-600 hover:bg-gray-500 rounded-md font-medium transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <XCircle size={20} /> Batal
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mt-2 text-gray-200 leading-relaxed whitespace-pre-line font-light prose prose-sm prose-invert max-w-none">
                  {topic.content}
                </div>
                
                {topic.imageUrl && (
                  <div className="mt-8">
                    <div className="border border-blue-500/30 rounded-lg p-3 bg-gray-900/50">
                      <img 
                        src={topic.imageUrl} 
                        alt={topic.title} 
                        className="max-w-full rounded-lg mx-auto shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Actions section (Likes, Comment Count) */}
            {!isEditing && (
              <div className="mt-8 pt-6 border-t border-blue-500/20">
                <div className="flex items-center space-x-5">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 py-2 px-3.5 rounded-md transition-all shadow-md text-sm font-medium
                                ${hasLiked() 
                                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white' 
                                  : 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-gray-200'}`}
                  >
                    <Heart size={18} className={hasLiked() ? 'fill-current' : ''} />
                    <span>
                      {topic.likes.length} {topic.likes.length === 1 ? 'Suka' : 'Suka'}
                    </span>
                  </button>
                  
                  <div className="flex items-center text-blue-300 text-sm">
                    <MessageSquare size={18} className="mr-1.5" />
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
                
                {formError && !commentText && ( // Show error if related to general comment section, not specific input
                    <div className="mb-4 bg-red-900/50 border border-red-500/50 rounded-lg p-3 flex items-start gap-2.5 text-sm">
                      <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-red-300">{formError}</p>
                    </div>
                )}

                <div className="mb-8 mt-6">
                  <textarea
                    value={commentText}
                    onChange={(e) => {
                        setCommentText(e.target.value);
                        if (formError) setFormError(null); // Clear error on input
                    }}
                    disabled={actionLoading}
                    className="w-full p-4 border border-blue-500/50 rounded-lg min-h-[120px] bg-gray-700/50 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 resize-none"
                    placeholder="Bagikan pemikiran Anda tentang topik ini..."
                  />
                   {formError && commentText && ( // Show error specific to comment input
                    <p className="text-red-400 text-xs mt-1.5">{formError}</p>
                  )}
                  <button
                    onClick={addComment}
                    disabled={!commentText.trim() || actionLoading}
                    className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                    {actionLoading ? "Mengirim..." : "Kirim Komentar"}
                  </button>
                </div>
                
                {topic.comments.length > 0 ? (
                  <div className="space-y-5">
                    {topic.comments.map((comment, commentIdx) => (
                      <div key={commentIdx} className="bg-gradient-to-br from-gray-800/80 to-gray-900/70 p-4 rounded-lg shadow-md border border-blue-500/20">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-blue-600 rounded-full h-9 w-9 flex items-center justify-center font-semibold text-white text-sm">
                              {comment.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-medium text-blue-200 text-sm">{comment.username}</span>
                              <div className="text-xs text-blue-400/70 mt-0.5">
                                {formatDateTime(comment.createdAt)}
                              </div>
                            </div>
                          </div>
                          {isOwnComment(comment.username) && (
                            <button
                              onClick={() => handleDeleteCommentRequest(commentIdx)}
                              disabled={actionLoading}
                              className="text-red-400 hover:text-red-300 transition-colors p-1 disabled:opacity-50"
                              aria-label="Hapus komentar"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        <p className="mt-3 text-gray-300 whitespace-pre-line text-sm leading-relaxed">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-800/50 rounded-lg border border-dashed border-blue-500/30">
                    <MessageSquare size={40} className="mx-auto text-blue-400/40 mb-3" />
                    <p className="text-blue-300 italic">Belum ada komentar. Jadilah yang pertama!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showDeleteTopicModal}
        onConfirm={confirmDeleteTopic}
        onCancel={() => setShowDeleteTopicModal(false)}
        isLoading={actionLoading}
        title="Hapus Topik"
        message="Apakah Anda yakin ingin menghapus topik ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua komentar terkait."
      />
      <ConfirmationModal
        isOpen={showDeleteCommentModal}
        onConfirm={confirmDeleteComment}
        onCancel={() => {
          setShowDeleteCommentModal(false);
          setCommentToDelete(null);
        }}
        isLoading={actionLoading}
        title="Hapus Komentar"
        message="Apakah Anda yakin ingin menghapus komentar ini?"
      />
    </div>
  );
}