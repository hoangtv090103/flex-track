import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  Timestamp,
  doc,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';
import { Workout, Exercise } from '@/domain/entities';

const WORKOUTS_COLLECTION = 'workouts';

export const clientWorkoutService = {
  // Test Firebase connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Firebase connection...');
      // Try to get any document to test connection
      const testQuery = query(collection(db, WORKOUTS_COLLECTION), where('__test__', '==', 'test'));
      await getDocs(testQuery);
      console.log('Firebase connection successful!');
      return true;
    } catch (error) {
      console.error('Firebase connection failed:', error);
      return false;
    }
  },

  // Lưu workout mới
  async saveWorkout(workoutData: Omit<Workout, 'id'>, userId: string): Promise<string> {
    try {
      console.log('Starting saveWorkout...');
      console.log('User ID:', userId);
      console.log('Workout data:', workoutData);

      const workoutToSave = {
        ...workoutData,
        userId,
        date: Timestamp.fromDate(workoutData.date),
        createdAt: Timestamp.fromDate(workoutData.createdAt),
        updatedAt: Timestamp.fromDate(workoutData.updatedAt),
      };

      console.log('Workout to save (with Timestamps):', workoutToSave);

      const docRef = await addDoc(collection(db, WORKOUTS_COLLECTION), workoutToSave);
      console.log('Workout saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving workout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = error instanceof Error && 'code' in error ? (error as any).code : 'unknown';
      console.error('Error details:', {
        code: errorCode,
        message: errorMessage,
        error: error
      });
      throw new Error(`Không thể lưu workout: ${errorMessage}`);
    }
  },

  // Lấy tất cả workout của user
  async getUserWorkouts(userId: string): Promise<Workout[]> {
    try {
      const q = query(
        collection(db, WORKOUTS_COLLECTION),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const workouts: Workout[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        workouts.push({
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Workout);
      });
      
      return workouts;
    } catch (error) {
      console.error('Error getting workouts:', error);
      throw new Error('Không thể tải danh sách workout');
    }
  },

  // Lấy thống kê workout
  async getWorkoutStats(userId: string): Promise<any> {
    try {
      const workouts = await this.getUserWorkouts(userId);
      
      const stats = {
        totalWorkouts: workouts.length,
        totalSets: 0,
        totalReps: 0,
        totalWeight: 0,
        averageWorkoutDuration: 0,
        totalDuration: 0,
      };

      workouts.forEach(workout => {
        if (workout.duration) {
          stats.totalDuration += workout.duration;
        }
        
        workout.exercises.forEach((exercise: any) => {
          stats.totalSets += exercise.sets.length;
          exercise.sets.forEach((set: any) => {
            stats.totalReps += set.reps;
            stats.totalWeight += set.weight * set.reps;
          });
        });
      });

      if (workouts.length > 0) {
        stats.averageWorkoutDuration = stats.totalDuration / workouts.length;
      }

      return stats;
    } catch (error) {
      console.error('Error getting workout stats:', error);
      throw new Error('Không thể tải thống kê workout');
    }
  },
};
