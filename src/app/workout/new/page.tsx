'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Timer } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { clientWorkoutService } from '@/services/clientWorkoutService';
import { Exercise, Set } from '@/domain/entities';

// Local interfaces for form state
interface WorkoutExercise extends Exercise {
  // Can add additional UI-specific properties here if needed
}

interface WorkoutSet extends Set {
  // Can add additional UI-specific properties here if needed
}

export default function NewWorkoutPage() {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [startTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newExerciseName, setNewExerciseName] = useState('');
  const [showAddExercise, setShowAddExercise] = useState(false);

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // Auto-update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getDuration = () => {
    const diff = currentTime.getTime() - startTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const addExercise = () => {
    if (newExerciseName.trim()) {
      const newExercise: WorkoutExercise = {
        id: Date.now().toString(),
        name: newExerciseName,
        type: 'strength', // Default to strength workout type
        sets: [],
      };
      // Add to top of the list instead of bottom
      setExercises([newExercise, ...exercises]);
      setNewExerciseName('');
      setShowAddExercise(false);
    }
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      reps: 0,
      weight: 0,
      completed: false,
    };

    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, sets: [...ex.sets, newSet] } : ex
      )
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'reps' | 'weight',
    value: number
  ) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : ex
      )
    );
  };

  const toggleSetCompletion = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                set.id === setId ? { ...set, completed: !set.completed } : set
              ),
            }
          : ex
      )
    );
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((set) => set.id !== setId) }
          : ex
      )
    );
  };

  const saveWorkout = async () => {
    try {
      console.log('Starting to save workout...');
      
      // Check authentication
      if (!isSignedIn || !user) {
        alert('Vui lòng đăng nhập để lưu workout!');
        // Redirect to login
        window.location.href = '/sign-in';
        return;
      }

      console.log('User authenticated:', user.id);

      // Kiểm tra xem có bài tập nào không
      if (exercises.length === 0) {
        alert('Vui lòng thêm ít nhất một bài tập!');
        return;
      }

      console.log('Exercises to save:', exercises);

      // Kiểm tra xem có set nào hoàn thành không
      const hasCompletedSets = exercises.some((exercise) =>
        exercise.sets.some((set) => set.completed)
      );

      if (!hasCompletedSets) {
        const shouldSave = confirm(
          'Bạn chưa hoàn thành set nào. Vẫn muốn lưu workout này?'
        );
        if (!shouldSave) return;
      }

      const now = new Date();
      const workoutData = {
        date: now.toISOString(), // Convert to string for JSON
        exercises: exercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets.map(set => ({
            id: set.id,
            reps: set.reps,
            weight: set.weight,
            completed: set.completed,
          })),
          notes: exercise.notes || '',
        })),
        duration: Math.floor(
          (now.getTime() - startTime.getTime()) / 60000
        ),
        notes: '', // Có thể thêm field notes sau
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      console.log('Workout data to save:', workoutData);

      // Save to Firebase using API route
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Workout saved with ID:', result.workoutId);
      alert('Workout đã được lưu thành công!');

      // Reset form
      setExercises([]);

      // Redirect về trang chủ sau 1 giây
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Error saving workout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Có lỗi xảy ra khi lưu workout: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary-600 p-4 text-white">
        <Link href="/">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold">Buổi tập mới</h1>
          <div className="mt-1 flex items-center justify-center">
            <Timer className="mr-1 h-4 w-4" />
            <span className="text-sm">{getDuration()}</span>
          </div>
        </div>
        <button
          onClick={saveWorkout}
          className="rounded-lg bg-white bg-opacity-20 p-2"
        >
          <Save className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {/* Add Exercise Button */}
        {!showAddExercise ? (
          <button
            onClick={() => setShowAddExercise(true)}
            className="flex w-full items-center justify-center rounded-2xl bg-primary-600 py-4 font-semibold text-white shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Thêm bài tập
          </button>
        ) : (
          <div className="rounded-2xl bg-white p-4 shadow-lg">
            <input
              type="text"
              placeholder="Tên bài tập..."
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              className="mb-3 w-full rounded-lg border border-gray-300 p-3"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={addExercise}
                className="flex-1 rounded-lg bg-primary-600 py-2 font-medium text-white"
              >
                Thêm
              </button>
              <button
                onClick={() => {
                  setShowAddExercise(false);
                  setNewExerciseName('');
                }}
                className="flex-1 rounded-lg bg-gray-300 py-2 font-medium text-gray-700"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Exercises List */}
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="overflow-hidden rounded-2xl bg-white shadow-lg"
          >
            {/* Exercise Header */}
            <div className="flex items-center justify-between bg-gray-100 p-4">
              <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
              <button
                onClick={() => removeExercise(exercise.id)}
                className="p-1 text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            {/* Sets */}
            <div className="space-y-3 p-4">
              {exercise.sets.length === 0 ? (
                <p className="py-4 text-center text-gray-500">
                  Chưa có set nào
                </p>
              ) : (
                <>
                  {/* Sets Header */}
                  <div className="grid grid-cols-5 gap-2 border-b pb-2 text-sm font-medium text-gray-600">
                    <div>Set</div>
                    <div>Reps</div>
                    <div>Tạ (kg)</div>
                    <div>✓</div>
                    <div></div>
                  </div>

                  {exercise.sets.map((set, index) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-5 items-center gap-2"
                    >
                      <div className="font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) =>
                          updateSet(
                            exercise.id,
                            set.id,
                            'reps',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="rounded border border-gray-300 p-2 text-center"
                        placeholder="0"
                      />
                      <input
                        type="number"
                        step="0.5"
                        value={set.weight || ''}
                        onChange={(e) =>
                          updateSet(
                            exercise.id,
                            set.id,
                            'weight',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="rounded border border-gray-300 p-2 text-center"
                        placeholder="0"
                      />
                      <button
                        onClick={() => toggleSetCompletion(exercise.id, set.id)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                          set.completed
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 text-gray-400'
                        }`}
                      >
                        {set.completed && '✓'}
                      </button>
                      <button
                        onClick={() => removeSet(exercise.id, set.id)}
                        className="p-1 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}

              {/* Add Set Button */}
              <button
                onClick={() => addSet(exercise.id)}
                className="flex w-full items-center justify-center rounded-lg bg-gray-100 py-3 font-medium text-gray-600"
              >
                <Plus className="mr-1 h-4 w-4" />
                Thêm set
              </button>
            </div>
          </div>
        ))}

        {exercises.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <div className="mb-4 text-4xl">💪</div>
            <p>Thêm bài tập đầu tiên để bắt đầu!</p>
          </div>
        )}
      </div>
    </div>
  );
}
