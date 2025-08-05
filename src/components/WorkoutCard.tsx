import React, { useState } from 'react';
import { Edit, Trash2, Calendar, Clock, Dumbbell } from 'lucide-react';
import { getWorkoutTypeData } from './WorkoutTypeSelector';

interface WorkoutCardProps {
  workout: {
    id: string;
    date: Date;
    exercises: any[];
    duration?: number;
    notes?: string;
  };
  onEdit: (workoutId: string) => void;
  onDelete: (workoutId: string) => void;
  onView: (workoutId: string) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onEdit,
  onDelete,
  onView,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const getTotalSets = () => {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(workout.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">
            {formatDate(workout.date)}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(workout.id)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Workout Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Dumbbell className="h-4 w-4" />
            <span>{workout.exercises.length} bài tập</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{getTotalSets()} sets</span>
          </div>
          {workout.duration && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(workout.duration)}</span>
            </div>
          )}
        </div>

        {/* Exercise List */}
        <div className="text-sm text-gray-700 space-y-1">
          {workout.exercises.slice(0, 3).map((exercise, index) => {
            const typeData = getWorkoutTypeData(exercise.type || 'strength');
            const TypeIcon = typeData.icon;
            
            return (
              <div key={index} className="flex items-center space-x-2">
                <div className={`p-1 rounded ${typeData.color}`}>
                  <TypeIcon className="h-3 w-3 text-white" />
                </div>
                <span className="truncate flex-1">
                  {exercise.name} ({exercise.sets.length} sets)
                </span>
              </div>
            );
          })}
          {workout.exercises.length > 3 && (
            <div className="text-gray-500 text-center pt-1">
              +{workout.exercises.length - 3} bài tập khác
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

      {/* View Button */}
      <button
        onClick={() => onView(workout.id)}
        className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-md transition-colors"
      >
        Xem chi tiết
      </button>

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
};
