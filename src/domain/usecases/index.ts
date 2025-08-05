import { User, Workout, WorkoutStats, ProgressData } from '../entities';
import { IUserRepository, IWorkoutRepository, IAuthRepository } from '../repositories';

// Domain Use Cases - Business logic interfaces
export interface ICreateWorkoutUseCase {
  execute(workoutData: Omit<Workout, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string>;
}

export interface IGetUserWorkoutsUseCase {
  execute(userId?: string): Promise<Workout[]>;
}

export interface IGetWorkoutStatsUseCase {
  execute(userId?: string): Promise<WorkoutStats>;
}

export interface IUpdateWorkoutUseCase {
  execute(workoutId: string, data: Partial<Workout>): Promise<void>;
}

export interface IDeleteWorkoutUseCase {
  execute(workoutId: string): Promise<void>;
}

export interface IGetProgressDataUseCase {
  execute(exercise: string, userId?: string): Promise<ProgressData[]>;
}

export interface IGetCurrentUserUseCase {
  execute(): Promise<User | null>;
}

export interface IUpdateUserProfileUseCase {
  execute(data: Partial<User>): Promise<User>;
}
