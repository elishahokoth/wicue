import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertCircle, Info, Calendar, BookOpen, MessageSquare, Settings, ChevronRight, Clock, X } from 'lucide-react';
// Define notification types
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'course' | 'calendar' | 'system';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  sender?: {
    id: string;
    name: string;
    avatar: string;
  };
}
// Mock data for notifications
const mockNotifications: Notification[] = [{
  id: '1',
  title: 'Assignment Graded',
  message: 'Your assignment "Data Structures Final Project" has been graded. You received a 92%.',
  type: 'success',
  timestamp: new Date(Date.now() - 1000 * 60 * 30),
  read: false,
  actionUrl: '/courses/cs101/assignments/final'
}, {
  id: '2',
  title: 'New Message',
  message: 'Dr. Sarah Johnson sent you a message about your recent submission.',
  type: 'message',
  timestamp: new Date(Date.now() - 1000 * 60 * 60),
  read: false,
  actionUrl: '/messages/1',
  sender: {
    id: 'user2',
    name: 'Dr. Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
}, {
  id: '3',
  title: 'Course Enrollment Confirmed',
  message: 'You have been successfully enrolled in "Advanced Machine Learning" course.',
  type: 'info',
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
  read: false,
  actionUrl: '/courses/ml202'
}, {
  id: '4',
  title: 'Assignment Due Soon',
  message: 'Your assignment "Web Development Project" is due in 2 days.',
  type: 'warning',
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  read: true,
  actionUrl: '/courses/web101/assignments/project'
}, {
  id: '5',
  title: 'System Maintenance',
  message: 'The system will be undergoing maintenance on Saturday from 2 AM to 4 AM.',
  type: 'system',
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  read: true
}, {
  id: '6',
  title: 'New Course Available',
  message: 'A new course "Introduction to Artificial Intelligence" is now available for enrollment.',
  type: 'course',
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  read: true,
  actionUrl: '/courses/ai101'
}, {
  id: '7',
  title: 'Calendar Event',
  message: 'You have a study group meeting scheduled for tomorrow at 3 PM.',
  type: 'calendar',
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  read: true,
  actionUrl: '/calendar'
}, {
  id: '8',
  title: 'Missing Assignment',
  message: 'You missed the deadline for "Database Systems Quiz 3". Please contact your instructor.',
  type: 'error',
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  read: true,
  actionUrl: '/courses/db201/assignments/quiz3'
}];
const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<string>('all'); // 'all', 'unread', or notification type
  useTheme();
  const navigate = useNavigate();
  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => notification.id === id ? {
      ...notification,
      read: true
    } : notification));
  };
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);
    // Navigate to the action URL if provided
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };
  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'course':
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'calendar':
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  return <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-emerald-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 mr-2" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
              Notifications
            </h1>
            {unreadCount > 0 && <span className="ml-2 bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-800 text-emerald-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>}
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={markAllAsRead} className="text-sm text-emerald-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 hover:text-emerald-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-sky-300">
              Mark all as read
            </button>
          </div>
        </div>
        <div className="p-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-800 flex items-center space-x-2 overflow-x-auto hide-scrollbar">
          <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filter === 'all' ? 'bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-800 text-emerald-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200' : 'bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800/60 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-400'}`}>
            All
          </button>
          <button onClick={() => setFilter('unread')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filter === 'unread' ? 'bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-800 text-emerald-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200' : 'bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800/60 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-400'}`}>
            Unread
          </button>
          <button onClick={() => setFilter('message')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filter === 'message' ? 'bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-800 text-emerald-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200' : 'bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800/60 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-400'}`}>
            Messages
          </button>
          <button onClick={() => setFilter('course')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filter === 'course' ? 'bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-800 text-emerald-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200' : 'bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800/60 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-400'}`}>
            Courses
          </button>
          <button onClick={() => setFilter('calendar')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filter === 'calendar' ? 'bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-800 text-emerald-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200' : 'bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800/60 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-400'}`}>
            Calendar
          </button>
          <button onClick={() => setFilter('system')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filter === 'system' ? 'bg-emerald-100 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-800 text-emerald-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200' : 'bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800/60 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-400'}`}>
            System
          </button>
        </div>
        {filteredNotifications.length === 0 ? <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 dark:text-blue-800 jungle:text-green-800 extra-dark:text-gray-800 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
              No notifications
            </h3>
            <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-400 mt-1">
              {filter === 'all' ? "You don't have any notifications." : filter === 'unread' ? "You don't have any unread notifications." : `You don't have any ${filter} notifications.`}
            </p>
          </div> : <ul className="divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800 extra-dark:divide-gray-800">
            {filteredNotifications.map(notification => <li key={notification.id} className={`
                  p-4 hover:bg-gray-50 dark:hover:bg-blue-900/50 jungle:hover:bg-green-800/50 extra-dark:hover:bg-gray-800/50 cursor-pointer transition-colors
                  ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/30 jungle:bg-green-900/30 extra-dark:bg-sky-900/20' : ''}
                `} onClick={() => handleNotificationClick(notification)}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {notification.sender ? <img src={notification.sender.avatar} alt={notification.sender.name} className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {notification.title}
                      </p>
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatNotificationTime(notification.timestamp)}
                        </p>
                        <div className="ml-2 relative group">
                          <button onClick={e => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }} className="p-1 rounded-full text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500 hover:text-gray-600 dark:hover:text-blue-400 jungle:hover:text-green-400 extra-dark:hover:text-gray-400">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      {notification.message}
                    </p>
                    {notification.actionUrl && <div className="mt-2 flex">
                        <button className="text-xs text-emerald-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 hover:text-emerald-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-sky-300 flex items-center" onClick={e => {
                  e.stopPropagation();
                  markAsRead(notification.id);
                  navigate(notification.actionUrl!);
                }}>
                          View details
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </button>
                      </div>}
                  </div>
                  {!notification.read && <div className="ml-3 flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-blue-500 jungle:bg-green-500 extra-dark:bg-sky-500"></div>
                    </div>}
                </div>
              </li>)}
          </ul>}
      </div>
    </div>;
};
// Helper function to format notification time
const formatNotificationTime = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const oneMinute = 60 * 1000;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;
  if (diff < oneMinute) {
    return 'Just now';
  } else if (diff < oneHour) {
    const minutes = Math.floor(diff / oneMinute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diff < oneDay) {
    const hours = Math.floor(diff / oneHour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diff < 2 * oneDay) {
    return 'Yesterday';
  } else if (diff < 7 * oneDay) {
    const days = Math.floor(diff / oneDay);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return timestamp.toLocaleDateString();
  }
};
export default NotificationsPage;