import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ReviewListPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('reviews');
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Review Final Fantasy</h1>
          <Link
            to="/reviews/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tulis Review
          </Link>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center">Belum ada review.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white shadow-md p-4 rounded">
                <h2 className="text-lg font-semibold">{rev.title}</h2>
                <p className="text-sm text-gray-700 italic mb-2">
                  oleh {rev.username}
                </p>
                <p>{rev.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}