'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Dumbbell } from 'lucide-react';
import { WorkoutEditModal } from '@/components/WorkoutEditModal';
import { getWorkoutTypeData } from '@/components/WorkoutTypeSelector';
import { WorkoutType } from '@/domain/entities';

interface Workout {
  id: string;
  date: Date;
  exercises: any[];
  duration?: number;
  notes?: string;
}

export default function WorkoutDetailPage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const workoutId = params.id as string;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchWorkout = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workouts/${workoutId}`);
      const data = await response.json();

      if (data.success) {
        setWorkout({
          ...data.workout,
          date: new Date(data.workout.date),
        });
      } else {
        console.error('Failed to fetch workout:', data.error);
        router.push('/workouts');
      }
    } catch (error) {
      console.error('Error fetching workout:', error);
      router.push('/workouts');
    } finally {
      setLoading(false);
    }
  }, [workoutId, router]);

  useEffect(() => {
    if (user && workoutId) {
      fetchWorkout();
    }
  }, [user, workoutId, fetchWorkout]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/workouts');
      } else {
        alert('Không thể xóa workout');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Có lỗi khi xóa workout');
    }
  };

  const handleSaveWorkout = async (workoutData: any) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchWorkout(); // Refresh the workout
        setShowEditModal(false);
        alert('Đã cập nhật workout');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'Chưa ghi nhận';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours} giờ ${minutes} phút` : `${minutes} phút`;
  };

  const getTotalStats = () => {
    if (!workout) return { sets: 0, reps: 0, weight: 0 };

    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;

    workout.exercises.forEach((exercise) => {
      totalSets += exercise.sets.length;
      exercise.sets.forEach((set: any) => {
        totalReps += set.reps;
        totalWeight += set.weight * set.reps;
      });
    });

    return { sets: totalSets, reps: totalReps, weight: totalWeight };
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem workout</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy workout</p>
        </div>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Chi tiết workout
                </h1>
                <p className="text-sm text-gray-600">
                  {formatDate(workout.date)}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Stats Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tổng quan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{workout.exercises.length}</div>
              <div className="text-sm text-gray-600">Bài tập</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.sets}</div>
              <div className="text-sm text-gray-600">Sets</div>
            </div>
            
            {(() => {
              const totalVolume = workout.exercises.reduce((sum, ex) => 
                sum + ex.sets.reduce((setSum: number, set: any) => 
                  setSum + ((set.reps || 0) * (set.weight || 0)), 0
                ), 0
              );
              
              const totalDistance = workout.exercises.reduce((sum, ex) => 
                sum + ex.sets.reduce((setSum: number, set: any) => 
                  setSum + (set.distance || 0), 0
                ), 0
              );

              const totalDuration = workout.exercises.reduce((sum, ex) => 
                sum + ex.sets.reduce((setSum: number, set: any) => 
                  setSum + (set.duration || 0), 0
                ), 0
              );

              if (totalVolume > 0) {
                return (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.reps}</div>
                      <div className="text-sm text-gray-600">Reps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{totalVolume.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">kg tổng</div>
                    </div>
                  </>
                );
              } else if (totalDistance > 0) {
                return (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {totalDistance >= 1000 ? `${(totalDistance / 1000).toFixed(1)}` : totalDistance}
                      </div>
                      <div className="text-sm text-gray-600">
                        {totalDistance >= 1000 ? 'km' : 'm'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm text-gray-600">phút</div>
                    </div>
                  </>
                );
              } else if (totalDuration > 0) {
                return (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm text-gray-600">phút</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">✓</div>
                      <div className="text-sm text-gray-600">Hoàn thành</div>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.reps}</div>
                      <div className="text-sm text-gray-600">Reps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.weight.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">kg tổng</div>
                    </div>
                  </>
                );
              }
            })()}
          </div>

          {/* Workout Types Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Loại bài tập</h3>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const typeCount = workout.exercises.reduce((acc: Record<string, number>, exercise) => {
                  const type = exercise.type || 'strength';
                  acc[type] = (acc[type] || 0) + 1;
                  return acc;
                }, {});

                return Object.entries(typeCount).map(([type, count]) => {
                  const typeData = getWorkoutTypeData(type as WorkoutType);
                  const TypeIcon = typeData.icon;
                  
                  return (
                    <div key={type} className="flex items-center space-x-1.5 bg-gray-50 rounded-full px-3 py-1.5">
                      <div className={`p-1 rounded ${typeData.color}`}>
                        <TypeIcon className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{typeData.name}</span>
                      <span className="text-xs text-gray-500">({count})</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Thời gian:</span>
              </div>
              <span className="font-medium">{formatDuration(workout.duration)}</span>
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-3">
          {workout.exercises.map((exercise, index) => {
            const typeData = getWorkoutTypeData(exercise.type || 'strength');
            const TypeIcon = typeData.icon;
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <div className={`p-1.5 rounded ${typeData.color}`}>
                    <TypeIcon className="h-4 w-4 text-white" />
                  </div>
                  <span>{exercise.name}</span>
                  <span className="text-sm font-normal text-gray-500">({typeData.name})</span>
                </h3>

                <div className="space-y-2">
                  {/* Headers based on workout type */}
                  <div className="grid gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {typeData.fields.reps && typeData.fields.weight ? (
                      <div className="grid grid-cols-4 gap-2">
                        <div>Set</div>
                        <div className="text-center">Reps</div>
                        <div className="text-center">Weight</div>
                        <div className="text-center">Volume</div>
                      </div>
                    ) : typeData.fields.duration && typeData.fields.distance ? (
                      <div className="grid grid-cols-4 gap-2">
                        <div>Set</div>
                        <div className="text-center">Thời gian</div>
                        <div className="text-center">Khoảng cách</div>
                        <div className="text-center">Cường độ</div>
                      </div>
                    ) : typeData.fields.duration ? (
                      <div className="grid grid-cols-3 gap-2">
                        <div>Set</div>
                        <div className="text-center">Thời gian</div>
                        <div className="text-center">Cường độ</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        <div>Set</div>
                        <div className="text-center">Reps</div>
                        <div className="text-center">Weight</div>
                        <div className="text-center">Volume</div>
                      </div>
                    )}
                  </div>

                  {exercise.sets.map((set: any, setIndex: number) => (
                    <div key={setIndex}>
                      {typeData.fields.reps && typeData.fields.weight ? (
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="text-gray-600">{setIndex + 1}</div>
                          <div className="text-center font-medium">{set.reps || 0}</div>
                          <div className="text-center font-medium">{set.weight || 0} kg</div>
                          <div className="text-center text-blue-600 font-medium">
                            {((set.reps || 0) * (set.weight || 0)).toFixed(1)} kg
                          </div>
                        </div>
                      ) : typeData.fields.duration && typeData.fields.distance ? (
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="text-gray-600">{setIndex + 1}</div>
                          <div className="text-center font-medium">
                            {set.duration ? `${Math.floor(set.duration / 60)}:${(set.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                          </div>
                          <div className="text-center font-medium">
                            {set.distance ? (set.distance >= 1000 ? `${(set.distance / 1000).toFixed(1)}km` : `${set.distance}m`) : '0m'}
                          </div>
                          <div className="text-center font-medium">
                            {set.intensity === 'low' ? 'Thấp' : set.intensity === 'medium' ? 'TB' : 'Cao'}
                          </div>
                        </div>
                      ) : typeData.fields.duration ? (
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-gray-600">{setIndex + 1}</div>
                          <div className="text-center font-medium">
                            {set.duration ? `${Math.floor(set.duration / 60)}:${(set.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                          </div>
                          <div className="text-center font-medium">
                            {set.intensity ? (set.intensity === 'low' ? 'Thấp' : set.intensity === 'medium' ? 'TB' : 'Cao') : '-'}
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="text-gray-600">{setIndex + 1}</div>
                          <div className="text-center font-medium">{set.reps || 0}</div>
                          <div className="text-center font-medium">{set.weight || 0} kg</div>
                          <div className="text-center text-blue-600 font-medium">
                            {((set.reps || 0) * (set.weight || 0)).toFixed(1)} kg
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Exercise Summary */}
                  <div className="pt-2 border-t border-gray-100">
                    {typeData.fields.reps && typeData.fields.weight ? (
                      <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-700">
                        <div>Tổng</div>
                        <div className="text-center">
                          {exercise.sets.reduce((sum: number, set: any) => sum + (set.reps || 0), 0)}
                        </div>
                        <div className="text-center">
                          {exercise.sets.length} sets
                        </div>
                        <div className="text-center text-blue-600">
                          {exercise.sets.reduce((sum: number, set: any) => sum + ((set.reps || 0) * (set.weight || 0)), 0).toFixed(1)} kg
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-gray-700 text-center">
                        {exercise.sets.length} sets hoàn thành
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        {workout.notes && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Ghi chú</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {workout.notes}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <WorkoutEditModal
        workoutId={workout.id}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveWorkout}
        initialData={{
          date: workout.date,
          exercises: workout.exercises,
          duration: workout.duration,
          notes: workout.notes,
        }}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa workout này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
