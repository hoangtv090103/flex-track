import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { diContainer } from '@/infrastructure/di/DIContainer';

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated with Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workoutData = await request.json();
    
    console.log('API: Received workout data:', workoutData);
    console.log('API: User ID from auth:', userId);

    // Get use cases from DI container
    const workoutUseCases = await diContainer.getWorkoutUseCases();
    const repositoryType = await diContainer.getRepositoryType();
    
    console.log(`API: Using ${repositoryType} repository`);

    // Convert date strings back to Date objects
    const workoutToSave = {
      userId,
      date: new Date(workoutData.date),
      exercises: workoutData.exercises,
      duration: workoutData.duration,
      notes: workoutData.notes || '',
      createdAt: new Date(workoutData.createdAt),
      updatedAt: new Date(workoutData.updatedAt),
    };

    console.log('API: Data to save:', workoutToSave);

    // Save using clean architecture use cases
    const workoutId = await workoutUseCases.saveWorkout(workoutToSave, userId);
    
    console.log('API: Workout saved with ID:', workoutId);

    return NextResponse.json({
      success: true,
      workoutId: workoutId,
      repository: repositoryType,
    });
  } catch (error) {
    console.error('API: Error saving workout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: `Failed to save workout: ${errorMessage}` },
      { status: 500 }
    );
  }
}
