import { Injectable } from '@nestjs/common';
import { ReadDataRepository } from 'src/app/data/data-read.repository';

@Injectable()
export class PeriodIntegration {
  constructor(private readonly readDataRepository: ReadDataRepository) {}

  async getPeriodById(id: string) {
    const response = await this.readDataRepository.readOperatingPeriodsRepository.findById(id);
    return response;
  }

  async getMoneyMovementsByPeriodId(id: string) {
    const response =
      await this.readDataRepository.readOperatingPeriodsRepository.findMoneyMovementsByPeriodId(id);
    return response;
  }
}
