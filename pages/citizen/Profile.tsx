import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '../../components/ui';
import { MOCK_CURRENT_USER_PROFILE, ALL_BADGES } from '../../constants';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Bell,
  Shield,
  Leaf,
  Award,
  Calendar,
  Edit3,
  Check,
  X,
  ChevronRight,
  Lock,
  Trash2,
  Download,
} from 'lucide-react';

export const Profile = () => {
  const [profile, setProfile] = useState({
    ...MOCK_CURRENT_USER_PROFILE,
    email: 'alice.citizen@email.com',
    phone: '+880 1712-345678',
    address: 'Gulshan-2, Dhaka, Bangladesh',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [notifications, setNotifications] = useState({
    reportUpdates: true,
    pointsEarned: true,
    leaderboardChanges: false,
    weeklyDigest: true,
    promotions: false,
  });

  const handleSaveProfile = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 shadow-lg"
            />
            <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-green-600 shadow-md hover:bg-green-50 transition-colors">
              <Camera size={14} />
            </button>
          </div>

          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">{profile.name}</h1>
            <p className="text-green-100 text-sm">@{profile.name.toLowerCase().replace(' ', '_')}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                Joined {new Date(profile.joinedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Leaf size={12} className="sm:w-3.5 sm:h-3.5" />
                {profile.greenPoints} Points
              </span>
              <span className="flex items-center gap-1">
                <Award size={12} className="sm:w-3.5 sm:h-3.5" />
                Rank #{profile.rank}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="border-white/30 text-white hover:bg-white/10 w-full md:w-auto"
          >
            <Edit3 size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <div className="text-3xl font-bold text-green-600">{profile.totalReports}</div>
          <div className="text-sm text-slate-500">Total Reports</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <div className="text-3xl font-bold text-blue-600">{profile.approvedReports}</div>
          <div className="text-sm text-slate-500">Approved</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <div className="text-3xl font-bold text-orange-500">{profile.currentStreak}</div>
          <div className="text-sm text-slate-500">Day Streak</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <div className="text-3xl font-bold text-purple-600">{profile.badges.length}</div>
          <div className="text-sm text-slate-500">Badges</div>
        </div>
      </div>

      {/* Personal Information */}
      <Card title="Personal Information">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <User className="text-slate-400" size={20} />
            <div className="flex-1">
              <div className="text-xs text-slate-500">Full Name</div>
              <div className="font-medium">{profile.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <Mail className="text-slate-400" size={20} />
            <div className="flex-1">
              <div className="text-xs text-slate-500">Email Address</div>
              <div className="font-medium">{profile.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <Phone className="text-slate-400" size={20} />
            <div className="flex-1">
              <div className="text-xs text-slate-500">Phone Number</div>
              <div className="font-medium">{profile.phone}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <MapPin className="text-slate-400" size={20} />
            <div className="flex-1">
              <div className="text-xs text-slate-500">Address</div>
              <div className="font-medium">{profile.address}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Badges */}
      <Card title="Your Badges">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
          {ALL_BADGES.map((badge) => {
            const earned = profile.badges.find((b) => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-xl text-center transition-all ${
                  earned
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                    : 'bg-slate-50 border-2 border-dashed border-slate-200 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className={`text-xs font-medium ${earned ? 'text-green-800' : 'text-slate-400'}`}>
                  {badge.name}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Notification Settings */}
      <Card title="Notification Preferences">
        <div className="space-y-3">
          {[
            { key: 'reportUpdates', label: 'Report Status Updates', desc: 'Get notified when your report status changes' },
            { key: 'pointsEarned', label: 'Points Earned', desc: 'Notifications when you earn Green Points' },
            { key: 'leaderboardChanges', label: 'Leaderboard Changes', desc: 'Alert when your rank changes' },
            { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your weekly activity' },
            { key: 'promotions', label: 'News & Updates', desc: 'Platform updates and eco tips' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-slate-800">{item.label}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications]
                    ? 'bg-green-500'
                    : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? 'translate-x-7'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Account Settings */}
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

          <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
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

      {/* Edit Profile Modal */}
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

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowPasswordModal(false)}>Update Password</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
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
              onClick={() => setShowDeleteModal(false)}
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
            This action cannot be undone. All your data, reports, and Green Points will be
            permanently deleted.
          </p>
        </div>
      </Modal>
    </div>
  );
};
