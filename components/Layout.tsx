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
  Banknote,
  AlertTriangle,
  Shield,
  Award,
  Clock,
  CheckCheck,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { sharedAPI, notificationsAPI } from '../services/api';

interface Notification {
  id: string;
  type: 'POINTS' | 'BADGE' | 'REPORT' | 'TASK' | 'ALERT' | 'ANNOUNCEMENT';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  related_report_id?: string;
  related_task_id?: string;
}

// Icon mapping for notification types
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'POINTS':
      return { icon: Leaf, iconBg: 'bg-green-100', iconColor: 'text-green-600' };
    case 'BADGE':
      return { icon: Award, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' };
    case 'REPORT':
      return { icon: CheckCircle, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' };
    case 'TASK':
      return { icon: CheckCheck, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' };
    case 'ALERT':
      return { icon: AlertTriangle, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' };
    case 'ANNOUNCEMENT':
      return { icon: Bell, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' };
    default:
      return { icon: Bell, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' };
  }
};

// Format time ago
const formatTimeAgo = (dateString: string) => {
  const normalizedDateString = /([zZ]|[+-]\d\d:\d\d)$/.test(dateString)
    ? dateString
    : `${dateString}Z`;
  const date = new Date(normalizedDateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isSuperAdmin = Boolean(user?.isSuperAdmin);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Load notifications when component mounts
  useEffect(() => {
    if (!isSuperAdmin) {
      loadNotifications();
    }
  }, []);

  // Refresh notification list when dropdown opens so users see latest updates.
  useEffect(() => {
    if (!isSuperAdmin && isNotificationOpen) {
      loadNotifications();
    }
  }, [isNotificationOpen, isSuperAdmin]);

  const loadNotifications = async () => {
    if (isSuperAdmin) {
      setNotifications([]);
      setIsNotificationOpen(false);
      return;
    }

    try {
      setIsLoadingNotifications(true);
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Don't show error to user, just keep empty notifications
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

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

  const markAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getProfilePath = (role: UserRole) => {
    if (user?.isSuperAdmin) {
      return '/superadmin/dashboard';
    }

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
          { label: 'Payments', path: '/cleaner/payments', icon: <Banknote size={20} /> },
          { label: 'Leaderboard', path: '/cleaner/leaderboard', icon: <Trophy size={20} /> },
        ];
      case 'ADMIN':
        if (user?.isSuperAdmin) {
          return [
            { label: 'Super Admin', path: '/superadmin/dashboard', icon: <Shield size={20} /> },
          ];
        }
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
          { label: 'Citizen Reports', path: '/admin/reports', icon: <FileText size={20} /> },
          { label: 'Task Management', path: '/admin/tasks', icon: <ClipboardList size={20} /> },
          { label: 'Payments', path: '/admin/payments', icon: <Banknote size={20} /> },
          { label: 'Zones', path: '/admin/zones', icon: <Radio size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(userRole);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-200 safe-area">
      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-30">
        <Logo size="sm" />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition-colors active:scale-95 touch-manipulation"
          >
            {theme === 'dark' ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 sm:p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition-colors active:scale-95 touch-manipulation"
          >
            {isSidebarOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
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
        fixed md:sticky top-14 md:top-0 h-[calc(100vh-56px)] md:h-screen w-60 sm:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 flex flex-col transition-all duration-300 ease-in-out overflow-y-auto safe-area-inset-left
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6 flex items-center space-x-3 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <Logo size="md" />
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 flex-1">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base touch-manipulation active:scale-95
                  ${isActive 
                    ? 'bg-green-600 text-white shadow-md shadow-green-200 dark:shadow-green-900' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-green-600 dark:hover:text-green-400'
                  }
                `}
              >
                <span className="flex-shrink-0">{React.cloneElement(item.icon as React.ReactElement, { size: 18 })}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 sm:p-6 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 px-2.5 sm:px-3 py-2.5 sm:py-3 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full transition-colors text-sm sm:text-base touch-manipulation active:scale-95"
          >
            <LogOut size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-56px)] md:h-screen">
        <header className="hidden md:flex items-center justify-between px-6 md:px-8 py-4 md:py-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-100 dark:border-slate-700 safe-area-inset-top">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition-colors active:scale-95 touch-manipulation"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {!isSuperAdmin && (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className={`p-2 transition-colors relative rounded-lg ${
                      isNotificationOpen
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    } active:bg-slate-200 dark:active:bg-slate-600 active:scale-95 touch-manipulation`}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white text-white text-xs flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Popup */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 max-h-96 sm:max-h-[500px] flex flex-col">
                      {/* Header */}
                      <div className="px-3 sm:px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">Notifications</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 whitespace-nowrap ml-2 active:scale-95 touch-manipulation transition-transform"
                          >
                            Mark all
                          </button>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="overflow-y-auto flex-1">
                        {isLoadingNotifications ? (
                          <div className="p-6 sm:p-8 text-center text-slate-500 dark:text-slate-400">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                            <p className="text-xs sm:text-sm">Loading notifications...</p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-6 sm:p-8 text-center text-slate-500 dark:text-slate-400">
                            <Bell size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-xs sm:text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => {
                            const iconConfig = getNotificationIcon(notification.type);
                            const IconComponent = iconConfig.icon;
                            return (
                              <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors active:bg-slate-100 dark:active:bg-slate-600 touch-manipulation ${
                                  !notification.is_read ? 'bg-green-50/50 dark:bg-green-900/20' : ''
                                }`}
                              >
                                <div className="flex gap-2 sm:gap-3">
                                  <div
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${iconConfig.iconBg} dark:opacity-80 flex items-center justify-center flex-shrink-0`}
                                  >
                                    <IconComponent size={16} className={`sm:w-[18px] sm:h-[18px] ${iconConfig.iconColor}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p
                                        className={`text-xs sm:text-sm ${
                                          !notification.is_read
                                            ? 'font-semibold text-slate-800 dark:text-slate-100'
                                            : 'font-medium text-slate-700 dark:text-slate-300'
                                        }`}
                                      >
                                        {notification.title}
                                      </p>
                                      {!notification.is_read && (
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0 mt-1" />
                                      )}
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                      <Clock size={10} className="flex-shrink-0" />
                                      {formatTimeAgo(notification.created_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <button className="w-full text-center text-xs sm:text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium active:opacity-70 transition-opacity touch-manipulation">
                          View all
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

                {/* Profile Button */}
                <button
                  onClick={() => navigate(getProfilePath(userRole))}
                  className={`flex items-center space-x-2 p-1.5 rounded-lg transition-colors active:scale-95 touch-manipulation ${
                    location.pathname.includes('/profile')
                      ? 'ring-2 ring-green-500'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'Profile'}
                      className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-green-200 dark:bg-green-700 flex items-center justify-center text-green-800 dark:text-green-100 font-bold text-xs sm:text-sm">
                      {userRole[0]}
                    </div>
                  )}
                </button>
              </>
            )}
          </div>
        </header>
        <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8 safe-area-inset-bottom">
          {children}
        </div>
      </main>
    </div>
  );
};
