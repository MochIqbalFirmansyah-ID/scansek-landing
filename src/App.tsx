import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Protected route component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const location = useLocation();
  const { checkAuth } = useAuth();
  
  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;