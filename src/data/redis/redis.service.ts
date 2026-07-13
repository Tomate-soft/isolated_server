// src/redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: 'redis', // nombre del servicio Redis en tu docker-compose
      port: 6379,
    });

    this.client.on('connect', () => console.log('Redis conectado'));
    this.client.on('error', (err) => console.error('Redis error', err));
  }

  onModuleDestroy() {
    this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async getAllKeys(): Promise<string[]> {
    return this.client.keys('*');
  }
}
