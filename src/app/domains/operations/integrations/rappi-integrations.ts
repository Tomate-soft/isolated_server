import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class RappiIntegrations {
  constructor(private readonly dataRepository: DataRepository) {}
  async getAllRappiOrders(page: number, limit: number) {
    const response = await this.dataRepository.readRappiRepository.findAll(page, limit);
    const { data } = response;
    return data;
  }

  async getAllPeriodRappiOrders(operatingPeriod: string) {
    const response =
      await this.dataRepository.readRappiRepository.findByOperatingPeriod(operatingPeriod);
    return response;
  }

  async modifyRappiOrderProperties(id: string, body: any) {
    const response = await this.dataRepository.writeRappiRepository.modifyRappiOrderProperties(
      id,
      body,
    );
    return response;
  }
}
