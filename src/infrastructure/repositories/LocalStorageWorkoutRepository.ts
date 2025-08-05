import { Workout } from '@/domain/entities';
import { IWorkoutRepository } from '@/domain/repositories/IWorkoutRepository';

export class LocalStorageWorkoutRepository implements IWorkoutRepository {
  private readonly STORAGE_KEY = 'flextrack-workouts';

  private getWorkouts(): Workout[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      
      const workouts = JSON.parse(data);
      return workouts.map((workout: any) => ({
        ...workout,
        date: new Date(workout.date),
        createdAt: new Date(workout.createdAt),
        updatedAt: new Date(workout.updatedAt),
      }));
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private saveWorkouts(workouts: Workout[]): void {
    try {
      const serializedWorkouts = workouts.map(workout => ({
        ...workout,
        date: workout.date.toISOString(),
        createdAt: workout.createdAt.toISOString(),
        updatedAt: workout.updatedAt.toISOString(),
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializedWorkouts));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save to localStorage');
    }
  }

  async save(workout: Omit<Workout, 'id'>, userId: string): Promise<string> {
    try {
      const workouts = this.getWorkouts();
      const id = `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newWorkout: Workout = {
        ...workout,
        id,
        userId,
      };

      workouts.push(newWorkout);
      this.saveWorkouts(workouts);

      console.log('Workout saved to localStorage with ID:', id);
      return id;
    } catch (error) {
      console.error('Error saving workout to localStorage:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Workout[]> {
    try {
      const allWorkouts = this.getWorkouts();
      const userWorkouts = allWorkouts.filter(workout => workout.userId === userId);
      
      // Sort by date descending
      userWorkouts.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      console.log(`Found ${userWorkouts.length} workouts in localStorage for user ${userId}`);
      return userWorkouts;
    } catch (error) {
      console.error('Error finding workouts by userId in localStorage:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Workout | null> {
    try {
      const workouts = this.getWorkouts();
      const workout = workouts.find(w => w.id === id);
      return workout || null;
    } catch (error) {
      console.error('Error finding workout by ID in localStorage:', error);
      throw error;
    }
  }

  async update(id: string, workoutData: Partial<Workout>): Promise<void> {
    try {
      const workouts = this.getWorkouts();
      const index = workouts.findIndex(w => w.id === id);
      
      if (index === -1) {
        throw new Error('Workout not found');
      }

      // Update the workout
      workouts[index] = {
        ...workouts[index],
        ...workoutData,
        updatedAt: new Date(),
      };

      this.saveWorkouts(workouts);
      console.log('Workout updated in localStorage:', id);
    } catch (error) {
      console.error('Error updating workout in localStorage:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const workouts = this.getWorkouts();
      const filteredWorkouts = workouts.filter(w => w.id !== id);
      
      if (filteredWorkouts.length === workouts.length) {
        throw new Error('Workout not found');
      }

      this.saveWorkouts(filteredWorkouts);
      console.log('Workout deleted from localStorage:', id);
    } catch (error) {
      console.error('Error deleting workout from localStorage:', error);
      throw error;
    }
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Workout[]> {
    try {
      const userWorkouts = await this.findByUserId(userId);
      const filteredWorkouts = userWorkouts.filter(workout => 
        workout.date >= startDate && workout.date <= endDate
      );
      
      return filteredWorkouts;
    } catch (error) {
      console.error('Error finding workouts by date range in localStorage:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test localStorage availability
      const testKey = 'test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error('localStorage test failed:', error);
      return false;
    }
  }
}
