import { Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { CounterService } from './counter.service';

@Controller('counter')
export class CounterController {
  constructor(private counterService: CounterService) {}

  @Get()
  async getCounter() {
    try {
      const response = await this.counterService.getCounter();
      return response;
    } catch (error) {
      throw new NotFoundException('Counter not found');
    }
  }

  @Post()
  async createCounter() {
    return this.counterService.createCounter();
  }
}
