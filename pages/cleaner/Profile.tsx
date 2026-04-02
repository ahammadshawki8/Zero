import React, { useRef, useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Toast } from '../../components/ui';
import { cleanerAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Bell,
  Shield,
  Calendar,
  Edit3,
  Check,
  ChevronRight,
  Lock,
  Trash2,
  Download,
} from 'lucide-react';
import type { CleanerProfile as CleanerProfileType } from '../../types';
import { formatApiDate } from '../../utils/date';

export const CleanerProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const [profile, setProfile] = useState<CleanerProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settings, setSettings] = useState({
    reportUpdates: true,
    promotions: false,
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await cleanerAPI.getProfile();
        setProfile(profileData);
        setEditForm({
          name: profileData.name || '',
          email: profileData.email || user?.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
        });
        setSettings({
          reportUpdates: (profileData as any).notify_report_updates ?? true,
          promotions: (profileData as any).notify_news_updates ?? false,
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
        setToast({ show: true, message: 'Failed to load profile data', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      const updatedProfile = await cleanerAPI.updateProfile({
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        avatar: profile.avatar,
      } as any);
      setProfile(updatedProfile);
      updateUser({ name: updatedProfile.name });
      setIsEditing(false);
      setToast({ show: true, message: 'Profile updated successfully', type: 'success' });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setToast({ show: true, message: error.message || 'Failed to update profile', type: 'error' });
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
    setIsEditing(false);
  };

  const handleUpdateSettings = async (key: 'reportUpdates' | 'promotions', value: boolean) => {
    const prev = settings;
    const next = { ...settings, [key]: value };
    setSettings(next);

    try {
      await cleanerAPI.updateNotificationSettings(next);
      setToast({ show: true, message: 'Notification preferences updated', type: 'success' });
    } catch (error: any) {
      console.error('Failed to update settings:', error);
      setSettings(prev);
      setToast({ show: true, message: error.message || 'Failed to update notification preferences', type: 'error' });
    }
  };

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read selected image'));
      reader.readAsDataURL(file);
    });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !profile) return;

    if (!file.type.startsWith('image/')) {
      setToast({ show: true, message: 'Please select a valid image file', type: 'warning' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({ show: true, message: 'Image size must be 5MB or less', type: 'warning' });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const avatarDataUrl = await fileToDataUrl(file);
      const updatedProfile = await cleanerAPI.updateProfile({ avatar: avatarDataUrl });
      setProfile(updatedProfile);
      updateUser({ avatar: updatedProfile.avatar || avatarDataUrl });
      setToast({ show: true, message: 'Avatar updated successfully', type: 'success' });
    } catch (error: any) {
      console.error('Failed to update avatar:', error);
      setToast({ show: true, message: error.message || 'Failed to update avatar', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({ show: true, message: 'New passwords do not match', type: 'error' });
      return;
    }

    try {
      await cleanerAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setToast({ show: true, message: 'Password changed successfully', type: 'success' });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      setToast({ show: true, message: error.message || 'Failed to change password', type: 'error' });
    }
  };

  const handleDownloadData = async () => {
    try {
      await cleanerAPI.downloadUserData();
      setToast({ show: true, message: 'Data download started', type: 'info' });
    } catch (error: any) {
      console.error('Failed to download data:', error);
      setToast({ show: true, message: error.message || 'Failed to download data', type: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await cleanerAPI.deleteAccount();
      setShowDeleteModal(false);
      setToast({ show: true, message: 'Account deletion initiated', type: 'info' });
      logout();
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      setToast({ show: true, message: error.message || 'Failed to delete account', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Failed to load profile data</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl sm:max-w-4xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6">
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />

      <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-3 sm:p-4 md:p-6 text-white shadow-lg dark:shadow-slate-900/30">
        <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6">
          <div className="relative">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <img
              src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=2563eb&color=fff`}
              alt={profile.name || 'User'}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 shadow-lg object-cover"
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center text-slate-700 shadow-md hover:bg-slate-100 transition-colors active:scale-95 disabled:opacity-60 touch-manipulation"
            >
              <Camera size={14} />
            </button>
            {isUploadingAvatar && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-slate-200 whitespace-nowrap">
                Uploading...
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">{profile.name || 'User'}</h1>
            <p className="text-slate-300 text-sm">Cleanup Specialist</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                Joined {formatApiDate(profile.joinedAt, 'Recently')}
              </span>
              <span className="flex items-center gap-1">
                <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                {profile.completedTasks || 0} Completed
              </span>
              <span className="flex items-center gap-1">
                <Bell size={12} className="sm:w-3.5 sm:h-3.5" />
                Rating {profile.rating || 0}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="bg-white text-slate-800 hover:bg-slate-100 w-full md:w-auto"
          >
            <Edit3 size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <Card title="Personal Information">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
              <User className="text-slate-400" size={20} />
              <div className="flex-1">
                <div className="text-xs text-slate-500">Full Name</div>
                <div className="font-medium">{profile.name || 'Not provided'}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
              <Mail className="text-slate-400" size={20} />
              <div className="flex-1">
                <div className="text-xs text-slate-500">Email Address</div>
                <div className="font-medium">{profile.email || user?.email || 'Not provided'}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
              <Phone className="text-slate-400" size={20} />
              <div className="flex-1">
                <div className="text-xs text-slate-500">Phone Number</div>
                <div className="font-medium">{profile.phone || 'Not provided'}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
              <MapPin className="text-slate-400" size={20} />
              <div className="flex-1">
                <div className="text-xs text-slate-500">Address</div>
                <div className="font-medium">{profile.address || 'Not provided'}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Notification Preferences">
          <div className="space-y-3">
            {[
              { key: 'reportUpdates', label: 'Report & Activity Updates', desc: 'Notifications about report status and cleanup activity' },
              { key: 'promotions', label: 'News & Updates', desc: 'Platform updates and task announcements' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-800">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                <button
                  onClick={() => handleUpdateSettings(item.key as 'reportUpdates' | 'promotions', !settings[item.key as keyof typeof settings])}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    settings[item.key as keyof typeof settings] ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      settings[item.key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Account Settings">
        <div className="space-y-2">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="text-slate-400" size={20} />
              <span className="font-medium">Change Password</span>
            </div>
            <ChevronRight className="text-slate-400" size={20} />
          </button>

          <button
            onClick={handleDownloadData}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="text-slate-400" size={20} />
              <span className="font-medium">Download My Data</span>
            </div>
            <ChevronRight className="text-slate-400" size={20} />
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-600"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={20} />
              <span className="font-medium">Delete Account</span>
            </div>
            <ChevronRight size={20} />
          </button>
        </div>
      </Card>

      <Modal
        isOpen={isEditing}
        onClose={handleCancelEdit}
        title="Edit Profile"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <Check size={16} className="mr-1" /> Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <Input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <Input
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <Input
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Update Password</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <Input
              type="password"
              placeholder="Enter current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </Button>
          </div>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="text-red-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Are you sure?</h3>
          <p className="text-slate-500 text-sm">
            This action cannot be undone. Your cleaner account will be deactivated.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export const Profile = CleanerProfile;
