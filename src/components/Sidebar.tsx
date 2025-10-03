
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import { HomeIcon, BookOpenIcon, UsersIcon, BarChartIcon, SettingsIcon, GraduationCapIcon, CalendarIcon, MessageSquareIcon, FileTextIcon, HelpCircleIcon, VideoIcon, GitBranchIcon, UserIcon } from 'lucide-react';
const Sidebar = () => {
  const {
    currentUser
  } = useAuth();
  const {
    theme
  } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const isJungle = theme === 'jungle';
  const isExtraDark = theme === 'extra-dark';
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
        name: 'Dominions',
        href: '/dominions',
        icon: GitBranchIcon
      }, {
        name: 'Profile',
        href: '/profile',
        icon: UserIcon
      }, {
        name: 'Reports',
        href: '/admin/reports',
        icon: BarChartIcon
      }, {
        name: 'Student Progress',
        href: '/admin/student-progress',
        icon: GraduationCapIcon
      }, {
        name: 'Chambers',
        href: '/chambers',
        icon: VideoIcon
      }, {
        name: 'Resources',
        href: '/resources',
        icon: FileTextIcon
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
        name: 'Courses',
        href: '/courses',
        icon: BookOpenIcon
      }, {
        name: 'Students',
        href: '/lecturer/students',
        icon: UsersIcon
      }, {
        name: 'Student Progress',
        href: '/lecturer/student-progress',
        icon: BarChartIcon
      }, {
        name: 'Dominions',
        href: '/dominions',
        icon: GitBranchIcon
      }, {
        name: 'Profile',
        href: '/profile',
        icon: UserIcon
      }, {
        name: 'Chambers',
        href: '/chambers',
        icon: VideoIcon
      }, {
        name: 'Resources',
        href: '/resources',
        icon: FileTextIcon
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
        name: 'Courses',
        href: '/courses',
        icon: BookOpenIcon
      }, {
        name: 'My Progress',
        href: '/student/progress',
        icon: BarChartIcon
      }, {
        name: 'Learning Path',
        href: '/learning-path',
        icon: GraduationCapIcon
      }, {
        name: 'Grades',
        href: '/student/grades',
        icon: BarChartIcon
      }, {
        name: 'Dominions',
        href: '/dominions',
        icon: GitBranchIcon
      }, {
        name: 'Profile',
        href: '/profile',
        icon: UserIcon
      }, {
        name: 'Chambers',
        href: '/chambers',
        icon: VideoIcon
      }, {
        name: 'Resources',
        href: '/resources',
        icon: FileTextIcon
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
  const handleViewProfile = () => {
    if (currentUser?.role) {
      navigate(`/${currentUser.role}/settings`);
    }
  };
  return <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="sidebar">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <Logo darkMode={isDark} jungleMode={isJungle} size="large" />
            </div>
            <nav className="mt-2 flex-1 px-2 space-y-1">
              {navItems.map(item => {
              const isActive = location.pathname === item.href;
              const IconComponent = item.icon;
              return <Link key={item.name} to={item.href} className={`${isActive ? 'nav-link-active' : 'nav-link-inactive'} group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}>
                    <IconComponent className={`${isActive ? 'text-white' : isDark ? 'text-blue-300 group-hover:text-white' : isJungle ? 'text-green-300 group-hover:text-white' : isExtraDark ? 'text-gray-300 group-hover:text-white' : 'text-emerald-300 group-hover:text-white'} mr-3 flex-shrink-0 h-5 w-5`} aria-hidden="true" />
                    {item.name}
                  </Link>;
            })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-emerald-700 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-700 flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-emerald-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {currentUser?.name}
                  </p>
                  <button className="text-xs font-medium text-emerald-300 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-400 hover:text-emerald-200 dark:hover:text-blue-200 jungle:hover:text-green-200 extra-dark:hover:text-gray-300" onClick={handleViewProfile}>
                    View profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Sidebar;