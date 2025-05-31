import { NavLink } from 'react-router-dom';
import { Home, Database, Users, BarChart2, LogOut, ActivitySquare } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = '' }: SidebarProps) => {
  const { logout } = useAuth();
  
  const navItems = [
    { path: '/dashboard/overview', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/dashboard/sugar-history', label: 'Sugar History', icon: <Database size={20} /> },
    { path: '/dashboard/users', label: 'Users', icon: <Users size={20} /> },
    { path: '/dashboard/statistics', label: 'Statistics', icon: <BarChart2 size={20} /> },
  ];
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <aside className={`w-64 bg-white border-r border-gray-200 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <ActivitySquare className="text-primary-600 mr-2" size={24} />
          <span className="text-xl font-bold font-heading text-gray-900">ScanSek</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;