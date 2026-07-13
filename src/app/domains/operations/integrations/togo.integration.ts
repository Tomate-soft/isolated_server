import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class TogoIntegration {
  constructor(private readonly dataRepository: DataRepository) {}
  async getAllTogoOrders(page: number = 1, limit: number = 50) {
    const response = await this.dataRepository.readTogoRepository.findAll(page, limit);
    const { data } = response;
    return data;
  }

  async getAllPeriodTogoOrders(operatingPeriod: string) {
    const response =
      await this.dataRepository.readTogoRepository.findByOperatingPeriod(operatingPeriod);
    return response;
  }

  async modifyTogoOrderProperties(id: string, body: any) {
    const response = await this.dataRepository.writeTogoRepository.modifyTogoOrderProperties(
      id,
      body,
    );
    return response;
  }
}
