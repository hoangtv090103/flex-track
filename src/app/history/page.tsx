'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Calendar, Dumbbell, Clock, ChevronRight, Search, Filter } from 'lucide-react';

interface Workout {
  id: string;
  date: Date;
  exercises: any[];
  duration?: number;
  notes?: string;
}

export default function HistoryPage() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const filterWorkouts = useCallback(() => {
    let filtered = workouts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(workout =>
        workout.exercises.some(exercise =>
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (workout.notes && workout.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Month filter
    if (selectedMonth !== 'all') {
      const now = new Date();
      const targetDate = new Date(now.getFullYear(), parseInt(selectedMonth), 1);
      const nextMonth = new Date(now.getFullYear(), parseInt(selectedMonth) + 1, 1);
      
      filtered = filtered.filter(workout => 
        workout.date >= targetDate && workout.date < nextMonth
      );
    }

    setFilteredWorkouts(filtered);
  }, [workouts, searchTerm, selectedMonth]);

  useEffect(() => {
    filterWorkouts();
  }, [filterWorkouts]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/workouts/history');
      const data = await response.json();

      if (data.success) {
        const workoutsWithDates = data.workouts.map((workout: any) => ({
          ...workout,
          date: new Date(workout.date),
        }));
        setWorkouts(workoutsWithDates);
      } else {
        console.error('Failed to fetch workouts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getTotalSets = (exercises: any[]) => {
    return exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  };

  const getMonthOptions = () => {
    const months = [
      { value: 'all', label: 'Tất cả' },
      { value: '0', label: 'Tháng 1' },
      { value: '1', label: 'Tháng 2' },
      { value: '2', label: 'Tháng 3' },
      { value: '3', label: 'Tháng 4' },
      { value: '4', label: 'Tháng 5' },
      { value: '5', label: 'Tháng 6' },
      { value: '6', label: 'Tháng 7' },
      { value: '7', label: 'Tháng 8' },
      { value: '8', label: 'Tháng 9' },
      { value: '9', label: 'Tháng 10' },
      { value: '10', label: 'Tháng 11' },
      { value: '11', label: 'Tháng 12' },
    ];
    return months;
  };

  const groupWorkoutsByMonth = () => {
    const groups: { [key: string]: Workout[] } = {};
    
    filteredWorkouts.forEach(workout => {
      const monthKey = workout.date.toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(workout);
    });

    return groups;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem lịch sử</p>
        </div>
      </div>
    );
  }

  const groupedWorkouts = groupWorkoutsByMonth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span>Lịch sử tập luyện</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Xem lại các buổi tập đã hoàn thành
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập, ghi chú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Month Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
          >
            {getMonthOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 pb-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Đang tải...</p>
          </div>
        ) : Object.keys(groupedWorkouts).length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {workouts.length === 0 ? 'Chưa có lịch sử tập luyện' : 'Không tìm thấy kết quả'}
            </h3>
            <p className="text-gray-600 mb-4">
              {workouts.length === 0 
                ? 'Hãy bắt đầu ghi lại buổi tập đầu tiên của bạn'
                : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              }
            </p>
            {workouts.length === 0 && (
              <Link
                href="/workout/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors space-x-2"
              >
                <Dumbbell className="h-5 w-5" />
                <span>Bắt đầu tập luyện</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedWorkouts).map(([monthKey, monthWorkouts]) => (
              <div key={monthKey}>
                {/* Month Header */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">{monthKey}</h2>
                  <span className="text-sm text-gray-500">
                    {monthWorkouts.length} buổi tập
                  </span>
                </div>

                {/* Workouts List */}
                <div className="space-y-3">
                  {monthWorkouts.map((workout) => (
                    <Link key={workout.id} href={`/workouts/${workout.id}`}>
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(workout.date)}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>

                        {/* Workout Info */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Dumbbell className="h-4 w-4" />
                              <span>{workout.exercises.length} bài tập</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>{getTotalSets(workout.exercises)} sets</span>
                            </div>
                            {workout.duration && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatDuration(workout.duration)}</span>
                              </div>
                            )}
                          </div>

                          {/* Exercise List */}
                          <div className="text-sm text-gray-700">
                            {workout.exercises.slice(0, 2).map((exercise, index) => (
                              <div key={index} className="truncate">
                                {exercise.name} ({exercise.sets.length} sets)
                              </div>
                            ))}
                            {workout.exercises.length > 2 && (
                              <div className="text-gray-500">
                                +{workout.exercises.length - 2} bài tập khác
                              </div>
                            )}
                          </div>

                          {/* Notes */}
                          {workout.notes && (
                            <div className="text-sm text-gray-600 italic truncate">
                              &ldquo;{workout.notes}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
