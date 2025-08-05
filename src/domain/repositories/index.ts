import { User, Workout, WorkoutStats, ProgressData } from '../entities';

// Domain Repository Interfaces - Define contracts for data access
export interface IUserRepository {
  getCurrentUser(): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export interface IWorkoutRepository {
  // CRUD operations
  create(workout: Omit<Workout, 'id'>): Promise<string>;
  getById(id: string): Promise<Workout | null>;
  getByUserId(userId: string): Promise<Workout[]>;
  update(id: string, data: Partial<Workout>): Promise<void>;
  delete(id: string): Promise<void>;
  
  // Query operations
  getByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]>;
  getRecent(userId: string, limit: number): Promise<Workout[]>;
  
  // Stats operations
  getStats(userId: string): Promise<WorkoutStats>;
  getProgressData(userId: string, exercise: string): Promise<ProgressData[]>;
}

export interface IAuthRepository {
  getCurrentUserId(): string | null;
  signOut(): Promise<void>;
  isAuthenticated(): boolean;
}
