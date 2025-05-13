import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ReviewAddPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = localStorage.getItem('loggedInUser');
    if (!username) {
      alert('Anda harus login terlebih dahulu!');
      navigate('/login');
      return;
    }

    if (!form.title || !form.content) {
      setError('Judul dan konten wajib diisi!');
      return;
    }

    const newReview = {
      title: form.title,
      content: form.content,
      username,
    };

    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    alert('Review berhasil ditambahkan!');
    navigate('/reviews');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Tulis Review Baru</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Judul Review</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Contoh: Final Fantasy IX adalah masterpiece!"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Isi Review</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded h-40"
              placeholder="Bagikan pengalaman dan pendapatmu..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan Review
          </button>
        </form>
      </div>
    </div>
  );
}