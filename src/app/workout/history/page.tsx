'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Dumbbell } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { clientWorkoutService } from '@/services/clientWorkoutService';

interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Workout {
  id: string;
  date: Date;
  exercises: Exercise[];
  duration?: number;
  notes?: string;
}

export default function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true);
        
        // Check authentication
        if (!isSignedIn || !user) {
          // User not authenticated, show empty state
          setWorkouts([]);
          setLoading(false);
          return;
        }

        // Load workouts using API route
        const response = await fetch('/api/workouts/history');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        const userWorkouts = result.workouts || [];
        
        // Convert date strings back to Date objects
        const parsedWorkouts = userWorkouts.map((workout: any) => ({
          ...workout,
          date: new Date(workout.date),
          createdAt: new Date(workout.createdAt),
          updatedAt: new Date(workout.updatedAt)
        }));
        
        setWorkouts(parsedWorkouts);
        
      } catch (error) {
        console.error('Error loading workouts:', error);
        // Fallback to localStorage for demo purposes
        try {
          const savedWorkouts = JSON.parse(localStorage.getItem('flextrack-workouts') || '[]');
          const parsedWorkouts = savedWorkouts.map((workout: any) => ({
            ...workout,
            date: new Date(workout.date),
            createdAt: new Date(workout.createdAt),
            updatedAt: new Date(workout.updatedAt)
          }));
          setWorkouts(parsedWorkouts);
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
          setWorkouts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [user, isSignedIn]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  const getTotalSets = (workout: Workout) => {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  };

  const getTotalVolume = (workout: Workout) => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  };

  const getMaxWeight = (workout: Workout) => {
    let maxWeight = 0;
    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.weight > maxWeight) {
          maxWeight = set.weight;
        }
      });
    });
    return maxWeight;
  };

  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'week', label: 'Tuần này' },
    { key: 'month', label: 'Tháng này' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
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
          <h1 className="text-lg font-semibold">Lịch sử tập luyện</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4">
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedFilter === filter.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workouts List */}
      <div className="px-4 space-y-4">
        {!user ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🔒</div>
            <p className="mb-4">Vui lòng đăng nhập để xem lịch sử tập luyện</p>
            <Link href="/auth/signin" className="text-primary-600 font-medium">
              Đăng nhập ngay
            </Link>
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <p>Chưa có buổi tập nào</p>
            <Link href="/workout/new" className="text-primary-600 font-medium">
              Bắt đầu tập luyện ngay!
            </Link>
          </div>
        ) : (
          workouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Workout Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="font-semibold text-gray-800">{formatDate(workout.date)}</span>
                  </div>
                  {workout.duration && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{workout.duration} phút</span>
                    </div>
                  )}
                </div>
                {workout.notes && (
                  <p className="text-gray-600 text-sm">{workout.notes}</p>
                )}
              </div>

              {/* Workout Stats */}
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary-600">
                      {workout.exercises.length}
                    </div>
                    <div className="text-xs text-gray-600">Bài tập</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary-600">
                      {getTotalSets(workout)}
                    </div>
                    <div className="text-xs text-gray-600">Tổng set</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary-600">
                      {getTotalVolume(workout).toFixed(0)}kg
                    </div>
                    <div className="text-xs text-gray-600">Tổng volume</div>
                  </div>
                </div>
              </div>

              {/* Exercises List */}
              <div className="p-4 space-y-3">
                {workout.exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Dumbbell className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-800">{exercise.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {exercise.sets.length} set{exercise.sets.length > 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
