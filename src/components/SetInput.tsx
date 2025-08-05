import React from 'react';
import { Trash } from 'lucide-react';
import { WorkoutType } from '@/domain/entities';
import { getWorkoutTypeData } from './WorkoutTypeSelector';

interface SetData {
  reps?: number;
  weight?: number;
  duration?: number; // in seconds
  distance?: number; // in meters
  restTime?: number; // in seconds
  intensity?: 'low' | 'medium' | 'high';
}

interface SetInputProps {
  setIndex: number;
  setData: SetData;
  workoutType: WorkoutType;
  onUpdate: (field: keyof SetData, value: any) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const SetInput: React.FC<SetInputProps> = ({
  setIndex,
  setData,
  workoutType,
  onUpdate,
  onRemove,
  canRemove,
}) => {
  const typeData = getWorkoutTypeData(workoutType);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${meters}m`;
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
      <span className="text-sm text-gray-500 w-8 text-center font-medium">
        {setIndex + 1}
      </span>

      {/* Reps */}
      {typeData.fields.reps && (
        <div className="flex-1">
          <input
            type="number"
            placeholder="Reps"
            value={setData.reps || ''}
            onChange={(e) => onUpdate('reps', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
            min="0"
          />
          <label className="text-xs text-gray-500 block text-center mt-1">
            Reps
          </label>
        </div>
      )}

      {/* Weight */}
      {typeData.fields.weight && (
        <div className="flex-1">
          <input
            type="number"
            placeholder="Kg"
            value={setData.weight || ''}
            onChange={(e) => onUpdate('weight', Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
            min="0"
            step="0.5"
          />
          <label className="text-xs text-gray-500 block text-center mt-1">
            Kg
          </label>
        </div>
      )}

      {/* Duration */}
      {typeData.fields.duration && (
        <div className="flex-1">
          <input
            type="number"
            placeholder="Giây"
            value={setData.duration || ''}
            onChange={(e) => onUpdate('duration', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
            min="0"
          />
          <label className="text-xs text-gray-500 block text-center mt-1">
            {setData.duration ? formatDuration(setData.duration) : 'Giây'}
          </label>
        </div>
      )}

      {/* Distance */}
      {typeData.fields.distance && (
        <div className="flex-1">
          <input
            type="number"
            placeholder="Mét"
            value={setData.distance || ''}
            onChange={(e) => onUpdate('distance', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
            min="0"
          />
          <label className="text-xs text-gray-500 block text-center mt-1">
            {setData.distance ? formatDistance(setData.distance) : 'Mét'}
          </label>
        </div>
      )}

      {/* Intensity */}
      {typeData.fields.intensity && (
        <div className="flex-1">
          <select
            value={setData.intensity || 'medium'}
            onChange={(e) => onUpdate('intensity', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
          <label className="text-xs text-gray-500 block text-center mt-1">
            Cường độ
          </label>
        </div>
      )}

      {/* Rest Time */}
      {typeData.fields.restTime && (
        <div className="flex-1">
          <input
            type="number"
            placeholder="Giây"
            value={setData.restTime || ''}
            onChange={(e) => onUpdate('restTime', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
            min="0"
          />
          <label className="text-xs text-gray-500 block text-center mt-1">
            {setData.restTime ? formatDuration(setData.restTime) : 'Nghỉ'}
          </label>
        </div>
      )}

      {/* Remove Button */}
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Xóa set"
        >
          <Trash className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
