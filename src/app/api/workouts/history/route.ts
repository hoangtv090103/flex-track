import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { diContainer } from '@/infrastructure/di/DIContainer';

// Force this route to be treated as dynamic and not statically exported
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify the user is authenticated with Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('API: Getting workouts for user:', userId);

    // Get use cases from DI container
    const workoutUseCases = await diContainer.getWorkoutUseCases();
    const repositoryType = await diContainer.getRepositoryType();
    
    console.log(`API: Using ${repositoryType} repository`);

    // Get workouts using clean architecture use cases
    const workouts = await workoutUseCases.getUserWorkouts(userId);
    
    // Convert Date objects to strings for JSON transport
    const serializedWorkouts = workouts.map(workout => ({
      ...workout,
      date: workout.date.toISOString(),
      createdAt: workout.createdAt.toISOString(),
      updatedAt: workout.updatedAt.toISOString(),
    }));
    
    console.log('API: Found workouts:', serializedWorkouts.length);

    return NextResponse.json({
      success: true,
      workouts: serializedWorkouts,
      repository: repositoryType,
    });
  } catch (error) {
    console.error('API: Error getting workouts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: `Failed to get workouts: ${errorMessage}` },
      { status: 500 }
    );
  }
}
