import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBadge from './NotificationBadge';
import { HomeIcon, BookOpenIcon, CalendarIcon, MessageSquareIcon, UserIcon } from 'lucide-react';
const BottomNav: React.FC = () => {
  const {
    currentUser
  } = useAuth();
  const location = useLocation();
  // Mock notification count - in a real app, this would come from a context or API
  const messageCount = 5;
  const getNavItems = () => {
    const basePath = currentUser?.role === 'admin' ? '/admin' : currentUser?.role === 'lecturer' ? '/lecturer' : '/student';
    // Common items for all users
    return [{
      name: 'Home',
      href: basePath,
      icon: HomeIcon
    }, {
      name: 'Courses',
      href: '/courses',
      icon: BookOpenIcon
    }, {
      name: 'Calendar',
      href: '/calendar',
      icon: CalendarIcon
    }, {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquareIcon,
      badge: messageCount
    }, {
      name: 'Profile',
      href: `${basePath}/settings`,
      icon: UserIcon
    }];
  };
  const navItems = getNavItems();
  return <nav className="mobile-bottom-nav">
      {navItems.map(item => {
      const isActive = location.pathname === item.href;
      const IconComponent = item.icon;
      return <Link key={item.name} to={item.href} className={`mobile-bottom-nav-item ${isActive ? 'mobile-bottom-nav-item-active' : ''}`}>
            <div className="relative">
              <IconComponent className="h-5 w-5" />
              {typeof item.badge === 'number' && item.badge > 0 && <NotificationBadge count={item.badge as number} />}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>;
    })}
    </nav>;
};
export default BottomNav;