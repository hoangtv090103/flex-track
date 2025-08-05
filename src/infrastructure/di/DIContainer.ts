import { SupabaseWorkoutRepository } from '@/infrastructure/repositories/SupabaseWorkoutRepository';
import { WorkoutUseCases } from '@/domain/usecases/WorkoutUseCases';
import { IWorkoutRepository } from '@/domain/repositories/IWorkoutRepository';

// Fallback LocalStorage Repository for when Supabase is not available
class LocalStorageWorkoutRepository implements IWorkoutRepository {
  private storageKey = 'flextrack_workouts';

  async save(workout: Omit<import('@/domain/entities').Workout, 'id'>, userId: string): Promise<string> {
    const workoutId = `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullWorkout = {
      ...workout,
      id: workoutId,
    };

    const userWorkouts = await this.findByUserId(userId);
    userWorkouts.unshift(fullWorkout);

    try {
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(userWorkouts));
      console.log('LocalStorage: Workout saved with ID:', workoutId);
      return workoutId;
    } catch (error) {
      console.error('LocalStorage save error:', error);
      throw new Error('Failed to save workout to local storage');
    }
  }

  async findByUserId(userId: string): Promise<import('@/domain/entities').Workout[]> {
    try {
      const stored = localStorage.getItem(`${this.storageKey}_${userId}`);
      if (!stored) return [];

      const workouts = JSON.parse(stored).map((w: any) => ({
        ...w,
        date: new Date(w.date),
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt),
      }));

      return workouts;
    } catch (error) {
      console.error('LocalStorage findByUserId error:', error);
      return [];
    }
  }

  async findById(id: string): Promise<import('@/domain/entities').Workout | null> {
    // This is a simple implementation - in reality you'd need to search across all users
    // For now, this method is not fully implemented for localStorage
    return null;
  }

  async update(id: string, workout: Partial<import('@/domain/entities').Workout>): Promise<void> {
    // Simple implementation - would need userId to properly implement
    console.log('LocalStorage update not fully implemented');
  }

  async delete(id: string): Promise<void> {
    // Simple implementation - would need userId to properly implement
    console.log('LocalStorage delete not fully implemented');
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<import('@/domain/entities').Workout[]> {
    const workouts = await this.findByUserId(userId);
    return workouts.filter(
      workout => workout.date >= startDate && workout.date <= endDate
    );
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test localStorage availability
      const testKey = 'test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      console.log('LocalStorage connection test successful');
      return true;
    } catch (error) {
      console.error('LocalStorage connection test failed:', error);
      return false;
    }
  }
}

// Dependency Injection Container
export class DIContainer {
  private static instance: DIContainer;
  private workoutRepository: IWorkoutRepository | null = null;
  private workoutUseCases: WorkoutUseCases | null = null;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  async getWorkoutRepository(): Promise<IWorkoutRepository> {
    if (this.workoutRepository) {
      return this.workoutRepository;
    }

    // Try Supabase first
    try {
      const supabaseRepo = new SupabaseWorkoutRepository();
      const connectionTest = await supabaseRepo.testConnection();
      
      if (connectionTest) {
        console.log('DI: Using Supabase repository');
        this.workoutRepository = supabaseRepo;
        return this.workoutRepository;
      } else {
        console.warn('DI: Supabase connection failed, falling back to localStorage');
      }
    } catch (error) {
      console.error('DI: Supabase repository initialization failed:', error);
    }

    // Fallback to localStorage
    console.log('DI: Using LocalStorage repository');
    this.workoutRepository = new LocalStorageWorkoutRepository();
    return this.workoutRepository;
  }

  async getWorkoutUseCases(): Promise<WorkoutUseCases> {
    if (this.workoutUseCases) {
      return this.workoutUseCases;
    }

    const repository = await this.getWorkoutRepository();
    this.workoutUseCases = new WorkoutUseCases(repository);
    console.log('DI: WorkoutUseCases initialized');
    return this.workoutUseCases;
  }

  // Method to force re-initialization (useful for testing or switching repositories)
  reset(): void {
    this.workoutRepository = null;
    this.workoutUseCases = null;
    console.log('DI: Container reset');
  }

  // Method to check which repository is being used
  async getRepositoryType(): Promise<'supabase' | 'localStorage'> {
    const repo = await this.getWorkoutRepository();
    return repo instanceof SupabaseWorkoutRepository ? 'supabase' : 'localStorage';
  }
}

// Export singleton instance
export const diContainer = DIContainer.getInstance();
