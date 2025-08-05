// Infrastructure repositories
import { ClerkAuthRepository } from '@/infrastructure/repositories/ClerkAuthRepository';
import { ClerkUserRepository } from '@/infrastructure/repositories/ClerkUserRepository';
import { FirebaseWorkoutRepository } from '@/infrastructure/repositories/FirebaseWorkoutRepository';

// Application use cases
import {
  CreateWorkoutUseCase,
  GetUserWorkoutsUseCase,
  GetWorkoutStatsUseCase,
  UpdateWorkoutUseCase,
  DeleteWorkoutUseCase,
  GetProgressDataUseCase,
} from '@/application/usecases/WorkoutUseCases';

import {
  GetCurrentUserUseCase,
  UpdateUserProfileUseCase,
} from '@/application/usecases/UserUseCases';

// Application services
import { WorkoutService } from '@/application/services/WorkoutService';
import { UserService } from '@/application/services/UserService';

class DIContainer { // DI: 
  private static instance: DIContainer;

  // Repositories
  private authRepository!: ClerkAuthRepository;
  private userRepository!: ClerkUserRepository;
  private workoutRepository!: FirebaseWorkoutRepository;

  // Use Cases
  private createWorkoutUseCase!: CreateWorkoutUseCase;
  private getUserWorkoutsUseCase!: GetUserWorkoutsUseCase;
  private getWorkoutStatsUseCase!: GetWorkoutStatsUseCase;
  private updateWorkoutUseCase!: UpdateWorkoutUseCase;
  private deleteWorkoutUseCase!: DeleteWorkoutUseCase;
  private getProgressDataUseCase!: GetProgressDataUseCase;
  private getCurrentUserUseCase!: GetCurrentUserUseCase;
  private updateUserProfileUseCase!: UpdateUserProfileUseCase;

  // Services
  private workoutService!: WorkoutService;
  private userService!: UserService;

  private constructor() {
    this.initializeRepositories();
    this.initializeUseCases();
    this.initializeServices();
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeRepositories(): void {
    this.authRepository = new ClerkAuthRepository();
    this.userRepository = new ClerkUserRepository();
    this.workoutRepository = new FirebaseWorkoutRepository();
  }

  private initializeUseCases(): void {
    // Workout use cases
    this.createWorkoutUseCase = new CreateWorkoutUseCase(
      this.workoutRepository,
      this.authRepository
    );
    this.getUserWorkoutsUseCase = new GetUserWorkoutsUseCase(
      this.workoutRepository,
      this.authRepository
    );
    this.getWorkoutStatsUseCase = new GetWorkoutStatsUseCase(
      this.workoutRepository,
      this.authRepository
    );
    this.updateWorkoutUseCase = new UpdateWorkoutUseCase(
      this.workoutRepository,
      this.authRepository
    );
    this.deleteWorkoutUseCase = new DeleteWorkoutUseCase(
      this.workoutRepository,
      this.authRepository
    );
    this.getProgressDataUseCase = new GetProgressDataUseCase(
      this.workoutRepository,
      this.authRepository
    );

    // User use cases
    this.getCurrentUserUseCase = new GetCurrentUserUseCase(
      this.userRepository,
      this.authRepository
    );
    this.updateUserProfileUseCase = new UpdateUserProfileUseCase(
      this.userRepository,
      this.authRepository
    );
  }

  private initializeServices(): void {
    this.workoutService = new WorkoutService(
      this.createWorkoutUseCase,
      this.getUserWorkoutsUseCase,
      this.getWorkoutStatsUseCase,
      this.updateWorkoutUseCase,
      this.deleteWorkoutUseCase,
      this.getProgressDataUseCase
    );

    this.userService = new UserService(
      this.getCurrentUserUseCase,
      this.updateUserProfileUseCase
    );
  }

  // Public getters
  getWorkoutService(): WorkoutService {
    return this.workoutService;
  }

  getUserService(): UserService {
    return this.userService;
  }

  getAuthRepository(): ClerkAuthRepository {
    return this.authRepository;
  }

  getWorkoutRepository(): FirebaseWorkoutRepository {
    return this.workoutRepository;
  }

  getUserRepository(): ClerkUserRepository {
    return this.userRepository;
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();

// Convenience exports
export const workoutService = container.getWorkoutService();
export const userService = container.getUserService();
