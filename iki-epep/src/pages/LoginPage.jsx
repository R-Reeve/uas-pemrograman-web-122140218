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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

          <p className="text-sm mt-4 text-center">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}