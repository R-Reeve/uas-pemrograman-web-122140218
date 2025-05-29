// ikiEpep/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TopicListPage from "./pages/TopicListPage";
import TopicAddPage from "./pages/TopicAddPage";
import TopicDetailPage from "./pages/TopicDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/topics" element={<TopicListPage />} />
        <Route path="/topics/add" element={<TopicAddPage />} />
        <Route path="/topics/:id" element={<TopicDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;