import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class BillsIntegrationsService {
  constructor(private readonly dataRepository: DataRepository) {}

  async readBills() {
    const response = await this.dataRepository.readBillsRepository.findAll();
    const { data } = response;
    return data;
  }

  async readBillsByPeriod(operatingPeriod: string) {
    const response =
      await this.dataRepository.readBillsRepository.findByOperatingPeriod(operatingPeriod);
    return response;
  }

  async modifyOnSiteOrderProperties(id: string, body: any) {
    const response = await this.dataRepository.writeBillsRepository.modifyOnSiteOrderProperties(
      id,
      body,
    );
    return response;
  }
}
