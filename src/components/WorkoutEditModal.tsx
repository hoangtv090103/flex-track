import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash, Calendar } from 'lucide-react';
import { WorkoutType } from '@/domain/entities';
import { WorkoutTypeSelector } from './WorkoutTypeSelector';
import { SetInput } from './SetInput';

interface Exercise {
  name: string;
  type: WorkoutType;
  sets: any[];
}

interface WorkoutEditModalProps {
  workoutId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (workoutData: any) => void;
  initialData?: {
    date: Date;
    exercises: Exercise[];
    duration?: number;
    notes?: string;
  };
}

export const WorkoutEditModal: React.FC<WorkoutEditModalProps> = ({
  workoutId,
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    exercises: [] as Exercise[],
    duration: '',
    notes: '',
  });

  const [loading, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date.toISOString().split('T')[0],
        exercises: initialData.exercises || [],
        duration: initialData.duration?.toString() || '',
        notes: initialData.notes || '',
      });
    } else {
      // Reset for new workout
      setFormData({
        date: new Date().toISOString().split('T')[0],
        exercises: [],
        duration: '',
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { 
          name: '', 
          type: 'strength' as WorkoutType,
          sets: [{ reps: 0, weight: 0 }] 
        }
      ]
    }));
  };

  const updateExercise = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const addSet = (exerciseIndex: number) => {
    const exercise = formData.exercises[exerciseIndex];
    const newSet = exercise.type === 'strength' 
      ? { reps: 0, weight: 0 }
      : exercise.type === 'cardio'
      ? { duration: 0, distance: 0, intensity: 'medium' as const }
      : exercise.type === 'hiit'
      ? { duration: 0, intensity: 'high' as const, restTime: 0 }
      : exercise.type === 'flexibility'
      ? { duration: 0 }
      : exercise.type === 'sports'
      ? { duration: 0, intensity: 'medium' as const }
      : { reps: 0, weight: 0 }; // other

    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === exerciseIndex
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      )
    }));
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set: any, j: number) =>
                j === setIndex ? { ...set, [field]: value } : set
              )
            }
          : exercise
      )
    }));
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === exerciseIndex
          ? { ...exercise, sets: exercise.sets.filter((_, j) => j !== setIndex) }
          : exercise
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.exercises.length === 0) {
      alert('Vui lòng thêm ít nhất một bài tập');
      return;
    }

    setSaving(true);
    
    try {
      const workoutData = {
        date: new Date(formData.date),
        exercises: formData.exercises.filter(ex => ex.name.trim() !== ''),
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        notes: formData.notes.trim() || undefined,
      };

      await onSave(workoutData);
      onClose();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Có lỗi khi lưu workout. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {workoutId ? 'Chỉnh sửa workout' : 'Thêm workout mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Exercises */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Bài tập
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm bài tập</span>
              </button>
            </div>

            {formData.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      placeholder="Tên bài tập"
                      value={exercise.name}
                      onChange={(e) => updateExercise(exerciseIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    
                    <WorkoutTypeSelector
                      selectedType={exercise.type}
                      onTypeChange={(type) => {
                        updateExercise(exerciseIndex, 'type', type);
                        // Reset sets when type changes
                        const newSet = type === 'strength' 
                          ? { reps: 0, weight: 0 }
                          : type === 'cardio'
                          ? { duration: 0, distance: 0, intensity: 'medium' as const }
                          : type === 'hiit'
                          ? { duration: 0, intensity: 'high' as const, restTime: 0 }
                          : type === 'flexibility'
                          ? { duration: 0 }
                          : type === 'sports'
                          ? { duration: 0, intensity: 'medium' as const }
                          : { reps: 0, weight: 0 }; // other
                        
                        updateExercise(exerciseIndex, 'sets', [newSet]);
                      }}
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeExercise(exerciseIndex)}
                    className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Sets</span>
                    <button
                      type="button"
                      onClick={() => addSet(exerciseIndex)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200"
                    >
                      + Set
                    </button>
                  </div>

                  {exercise.sets.map((set: any, setIndex: number) => (
                    <SetInput
                      key={setIndex}
                      setIndex={setIndex}
                      setData={set}
                      workoutType={exercise.type}
                      onUpdate={(field, value) => updateSet(exerciseIndex, setIndex, field, value)}
                      onRemove={() => removeSet(exerciseIndex, setIndex)}
                      canRemove={exercise.sets.length > 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian (phút)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              placeholder="Ví dụ: 45"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Cảm nhận về buổi tập..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Đang lưu...' : 'Lưu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
