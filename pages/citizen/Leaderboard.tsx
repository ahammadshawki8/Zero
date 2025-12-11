import React, { useState } from 'react';
import { Card } from '../../components/ui';
import { MOCK_LEADERBOARD, MOCK_CURRENT_USER_PROFILE, ALL_BADGES } from '../../constants';
import { Trophy, Medal, Award, Leaf, TrendingUp, Target, Flame, Crown } from 'lucide-react';

type TimeFilter = 'week' | 'month' | 'all';

export const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const currentUser = MOCK_CURRENT_USER_PROFILE;

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

  return (
    <div className="space-y-6">
      {/* User Stats Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-6 text-center sm:text-left">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-white/30 shadow-lg"
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{currentUser.name}</h2>
            <p className="text-green-100 text-xs sm:text-sm">Rank #{currentUser.rank} • Joined {new Date(currentUser.joinedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
            <Leaf className="mx-auto mb-1" size={24} />
            <div className="text-2xl font-bold">{currentUser.greenPoints}</div>
            <div className="text-xs text-green-100">Green Points</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
            <Target className="mx-auto mb-1" size={24} />
            <div className="text-2xl font-bold">{currentUser.approvedReports}</div>
            <div className="text-xs text-green-100">Approved Reports</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
            <Flame className="mx-auto mb-1" size={24} />
            <div className="text-2xl font-bold">{currentUser.currentStreak}</div>
            <div className="text-xs text-green-100">Day Streak</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
            <Award className="mx-auto mb-1" size={24} />
            <div className="text-2xl font-bold">{currentUser.badges.length}</div>
            <div className="text-xs text-green-100">Badges Earned</div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <Card title="Your Badges">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
          {ALL_BADGES.map((badge) => {
            const earned = currentUser.badges.find((b) => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  earned
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                    : 'bg-slate-50 border-2 border-dashed border-slate-200 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className={`text-sm font-medium ${earned ? 'text-green-800' : 'text-slate-400'}`}>
                  {badge.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">{badge.description}</div>
                {earned && (
                  <div className="text-xs text-green-600 mt-2">
                    ✓ {new Date(earned.earnedAt!).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
        <div className="space-y-3">
          {MOCK_LEADERBOARD.map((entry) => {
            const isCurrentUser = entry.userId === currentUser.userId;
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
                    src={entry.avatar}
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
                      {entry.approvedReports} reports • {entry.badges} badges
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm sm:text-lg">
                    <Leaf size={16} className="hidden sm:block" />
                    {entry.greenPoints}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">pts</div>
                </div>
              </div>
            );
          })}
        </div>
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
