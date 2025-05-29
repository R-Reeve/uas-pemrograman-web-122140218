import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/home');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Debug logging
    console.log("Attempting login with:", { username, password: "***" });

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await login({ username, password });
      
      // Success feedback
      setSuccess(true);
      console.log("Login successful, redirecting...");
      
      // Small delay to show success message before redirect
      setTimeout(() => {
        navigate('/home');
      }, 1000);
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 bg bg-cover bg-center bg-blend-overlay">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center text-blue-400 font-fantasy tracking-wider">
          Log In to Your Account
        </h1>

        <form onSubmit={handleLogin} className="bg-gray-900 bg-opacity-80 rounded-lg shadow-md p-6 space-y-5 border border-blue-900">
          {error && (
            <div className="bg-red-900 bg-opacity-50 text-red-300 p-3 rounded border border-red-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-900 bg-opacity-50 text-green-300 p-3 rounded border border-green-700">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Login successful! Redirecting...
              </div>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block mb-1 font-semibold text-blue-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="your username"
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-semibold text-blue-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white py-3 rounded font-semibold transition flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 font-semibold underline hover:text-blue-300 transition">
            Sign Up
          </Link>
        </p>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-400">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Username: {formData.username}</p>
            <p>Password: {"*".repeat(formData.password.length)}</p>
            <p>Auth Loading: {authLoading.toString()}</p>
            <p>Is Authenticated: {isAuthenticated.toString()}</p>
            <p>Form Loading: {isLoading.toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;