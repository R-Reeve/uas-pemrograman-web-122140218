// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TopicListPage from "./pages/TopicListPage";
import TopicAddPage from "./pages/TopicAddPage";
import TopicDetailPage from "./pages/TopicDetailPage";

// simple token check
const isAuthenticated = () => Boolean(localStorage.getItem('token'))

function PublicOnlyRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/home" replace /> : children
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to appropriate page based on auth status */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />} 
        />
        
        {/* Guest-only routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        {/* Authenticated-only routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/topics"
          element={
            <PrivateRoute>
              <TopicListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/topics/add"
          element={
            <PrivateRoute>
              <TopicAddPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/topics/:id"
          element={
            <PrivateRoute>
              <TopicDetailPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;