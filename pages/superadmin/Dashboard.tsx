import React, { useEffect, useMemo, useState } from 'react';
import { Card, Button, Input, Modal, Toast } from '../../components/ui';
import { PageLoader } from '../../components/ZeroLoader';
import { adminAPI, superadminAPI } from '../../services/api';
import { formatApiDateTime } from '../../utils/date';

type SuperAdminUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CITIZEN' | 'CLEANER' | 'ADMIN';
  is_active: boolean;
  is_superadmin: boolean;
  created_at?: string;
  last_login_at?: string;
};

type ActivityLog = {
  id: string;
  user_id?: string;
  user_name?: string;
  user_role?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: any;
  created_at: string;
};

export const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<SuperAdminUser[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResettingPool, setIsResettingPool] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [armPhrase, setArmPhrase] = useState('');
  const [terminateSessions, setTerminateSessions] = useState(true);
  const [terminateCurrentUserOnly, setTerminateCurrentUserOnly] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const dashboardRes = await superadminAPI.getDashboard();
      const usersRes = await superadminAPI.getUsers({ limit: 100, search: search || undefined });
      const logsRes = await superadminAPI.getActivityLogs({ limit: 50 });
      setStats(dashboardRes || {});
      setUsers(Array.isArray(usersRes?.data) ? usersRes.data : []);
      setLogs(Array.isArray(logsRes?.data) ? logsRes.data : []);
    } catch (error: any) {
      setToast({ show: true, message: error.message || 'Failed to load superadmin data', type: 'error' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const moderateUser = async (userId: string, action: 'block' | 'unblock' | 'delete') => {
    try {
      if (action === 'block') await superadminAPI.blockUser(userId);
      if (action === 'unblock') await superadminAPI.unblockUser(userId);
      if (action === 'delete') await superadminAPI.deleteUser(userId);
      setToast({ show: true, message: `User ${action}ed successfully`, type: 'success' });
      await loadData();
    } catch (error: any) {
      setToast({ show: true, message: error.message || `Failed to ${action} user`, type: 'error' });
    }
  };

  const revertAction = async (logId: string) => {
    try {
      await superadminAPI.revertAction(logId);
      setToast({ show: true, message: 'Action reverted successfully', type: 'success' });
      await loadData();
    } catch (error: any) {
      setToast({ show: true, message: error.message || 'Failed to revert action', type: 'error' });
    }
  };

  const handleForceResetPool = async () => {
    setIsResettingPool(true);
    try {
      await adminAPI.forceResetDbPool({
        terminate_sessions: terminateSessions,
        terminate_only_current_user: terminateCurrentUserOnly,
      });
      setToast({ show: true, message: 'DB pool reset triggered successfully.', type: 'success' });
      setShowResetModal(false);
      setArmPhrase('');
      await loadData();
    } catch (error: any) {
      setToast({ show: true, message: error.message || 'Failed to reset DB pool', type: 'error' });
    } finally {
      setIsResettingPool(false);
    }
  };

  const resetPhraseValid = armPhrase.trim().toUpperCase() === 'RESET DB POOL';

  if (isLoading) {
    return (
      <PageLoader label="Loading superadmin dashboard..." className="min-h-[400px]" />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />

      <Card title="Super Admin Dashboard">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <Metric label="Citizens" value={stats?.total_citizens || 0} />
          <Metric label="Cleaners" value={stats?.total_cleaners || 0} />
          <Metric label="Admins" value={stats?.total_admins || 0} />
          <Metric label="Superadmins" value={stats?.total_superadmins || 0} />
          <Metric label="Blocked" value={stats?.blocked_or_inactive_users || 0} />
          <Metric label="Actions 24h" value={stats?.actions_last_24h || 0} />
        </div>

        <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/80 dark:bg-red-900/10 p-4">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">Emergency DB Controls</p>
          <p className="mt-1 text-xs text-red-600/90 dark:text-red-300/90">
            Use only during spike incidents when pool waiters are stuck.
          </p>
          <div className="mt-3">
            <Button
              variant="danger"
              size="sm"
              isLoading={isResettingPool}
              onClick={() => setShowResetModal(true)}
            >
              Force Reset DB Pool
            </Button>
          </div>
        </div>
      </Card>

      <Card title="User Control Center">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, role"
          />
          <Button onClick={loadData} isLoading={isRefreshing}>Refresh</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 font-medium">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.is_superadmin ? 'SUPERADMIN' : u.role}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.is_active ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      {u.is_active ? (
                        <Button size="sm" variant="outline" onClick={() => moderateUser(u.id, 'block')}>Block</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => moderateUser(u.id, 'unblock')}>Unblock</Button>
                      )}
                      {!u.is_superadmin && (
                        <Button size="sm" variant="danger" onClick={() => moderateUser(u.id, 'delete')}>Delete</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Global Activity Logs">
        <div className="space-y-2 max-h-[420px] overflow-y-auto">
          {logs.map((log) => {
            const canRevert =
              ['SUPERADMIN_BLOCK_USER', 'SUPERADMIN_UNBLOCK_USER', 'SUPERADMIN_DELETE_USER'].includes(log.action) ||
              log.action.startsWith('AUDIT_');
            const alreadyReverted = Boolean(log.details?.reverted);
            return (
              <div key={log.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 break-all">{log.action}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Actor: {log.user_name || 'System'} ({log.user_role || 'N/A'}) | Entity: {log.entity_type || 'N/A'}:{log.entity_id || '-'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{formatApiDateTime(log.created_at)}</p>
                  </div>
                  {canRevert && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={alreadyReverted}
                      onClick={() => revertAction(log.id)}
                    >
                      {alreadyReverted ? 'Reverted' : 'Revert'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {logs.length === 0 && (
            <p className="text-sm text-slate-500">No activity logs found.</p>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showResetModal}
        onClose={() => {
          if (isResettingPool) return;
          setShowResetModal(false);
          setArmPhrase('');
        }}
        title="Arm and Execute DB Pool Reset"
        footer={(
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowResetModal(false);
                setArmPhrase('');
              }}
              disabled={isResettingPool}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={isResettingPool}
              disabled={!resetPhraseValid || isResettingPool}
              onClick={handleForceResetPool}
            >
              Execute Reset
            </Button>
          </>
        )}
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-900/10 p-3">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">Danger Zone</p>
            <p className="text-xs text-red-600 dark:text-red-300/90 mt-1">
              This operation interrupts active DB activity and should be used only during severe pool spikes.
            </p>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={terminateSessions}
              onChange={(e) => setTerminateSessions(e.target.checked)}
              disabled={isResettingPool}
            />
            <span>Terminate DB sessions before recreating pool</span>
          </label>

          <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={terminateCurrentUserOnly}
              onChange={(e) => setTerminateCurrentUserOnly(e.target.checked)}
              disabled={isResettingPool || !terminateSessions}
            />
            <span>Terminate only sessions owned by current DB user (safer)</span>
          </label>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              To arm execution, type exactly: <span className="font-semibold text-slate-700 dark:text-slate-200">RESET DB POOL</span>
            </p>
            <Input
              value={armPhrase}
              onChange={(e) => setArmPhrase(e.target.value)}
              placeholder="Type: RESET DB POOL"
              disabled={isResettingPool}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800 text-center">
    <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
  </div>
);
