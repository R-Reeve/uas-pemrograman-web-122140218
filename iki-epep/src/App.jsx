// App.jsx - Fixed route ordering
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TopicListPage from './pages/TopicListPage';
import TopicDetailPage from './pages/TopicDetailPage';
import TopicAddPage from './pages/TopicAddPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/topics" element={<TopicListPage />} />
      <Route path="/topics/add" element={<TopicAddPage />} />
      <Route path="/topics/:id" element={<TopicDetailPage />} />
    </Routes>
  );
}