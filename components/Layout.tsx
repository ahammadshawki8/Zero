import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  ClipboardList,
  MapPin,
  Bell,
  LogOut,
  CheckCircle,
  BarChart3,
  Radio,
  Trophy,
  Leaf,
  AlertTriangle,
  Award,
  Clock,
  CheckCheck,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../contexts/ThemeContext';

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'points',
    title: 'Points Earned!',
    message: 'You earned +25 Green Points for your approved report.',
    time: '5 min ago',
    read: false,
    icon: Leaf,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: '2',
    type: 'badge',
    title: 'New Badge Unlocked!',
    message: 'Congratulations! You earned the "Eco Warrior" badge.',
    time: '1 hour ago',
    read: false,
    icon: Award,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: '3',
    type: 'report',
    title: 'Report Approved',
    message: 'Your report #R-101 has been approved by admin.',
    time: '2 hours ago',
    read: false,
    icon: CheckCircle,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: '4',
    type: 'task',
    title: 'Cleanup Completed',
    message: 'The waste you reported at Gulshan has been cleaned.',
    time: '1 day ago',
    read: true,
    icon: CheckCheck,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: '5',
    type: 'alert',
    title: 'Streak Reminder',
    message: "Don't forget to report today to keep your streak!",
    time: '1 day ago',
    read: true,
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
];

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notification popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getProfilePath = (role: UserRole) => {
    switch (role) {
      case 'CITIZEN':
        return '/citizen/profile';
      case 'CLEANER':
        return '/cleaner/profile';
      case 'ADMIN':
        return '/admin/profile';
      default:
        return '/profile';
    }
  };

  const getNavItems = (role: UserRole) => {
    switch (role) {
      case 'CITIZEN':
        return [
          { label: 'Report Waste', path: '/citizen/report', icon: <MapPin size={20} /> },
          { label: 'My Reports', path: '/citizen/reports', icon: <FileText size={20} /> },
          { label: 'My Reviews', path: '/citizen/reviews', icon: <CheckCheck size={20} /> },
          { label: 'Leaderboard', path: '/citizen/leaderboard', icon: <Trophy size={20} /> },
        ];
      case 'CLEANER':
        return [
          { label: 'Available Tasks', path: '/cleaner/available', icon: <Zap size={20} /> },
          { label: 'My Tasks', path: '/cleaner/tasks', icon: <ClipboardList size={20} /> },
          { label: 'History', path: '/cleaner/history', icon: <CheckCircle size={20} /> },
          { label: 'Leaderboard', path: '/cleaner/leaderboard', icon: <Trophy size={20} /> },
        ];
      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
          { label: 'Citizen Reports', path: '/admin/reports', icon: <FileText size={20} /> },
          { label: 'Task Management', path: '/admin/tasks', icon: <ClipboardList size={20} /> },
          { label: 'Zones', path: '/admin/zones', icon: <Radio size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(userRole);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between sticky top-0 z-30">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600 dark:text-slate-300">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center space-x-3 border-b border-slate-100 dark:border-slate-700">
          <Logo size="md" />
        </div>

        <div className="px-6 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-green-600 text-white shadow-md shadow-green-200 dark:shadow-green-900' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-green-600 dark:hover:text-green-400'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`p-2 transition-colors relative rounded-lg ${
                  isNotificationOpen
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 rounded-full border-2 border-white text-white text-xs flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  {/* Header */}
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-30" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const IconComponent = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-green-50/50 dark:bg-green-900/20' : ''
                            }`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`w-10 h-10 rounded-full ${notification.iconBg} dark:opacity-80 flex items-center justify-center flex-shrink-0`}
                              >
                                <IconComponent size={18} className={notification.iconColor} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p
                                    className={`text-sm ${
                                      !notification.read
                                        ? 'font-semibold text-slate-800 dark:text-slate-100'
                                        : 'font-medium text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                  <Clock size={10} />
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                    <button className="w-full text-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
            
            {/* Profile Button */}
            <button
              onClick={() => navigate(getProfilePath(userRole))}
              className={`flex items-center space-x-2 p-1.5 rounded-lg transition-colors ${
                location.pathname.includes('/profile')
                  ? 'ring-2 ring-green-500'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-green-200 dark:bg-green-700 flex items-center justify-center text-green-800 dark:text-green-100 font-bold text-sm">
                {userRole[0]}
              </div>
            </button>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
};
