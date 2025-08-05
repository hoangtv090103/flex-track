import { currentUser } from '@clerk/nextjs/server';
import { IUserRepository } from '@/domain/repositories';
import { User } from '@/domain/entities';

export class ClerkUserRepository implements IUserRepository {
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await currentUser();
      
      if (!user) return null;

      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.firstName || user.lastName || undefined,
        avatar: user.imageUrl || undefined,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    // Clerk doesn't provide direct user lookup by ID from client
    // This would typically be handled through Clerk's backend API
    throw new Error('getUserById not implemented for Clerk - use getCurrentUser instead');
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    // User profile updates should be handled through Clerk's UI components
    // or through Clerk's backend API
    throw new Error('updateUser should be handled through Clerk UI components');
  }

  async deleteUser(id: string): Promise<void> {
    // User deletion should be handled through Clerk's backend API
    throw new Error('deleteUser should be handled through Clerk backend API');
  }
}
