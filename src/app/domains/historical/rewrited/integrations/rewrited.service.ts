import { Injectable } from '@nestjs/common';
import { ReadDataRepository } from 'src/app/data/data-read.repository';

@Injectable()
export class RewritedService {
  constructor(private readonly readRepository: ReadDataRepository) {}

  async findAll() {
    const response = await this.readRepository.readRewritedPeriodsRepository.findAll();
    return response;
  }
}
