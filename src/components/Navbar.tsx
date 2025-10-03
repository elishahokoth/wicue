import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import NotificationBadge from './NotificationBadge';
import { MenuIcon, BellIcon, UserIcon, LogOutIcon, SunIcon, MoonIcon, BookOpenIcon, MessageSquareIcon, CalendarIcon } from 'lucide-react';
interface NavbarProps {
  onMenuClick?: () => void;
}
const Navbar: React.FC<NavbarProps> = ({
  onMenuClick
}) => {
  const {
    currentUser,
    logout
  } = useAuth();
  const {
    theme,
    toggleTheme,
  // ...existing code...
  } = useTheme();
  const navigate = useNavigate();
  // ...existing code...
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  // ...existing code...
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  // ...existing code...
  // Mock notification counts - in a real app, these would come from a context or API
  const notificationCount = 8;
  const messageCount = 5;
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
  // ...existing code...
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Get theme icon
  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <SunIcon className="h-5 w-5" />;
      case 'jungle':
        return <MoonIcon className="h-5 w-5" />;
      case 'extra-dark':
        return <SunIcon className="h-5 w-5" />;
      default:
        return <MoonIcon className="h-5 w-5" />;
    }
  };
  const handleThemeToggle = () => {
    toggleTheme();
  };
  return <header className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 shadow-sm z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Mobile menu button */}
            <button type="button" onClick={onMenuClick} className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Logo darkMode={theme === 'dark'} jungleMode={theme === 'jungle'} />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link to="/courses" className="nav-link nav-link-inactive dark:text-blue-200 dark:hover:bg-blue-800 jungle:text-green-200 jungle:hover:bg-green-700 extra-dark:text-gray-200 extra-dark:hover:bg-gray-700">
                <BookOpenIcon className="h-5 w-5 mr-1" />
                <span className="hidden lg:inline">Library</span>
              </Link>
              <Link to="/calendar" className="nav-link nav-link-inactive dark:text-blue-200 dark:hover:bg-blue-800 jungle:text-green-200 jungle:hover:bg-green-700 extra-dark:text-gray-200 extra-dark:hover:bg-gray-700">
                <CalendarIcon className="h-5 w-5 mr-1" />
                <span className="hidden lg:inline">Calendar</span>
              </Link>
              <Link to="/messages" className="nav-link nav-link-inactive dark:text-blue-200 dark:hover:bg-blue-800 jungle:text-green-200 jungle:hover:bg-green-700 extra-dark:text-gray-200 extra-dark:hover:bg-gray-700 relative">
                <MessageSquareIcon className="h-5 w-5 mr-1" />
                <span className="hidden lg:inline">Messages</span>
                {messageCount > 0 && <NotificationBadge count={messageCount} />}
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Simple theme toggle button */}
            <button onClick={handleThemeToggle} className="bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 p-2 rounded-full text-emerald-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-blue-600 jungle:focus:ring-green-600 extra-dark:focus:ring-gray-500 transition-colors" aria-label="Toggle theme">
              {getThemeIcon()}
            </button>
            <div className="relative">
              <button type="button" className="bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 p-2 rounded-full text-emerald-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-blue-600 jungle:focus:ring-green-600 extra-dark:focus:ring-gray-500 transition-colors" onClick={() => navigate('/notifications')}>
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-5 w-5" aria-hidden="true" />
                {notificationCount > 0 && <NotificationBadge count={notificationCount} />}
              </button>
            </div>
            {/* Profile dropdown */}
            <div className="relative flex items-center" ref={profileDropdownRef}>
              <div className="flex items-center cursor-pointer" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-700 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-emerald-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                  {currentUser?.name}
                </span>
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-emerald-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 capitalize">
                  {currentUser?.role}
                </span>
              </div>
              {profileDropdownOpen && <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700" onClick={() => {
                  navigate(`/${currentUser?.role}/settings`);
                  setProfileDropdownOpen(false);
                }}>
                      View Profile
                    </button>
                    <button onClick={() => {
                  handleLogout();
                  setProfileDropdownOpen(false);
                }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700">
                      <LogOutIcon className="h-4 w-4 inline mr-1" />
                      Sign Out
                    </button>
                  </div>
                </div>}
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            {/* Mobile notification button */}
            <div className="relative">
              <button type="button" className="p-2 rounded-md text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 focus:outline-none" onClick={() => navigate('/notifications')}>
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                {notificationCount > 0 && <NotificationBadge count={notificationCount} />}
              </button>
            </div>
            {/* Mobile theme toggle */}
            <button onClick={toggleTheme} className="ml-2 p-2 rounded-md text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 focus:outline-none">
              {getThemeIcon()}
            </button>
          </div>
        </div>
      </div>
    </header>;
};
export default Navbar;