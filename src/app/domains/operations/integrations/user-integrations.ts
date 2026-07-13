import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class UserIntegrations {
  constructor(private readonly dataRepository: DataRepository) {}

  async changeUserPassword(userId: string, newPassword: number) {
    return this.dataRepository.writeUsersRepository.changePassword(userId, newPassword);
  }
}
