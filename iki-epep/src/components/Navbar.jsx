import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    alert('Anda telah logout!');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">iki epep</h1>
      {localStorage.getItem('loggedInUser') && (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </nav>
  );
}