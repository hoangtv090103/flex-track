import { SupabaseWorkoutRepository } from '@/infrastructure/repositories/SupabaseWorkoutRepository';
import { LocalStorageWorkoutRepository } from '@/infrastructure/repositories/LocalStorageWorkoutRepository';
import { WorkoutUseCases } from '@/domain/usecases/WorkoutUseCases';
import { IWorkoutRepository } from '@/domain/repositories/IWorkoutRepository';

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
