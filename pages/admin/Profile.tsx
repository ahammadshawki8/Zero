import { useState } from 'react';
import { Card, Button, Input, Toast } from '../../components/ui';
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Moon,
  Globe,
  Save,
  Camera,
} from 'lucide-react';

// Mock admin profile data
const MOCK_ADMIN_PROFILE = {
  userId: 'A-1',
  name: 'Admin User',
  email: 'admin@zerowaste.gov.bd',
  phone: '+880 1700-000000',
  avatar: 'https://i.pravatar.cc/150?img=3',
  role: 'System Administrator',
  department: 'Waste Management Division',
  joinedAt: '2023-06-15',
};

export const AdminProfile = () => {
  const [profile, setProfile] = useState(MOCK_ADMIN_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: 'en',
  });

  const handleSave = () => {
    console.log('Saving profile:', profile);
    setIsEditing(false);
    setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
  };

  return (
    <>
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
      <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-slate-700 shadow-lg hover:bg-slate-100 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-slate-300">{profile.role}</p>
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
              <Shield size={16} className="text-amber-400" />
              <span className="text-sm text-slate-300">{profile.department}</span>
            </div>
          </div>
          <div className="md:ml-auto">
            <Button
              variant={isEditing ? 'outline' : 'primary'}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={isEditing ? 'bg-white text-slate-800 hover:bg-slate-100' : ''}
            >
              {isEditing ? (
                <>
                  <Save size={16} className="mr-1" /> Save Changes
                </>
              ) : (
                'Edit Profile'
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card title="Personal Information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <User size={14} className="inline mr-1" /> Full Name
              </label>
              {isEditing ? (
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              ) : (
                <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">
                  {profile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Mail size={14} className="inline mr-1" /> Email Address
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              ) : (
                <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">
                  {profile.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Phone size={14} className="inline mr-1" /> Phone Number
              </label>
              {isEditing ? (
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              ) : (
                <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">
                  {profile.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Shield size={14} className="inline mr-1" /> Role
              </label>
              <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">
                {profile.role}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Member Since
              </label>
              <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">
                {new Date(profile.joinedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card title="Settings">
          <div className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Email Notifications</p>
                  <p className="text-xs text-slate-500">Receive updates via email</p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, emailNotifications: !settings.emailNotifications })
                }
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-green-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bell size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Push Notifications</p>
                  <p className="text-xs text-slate-500">Get instant alerts</p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, pushNotifications: !settings.pushNotifications })
                }
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.pushNotifications ? 'bg-green-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 rounded-lg">
                  <Moon size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Dark Mode</p>
                  <p className="text-xs text-slate-500">Toggle dark theme</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.darkMode ? 'bg-green-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Globe size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Language</p>
                  <p className="text-xs text-slate-500">Select your language</p>
                </div>
              </div>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
};
