import { Workout } from '../entities';

export interface IWorkoutRepository {
  save(workout: Omit<Workout, 'id'>, userId: string): Promise<string>;
  findByUserId(userId: string): Promise<Workout[]>;
  findById(id: string): Promise<Workout | null>;
  update(id: string, workout: Partial<Workout>): Promise<void>;
  delete(id: string): Promise<void>;
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]>;
  testConnection?(): Promise<boolean>;
}
