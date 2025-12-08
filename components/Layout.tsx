import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { 
  Menu, X, LayoutDashboard, FileText, ClipboardList, 
  MapPin, Bell, LogOut, User, Settings, CheckCircle, BarChart3, Radio
} from 'lucide-react';
import { Button } from './ui';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getNavItems = (role: UserRole) => {
    switch (role) {
      case 'CITIZEN':
        return [
          { label: 'Report Waste', path: '/citizen/report', icon: <MapPin size={20} /> },
          { label: 'My Reports', path: '/citizen/reports', icon: <FileText size={20} /> },
        ];
      case 'CLEANER':
        return [
          { label: 'My Tasks', path: '/cleaner/tasks', icon: <ClipboardList size={20} /> },
          { label: 'History', path: '/cleaner/history', icon: <CheckCircle size={20} /> },
        ];
      case 'ADMIN':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
          { label: 'User Reports', path: '/admin/reports', icon: <FileText size={20} /> },
          { label: 'Task Mgmt', path: '/admin/tasks', icon: <ClipboardList size={20} /> },
          { label: 'Zones & Devices', path: '/admin/zones', icon: <Radio size={20} /> },
          { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(userRole);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Z</div>
          <span className="font-bold text-xl text-slate-800">Zero</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
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
        fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center space-x-3 border-b border-slate-100">
          <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-green-200 shadow-lg">Z</div>
          <div>
            <h1 className="font-bold text-xl text-slate-900 leading-tight">Zero</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">SMART CITY</p>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="p-3 bg-green-50 rounded-lg flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold">
              {userRole[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">John Doe</p>
              <p className="text-xs text-slate-500 capitalize">{userRole.toLowerCase()}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-green-600 text-white shadow-md shadow-green-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-green-600'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-green-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-900">
              <Settings size={20} />
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
