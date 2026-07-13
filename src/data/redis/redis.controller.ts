import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('keys')
  async getAllKeys() {
    const keys = await this.redisService.getAllKeys();
    return { keys };
  }
}
