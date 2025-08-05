import React from 'react';
import { Dumbbell, Heart, Zap, Flower2, Trophy, MoreHorizontal } from 'lucide-react';
import { WorkoutType } from '@/domain/entities';

interface WorkoutTypeData {
  id: WorkoutType;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  fields: {
    reps?: boolean;
    weight?: boolean;
    duration?: boolean;
    distance?: boolean;
    intensity?: boolean;
    restTime?: boolean;
  };
}

export const workoutTypes: WorkoutTypeData[] = [
  {
    id: 'strength',
    name: 'Tập tạ',
    description: 'Nâng tạ, bodyweight, cơ bắp',
    icon: Dumbbell,
    color: 'bg-blue-500',
    fields: {
      reps: true,
      weight: true,
      restTime: true,
    },
  },
  {
    id: 'cardio',
    name: 'Cardio',
    description: 'Chạy, đạp xe, bơi lội',
    icon: Heart,
    color: 'bg-red-500',
    fields: {
      duration: true,
      distance: true,
      intensity: true,
    },
  },
  {
    id: 'hiit',
    name: 'HIIT',
    description: 'High Intensity Interval Training',
    icon: Zap,
    color: 'bg-orange-500',
    fields: {
      duration: true,
      intensity: true,
      restTime: true,
    },
  },
  {
    id: 'flexibility',
    name: 'Dẻo dai',
    description: 'Yoga, stretching, pilates',
    icon: Flower2,
    color: 'bg-green-500',
    fields: {
      duration: true,
    },
  },
  {
    id: 'sports',
    name: 'Thể thao',
    description: 'Bóng đá, bóng rổ, tennis',
    icon: Trophy,
    color: 'bg-purple-500',
    fields: {
      duration: true,
      intensity: true,
    },
  },
  {
    id: 'other',
    name: 'Khác',
    description: 'Các loại khác',
    icon: MoreHorizontal,
    color: 'bg-gray-500',
    fields: {
      reps: true,
      weight: true,
      duration: true,
      distance: true,
      intensity: true,
      restTime: true,
    },
  },
];

interface WorkoutTypeSelectorProps {
  selectedType: WorkoutType;
  onTypeChange: (type: WorkoutType) => void;
  className?: string;
}

export const WorkoutTypeSelector: React.FC<WorkoutTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Loại bài tập
      </label>
      <div className="grid grid-cols-2 gap-3">
        {workoutTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onTypeChange(type.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className={`p-1.5 rounded ${type.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-sm text-gray-900">
                  {type.name}
                </span>
              </div>
              <p className="text-xs text-gray-600 text-left">
                {type.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const getWorkoutTypeData = (type: WorkoutType): WorkoutTypeData => {
  return workoutTypes.find(t => t.id === type) || workoutTypes[0];
};
