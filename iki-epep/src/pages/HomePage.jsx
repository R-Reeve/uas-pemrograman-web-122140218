import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Selamat Datang di iki epep!</h1>
        <p className="mb-6">Review game, baca review temanmu, dan bagikan pengalamanmu.</p>

        <div className="space-x-4">
          <button
            onClick={() => navigate('/reviews')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Lihat Semua Review
          </button>

          <button
            onClick={() => navigate('/reviews/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tulis Review Baru
          </button>
        </div>
      </div>
    </div>
  );
}