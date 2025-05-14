// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReviewListPage from './pages/ReviewListPage';
import ReviewAddPage from './pages/ReviewAddPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/reviews" element={<ReviewListPage />} />
      <Route path="/reviews/add" element={<ReviewAddPage />} />
    </Routes>
  );
}