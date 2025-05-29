// ikiEepep/src/pages/RegisterPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthAPI } from '../api/auth'; // Adjust the path if needed

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Redirect ke home jika sudah login
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const data = await AuthAPI.signup({ username, email, password, confirmPassword });
      setSuccess(true);
      setError("");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
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

          {error && <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 px-4 py-2 rounded mb-4">{error}</div>}
          {success && (
            <div className="bg-green-900 bg-opacity-50 border border-green-700 text-green-300 px-4 py-2 rounded mb-4">
              Account created successfully! You can now <Link to="/login" className="text-blue-400 underline">log in</Link>.
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1 font-semibold text-blue-300">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold text-blue-300">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-semibold text-blue-300">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 font-semibold text-blue-300">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded font-semibold transition mt-6"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 font-semibold underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}