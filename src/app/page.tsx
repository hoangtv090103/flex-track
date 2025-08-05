'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, History, BarChart3, User, Dumbbell } from 'lucide-react';
import { useAuth, useUser, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useLocalTime } from '@/hooks/useClientOnly';
import { clientWorkoutService } from '@/services/clientWorkoutService';
import ClientOnly from '@/components/ClientOnly';

export default function HomePage() {
  const { currentTime, formatTime, formatDate } = useLocalTime();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 0,
    thisWeekWorkouts: 0,
    maxWeight: 0
  });
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!isSignedIn || !user) {
          // Reset stats for unauthenticated users
          setWorkoutStats({
            totalWorkouts: 0,
            thisWeekWorkouts: 0,
            maxWeight: 0
          });
          setRecentWorkouts([]);
          return;
        }

        // Load workouts using API route
        const response = await fetch('/api/workouts/history');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        const userWorkouts = result.workouts || [];

        // Calculate weekly stats
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const thisWeekWorkouts = userWorkouts.filter((workout: any) =>
          new Date(workout.date) >= oneWeekAgo
        );

        // Find max weight
        let maxWeight = 0;
        userWorkouts.forEach((workout: any) => {
          workout.exercises?.forEach((exercise: any) => {
            exercise.sets?.forEach((set: any) => {
              if (set.weight > maxWeight) {
                maxWeight = set.weight;
              }
            });
          });
        });

        setWorkoutStats({
          totalWorkouts: userWorkouts.length,
          thisWeekWorkouts: thisWeekWorkouts.length,
          maxWeight: maxWeight
        });

        // Get recent workouts (last 3)
        const recent = userWorkouts.slice(0, 3);
        setRecentWorkouts(recent);

      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to localStorage if service fails
        try {
          const savedWorkouts = JSON.parse(localStorage.getItem('flextrack-workouts') || '[]');
          const stats = {
            totalWorkouts: savedWorkouts.length,
            thisWeekWorkouts: 0,
            maxWeight: 0
          };

          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          savedWorkouts.forEach((workout: any) => {
            const workoutDate = new Date(workout.date);

            if (workoutDate >= oneWeekAgo) {
              stats.thisWeekWorkouts++;
            }

            workout.exercises?.forEach((exercise: any) => {
              exercise.sets?.forEach((set: any) => {
                if (set.weight > stats.maxWeight) {
                  stats.maxWeight = set.weight;
                }
              });
            });
          });

          setWorkoutStats(stats);

          const recent = savedWorkouts.slice(0, 3).map((workout: any) => ({
            ...workout,
            date: new Date(workout.date)
          }));
          setRecentWorkouts(recent);
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      }
    };

    loadStats();
  }, [user, isSignedIn]);

  const quickStats = [
    { label: 'Tổng buổi tập', value: workoutStats.totalWorkouts.toString(), icon: '🏋️' },
    { label: 'Tuần này', value: workoutStats.thisWeekWorkouts.toString(), icon: '📅' },
    { label: 'Tạ nâng cao nhất', value: workoutStats.maxWeight > 0 ? `${workoutStats.maxWeight}kg` : '0kg', icon: '💪' },
  ];

  const menuItems = [
    {
      title: 'Bắt đầu tập luyện',
      subtitle: 'Ghi lại buổi tập mới',
      icon: Plus,
      href: '/workout/new',
      bgColor: 'bg-primary-600',
      textColor: 'text-white',
    },
    {
      title: 'Quản lý workouts',
      subtitle: 'Xem, sửa, xóa workouts',
      icon: Dumbbell,
      href: '/workouts',
      bgColor: 'bg-green-600',
      textColor: 'text-white',
    },
    {
      title: 'Thống kê',
      subtitle: 'Tổng quan hiệu suất',
      icon: BarChart3,
      href: '/stats',
      bgColor: 'bg-gray-700',
      textColor: 'text-white',
    },
    {
      title: 'Cá nhân',
      subtitle: 'Cài đặt và thông tin',
      icon: User,
      href: '/profile',
      bgColor: 'bg-indigo-600',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <SignedIn>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span className="text-sm">{user?.firstName} {user?.lastName}</span>
              </div>
            </SignedIn>
          </div>
          <div className="flex items-center space-x-3">
            {/* <SignedIn>
              <UserButton />
            </SignedIn> */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center text-sm bg-white bg-opacity-20 px-3 py-1 rounded-lg">
                  <User className="w-4 h-4 mr-1" />
                  Đăng nhập
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">FlexTrack</h1>
          <ClientOnly fallback={<p className="text-primary-100 text-sm">Loading...</p>}>
            <p className="text-primary-100 text-sm">{formatDate(currentTime)}</p>
          </ClientOnly>
          <ClientOnly fallback={<p className="text-white text-xl font-semibold">--:--</p>}>
            <p className="text-white text-xl font-semibold">{formatTime(currentTime)}</p>
          </ClientOnly>
        </div>
      </div>

      <SignedOut>
        {/* Landing Page for Signed Out Users */}
        <div className="px-6 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">🏋️‍♂️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Chào mừng đến với FlexTrack
            </h2>
            <p className="text-gray-600 mb-6">
              Ứng dụng theo dõi tập luyện hiệu quả dành cho những người yêu thể dục
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Ghi nhận bài tập nhanh chóng</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Theo dõi tiến độ chi tiết</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Đạt được mục tiêu fitness</span>
                </div>
              </div>
            </div>

            <SignInButton mode="modal">
              <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Bắt đầu ngay
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Quick Stats */}
        <div className="px-6 mt-8 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống kê nhanh</h2>
            <div className="grid grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="px-6 space-y-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} href={item.href}>
                <div className={`${item.bgColor} ${item.textColor} rounded-2xl p-6 shadow-lg active:scale-95 transition-transform duration-150 my-2`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm opacity-90">{item.subtitle}</p>
                    </div>
                    <Icon className="w-8 h-8 ml-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="px-6 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h2>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">{workout.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(workout.date).toLocaleDateString('vi-VN')} • {workout.duration || 0} phút
                      </p>
                    </div>
                    <div className="text-primary-600 font-semibold">
                      {workout.exercises?.length || 0} bài tập
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💪</div>
                <p>Chưa có buổi tập nào</p>
                <p className="text-sm">Hãy bắt đầu buổi tập đầu tiên!</p>
              </div>
            )}
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
