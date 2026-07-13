import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';
import { DataQuery } from 'src/app/data/data.query';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class DailyClousureService {
  constructor(
    private readonly dataRepository: DataRepository,
    private dataQuery: DataQuery,
    private readonly integrationsService: OperationsIntegrationsService,
  ) {}

  async execute(periodId: string) {
    // const response =
    //   await this.dataRepository.readOperatingPeriodsRepository.findAll(1, 2);
    // const { data } = response;
    const data = await this.dataQuery.closures.dailyClousure(periodId);
    return data;
  }
}
