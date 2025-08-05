import { IGetCurrentUserUseCase, IUpdateUserProfileUseCase } from '@/domain/usecases';
import { IUserRepository, IAuthRepository } from '@/domain/repositories';
import { User } from '@/domain/entities';

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<User | null> {
    if (!this.authRepository.isAuthenticated()) {
      return null;
    }

    return await this.userRepository.getCurrentUser();
  }
}

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(data: Partial<User>): Promise<User> {
    const userId = this.authRepository.getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to update profile');
    }

    return await this.userRepository.updateUser(userId, data);
  }
}
