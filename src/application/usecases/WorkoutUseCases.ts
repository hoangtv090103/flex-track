import { 
  ICreateWorkoutUseCase,
  IGetUserWorkoutsUseCase,
  IGetWorkoutStatsUseCase,
  IUpdateWorkoutUseCase,
  IDeleteWorkoutUseCase,
  IGetProgressDataUseCase
} from '@/domain/usecases';
import { IWorkoutRepository, IAuthRepository } from '@/domain/repositories';
import { Workout, WorkoutStats, ProgressData } from '@/domain/entities';

export class CreateWorkoutUseCase implements ICreateWorkoutUseCase {
  constructor(
    private workoutRepository: IWorkoutRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(workoutData: Omit<Workout, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const userId = this.authRepository.getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to create workout');
    }

    const now = new Date();
    const fullWorkoutData = {
      ...workoutData,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    return await this.workoutRepository.create(fullWorkoutData);
  }
}

export class GetUserWorkoutsUseCase implements IGetUserWorkoutsUseCase {
  constructor(
    private workoutRepository: IWorkoutRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(userId?: string): Promise<Workout[]> {
    const targetUserId = userId || this.authRepository.getCurrentUserId();
    if (!targetUserId) {
      throw new Error('User ID is required');
    }

    return await this.workoutRepository.getByUserId(targetUserId);
  }
}

export class GetWorkoutStatsUseCase implements IGetWorkoutStatsUseCase {
  constructor(
    private workoutRepository: IWorkoutRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(userId?: string): Promise<WorkoutStats> {
    const targetUserId = userId || this.authRepository.getCurrentUserId();
    if (!targetUserId) {
      throw new Error('User ID is required');
    }

    return await this.workoutRepository.getStats(targetUserId);
  }
}

export class UpdateWorkoutUseCase implements IUpdateWorkoutUseCase {
  constructor(
    private workoutRepository: IWorkoutRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(workoutId: string, data: Partial<Workout>): Promise<void> {
    const userId = this.authRepository.getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to update workout');
    }

    // Verify ownership
    const workout = await this.workoutRepository.getById(workoutId);
    if (!workout || workout.userId !== userId) {
      throw new Error('Workout not found or access denied');
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    await this.workoutRepository.update(workoutId, updateData);
  }
}

export class DeleteWorkoutUseCase implements IDeleteWorkoutUseCase {
  constructor(
    private workoutRepository: IWorkoutRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(workoutId: string): Promise<void> {
    const userId = this.authRepository.getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to delete workout');
    }

    // Verify ownership
    const workout = await this.workoutRepository.getById(workoutId);
    if (!workout || workout.userId !== userId) {
      throw new Error('Workout not found or access denied');
    }

    await this.workoutRepository.delete(workoutId);
  }
}

export class GetProgressDataUseCase implements IGetProgressDataUseCase {
  constructor(
    private workoutRepository: IWorkoutRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(exercise: string, userId?: string): Promise<ProgressData[]> {
    const targetUserId = userId || this.authRepository.getCurrentUserId();
    if (!targetUserId) {
      throw new Error('User ID is required');
    }

    return await this.workoutRepository.getProgressData(targetUserId, exercise);
  }
}
