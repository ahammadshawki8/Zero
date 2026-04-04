import { useState, useEffect } from 'react';
import { Card, Toast } from '../../components/ui';
import { PageLoader } from '../../components/ZeroLoader';
import {
  Trophy,
  Medal,
  Banknote,
  Star,
  CheckCircle,
  TrendingUp,
  Crown,
} from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { cleanerAPI } from '../../services/api';

type TimeFilter = 'ALL_TIME' | 'THIS_MONTH' | 'THIS_WEEK';

export const CleanerLeaderboard = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL_TIME');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        const apiPeriod =
          timeFilter === 'THIS_MONTH'
            ? 'month'
            : timeFilter === 'THIS_WEEK'
              ? 'week'
              : 'all_time';

        const data = await cleanerAPI.getLeaderboard(apiPeriod, 50);
        setLeaderboard(data);
      } catch (error: any) {
        console.error('Failed to load leaderboard:', error);
        setToast({ show: true, message: 'Failed to load leaderboard', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [timeFilter]);

  if (isLoading) {
    return (
      <PageLoader label="Loading leaderboard..." />
    );
  }

  const currentUser = leaderboard.find((entry) => entry.isCurrentUser);
  const sortedLeaderboard = [...leaderboard].sort((a, b) => Number(a.rank || 0) - Number(b.rank || 0));
  const first = sortedLeaderboard[0];
  const second = sortedLeaderboard[1];
  const third = sortedLeaderboard[2];

  const getDisplayEarnings = (entry?: LeaderboardEntry) => {
    if (!entry) return 0;
    return Number(timeFilter === 'ALL_TIME' ? entry.totalEarnings || 0 : entry.monthlyEarnings || 0);
  };

  const getAvatar = (entry: LeaderboardEntry | undefined, fallbackIndex: number) =>
    entry?.avatar || entry?.avatarUrl || `https://i.pravatar.cc/150?img=${fallbackIndex}`;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={20} className="text-slate-400" />;
    if (rank === 3) return <Medal size={20} className="text-sky-500" />;
    return <span className="text-slate-500 font-bold">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) {
      return 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 dark:from-emerald-900/30 dark:to-teal-900/30 dark:border-emerald-700';
    }
    if (rank === 2) {
      return 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300 dark:from-slate-800 dark:to-slate-700 dark:border-slate-600';
    }
    if (rank === 3) {
      return 'bg-gradient-to-r from-sky-50 to-blue-50 border-sky-300 dark:from-sky-900/25 dark:to-blue-900/25 dark:border-sky-700';
    }
    return 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700';
  };

  const periodLabel =
    timeFilter === 'THIS_WEEK'
      ? 'This Week'
      : timeFilter === 'THIS_MONTH'
        ? 'This Month'
        : 'All Time';

  return (
    <>
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-emerald-800 rounded-2xl p-3 sm:p-4 md:p-6 text-white shadow-lg border border-slate-700/40 dark:shadow-slate-900/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 bg-white/15 rounded-xl border border-white/20">
                <Trophy size={24} className="sm:w-7 sm:h-7" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Cleaner Leaderboards</h1>
                <p className="text-emerald-100/90 text-sm">Track rankings, earnings, and performance at a glance.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 bg-white/10 p-1 rounded-xl border border-white/15 w-fit">
              <button
                onClick={() => setTimeFilter('ALL_TIME')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  timeFilter === 'ALL_TIME'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-100 hover:bg-white/10'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setTimeFilter('THIS_MONTH')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  timeFilter === 'THIS_MONTH'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-100 hover:bg-white/10'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeFilter('THIS_WEEK')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  timeFilter === 'THIS_WEEK'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-100 hover:bg-white/10'
                }`}
              >
                This Week
              </button>
            </div>
          </div>
          {currentUser && (
            <div className="mt-4 sm:mt-5 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-200">Your Rank</p>
                <p className="text-2xl font-bold">#{currentUser.rank}</p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-200">{periodLabel} Earnings</p>
                <p className="text-2xl font-bold">৳{getDisplayEarnings(currentUser).toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-200">Completed Tasks</p>
                <p className="text-2xl font-bold">{currentUser.completedTasks || 0}</p>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-200">Rating</p>
                <p className="text-2xl font-bold">{currentUser.rating || 0}</p>
              </div>
            </div>
          )}

          {!currentUser && (
            <div className="mt-5 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100">
              You are not ranked yet for this period. Complete tasks to appear on the board.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <Card title="Podium" className="xl:col-span-4">
            <div className="space-y-3">
              {[
                { label: '1st Place', entry: first, badgeBg: 'bg-yellow-500', border: 'border-yellow-400', offset: 'pt-0' },
                { label: '2nd Place', entry: second, badgeBg: 'bg-slate-500', border: 'border-slate-300', offset: 'pt-0' },
                { label: '3rd Place', entry: third, badgeBg: 'bg-sky-500', border: 'border-sky-400', offset: 'pt-0' },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className={`rounded-xl border p-3 sm:p-4 ${idx === 0 ? 'bg-yellow-50/70 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' : idx === 1 ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-sky-50/70 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700'} ${item.offset}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img
                          src={getAvatar(item.entry, idx + 1)}
                          alt={item.entry?.name || item.label}
                          className={`w-11 h-11 rounded-full object-cover border-2 ${item.border}`}
                        />
                        <span className={`absolute -bottom-1 -right-1 w-5 h-5 text-[10px] text-white rounded-full flex items-center justify-center font-bold ${item.badgeBg}`}>
                          {idx + 1}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{item.entry?.name || '-'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 dark:text-green-400">৳{getDisplayEarnings(item.entry).toLocaleString()}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.entry?.completedTasks || 0} tasks</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Full Rankings" className="xl:col-span-8">
            <div className="space-y-2 sm:space-y-3">
              {sortedLeaderboard.map((cleaner, index) => (
                <div
                  key={cleaner.userId}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all ${getRankBg(index + 1)} ${
                    cleaner.isCurrentUser ? 'ring-2 ring-emerald-500/80' : ''
                  }`}
                >
                  <div className="w-8 sm:w-10 flex justify-center flex-shrink-0">{getRankIcon(index + 1)}</div>

                  <img
                    src={getAvatar(cleaner, index + 1)}
                    alt={cleaner.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/70 dark:border-slate-600 shadow-sm flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm sm:text-base">{cleaner.name}</p>
                      {cleaner.isCurrentUser && (
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full flex-shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-300 mt-1">
                      <span className="flex items-center gap-1">
                        <CheckCircle size={10} className="hidden sm:block" />
                        {cleaner.completedTasks || 0} <span className="hidden sm:inline">tasks</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        {cleaner.rating || 0}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm sm:text-base justify-end">
                      <Banknote size={14} className="hidden sm:block" />
                      ৳{getDisplayEarnings(cleaner).toLocaleString()}
                    </div>
                    {timeFilter === 'ALL_TIME' && (cleaner.monthlyEarnings || 0) > 0 && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 hidden sm:flex items-center gap-1 justify-end mt-0.5">
                        <TrendingUp size={10} className="text-emerald-500" />
                        +৳{(cleaner.monthlyEarnings || 0).toLocaleString()} this month
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-sky-600 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Keep Climbing</h3>
              <p className="text-sky-100 text-sm">
                Finish high-priority tasks consistently to move up faster and unlock better payout opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
