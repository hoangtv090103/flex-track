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
  deleteDoc,
  getDoc,
  limit 
} from 'firebase/firestore';
import { IWorkoutRepository } from '@/domain/repositories';
import { Workout, WorkoutStats, ProgressData } from '@/domain/entities';

const WORKOUTS_COLLECTION = 'workouts';

export class FirebaseWorkoutRepository implements IWorkoutRepository {
  async create(workoutData: Omit<Workout, 'id'>): Promise<string> {
    try {
      const workoutToSave = {
        ...workoutData,
        date: Timestamp.fromDate(workoutData.date),
        createdAt: Timestamp.fromDate(workoutData.createdAt),
        updatedAt: Timestamp.fromDate(workoutData.updatedAt),
      };

      const docRef = await addDoc(collection(db, WORKOUTS_COLLECTION), workoutToSave);
      console.log('Workout saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw new Error('Không thể lưu workout');
    }
  }

  async getById(id: string): Promise<Workout | null> {
    try {
      const docRef = doc(db, WORKOUTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Workout;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting workout by ID:', error);
      throw new Error('Không thể tải workout');
    }
  }

  async getByUserId(userId: string): Promise<Workout[]> {
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
      console.error('Error getting workouts by user ID:', error);
      throw new Error('Không thể tải danh sách workout');
    }
  }

  async update(id: string, updateData: Partial<Workout>): Promise<void> {
    try {
      const workoutRef = doc(db, WORKOUTS_COLLECTION, id);
      const dataToUpdate: any = {
        ...updateData,
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      if (updateData.date) {
        dataToUpdate.date = Timestamp.fromDate(updateData.date);
      }
      
      await updateDoc(workoutRef, dataToUpdate);
      console.log('Workout updated successfully');
    } catch (error) {
      console.error('Error updating workout:', error);
      throw new Error('Không thể cập nhật workout');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, WORKOUTS_COLLECTION, id));
      console.log('Workout deleted successfully');
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw new Error('Không thể xóa workout');
    }
  }

  async getByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]> {
    try {
      const q = query(
        collection(db, WORKOUTS_COLLECTION),
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
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
      console.error('Error getting workouts by date range:', error);
      throw new Error('Không thể tải workout theo khoảng thời gian');
    }
  }

  async getRecent(userId: string, limitCount: number): Promise<Workout[]> {
    try {
      const q = query(
        collection(db, WORKOUTS_COLLECTION),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
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
      console.error('Error getting recent workouts:', error);
      throw new Error('Không thể tải workout gần đây');
    }
  }

  async getStats(userId: string): Promise<WorkoutStats> {
    try {
      const workouts = await this.getByUserId(userId);
      
      const stats: WorkoutStats = {
        totalWorkouts: workouts.length,
        totalSets: 0,
        totalReps: 0,
        totalWeight: 0,
        averageWorkoutDuration: 0,
        thisWeekWorkouts: 0,
        maxWeight: 0,
      };

      let totalDuration = 0;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      workouts.forEach(workout => {
        // Duration stats
        if (workout.duration) {
          totalDuration += workout.duration;
        }

        // Weekly stats
        if (workout.date >= oneWeekAgo) {
          stats.thisWeekWorkouts++;
        }
        
        // Exercise stats
        workout.exercises.forEach(exercise => {
          stats.totalSets += exercise.sets.length;
          exercise.sets.forEach(set => {
            stats.totalReps += set.reps || 0;
            stats.totalWeight += (set.weight || 0) * (set.reps || 0);
            
            // Max weight
            if ((set.weight || 0) > stats.maxWeight) {
              stats.maxWeight = set.weight || 0;
            }
          });
        });
      });

      if (workouts.length > 0) {
        stats.averageWorkoutDuration = totalDuration / workouts.length;
      }

      return stats;
    } catch (error) {
      console.error('Error getting workout stats:', error);
      throw new Error('Không thể tải thống kê workout');
    }
  }

  async getProgressData(userId: string, exercise: string): Promise<ProgressData[]> {
    try {
      const workouts = await this.getByUserId(userId);
      const progressData: ProgressData[] = [];

      workouts.forEach(workout => {
        const targetExercise = workout.exercises.find(ex => 
          ex.name.toLowerCase().includes(exercise.toLowerCase())
        );

        if (targetExercise && targetExercise.sets.length > 0) {
          // Get max weight and reps for this workout
          const maxWeight = Math.max(...targetExercise.sets.map(set => set.weight));
          const maxReps = Math.max(...targetExercise.sets.map(set => set.reps));

          progressData.push({
            date: workout.date,
            weight: maxWeight,
            reps: maxReps,
            exercise: targetExercise.name,
          });
        }
      });

      // Sort by date ascending for progress visualization
      return progressData.sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (error) {
      console.error('Error getting progress data:', error);
      throw new Error('Không thể tải dữ liệu tiến độ');
    }
  }
}
