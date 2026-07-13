import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class WriteUsersService {
  constructor(private readonly userService: UsersService) {}

  async changeUserPassword(userId: string, newPassword: number) {
    return this.userService.changeUserPassword(userId, newPassword);
  }
}
