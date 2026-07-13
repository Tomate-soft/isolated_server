import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class OperatingPeriodIntegration {
  constructor(
    private readonly dataQuery: DataQuery,
    private readonly dataRepository: DataRepository,
  ) {}

  async findForConvert(id: string) {
    const response = await this.dataRepository.readOperatingPeriodsRepository.findForConvert(id);
    return response;
  }
}
