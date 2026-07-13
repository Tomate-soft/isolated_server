import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class RewritedPeriodIntegration {
  constructor(private readonly dataRepository: DataRepository) {}

  async createRewritePeriod(body: any) {
    const response =
      await this.dataRepository.writeRewritedPeriodsRepository.createRewritePeriod(body);
    return response;
  }

  async modifyProperties(id: string, body: any) {
    const response =
      await this.dataRepository.writeRewritedPeriodsRepository.modifyRewritePeriodProperties(
        id,
        body,
      );
    return response;
  }
}
