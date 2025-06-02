// my RegisterPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function RegisterPage() {
  const navigate = useNavigate();

  // 1️⃣ Redirect away if already logged in (following friend's pattern)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = form;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi!");
      return;
    }
    
    if (password.length < 8) {
      setError("Password minimal 8 karakter!");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password harus sama!");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid!");
      return;
    }

    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:6543/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (typeof data.error === "object" && data.error !== null) {
          const messages = Object.values(data.error).flat().join(" ");
          setError(messages || "Registrasi gagal");
        } else {
          setError(data.error || "Registrasi gagal");
        }
      } else {
        setSuccess(true);
        setMessage("Registrasi berhasil!");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-[url('https://via.placeholder.com/1920x1080?text=FF+Background')] bg-cover bg-center bg-blend-overlay">
      <Navbar />
      <div className="flex items-center justify-center py-12">
        <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-2xl w-full max-w-md border border-blue-900">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-blue-400 font-fantasy tracking-wider">REGISTER</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-2"></div>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 px-4 py-2 rounded mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-900 bg-opacity-50 border border-green-700 text-green-300 px-4 py-2 rounded mb-4">
              <p className="text-sm">
                {message} Silakan{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 underline">
                  login
                </Link>
                .
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              <label className="block mb-2 text-sm font-medium text-blue-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="contoh@email.com"
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
                placeholder="Minimal 8 karakter"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-300">Konfirmasi Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={8}
                placeholder="Masukkan password yang sama"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors border border-blue-700 mt-6"
            >
              Register
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-700 pt-4">
            <p className="text-gray-400">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}