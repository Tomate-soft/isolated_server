import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class PhoneIntegrations {
  constructor(private readonly dataRepository: DataRepository) {}

  async getAllPhoneOrders(page: number, limit: number) {
    const response = await this.dataRepository.readPhoneRepository.findAll(page, limit);
    const { data } = response;
    return data;
  }

  async getAllPeriodPhoneOrders(operatingPeriod: string) {
    const response =
      await this.dataRepository.readPhoneRepository.findByOperatingPeriod(operatingPeriod);
    return response;
  }

  async modifyPhoneOrderProperties(id: string, body: any) {
    const response = await this.dataRepository.writePhoneRepository.modifyPhoneOrderProperties(
      id,
      body,
    );
    return response;
  }
}
