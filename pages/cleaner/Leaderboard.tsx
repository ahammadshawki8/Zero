import { useState } from 'react';
import { Card } from '../../components/ui';
import {
  Trophy,
  Medal,
  Banknote,
  Star,
  CheckCircle,
  TrendingUp,
  Crown,
} from 'lucide-react';

// Mock cleaner leaderboard data based on earnings
const MOCK_CLEANER_LEADERBOARD = [
  {
    rank: 1,
    oderId: 'C-5',
    name: 'Rafiq Ahmed',
    avatar: 'https://i.pravatar.cc/150?img=52',
    totalEarnings: 45600,
    completedTasks: 76,
    rating: 4.9,
    thisMonth: 8500,
  },
  {
    rank: 2,
    oderId: 'C-3',
    name: 'Kamal Hossain',
    avatar: 'https://i.pravatar.cc/150?img=53',
    totalEarnings: 38200,
    completedTasks: 64,
    rating: 4.8,
    thisMonth: 7200,
  },
  {
    rank: 3,
    oderId: 'C-7',
    name: 'Jamal Uddin',
    avatar: 'https://i.pravatar.cc/150?img=54',
    totalEarnings: 32100,
    completedTasks: 52,
    rating: 4.7,
    thisMonth: 6100,
  },
  {
    rank: 4,
    oderId: 'C-2',
    name: 'Rahim Khan',
    avatar: 'https://i.pravatar.cc/150?img=55',
    totalEarnings: 28500,
    completedTasks: 45,
    rating: 4.6,
    thisMonth: 5400,
  },
  {
    rank: 5,
    oderId: 'C-1',
    name: 'Bob Cleaner',
    avatar: 'https://i.pravatar.cc/150?img=8',
    totalEarnings: 24000,
    completedTasks: 38,
    rating: 4.8,
    thisMonth: 4800,
    isCurrentUser: true,
  },
  {
    rank: 6,
    oderId: 'C-8',
    name: 'Salam Mia',
    avatar: 'https://i.pravatar.cc/150?img=56',
    totalEarnings: 19800,
    completedTasks: 32,
    rating: 4.5,
    thisMonth: 3900,
  },
  {
    rank: 7,
    oderId: 'C-4',
    name: 'Habib Rahman',
    avatar: 'https://i.pravatar.cc/150?img=57',
    totalEarnings: 15600,
    completedTasks: 26,
    rating: 4.4,
    thisMonth: 3200,
  },
  {
    rank: 8,
    oderId: 'C-6',
    name: 'Nasir Uddin',
    avatar: 'https://i.pravatar.cc/150?img=58',
    totalEarnings: 12400,
    completedTasks: 21,
    rating: 4.3,
    thisMonth: 2600,
  },
  {
    rank: 9,
    oderId: 'C-9',
    name: 'Faruk Hasan',
    avatar: 'https://i.pravatar.cc/150?img=59',
    totalEarnings: 8900,
    completedTasks: 15,
    rating: 4.2,
    thisMonth: 1800,
  },
  {
    rank: 10,
    oderId: 'C-10',
    name: 'Belal Ahmed',
    avatar: 'https://i.pravatar.cc/150?img=60',
    totalEarnings: 5200,
    completedTasks: 9,
    rating: 4.1,
    thisMonth: 1200,
  },
];

type TimeFilter = 'ALL_TIME' | 'THIS_MONTH' | 'THIS_WEEK';

export const CleanerLeaderboard = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL_TIME');

  const currentUser = MOCK_CLEANER_LEADERBOARD.find((c) => c.isCurrentUser);

  // Sort by earnings based on filter
  const sortedLeaderboard = [...MOCK_CLEANER_LEADERBOARD].sort((a, b) => {
    if (timeFilter === 'THIS_MONTH') {
      return b.thisMonth - a.thisMonth;
    }
    return b.totalEarnings - a.totalEarnings;
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={20} className="text-slate-400" />;
    if (rank === 3) return <Medal size={20} className="text-amber-600" />;
    return <span className="text-slate-500 font-bold">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
    if (rank === 2) return 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200';
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200';
    return 'bg-white border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
            <Trophy size={24} className="sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Top Earners</h1>
            <p className="text-amber-100 text-sm">Compete with fellow cleaners and earn more!</p>
          </div>
        </div>

        {/* Current User Stats */}
        {currentUser && (
          <div className="bg-white/10 rounded-xl p-3 sm:p-4 mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-base">Your Ranking</p>
                  <p className="text-amber-100 text-xs sm:text-sm truncate">Keep completing tasks!</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl sm:text-3xl font-bold">#{currentUser.rank}</div>
                <div className="text-xs sm:text-sm text-amber-100">
                  ৳{currentUser.totalEarnings.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time Filter */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTimeFilter('ALL_TIME')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            timeFilter === 'ALL_TIME'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setTimeFilter('THIS_MONTH')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            timeFilter === 'THIS_MONTH'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          This Month
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {/* 2nd Place */}
        <div className="flex flex-col items-center pt-6 sm:pt-8">
          <div className="relative">
            <img
              src={sortedLeaderboard[1]?.avatar}
              alt={sortedLeaderboard[1]?.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-slate-300 object-cover"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
              2
            </div>
          </div>
          <p className="mt-3 sm:mt-4 font-semibold text-slate-800 dark:text-slate-200 text-center text-xs sm:text-sm line-clamp-1">
            {sortedLeaderboard[1]?.name}
          </p>
          <p className="text-green-600 dark:text-green-400 font-bold text-sm sm:text-base">
            ৳{(timeFilter === 'THIS_MONTH' ? sortedLeaderboard[1]?.thisMonth : sortedLeaderboard[1]?.totalEarnings)?.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle size={10} className="hidden sm:block" />
            <span className="hidden sm:inline">{sortedLeaderboard[1]?.completedTasks} tasks</span>
            <span className="sm:hidden">{sortedLeaderboard[1]?.completedTasks}</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2">
              <Crown size={20} className="sm:w-6 sm:h-6 text-yellow-500" />
            </div>
            <img
              src={sortedLeaderboard[0]?.avatar}
              alt={sortedLeaderboard[0]?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-400 object-cover"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
              1
            </div>
          </div>
          <p className="mt-3 sm:mt-4 font-bold text-slate-800 dark:text-slate-200 text-center text-sm sm:text-base line-clamp-1">{sortedLeaderboard[0]?.name}</p>
          <p className="text-green-600 dark:text-green-400 font-bold text-base sm:text-lg">
            ৳{(timeFilter === 'THIS_MONTH' ? sortedLeaderboard[0]?.thisMonth : sortedLeaderboard[0]?.totalEarnings)?.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle size={10} className="hidden sm:block" />
            <span className="hidden sm:inline">{sortedLeaderboard[0]?.completedTasks} tasks</span>
            <span className="sm:hidden">{sortedLeaderboard[0]?.completedTasks}</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center pt-10 sm:pt-12">
          <div className="relative">
            <img
              src={sortedLeaderboard[2]?.avatar}
              alt={sortedLeaderboard[2]?.name}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-4 border-amber-400 object-cover"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
              3
            </div>
          </div>
          <p className="mt-3 sm:mt-4 font-semibold text-slate-800 dark:text-slate-200 text-center text-xs sm:text-sm line-clamp-1">
            {sortedLeaderboard[2]?.name}
          </p>
          <p className="text-green-600 dark:text-green-400 font-bold text-sm sm:text-base">
            ৳{(timeFilter === 'THIS_MONTH' ? sortedLeaderboard[2]?.thisMonth : sortedLeaderboard[2]?.totalEarnings)?.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle size={10} className="hidden sm:block" />
            <span className="hidden sm:inline">{sortedLeaderboard[2]?.completedTasks} tasks</span>
            <span className="sm:hidden">{sortedLeaderboard[2]?.completedTasks}</span>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <Card title="Full Rankings">
        <div className="space-y-2 sm:space-y-3">
          {sortedLeaderboard.map((cleaner, index) => (
            <div
              key={cleaner.oderId}
              className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all ${getRankBg(index + 1)} ${
                cleaner.isCurrentUser ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {/* Rank */}
              <div className="w-8 sm:w-10 flex justify-center flex-shrink-0">{getRankIcon(index + 1)}</div>

              {/* Avatar */}
              <img
                src={cleaner.avatar}
                alt={cleaner.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate text-sm sm:text-base">{cleaner.name}</p>
                  {cleaner.isCurrentUser && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle size={10} className="hidden sm:block" />
                    {cleaner.completedTasks} <span className="hidden sm:inline">tasks</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    {cleaner.rating}
                  </span>
                </div>
              </div>

              {/* Earnings */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm sm:text-base">
                  <Banknote size={14} className="hidden sm:block" />
                  ৳{(timeFilter === 'THIS_MONTH' ? cleaner.thisMonth : cleaner.totalEarnings).toLocaleString()}
                </div>
                {timeFilter === 'ALL_TIME' && cleaner.thisMonth > 0 && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1 justify-end">
                    <TrendingUp size={10} className="text-green-500" />
                    +৳{cleaner.thisMonth.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Motivation Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Earn More, Rank Higher!</h3>
            <p className="text-blue-100 text-sm">
              Complete more tasks to increase your earnings and climb the leaderboard. Top performers
              get priority access to high-value tasks!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
