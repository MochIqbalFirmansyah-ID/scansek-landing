import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileSidebar from './components/MobileSidebar';

// Pages
import Overview from './pages/Overview';
import SugarHistory from './pages/SugarHistory';
import Users from './pages/Users';
import Statistics from './pages/Statistics';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar when location changes (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  // If the user navigates to /dashboard, redirect to /dashboard/overview
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      navigate('/dashboard/overview');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Desktop */}
      <Sidebar className="hidden lg:block" />

      {/* Sidebar - Mobile */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="overview" element={<Overview />} />
            <Route path="sugar-history" element={<SugarHistory />} />
            <Route path="users" element={<Users />} />
            <Route path="statistics" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;