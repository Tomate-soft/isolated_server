import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class CrudPaymentsService {
  constructor(private readonly dataRepository: DataRepository) {}
  async findAll(page: number = 1, limit: number = 50): Promise<any> {
    const { count, data } = await this.dataRepository.readPaymentsRepository.findAll(page, limit);
    return { count, data };
  }
}
