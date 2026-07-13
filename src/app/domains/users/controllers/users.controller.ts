import { Body, Controller, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('change-password/:id')
  async changeUserPassword(@Param('id') userId: string, @Body('newPassword') newPassword: string) {
    try {
      const response = await this.usersService.changeUserPassword(userId, Number(newPassword));
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Failed to change user password');
    }
  }
}
