import { supabase, Database } from '@/lib/supabase';
import { Workout } from '@/domain/entities';
import { IWorkoutRepository } from '@/domain/repositories/IWorkoutRepository';

type WorkoutRow = Database['public']['Tables']['workouts']['Row'];
type WorkoutInsert = Database['public']['Tables']['workouts']['Insert'];

export class SupabaseWorkoutRepository implements IWorkoutRepository {
  async save(workout: Omit<Workout, 'id'>, userId: string): Promise<string> {
    try {
      const workoutData: WorkoutInsert = {
        user_id: userId,
        date: workout.date.toISOString(),
        exercises: workout.exercises,
        duration: workout.duration,
        notes: workout.notes || '',
      };

      const { data, error } = await supabase
        .from('workouts')
        .insert(workoutData)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase save error:', error);
        throw new Error(`Failed to save workout: ${error.message}`);
      }

      console.log('Workout saved to Supabase with ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error saving workout to Supabase:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Workout[]> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase findByUserId error:', error);
        throw new Error(`Failed to fetch workouts: ${error.message}`);
      }

      const workouts: Workout[] = data.map((row: WorkoutRow) => ({
        id: row.id,
        userId: row.user_id,
        date: new Date(row.date),
        exercises: row.exercises as any[],
        duration: row.duration || undefined,
        notes: row.notes || undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));

      console.log(`Fetched ${workouts.length} workouts from Supabase for user ${userId}`);
      return workouts;
    } catch (error) {
      console.error('Error fetching workouts from Supabase:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Workout | null> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        console.error('Supabase findById error:', error);
        throw new Error(`Failed to fetch workout: ${error.message}`);
      }

      const workout: Workout = {
        id: data.id,
        userId: data.user_id,
        date: new Date(data.date),
        exercises: data.exercises as any[],
        duration: data.duration || undefined,
        notes: data.notes || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      return workout;
    } catch (error) {
      console.error('Error fetching workout by ID from Supabase:', error);
      throw error;
    }
  }

  async update(id: string, workout: Partial<Workout>): Promise<void> {
    try {
      const updateData: Partial<WorkoutInsert> = {};
      
      if (workout.date) updateData.date = workout.date.toISOString();
      if (workout.exercises) updateData.exercises = workout.exercises;
      if (workout.duration !== undefined) updateData.duration = workout.duration;
      if (workout.notes !== undefined) updateData.notes = workout.notes;

      const { error } = await supabase
        .from('workouts')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Failed to update workout: ${error.message}`);
      }

      console.log('Workout updated in Supabase:', id);
    } catch (error) {
      console.error('Error updating workout in Supabase:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(`Failed to delete workout: ${error.message}`);
      }

      console.log('Workout deleted from Supabase:', id);
    } catch (error) {
      console.error('Error deleting workout from Supabase:', error);
      throw error;
    }
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Workout[]> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase findByUserIdAndDateRange error:', error);
        throw new Error(`Failed to fetch workouts: ${error.message}`);
      }

      const workouts: Workout[] = data.map((row: WorkoutRow) => ({
        id: row.id,
        userId: row.user_id,
        date: new Date(row.date),
        exercises: row.exercises as any[],
        duration: row.duration || undefined,
        notes: row.notes || undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));

      return workouts;
    } catch (error) {
      console.error('Error fetching workouts by date range from Supabase:', error);
      throw error;
    }
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workouts')
        .select('count')
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase connection test failed:', error);
        return false;
      }

      console.log('Supabase connection test successful');
      return true;
    } catch (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
  }
}
