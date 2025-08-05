import { User } from '@/domain/entities';
import { IGetCurrentUserUseCase, IUpdateUserProfileUseCase } from '@/domain/usecases';

export class UserService {
  constructor(
    private getCurrentUserUseCase: IGetCurrentUserUseCase,
    private updateUserProfileUseCase: IUpdateUserProfileUseCase
  ) {}

  async getCurrentUser(): Promise<User | null> {
    return await this.getCurrentUserUseCase.execute();
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return await this.updateUserProfileUseCase.execute(data);
  }
}
