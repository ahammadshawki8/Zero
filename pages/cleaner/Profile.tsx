import { useState } from 'react';
import { Card, Button, Input, Toast } from '../../components/ui';
import { MOCK_CLEANER_PROFILE } from '../../constants';
import {
  User,
  Mail,
  Phone,
  Banknote,
  Star,
  Bell,
  Moon,
  Globe,
  Save,
  Camera,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

export function CleanerProfile() {
  const [profile, setProfile] = useState({
    ...MOCK_CLEANER_PROFILE,
    email: 'bob.cleaner@zerowaste.gov.bd',
    phone: '+880 1800-000000',
  });
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-blue-700 shadow-lg hover:bg-slate-100 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-blue-200">Cleanup Specialist</p>
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{profile.rating} Rating</span>
            </div>
          </div>
          <div className="md:ml-auto flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.completedTasks}</div>
              <div className="text-xs text-blue-200">Tasks Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">৳{profile.totalEarnings.toLocaleString()}</div>
              <div className="text-xs text-blue-200">Total Earned</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Banknote size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">৳{profile.totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Total Earnings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">৳{profile.pendingEarnings.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{profile.completedTasks}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{profile.rating}</p>
              <p className="text-xs text-slate-500">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <Card title="Personal Information">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <User size={14} className="inline mr-1" /> Full Name
              </label>
              {isEditing ? (
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              ) : (
                <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">{profile.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Mail size={14} className="inline mr-1" /> Email
              </label>
              {isEditing ? (
                <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              ) : (
                <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">{profile.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Phone size={14} className="inline mr-1" /> Phone
              </label>
              {isEditing ? (
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              ) : (
                <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">{profile.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Member Since</label>
              <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">
                {new Date(profile.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}><Save size={16} className="mr-1" /> Save Changes</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </div>
      </Card>

      <Card title="Settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-500" />
              <div>
                <p className="font-medium text-slate-800">Email Notifications</p>
                <p className="text-sm text-slate-500">Receive task updates via email</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
              className={`w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-500" />
              <div>
                <p className="font-medium text-slate-800">Push Notifications</p>
                <p className="text-sm text-slate-500">Get notified about new tasks</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
              className={`w-12 h-6 rounded-full transition-colors ${settings.pushNotifications ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-slate-500" />
              <div>
                <p className="font-medium text-slate-800">Dark Mode</p>
                <p className="text-sm text-slate-500">Switch to dark theme</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
              className={`w-12 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-slate-500" />
              <div>
                <p className="font-medium text-slate-800">Language</p>
                <p className="text-sm text-slate-500">Select your preferred language</p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
    </>
  );
}
