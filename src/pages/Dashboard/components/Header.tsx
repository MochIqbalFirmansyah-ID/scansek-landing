import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 h-16 flex justify-between items-center">
        {/* Left: Menu button (mobile) */}
        <button
          type="button"
          className="lg:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        
        {/* Left: Page title (desktop) */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        
        {/* Right: User menu & notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="p-1 text-gray-500 hover:text-gray-600 focus:outline-none rounded-full"
            aria-label="View notifications"
          >
            <Bell size={20} />
          </button>
          
          {/* User menu */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
              {user?.username}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;