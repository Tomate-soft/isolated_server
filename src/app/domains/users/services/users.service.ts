import { Injectable } from '@nestjs/common';
import { Integrations } from '../integrations/integrations';

@Injectable()
export class UsersService {
  constructor(private readonly integrations: Integrations) {}

  async changeUserPassword(userId: string, newPassword: number) {
    return this.integrations.changeUserPassword(userId, newPassword);
  }
}
