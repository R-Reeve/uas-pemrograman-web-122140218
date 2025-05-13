import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const { username, email, password } = form;
    if (!username || !email || !password) {
      setError('Semua field wajib diisi!');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Cek apakah username sudah terdaftar
    const isUserExists = users.find((user) => user.username === username);
    if (isUserExists) {
      setError('Username sudah terdaftar!');
      return;
    }

    // Simpan ke localStorage
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedUser', JSON.stringify({ username, email }));

    setSuccess('Registrasi berhasil! Silakan login.');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <form
          onSubmit={handleRegister}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

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
            <label className="block mb-1 text-sm font-semibold">Email</label>
            <input
              type="text"
              name="email"
              value={form.email}
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
            Register
          </button>

          <p className="text-sm mt-4 text-center">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}