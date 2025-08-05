'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

export default function TestConnectionPage() {
  const [connectionData, setConnectionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testWorkoutResult, setTestWorkoutResult] = useState<any>(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      setConnectionData(data);
    } catch (error) {
      console.error('Error testing connection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setConnectionData({ success: false, error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const testSaveWorkout = async () => {
    if (!isSignedIn || !user) {
      setTestWorkoutResult({ error: 'User not authenticated' });
      return;
    }

    try {
      const testWorkout = {
        date: new Date().toISOString(),
        exercises: [
          {
            id: 'test-exercise-1',
            name: 'Test Push-ups',
            sets: [
              { id: 'set-1', reps: 10, weight: 0, completed: true },
              { id: 'set-2', reps: 15, weight: 0, completed: true },
            ],
            notes: '',
          },
        ],
        duration: 15,
        notes: 'Test workout from connection page',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testWorkout),
      });

      const result = await response.json();
      setTestWorkoutResult(result);

      if (result.success) {
        // Refresh connection data to see updated stats
        await testConnection();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestWorkoutResult({ error: errorMessage });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Testing connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          
          {connectionData?.success ? (
            <div className="space-y-4">
              {/* Supabase Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Supabase Database</h3>
                  <p className="text-sm text-gray-600">
                    URL: {connectionData.data.supabase.url}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  connectionData.data.supabase.connected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {connectionData.data.supabase.connected ? '✅ Connected' : '❌ Disconnected'}
                </div>
              </div>

              {/* Current Repository */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Current Repository</h3>
                  <p className="text-sm text-gray-600">
                    Type: {connectionData.data.currentRepository.type}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  connectionData.data.currentRepository.connected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {connectionData.data.currentRepository.connected ? '✅ Working' : '❌ Failed'}
                </div>
              </div>

              {/* Environment */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Environment Variables</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    Supabase URL: {connectionData.data.environment.supabaseUrl ? '✅' : '❌'}
                  </div>
                  <div>
                    Supabase Key: {connectionData.data.environment.supabaseKey ? '✅' : '❌'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-800">❌ Connection test failed</p>
              {connectionData?.error && (
                <p className="text-sm text-red-600 mt-2">{connectionData.error}</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Refresh Connection Test
            </button>

            {isSignedIn && (
              <button
                onClick={testSaveWorkout}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-4"
              >
                💾 Test Save Workout
              </button>
            )}

            {!isSignedIn && (
              <p className="text-gray-600">Sign in to test workout save functionality</p>
            )}
          </div>
        </div>

        {/* Test Workout Result */}
        {testWorkoutResult && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Workout Result</h2>
            <div className={`p-4 rounded-lg ${
              testWorkoutResult.success ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(testWorkoutResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Raw Data */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Raw Connection Data</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(connectionData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
