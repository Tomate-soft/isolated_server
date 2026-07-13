import { Injectable } from '@nestjs/common';
import { UsersIntegrations } from './users-integrations';

@Injectable()
export class Integrations {
  constructor(private readonly usersIntegrations: UsersIntegrations) {}

  changeUserPassword(userId: string, newPassword: number) {
    return this.usersIntegrations.changeUserPassword(userId, newPassword);
  }
}
