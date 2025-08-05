import { currentUser } from '@clerk/nextjs/server';
import { IAuthRepository } from '@/domain/repositories';

export class ClerkAuthRepository implements IAuthRepository {
  getCurrentUserId(): string | null {
    // Note: This is for client-side use. For server-side, use currentUser()
    if (typeof window === 'undefined') {
      // Server-side - will need to be handled differently
      return null;
    }
    
    // Client-side - will use useUser hook in components
    return null;
  }

  async signOut(): Promise<void> {
    // Will be handled by Clerk components
    throw new Error('Use Clerk SignOutButton component for sign out');
  }

  isAuthenticated(): boolean {
    // Will be handled by Clerk components and hooks
    return false;
  }
}
