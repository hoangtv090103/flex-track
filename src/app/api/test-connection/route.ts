import { NextRequest, NextResponse } from 'next/server';
import { diContainer } from '@/infrastructure/di/DIContainer';
import { testSupabaseConnection } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Testing database connections...');

    // Test Supabase connection directly
    const supabaseConnected = await testSupabaseConnection();
    
    // Get repository type from DI container
    const repositoryType = await diContainer.getRepositoryType();
    
    // Test the current repository through use cases
    const workoutUseCases = await diContainer.getWorkoutUseCases();
    const repositoryConnected = await workoutUseCases.testConnection();

    const result = {
      supabase: {
        connected: supabaseConnected,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'not configured',
      },
      currentRepository: {
        type: repositoryType,
        connected: repositoryConnected,
      },
      environment: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('API: Connection test results:', result);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('API: Error testing connections:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: `Connection test failed: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
