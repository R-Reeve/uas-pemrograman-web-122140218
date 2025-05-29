// ikiEpep/src/components/Navbar.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Cek status login pada mount dan update
    const checkLoginStatus = () => {
      const userData = localStorage.getItem('loggedUser');
      if (userData) {
        setLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    };
    
    checkLoginStatus();
    
    // Menambahkan event listener untuk mendeteksi perubahan localStorage
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    setLoggedIn(false);
    setUser(null);
    alert('Anda telah logout!');
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Menentukan path saat ini untuk highlight menu yang aktif
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="w-full">
      {/* Top Header Bar */}
      <div className="bg-gray-900 text-gray-300 py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm">
            Final Fantasy Gaming Community
          </div>
          <div className="text-sm">
            {loggedIn ? (
              <span>Selamat datang, <strong className="text-blue-400">{user?.username}</strong>!</span>
            ) : (
              <span>Silakan <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">login</Link> atau <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">register</Link></span>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Navbar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-lg border-t border-blue-700 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2">
              <div className="bg-blue-50 p-1 rounded-full">
                <span className="text-2xl font-fantasy text-blue-800">FF</span>
              </div>
              <h1 className="text-2xl font-bold text-white font-fantasy tracking-wider">Final Fantasy Forum</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 text-white items-center">
              <Link to="/home" className={`hover:text-blue-200 transition-colors font-medium ${isActive('/home') ? 'text-blue-300 border-b-2 border-blue-300' : ''}`}>
                Beranda
              </Link>
              <Link to="/topics" className={`hover:text-blue-200 transition-colors font-medium ${isActive('/topics') ? 'text-blue-300 border-b-2 border-blue-300' : ''}`}>
                Forum Diskusi
              </Link>
              <Link to="/topics/add" className={`hover:text-blue-200 transition-colors font-medium ${isActive('/topics/add') ? 'text-blue-300 border-b-2 border-blue-300' : ''}`}>
                Buat Topik
              </Link>
              {loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-800 transition-colors border border-red-600"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 transition-colors border border-blue-600"
                >
                  Login
                </Link>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {menuOpen && (
            <div className="md:hidden mt-2 py-2 border-t border-blue-700">
              <div className="flex flex-col space-y-2 text-white">
                <Link to="/home" className={`hover:text-blue-200 transition-colors py-1 ${isActive('/home') ? 'text-blue-300' : ''}`}>
                  Beranda
                </Link>
                <Link to="/topics" className={`hover:text-blue-200 transition-colors py-1 ${isActive('/topics') ? 'text-blue-300' : ''}`}>
                  Forum Diskusi
                </Link>
                <Link to="/topics/add" className={`hover:text-blue-200 transition-colors py-1 ${isActive('/topics/add') ? 'text-blue-300' : ''}`}>
                  Buat Topik
                </Link>
                {loggedIn && (
                  <button
                    onClick={handleLogout}
                    className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-800 transition-colors border border-red-600 text-left"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                {location.pathname !== '/home' && (
                  <>
                    <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                      <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                    </svg>
                    <span className="text-gray-300 capitalize">
                      {location.pathname.split('/')[1]}
                      {location.pathname.split('/')[2] && (
                        <>
                          <svg className="fill-current w-3 h-3 mx-2 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                          </svg>
                          <span className="capitalize">{location.pathname.split('/')[2]}</span>
                        </>
                      )}
                    </span>
                  </>
                )}
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );  
}