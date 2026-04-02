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
import { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Banknote,
  Users,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Loader,
  Send,
  Bell,
  Megaphone,
  ArrowRight,
  Activity,
  ShieldAlert,
} from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, Toast } from '../../components/ui';
import { adminAPI, sharedAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Report, Task, Zone } from '../../types';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState<{
    audience: 'all' | 'citizens' | 'cleaners';
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'alert';
  }>({
    audience: 'all',
    title: '',
    message: '',
    type: 'alert',
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const reportsData = await adminAPI.getAllReports();
        const tasksData = await adminAPI.getAllTasks();
        const zonesData = await sharedAPI.getZones();
        const statsData = await adminAPI.getStats();
        
        setReports(reportsData);
        setTasks(tasksData);
        setZones(zonesData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setToast({ show: true, message: 'Failed to load dashboard data', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleSendNotification = async () => {
    try {
      await adminAPI.sendBulkNotification(notificationData);
      const audienceLabels: Record<string, string> = {
        all: 'all users',
        citizens: 'all citizens',
        cleaners: 'all cleaners',
      };
      setToast({
        show: true,
        message: `Notification sent to ${audienceLabels[notificationData.audience]}!`,
        type: 'success',
      });
      setShowNotificationModal(false);
      setNotificationData({ audience: 'all', title: '', message: '', type: 'alert' });
    } catch (error: any) {
      console.error('Failed to send notification:', error);
      setToast({
        show: true,
        message: error.message || 'Failed to send notification',
        type: 'error',
      });
    }
  };

  // Calculate real stats from loaded data
  const reportStats = reports.length > 0 ? {
    total: reports.length,
    submitted: reports.filter((r) => r.status === 'SUBMITTED').length,
    approved: reports.filter((r) => r.status === 'APPROVED').length,
    inProgress: reports.filter((r) => r.status === 'IN_PROGRESS').length,
    completed: reports.filter((r) => r.status === 'COMPLETED').length,
    declined: reports.filter((r) => r.status === 'DECLINED').length,
  } : { total: 0, submitted: 0, approved: 0, inProgress: 0, completed: 0, declined: 0 };

  const taskStats = tasks.length > 0 ? {
    total: tasks.length,
    available: tasks.filter((t) => t.status === 'APPROVED').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    totalRewards: tasks.reduce((sum, t) => sum + t.reward, 0),
    paidOut: tasks.filter((t) => t.status === 'COMPLETED').reduce(
      (sum, t) => sum + t.reward,
      0
    ),
  } : { total: 0, available: 0, inProgress: 0, completed: 0, totalRewards: 0, paidOut: 0 };

  // Reports by zone
  const reportsByZone = zones.map((zone) => ({
    name: zone.name,
    reports: reports.filter((r) => r.zoneId === zone.id).length,
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
  const pendingReports = reports.filter((r) => r.status === 'SUBMITTED').slice(0, 5);
  const criticalPendingReports = reports.filter(
    (r) => r.status === 'SUBMITTED' && (r.severity === 'HIGH' || r.severity === 'CRITICAL')
  ).length;
  const averageCleanliness =
    zones.length > 0
      ? Math.round(zones.reduce((sum, zone) => sum + Number(zone.cleanlinessScore || 0), 0) / zones.length)
      : 0;
  const lowCleanlinessZones = zones.filter((zone) => Number(zone.cleanlinessScore || 0) < 60).length;
  const audienceStyleMap: Record<'all' | 'citizens' | 'cleaners', { selectedBox: string; selectedIcon: string; selectedText: string }> = {
    all: {
      selectedBox: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
      selectedIcon: 'text-indigo-600',
      selectedText: 'text-indigo-700 dark:text-indigo-300',
    },
    citizens: {
      selectedBox: 'border-green-500 bg-green-50 dark:bg-green-900/20',
      selectedIcon: 'text-green-600',
      selectedText: 'text-green-700 dark:text-green-300',
    },
    cleaners: {
      selectedBox: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      selectedIcon: 'text-blue-600',
      selectedText: 'text-blue-700 dark:text-blue-300',
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }


  return (
    <>
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 sm:gap-4 md:gap-6">
          <div className="xl:col-span-8 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-2xl p-3 sm:p-4 md:p-6 text-white border border-slate-700/50 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-emerald-200 mb-1\">Operations Pulse</p>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold">Admin Command Center</h3>
                <p className="text-slate-200 text-sm mt-1">Monitor reports, task flow, finances, and zone health in one view.</p>
              </div>
              <Button
                onClick={() => navigate('/admin/reports')}
                className="bg-white text-slate-900 hover:bg-slate-100 w-full sm:w-auto"
              >
                Review Reports <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                <p className="text-xs text-slate-200">Pending Reports</p>
                <p className="text-2xl font-bold mt-1">{reportStats.submitted}</p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                <p className="text-xs text-slate-200">Tasks In Progress</p>
                <p className="text-2xl font-bold mt-1">{taskStats.inProgress}</p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                <p className="text-xs text-slate-200">Avg Zone Cleanliness</p>
                <p className="text-2xl font-bold mt-1">{averageCleanliness}%</p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                <p className="text-xs text-slate-200">Critical Queue</p>
                <p className="text-2xl font-bold mt-1">{criticalPendingReports}</p>
              </div>
            </div>
          </div>

          <Card className="xl:col-span-4 p-5 sm:p-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white border-0 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="p-3 rounded-xl bg-white/20">
                <Megaphone size={26} />
              </div>
              <Badge variant="info" className="bg-white/20 text-white border-white/30">Featured</Badge>
            </div>
            <h3 className="text-xl font-bold mt-4">Bulk Notifications</h3>
            <p className="text-indigo-100 text-sm mt-1">
              Broadcast urgent alerts, announcements, or updates to everyone, only citizens, or only cleaners.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
              <div className="rounded-lg bg-white/15 px-2 py-2 border border-white/20">All Users</div>
              <div className="rounded-lg bg-white/15 px-2 py-2 border border-white/20">Citizens</div>
              <div className="rounded-lg bg-white/15 px-2 py-2 border border-white/20">Cleaners</div>
            </div>
            <Button
              onClick={() => setShowNotificationModal(true)}
              className="mt-5 w-full !bg-slate-900 !text-white hover:!bg-slate-800 border border-white/20 font-semibold"
            >
              <Send size={16} className="mr-2" /> Open Broadcast Center
            </Button>
          </Card>
        </div>

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

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          <Card title="Zone Cleanliness Scores" className="xl:col-span-7">
            <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Activity size={16} className="text-emerald-500" />
                Avg. Cleanliness: <span className="font-semibold">{averageCleanliness}%</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <ShieldAlert size={16} className="text-amber-500" />
                Low-score zones: <span className="font-semibold">{lowCleanlinessZones}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin size={18} style={{ color: zone.color }} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{zone.name}</span>
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
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{zone.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card
            className="xl:col-span-5"
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <span>Pending Approval Queue</span>
              </div>
            }
          >
            {pendingReports.length === 0 ? (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                <p>All reports are processed. Great job.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {pendingReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={report.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.zoneName || 'Report')}&background=f1f5f9&color=64748b`}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{report.id}</span>
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
                          <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{report.zoneName}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => navigate('/admin/reports')}>
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => navigate('/admin/reports')}>
                    View Full Queue ({reportStats.submitted})
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
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
                (() => {
                  const style = audienceStyleMap[option.value as 'all' | 'citizens' | 'cleaners'];
                  const isSelected = notificationData.audience === option.value;
                  return (
                <button
                  key={option.value}
                  onClick={() => setNotificationData({ ...notificationData, audience: option.value as 'all' | 'citizens' | 'cleaners' })}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    isSelected
                      ? style.selectedBox
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                  }`}
                >
                  <option.icon
                    size={20}
                    className={`mx-auto mb-1 ${
                      isSelected
                        ? style.selectedIcon
                        : 'text-slate-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isSelected
                        ? style.selectedText
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
                  );
                })()
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
            onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value as 'info' | 'success' | 'warning' | 'alert' })}
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
