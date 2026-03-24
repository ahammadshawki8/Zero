import React, { useState, useEffect } from 'react';
import { Card, Toast } from '../../components/ui';
import { citizenAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Trophy, Medal, Award, Leaf, TrendingUp, Target, Flame, Crown } from 'lucide-react';
import { LeaderboardEntry, CitizenProfile } from '../../types';

type TimeFilter = 'week' | 'month' | 'all';

export const Leaderboard = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Load data on component mount and when filter changes
  useEffect(() => {
    const loadData = async () => {
      try {
        const periodMap: Record<TimeFilter, 'week' | 'month' | 'all_time'> = {
          week: 'week',
          month: 'month',
          all: 'all_time',
        };

        const [leaderboardData, profileData] = await Promise.all([
          citizenAPI.getLeaderboard(periodMap[timeFilter], 50),
          citizenAPI.getProfile(),
        ]);
        setLeaderboard(leaderboardData);
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
        setToast({ show: true, message: 'Failed to load leaderboard data', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeFilter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-slate-400" size={22} />;
      case 3:
        return <Medal className="text-amber-600" size={22} />;
      default:
        return <span className="text-slate-500 font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
      default:
        return 'bg-white border-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />

      {/* User Stats Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-3 sm:p-4 md:p-6 text-white shadow-lg dark:shadow-green-900/20">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-6 text-center sm:text-left">
          <img
            src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=10b981&color=fff`}
            alt={profile.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-white/30 shadow-lg"
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{profile.name}</h2>
            <p className="text-green-100 text-xs sm:text-sm">
              Rank #{profile.rank || 'N/A'} • Joined {new Date(profile.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 text-center active:scale-95 transition-transform touch-manipulation">
            <Leaf className="mx-auto mb-1 w-5 h-5 sm:w-6 sm:h-6" />
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{profile.greenPoints || 0}</div>
            <div className="text-[10px] sm:text-xs text-green-100">Green Points</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
            <Target className="mx-auto mb-1" size={24} />
            <div className="text-2xl font-bold">{profile.approvedReports || 0}</div>
            <div className="text-xs text-green-100">Approved Reports</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
            <Flame className="mx-auto mb-1" size={24} />
            <div className="text-2xl font-bold">{profile.currentStreak || 0}</div>
            <div className="text-xs text-green-100">Day Streak</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
            <Award className="mx-auto mb-1" size={24} />
            <div className="text-2xl font-bold">{profile.badges?.length || 0}</div>
            <div className="text-xs text-green-100">Badges Earned</div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <Card title="Your Badges">
        {profile.badges && profile.badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {profile.badges.map((badge) => (
              <div
                key={badge.id}
                className="p-2 sm:p-3 rounded-xl text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 active:scale-95 transition-transform touch-manipulation"
              >
                <div className="text-2xl sm:text-3xl mb-2">{badge.icon}</div>
                <div className="text-[10px] sm:text-xs md:text-sm font-medium text-green-800 dark:text-green-300">{badge.name}</div>
                <div className="text-[8px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{badge.description}</div>
                {badge.earnedAt && (
                  <div className="text-[8px] sm:text-xs text-green-600 dark:text-green-400 mt-2">
                    {'\u2713'} {new Date(badge.earnedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Award size={48} className="mx-auto mb-4 text-slate-300" />
            <p>No badges earned yet</p>
            <p className="text-sm">Start reporting waste to earn your first badge!</p>
          </div>
        )}
      </Card>

      {/* Leaderboard */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={20} />
            <span>Green Impact Leaderboard</span>
          </div>
        }
      >
        {/* Time Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['week', 'month', 'all'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                timeFilter === filter
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Leaderboard List */}
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 sm:py-10 md:py-12 text-slate-500 dark:text-slate-400">
            <Trophy size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm sm:text-base">No leaderboard data available</p>
            <p className="text-xs sm:text-sm">Be the first to start reporting waste!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry) => {
              const isCurrentUser = entry.userId === user?.id;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    isCurrentUser
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 ring-2 ring-green-200 dark:ring-green-800'
                      : getRankBg(entry.rank)
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 sm:w-10 flex justify-center flex-shrink-0">{getRankIcon(entry.rank)}</div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <img
                      src={entry.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=10b981&color=fff`}
                      alt={entry.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base truncate">
                        {entry.name}
                        {isCurrentUser && (
                          <span className="ml-1 sm:ml-2 text-xs bg-green-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                        {entry.approvedReports || 0} reports • {entry.badges || 0} badges
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm sm:text-lg">
                      <Leaf size={16} className="hidden sm:block" />
                      {entry.greenPoints || 0}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* How Points Work */}
      <Card title="How to Earn Green Points">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Target size={20} />
            </div>
            <div>
              <div className="font-medium text-slate-800">Report Approved</div>
              <div className="text-sm text-slate-500">+10 points when your report is verified</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="font-medium text-slate-800">Task Completed</div>
              <div className="text-sm text-slate-500">+15 bonus when cleanup is done</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <Flame size={20} />
            </div>
            <div>
              <div className="font-medium text-slate-800">Daily Streak</div>
              <div className="text-sm text-slate-500">+5 points for consecutive days</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <Award size={20} />
            </div>
            <div>
              <div className="font-medium text-slate-800">Severity Bonus</div>
              <div className="text-sm text-slate-500">+2 to +10 for critical reports</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};