import { Workout } from '@/domain/entities';
import { IWorkoutRepository } from '@/domain/repositories/IWorkoutRepository';

export class WorkoutUseCases {
  constructor(private workoutRepository: IWorkoutRepository) {}

  async saveWorkout(workoutData: Omit<Workout, 'id'>, userId: string): Promise<string> {
    try {
      // Business logic validation
      if (!workoutData.exercises || workoutData.exercises.length === 0) {
        throw new Error('Workout must have at least one exercise');
      }

      if (!userId) {
        throw new Error('User ID is required');
      }

      // Add timestamps if not present
      const now = new Date();
      const workout = {
        ...workoutData,
        createdAt: workoutData.createdAt || now,
        updatedAt: now,
      };

      const workoutId = await this.workoutRepository.save(workout, userId);
      console.log('Use case: Workout saved successfully with ID:', workoutId);
      return workoutId;
    } catch (error) {
      console.error('Use case: Error saving workout:', error);
      throw error;
    }
  }

  async getUserWorkouts(userId: string): Promise<Workout[]> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const workouts = await this.workoutRepository.findByUserId(userId);
      console.log(`Use case: Retrieved ${workouts.length} workouts for user ${userId}`);
      return workouts;
    } catch (error) {
      console.error('Use case: Error getting user workouts:', error);
      throw error;
    }
  }

  async getWorkoutById(workoutId: string): Promise<Workout | null> {
    try {
      if (!workoutId) {
        throw new Error('Workout ID is required');
      }

      const workout = await this.workoutRepository.findById(workoutId);
      return workout;
    } catch (error) {
      console.error('Use case: Error getting workout by ID:', error);
      throw error;
    }
  }

  async updateWorkout(workoutId: string, workoutData: Partial<Workout>): Promise<void> {
    try {
      if (!workoutId) {
        throw new Error('Workout ID is required');
      }

      // Add updated timestamp
      const updateData = {
        ...workoutData,
        updatedAt: new Date(),
      };

      await this.workoutRepository.update(workoutId, updateData);
      console.log('Use case: Workout updated successfully:', workoutId);
    } catch (error) {
      console.error('Use case: Error updating workout:', error);
      throw error;
    }
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      if (!workoutId) {
        throw new Error('Workout ID is required');
      }

      await this.workoutRepository.delete(workoutId);
      console.log('Use case: Workout deleted successfully:', workoutId);
    } catch (error) {
      console.error('Use case: Error deleting workout:', error);
      throw error;
    }
  }

  async getWorkoutsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Workout[]> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (startDate > endDate) {
        throw new Error('Start date must be before end date');
      }

      const workouts = await this.workoutRepository.findByUserIdAndDateRange(
        userId,
        startDate,
        endDate
      );

      console.log(`Use case: Retrieved ${workouts.length} workouts for date range`);
      return workouts;
    } catch (error) {
      console.error('Use case: Error getting workouts by date range:', error);
      throw error;
    }
  }

  async getWorkoutStats(userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const workouts = await this.getUserWorkouts(userId);
      
      const stats = {
        totalWorkouts: workouts.length,
        totalSets: 0,
        totalReps: 0,
        totalWeight: 0,
        averageWorkoutDuration: 0,
        totalDuration: 0,
        thisWeekWorkouts: 0,
        maxWeight: 0,
      };

      // Calculate this week's date
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      workouts.forEach(workout => {
        // Duration stats
        if (workout.duration) {
          stats.totalDuration += workout.duration;
        }

        // Weekly stats
        if (workout.date >= oneWeekAgo) {
          stats.thisWeekWorkouts++;
        }
        
        // Exercise stats
        workout.exercises.forEach((exercise: any) => {
          stats.totalSets += exercise.sets.length;
          exercise.sets.forEach((set: any) => {
            stats.totalReps += set.reps;
            stats.totalWeight += set.weight * set.reps;
            
            // Track max weight
            if (set.weight > stats.maxWeight) {
              stats.maxWeight = set.weight;
            }
          });
        });
      });

      // Calculate averages
      if (workouts.length > 0) {
        stats.averageWorkoutDuration = stats.totalDuration / workouts.length;
      }

      console.log('Use case: Calculated workout stats:', stats);
      return stats;
    } catch (error) {
      console.error('Use case: Error calculating workout stats:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (this.workoutRepository.testConnection) {
        return await this.workoutRepository.testConnection();
      }
      return true; // Assume connection is fine if no test method
    } catch (error) {
      console.error('Use case: Connection test failed:', error);
      return false;
    }
  }
}
