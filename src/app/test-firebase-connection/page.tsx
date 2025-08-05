'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function TestFirebaseConnection() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing Firebase connection...\n');

    try {
      // Test 1: Try to read a document (this should work even without auth)
      setStatus(prev => prev + 'Test 1: Reading test document...\n');
      const testDocRef = doc(db, 'test', 'connection');
      const testDoc = await getDoc(testDocRef);
      setStatus(prev => prev + `- Read test: ${testDoc.exists() ? 'Document exists' : 'Document does not exist'}\n`);

      // Test 2: Try to write a document (this might fail due to security rules)
      setStatus(prev => prev + 'Test 2: Writing test document...\n');
      try {
        await setDoc(testDocRef, {
          timestamp: new Date(),
          test: true,
          message: 'Hello from FlexTrack'
        });
        setStatus(prev => prev + '- Write test: SUCCESS\n');
      } catch (writeError: any) {
        setStatus(prev => prev + `- Write test: FAILED - ${writeError.code}: ${writeError.message}\n`);
      }

      // Test 3: Check project ID
      setStatus(prev => prev + `Test 3: Project Configuration\n`);
      setStatus(prev => prev + `- Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}\n`);
      setStatus(prev => prev + `- Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}\n`);

      setStatus(prev => prev + '\nConnection test completed!\n');

    } catch (error: any) {
      setStatus(prev => prev + `\nERROR: ${error.code} - ${error.message}\n`);
      console.error('Firebase test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFirestore = async () => {
    setLoading(true);
    setStatus('Attempting to initialize Firestore...\n');

    try {
      // Try to create a simple document to initialize the database
      const initDocRef = doc(db, 'init', 'setup');
      await setDoc(initDocRef, {
        initialized: true,
        timestamp: new Date(),
        version: '1.0.0'
      });
      setStatus(prev => prev + 'Firestore initialization: SUCCESS\n');
    } catch (error: any) {
      setStatus(prev => prev + `Firestore initialization failed: ${error.code} - ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Firebase Connection Test</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            onClick={resetFirestore}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Initializing...' : 'Initialize Firestore'}
          </button>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <h2 className="font-semibold mb-2">Test Results:</h2>
          <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-100 p-3 rounded overflow-auto max-h-96">
            {status || 'Click "Test Connection" to start...'}
          </pre>
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Common Issues:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Firestore database not created in Firebase Console</li>
            <li>• Wrong project ID in environment variables</li>
            <li>• Security rules blocking writes</li>
            <li>• Network/proxy issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
