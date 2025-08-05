'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { WorkoutCard } from '@/components/WorkoutCard';
import { WorkoutEditModal } from '@/components/WorkoutEditModal';
import { Plus, Search, Filter, Calendar, Dumbbell } from 'lucide-react';

interface Workout {
  id: string;
  date: Date;
  exercises: any[];
  duration?: number;
  notes?: string;
}

export default function WorkoutsPage() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

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

  const handleCreateWorkout = () => {
    setEditingWorkout(null);
    setShowEditModal(true);
  };

  const handleEditWorkout = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`);
      const data = await response.json();

      if (data.success) {
        const workout = {
          ...data.workout,
          date: new Date(data.workout.date),
        };
        setEditingWorkout(workout);
        setShowEditModal(true);
      } else {
        alert('Không thể tải workout để chỉnh sửa');
      }
    } catch (error) {
      console.error('Error fetching workout for edit:', error);
      alert('Có lỗi khi tải workout');
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setWorkouts(prev => prev.filter(w => w.id !== workoutId));
        alert('Đã xóa workout thành công');
      } else {
        alert('Không thể xóa workout');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Có lỗi khi xóa workout');
    }
  };

  const handleViewWorkout = (workoutId: string) => {
    // Navigate to workout detail page
    window.location.href = `/workouts/${workoutId}`;
  };

  const handleSaveWorkout = async (workoutData: any) => {
    try {
      let response;

      if (editingWorkout) {
        // Update existing workout
        response = await fetch(`/api/workouts/${editingWorkout.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workoutData),
        });
      } else {
        // Create new workout
        response = await fetch('/api/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workoutData),
        });
      }

      const data = await response.json();

      if (data.success) {
        await fetchWorkouts(); // Refresh the list
        setShowEditModal(false);
        setEditingWorkout(null);
        alert(editingWorkout ? 'Đã cập nhật workout' : 'Đã tạo workout mới');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  };

  const getFilteredWorkouts = () => {
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

    // Date filter
    const now = new Date();
    switch (dateFilter) {
      case 'week':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        filtered = filtered.filter(workout => workout.date >= oneWeekAgo);
        break;
      case 'month':
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        filtered = filtered.filter(workout => workout.date >= oneMonthAgo);
        break;
      case 'year':
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        filtered = filtered.filter(workout => workout.date >= oneYearAgo);
        break;
    }

    return filtered;
  };

  const filteredWorkouts = getFilteredWorkouts();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem workouts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Dumbbell className="h-6 w-6 text-blue-600" />
              <span>Workouts của tôi</span>
            </h1>
            <button
              onClick={handleCreateWorkout}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài tập, ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
                <option value="year">1 năm qua</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Đang tải...</p>
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {workouts.length === 0 ? 'Chưa có workout nào' : 'Không tìm thấy workout'}
            </h3>
            <p className="text-gray-600 mb-4">
              {workouts.length === 0 
                ? 'Hãy bắt đầu ghi lại buổi tập đầu tiên của bạn'
                : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              }
            </p>
            {workouts.length === 0 && (
              <button
                onClick={handleCreateWorkout}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Thêm workout đầu tiên</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''}
                {searchTerm || dateFilter !== 'all' ? ' (đã lọc)' : ''}
              </p>
            </div>

            <div className="space-y-3">
              {filteredWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onEdit={handleEditWorkout}
                  onDelete={handleDeleteWorkout}
                  onView={handleViewWorkout}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <WorkoutEditModal
        workoutId={editingWorkout?.id}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingWorkout(null);
        }}
        onSave={handleSaveWorkout}
        initialData={editingWorkout ? {
          date: editingWorkout.date,
          exercises: editingWorkout.exercises,
          duration: editingWorkout.duration,
          notes: editingWorkout.notes,
        } : undefined}
      />
    </div>
  );
}
