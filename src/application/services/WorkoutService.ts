import { Workout, WorkoutStats, ProgressData } from '@/domain/entities';
import {
  ICreateWorkoutUseCase,
  IGetUserWorkoutsUseCase,
  IGetWorkoutStatsUseCase,
  IUpdateWorkoutUseCase,
  IDeleteWorkoutUseCase,
  IGetProgressDataUseCase
} from '@/domain/usecases';

export class WorkoutService {
  constructor(
    private createWorkoutUseCase: ICreateWorkoutUseCase,
    private getUserWorkoutsUseCase: IGetUserWorkoutsUseCase,
    private getWorkoutStatsUseCase: IGetWorkoutStatsUseCase,
    private updateWorkoutUseCase: IUpdateWorkoutUseCase,
    private deleteWorkoutUseCase: IDeleteWorkoutUseCase,
    private getProgressDataUseCase: IGetProgressDataUseCase
  ) {}

  async createWorkout(workoutData: Omit<Workout, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return await this.createWorkoutUseCase.execute(workoutData);
  }

  async getUserWorkouts(userId?: string): Promise<Workout[]> {
    return await this.getUserWorkoutsUseCase.execute(userId);
  }

  async getWorkoutStats(userId?: string): Promise<WorkoutStats> {
    return await this.getWorkoutStatsUseCase.execute(userId);
  }

  async updateWorkout(workoutId: string, data: Partial<Workout>): Promise<void> {
    return await this.updateWorkoutUseCase.execute(workoutId, data);
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    return await this.deleteWorkoutUseCase.execute(workoutId);
  }

  async getProgressData(exercise: string, userId?: string): Promise<ProgressData[]> {
    return await this.getProgressDataUseCase.execute(exercise, userId);
  }

  async getRecentWorkouts(userId?: string, limit: number = 3): Promise<Workout[]> {
    const allWorkouts = await this.getUserWorkouts(userId);
    return allWorkouts.slice(0, limit);
  }
}
