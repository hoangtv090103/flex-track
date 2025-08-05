import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { diContainer } from '@/infrastructure/di/DIContainer';

// GET /api/workouts/[id] - Get single workout
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workoutId = params.id;
    console.log('API: Getting workout:', workoutId, 'for user:', userId);

    const workoutUseCases = await diContainer.getWorkoutUseCases();
    const workout = await workoutUseCases.getWorkoutById(workoutId);

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (workout.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Serialize dates for JSON transport
    const serializedWorkout = {
      ...workout,
      date: workout.date.toISOString(),
      createdAt: workout.createdAt.toISOString(),
      updatedAt: workout.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      workout: serializedWorkout,
    });
  } catch (error) {
    console.error('API: Error getting workout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: `Failed to get workout: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// PUT /api/workouts/[id] - Update workout
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workoutId = params.id;
    const updateData = await request.json();

    console.log('API: Updating workout:', workoutId, 'for user:', userId);

    const workoutUseCases = await diContainer.getWorkoutUseCases();
    
    // First verify the workout exists and belongs to user
    const existingWorkout = await workoutUseCases.getWorkoutById(workoutId);
    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    if (existingWorkout.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Prepare update data
    const workoutUpdate: any = {};
    if (updateData.date) workoutUpdate.date = new Date(updateData.date);
    if (updateData.exercises) workoutUpdate.exercises = updateData.exercises;
    if (updateData.duration !== undefined) workoutUpdate.duration = updateData.duration;
    if (updateData.notes !== undefined) workoutUpdate.notes = updateData.notes;

    await workoutUseCases.updateWorkout(workoutId, workoutUpdate);

    console.log('API: Workout updated successfully:', workoutId);

    return NextResponse.json({
      success: true,
      message: 'Workout updated successfully',
    });
  } catch (error) {
    console.error('API: Error updating workout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: `Failed to update workout: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// DELETE /api/workouts/[id] - Delete workout
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workoutId = params.id;
    console.log('API: Deleting workout:', workoutId, 'for user:', userId);

    const workoutUseCases = await diContainer.getWorkoutUseCases();
    
    // First verify the workout exists and belongs to user
    const existingWorkout = await workoutUseCases.getWorkoutById(workoutId);
    if (!existingWorkout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    if (existingWorkout.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await workoutUseCases.deleteWorkout(workoutId);

    console.log('API: Workout deleted successfully:', workoutId);

    return NextResponse.json({
      success: true,
      message: 'Workout deleted successfully',
    });
  } catch (error) {
    console.error('API: Error deleting workout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: `Failed to delete workout: ${errorMessage}` },
      { status: 500 }
    );
  }
}
