'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Calendar, Target, TrendingUp, Clock, Dumbbell } from 'lucide-react';

interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  totalWeight: number;
  averageWorkoutDuration: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
  longestStreak: number;
  currentStreak: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    // Mock stats data
    const mockStats: WorkoutStats = {
      totalWorkouts: 42,
      totalSets: 324,
      totalReps: 2856,
      totalWeight: 15750, // kg
      averageWorkoutDuration: 48, // minutes
      thisWeekWorkouts: 3,
      thisMonthWorkouts: 12,
      longestStreak: 14, // days
      currentStreak: 5, // days
    };
    setStats(mockStats);
  }, []);

  const periods = [
    { key: 'all', label: 'Tất cả' },
    { key: 'year', label: 'Năm nay' },
    { key: 'month', label: 'Tháng này' },
    { key: 'week', label: 'Tuần này' },
  ];

  const achievements = [
    {
      title: 'Streaker',
      description: 'Tập luyện 7 ngày liên tiếp',
      icon: '🔥',
      achieved: true,
      progress: 100,
    },
    {
      title: 'Heavyweight',
      description: 'Nâng tổng cộng 10,000kg',
      icon: '💪',
      achieved: true,
      progress: 100,
    },
    {
      title: 'Dedication',
      description: 'Hoàn thành 50 buổi tập',
      icon: '🏆',
      achieved: false,
      progress: 84,
    },
    {
      title: 'Marathon',
      description: 'Tập luyện tổng cộng 24 giờ',
      icon: '⏱️',
      achieved: false,
      progress: 67,
    },
  ];

  const weeklyData = [
    { day: 'T2', workouts: 1, color: 'bg-primary-600' },
    { day: 'T3', workouts: 0, color: 'bg-gray-200' },
    { day: 'T4', workouts: 1, color: 'bg-primary-600' },
    { day: 'T5', workouts: 0, color: 'bg-gray-200' },
    { day: 'T6', workouts: 1, color: 'bg-primary-600' },
    { day: 'T7', workouts: 1, color: 'bg-primary-600' },
    { day: 'CN', workouts: 0, color: 'bg-gray-200' },
  ];

  const topExercises = [
    { name: 'Bench Press', sessions: 15, totalWeight: 2250 },
    { name: 'Squat', sessions: 12, totalWeight: 3600 },
    { name: 'Deadlift', sessions: 10, totalWeight: 4500 },
    { name: 'Pull-ups', sessions: 18, totalWeight: 0 },
  ];

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-semibold">Thống kê tổng quan</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Period Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-4 gap-2">
            {periods.map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`p-2 rounded-lg font-medium text-sm ${
                  selectedPeriod === period.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.totalWorkouts}</div>
            <div className="text-sm text-gray-600 mt-1">Tổng buổi tập</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.currentStreak}</div>
            <div className="text-sm text-gray-600 mt-1">Streak hiện tại</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.totalSets}</div>
            <div className="text-sm text-gray-600 mt-1">Tổng số set</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary-600">
              {(stats.totalWeight / 1000).toFixed(1)}T
            </div>
            <div className="text-sm text-gray-600 mt-1">Tổng trọng lượng</div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động tuần này</h2>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day) => (
              <div key={day.day} className="text-center">
                <div className="text-xs text-gray-600 mb-2">{day.day}</div>
                <div className={`w-8 h-8 rounded-full mx-auto ${day.color} flex items-center justify-center`}>
                  {day.workouts > 0 && (
                    <span className="text-white text-xs font-bold">{day.workouts}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Ít</span>
            <span>Nhiều</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Hiệu suất</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Thời gian trung bình</div>
                  <div className="text-sm text-gray-600">Mỗi buổi tập</div>
                </div>
              </div>
              <div className="text-xl font-bold text-primary-600">
                {stats.averageWorkoutDuration}&apos;
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Tần suất tập luyện</div>
                  <div className="text-sm text-gray-600">Tuần này</div>
                </div>
              </div>
              <div className="text-xl font-bold text-green-600">
                {stats.thisWeekWorkouts}/7
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-orange-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Streak dài nhất</div>
                  <div className="text-sm text-gray-600">Kỷ lục cá nhân</div>
                </div>
              </div>
              <div className="text-xl font-bold text-orange-600">
                {stats.longestStreak} ngày
              </div>
            </div>
          </div>
        </div>

        {/* Top Exercises */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bài tập yêu thích</h2>
          <div className="space-y-3">
            {topExercises.map((exercise, index) => (
              <div key={exercise.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{exercise.name}</div>
                    <div className="text-sm text-gray-600">{exercise.sessions} buổi</div>
                  </div>
                </div>
                <div className="text-primary-600 font-semibold">
                  {exercise.totalWeight > 0 ? `${exercise.totalWeight}kg` : 'Bodyweight'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thành tựu</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{achievement.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">{achievement.title}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                    </div>
                  </div>
                  {achievement.achieved ? (
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <div className="text-sm font-medium text-primary-600">
                      {achievement.progress}%
                    </div>
                  )}
                </div>
                {!achievement.achieved && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
