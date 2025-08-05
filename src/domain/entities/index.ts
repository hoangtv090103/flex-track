// Domain Entities - Core business objects
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  userId: string;
  date: Date;
  exercises: Exercise[];
  duration?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  totalWeight: number;
  averageWorkoutDuration: number;
  thisWeekWorkouts: number;
  maxWeight: number;
}

export interface ProgressData {
  date: Date;
  weight: number;
  reps: number;
  exercise: string;
}
