'use client';

import { useState } from 'react';
import { clientWorkoutService } from '@/services/clientWorkoutService';
import { useAuth, useUser } from '@clerk/nextjs';

export default function TestFirebasePage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing Firebase connection...\n');
    
    try {
      const result = await clientWorkoutService.testConnection();
      setTestResult(prev => prev + `Connection test: ${result ? 'SUCCESS' : 'FAILED'}\n`);
    } catch (error) {
      setTestResult(prev => prev + `Connection test failed: ${error}\n`);
    }
    
    setLoading(false);
  };

  const testSaveWorkout = async () => {
    if (!isSignedIn || !user) {
      setTestResult(prev => prev + 'User not authenticated\n');
      return;
    }

    setLoading(true);
    setTestResult(prev => prev + 'Testing save workout...\n');
    
    try {
      const testWorkout = {
        userId: user.id,
        date: new Date(),
        exercises: [
          {
            id: 'test-1',
            name: 'Test Exercise',
            sets: [
              {
                id: 'set-1',
                reps: 10,
                weight: 50,
                completed: true,
              },
            ],
            notes: '',
          },
        ],
        duration: 30,
        notes: 'Test workout',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const workoutId = await clientWorkoutService.saveWorkout(testWorkout, user.id);
      setTestResult(prev => prev + `Save test: SUCCESS - ID: ${workoutId}\n`);
    } catch (error) {
      setTestResult(prev => prev + `Save test failed: ${error}\n`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-bold">Firebase Test</h1>
        
        <div className="mb-4 space-y-2">
          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Test Connection
          </button>
          
          <button
            onClick={testSaveWorkout}
            disabled={loading || !isSignedIn}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Test Save Workout
          </button>
        </div>

        <div className="rounded-lg bg-white p-4">
          <h2 className="mb-2 font-semibold">Test Results:</h2>
          <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
        </div>

        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <h3 className="mb-2 font-semibold">Auth Status:</h3>
          <p>Signed In: {isSignedIn ? 'Yes' : 'No'}</p>
          <p>User ID: {user?.id || 'None'}</p>
        </div>
      </div>
    </div>
  );
}
