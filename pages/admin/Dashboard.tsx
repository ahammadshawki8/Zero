import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Banknote,
  Users,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Loader,
  Send,
  Bell,
  Megaphone,
} from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, Toast } from '../../components/ui';
import { MOCK_REPORTS, MOCK_TASKS, MOCK_ZONES, STATUS_INFO } from '../../constants';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState({
    audience: 'all',
    title: '',
    message: '',
    type: 'info',
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });

  const handleSendNotification = () => {
    const audienceLabels: Record<string, string> = {
      all: 'all users',
      citizens: 'all citizens',
      cleaners: 'all cleaners',
    };
    console.log('Sending notification:', notificationData);
    setToast({
      show: true,
      message: `Notification sent to ${audienceLabels[notificationData.audience]}!`,
      type: 'success',
    });
    setShowNotificationModal(false);
    setNotificationData({ audience: 'all', title: '', message: '', type: 'info' });
  };

  // Calculate real stats from mock data
  const reportStats = {
    total: MOCK_REPORTS.length,
    submitted: MOCK_REPORTS.filter((r) => r.status === 'SUBMITTED').length,
    approved: MOCK_REPORTS.filter((r) => r.status === 'APPROVED').length,
    inProgress: MOCK_REPORTS.filter((r) => r.status === 'IN_PROGRESS').length,
    completed: MOCK_REPORTS.filter((r) => r.status === 'COMPLETED').length,
    declined: MOCK_REPORTS.filter((r) => r.status === 'DECLINED').length,
  };

  const taskStats = {
    total: MOCK_TASKS.length,
    available: MOCK_TASKS.filter((t) => t.status === 'APPROVED').length,
    inProgress: MOCK_TASKS.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: MOCK_TASKS.filter((t) => t.status === 'COMPLETED').length,
    totalRewards: MOCK_TASKS.reduce((sum, t) => sum + t.reward, 0),
    paidOut: MOCK_TASKS.filter((t) => t.status === 'COMPLETED').reduce(
      (sum, t) => sum + t.reward,
      0
    ),
  };

  // Reports by zone
  const reportsByZone = MOCK_ZONES.map((zone) => ({
    name: zone.name,
    reports: MOCK_REPORTS.filter((r) => r.zoneId === zone.id).length,
    score: zone.cleanlinessScore,
  }));

  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Pending', value: reportStats.submitted, color: '#f59e0b' },
    { name: 'Approved', value: reportStats.approved, color: '#3b82f6' },
    { name: 'In Progress', value: reportStats.inProgress, color: '#8b5cf6' },
    { name: 'Completed', value: reportStats.completed, color: '#22c55e' },
    { name: 'Declined', value: reportStats.declined, color: '#ef4444' },
  ].filter((s) => s.value > 0);

  // Recent reports needing attention
  const pendingReports = MOCK_REPORTS.filter((r) => r.status === 'SUBMITTED').slice(0, 5);


  return (
    <>
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
      <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/reports')}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Pending</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">{reportStats.submitted}</h3>
            </div>
            <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Clock className="text-amber-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 sm:mt-2 hidden sm:block">Reports awaiting review</p>
        </Card>

        <Card className="p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/tasks')}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Available</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{taskStats.available}</h3>
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="text-blue-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 sm:mt-2 hidden sm:block">Waiting for cleaners</p>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">In Progress</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{taskStats.inProgress}</h3>
            </div>
            <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Loader className="text-purple-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 sm:mt-2 hidden sm:block">Being cleaned now</p>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{taskStats.completed}</h3>
            </div>
            <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 sm:mt-2 hidden sm:block">Successfully cleaned</p>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <Banknote size={24} />
            </div>
            <div>
              <p className="text-green-100 text-xs sm:text-sm">Total Rewards</p>
              <h3 className="text-xl sm:text-2xl font-bold">৳{taskStats.totalRewards.toLocaleString()}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-blue-100 text-xs sm:text-sm">Paid Out</p>
              <h3 className="text-xl sm:text-2xl font-bold">৳{taskStats.paidOut.toLocaleString()}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-amber-100 text-xs sm:text-sm">Total Reports</p>
              <h3 className="text-xl sm:text-2xl font-bold">{reportStats.total}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Bulk Notification Card */}
      <Card className="p-4 sm:p-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Megaphone size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Bulk Notifications</h3>
              <p className="text-indigo-100 text-sm">Send announcements to citizens or cleaners</p>
            </div>
          </div>
          <Button
            onClick={() => setShowNotificationModal(true)}
            className="bg-white text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto"
          >
            <Send size={16} className="mr-2" /> Send Notification
          </Button>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Reports by Zone */}
        <Card title="Reports by Zone">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reportsByZone}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar dataKey="reports" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution */}
        <Card title="Report Status Distribution">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-600">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Zone Cleanliness Scores */}
      <Card title="Zone Cleanliness Scores">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {MOCK_ZONES.map((zone) => (
            <div
              key={zone.id}
              className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={18} style={{ color: zone.color }} />
                  <span className="font-semibold text-slate-800">{zone.name}</span>
                </div>
                <span
                  className={`text-2xl font-bold ${
                    zone.cleanlinessScore >= 80
                      ? 'text-green-600'
                      : zone.cleanlinessScore >= 60
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}
                >
                  {zone.cleanlinessScore}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    zone.cleanlinessScore >= 80
                      ? 'bg-green-500'
                      : zone.cleanlinessScore >= 60
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${zone.cleanlinessScore}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">{zone.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending Reports Quick View */}
      {pendingReports.length > 0 && (
        <Card
          title={
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <span>Reports Pending Approval</span>
            </div>
          }
        >
          <div className="space-y-3">
            {pendingReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={report.imageUrl}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{report.id}</span>
                      <Badge
                        variant={
                          report.severity === 'CRITICAL' || report.severity === 'HIGH'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {report.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{report.zoneName}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => navigate('/admin/reports')}>
                  Review
                </Button>
              </div>
            ))}
          </div>
          {reportStats.submitted > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate('/admin/reports')}>
                View All {reportStats.submitted} Pending Reports
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>

      {/* Bulk Notification Modal */}
      <Modal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title="Send Bulk Notification"
        footer={
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setShowNotificationModal(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              disabled={!notificationData.title || !notificationData.message}
              className="flex-1 sm:flex-none"
            >
              <Send size={16} className="mr-1" /> Send
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Audience Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Send To
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'all', label: 'Everyone', icon: Users, color: 'indigo' },
                { value: 'citizens', label: 'Citizens', icon: Users, color: 'green' },
                { value: 'cleaners', label: 'Cleaners', icon: Users, color: 'blue' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setNotificationData({ ...notificationData, audience: option.value })}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    notificationData.audience === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                  }`}
                >
                  <option.icon
                    size={20}
                    className={`mx-auto mb-1 ${
                      notificationData.audience === option.value
                        ? `text-${option.color}-600`
                        : 'text-slate-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      notificationData.audience === option.value
                        ? `text-${option.color}-700 dark:text-${option.color}-300`
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notification Type */}
          <Select
            label="Notification Type"
            options={[
              { value: 'info', label: '📢 Announcement' },
              { value: 'success', label: '🎉 Good News' },
              { value: 'warning', label: '⚠️ Important Notice' },
              { value: 'alert', label: '🚨 Urgent Alert' },
            ]}
            value={notificationData.type}
            onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value })}
          />

          {/* Title */}
          <Input
            label="Title"
            placeholder="e.g., New Feature Available!"
            value={notificationData.title}
            onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
          />

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder-slate-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Write your notification message here..."
              value={notificationData.message}
              onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
            />
          </div>

          {/* Preview */}
          {notificationData.title && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                <Bell size={12} /> Preview
              </p>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  notificationData.type === 'success' ? 'bg-green-100 text-green-600' :
                  notificationData.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  notificationData.type === 'alert' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Bell size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{notificationData.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notificationData.message || 'Your message will appear here...'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
