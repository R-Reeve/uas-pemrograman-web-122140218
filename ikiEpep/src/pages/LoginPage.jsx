// LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect ke home jika sudah login
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = storedUsers.find(
      (user) =>
        user.username === form.username && user.password === form.password
    );

    if (foundUser) {
      // Tambahkan event untuk Navbar
      const userToStore = {
        username: foundUser.username,
        email: foundUser.email
      };
      localStorage.setItem('loggedUser', JSON.stringify(userToStore));
      
      // Trigger event untuk update Navbar
      window.dispatchEvent(new Event('storage'));
      
      alert('Login berhasil!');
      navigate('/home');
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-[url('https://via.placeholder.com/1920x1080?text=FF+Background')] bg-cover bg-center bg-blend-overlay">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-2xl w-full max-w-md border border-blue-900">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-blue-400 font-fantasy tracking-wider">LOGIN</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 px-4 py-2 rounded mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-300">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-blue-300">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={8}
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors border border-blue-700"
            >
              Login
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-700 pt-4">
            <p className="text-gray-400">
              Belum punya akun?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}