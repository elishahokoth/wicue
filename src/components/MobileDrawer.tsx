import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import { X as XIcon, Home as HomeIcon, BookOpen as BookOpenIcon, Users as UsersIcon, BarChart2 as BarChartIcon, Settings as SettingsIcon, GraduationCap as GraduationCapIcon, Calendar as CalendarIcon, MessageSquare as MessageSquareIcon, FileText as FileTextIcon, HelpCircle as HelpCircleIcon, LogOut as LogOutIcon, Sun as SunIcon, Moon as MoonIcon, Leaf as LeafIcon, Monitor as MonitorIcon, User as UserIcon } from 'lucide-react';
interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const {
    currentUser,
    logout
  } = useAuth();
  const {
    theme,
    setTheme
  } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);
  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  // Define navigation items based on user role
  const getNavItems = () => {
    const items = [];
    if (currentUser?.role === 'admin') {
      items.push({
        name: 'Dashboard',
        href: '/admin',
        icon: HomeIcon
      }, {
        name: 'Courses',
        href: '/courses',
        icon: BookOpenIcon
      }, {
        name: 'Users',
        href: '/admin/users',
        icon: UsersIcon
      }, {
        name: 'Reports',
        href: '/admin/reports',
        icon: BarChartIcon
      }, {
        name: 'Student Progress',
        href: '/admin/student-progress',
        icon: GraduationCapIcon
      }, {
        name: 'Calendar',
        href: '/calendar',
        icon: CalendarIcon
      }, {
        name: 'Messages',
        href: '/messages',
        icon: MessageSquareIcon
      }, {
        name: 'Settings',
        href: '/admin/settings',
        icon: SettingsIcon
      }, {
        name: 'Help & Support',
        href: '/help',
        icon: HelpCircleIcon
      });
    } else if (currentUser?.role === 'lecturer') {
      items.push({
        name: 'Dashboard',
        href: '/lecturer',
        icon: HomeIcon
      }, {
        name: 'My Courses',
        href: '/courses',
        icon: BookOpenIcon
      }, {
        name: 'My Students',
        href: '/lecturer/students',
        icon: UsersIcon
      }, {
        name: 'Student Progress',
        href: '/lecturer/student-progress',
        icon: GraduationCapIcon
      }, {
        name: 'Calendar',
        href: '/calendar',
        icon: CalendarIcon
      }, {
        name: 'Messages',
        href: '/messages',
        icon: MessageSquareIcon
      }, {
        name: 'Resources',
        href: '/resources',
        icon: FileTextIcon
      }, {
        name: 'Settings',
        href: '/lecturer/settings',
        icon: SettingsIcon
      }, {
        name: 'Help & Support',
        href: '/help',
        icon: HelpCircleIcon
      });
    } else if (currentUser?.role === 'student') {
      items.push({
        name: 'Dashboard',
        href: '/student',
        icon: HomeIcon
      }, {
        name: 'My Courses',
        href: '/courses',
        icon: BookOpenIcon
      }, {
        name: 'My Progress',
        href: '/student/progress',
        icon: BarChartIcon
      }, {
        name: 'Calendar',
        href: '/calendar',
        icon: CalendarIcon
      }, {
        name: 'Messages',
        href: '/messages',
        icon: MessageSquareIcon
      }, {
        name: 'Learning Path',
        href: '/learning-path',
        icon: GraduationCapIcon
      }, {
        name: 'Settings',
        href: '/student/settings',
        icon: SettingsIcon
      }, {
        name: 'Help & Support',
        href: '/help',
        icon: HelpCircleIcon
      });
    }
    return items;
  };
  const navItems = getNavItems();
  const isDark = theme === 'dark';
  const isJungle = theme === 'jungle';
  const isExtraDark = theme === 'extra-dark';
  // Theme options
  const themeOptions = [{
    name: 'Light',
    value: 'light',
    icon: SunIcon
  }, {
    name: 'Dark Blue',
    value: 'dark',
    icon: MoonIcon
  }, {
    name: 'Jungle Green',
    value: 'jungle',
    icon: LeafIcon
  }, {
    name: 'Extra Dark',
    value: 'extra-dark',
    icon: MonitorIcon
  }];
  const handleViewProfile = () => {
    if (currentUser?.role) {
      navigate(`/${currentUser.role}/settings`);
      onClose();
    }
  };
  // Update theme selection to use simple buttons
  // ...existing code...
  return <div className={`mobile-drawer ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-hidden={!isOpen}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div ref={drawerRef} className="absolute top-0 left-0 bottom-0 w-64 bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
          <Logo darkMode={isDark} jungleMode={isJungle} size="medium" />
          <button onClick={onClose} className="p-2 rounded-md text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-2 space-y-1">
            {navItems.map(item => {
            const isActive = location.pathname === item.href;
            const IconComponent = item.icon;
            return <Link key={item.name} to={item.href} className={`${isActive ? 'nav-link-active' : 'nav-link-inactive'} group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors`} onClick={onClose}>
                  <IconComponent className={`${isActive ? 'text-white' : isDark ? 'text-blue-300 group-hover:text-white' : isJungle ? 'text-green-300 group-hover:text-white' : isExtraDark ? 'text-gray-300 group-hover:text-white' : 'text-emerald-600 group-hover:text-white'} mr-3 flex-shrink-0 h-5 w-5`} aria-hidden="true" />
                  {item.name}
                </Link>;
          })}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mb-2">
              Theme
            </p>
            <div className="grid grid-cols-2 gap-2">
              {themeOptions.map(option => {
              const ThemeIcon = option.icon;
              const isActive = theme === option.value;
              return <button key={option.value} onClick={() => setTheme(option.value as any)} className={`flex items-center p-2 rounded-md ${isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-blue-900 dark:text-blue-200 jungle:bg-green-800 jungle:text-green-200 extra-dark:bg-gray-800 extra-dark:text-gray-200' : 'text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800'}`}>
                    <ThemeIcon className="h-4 w-4 mr-2" />
                    <span className="text-xs">{option.name}</span>
                  </button>;
            })}
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-700 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-emerald-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                {currentUser?.name}
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 capitalize">
                {currentUser?.role}
              </p>
            </div>
          </div>
          <div className="mt-2 flex space-x-2">
            <button onClick={handleViewProfile} className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-emerald-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 rounded-md hover:bg-emerald-50 dark:hover:bg-blue-900/20 jungle:hover:bg-green-900/20 extra-dark:hover:bg-gray-800">
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
            </button>
            <button onClick={() => {
            logout();
            onClose();
          }} className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 jungle:hover:bg-red-900/20 extra-dark:hover:bg-red-900/20">
              <LogOutIcon className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default MobileDrawer;