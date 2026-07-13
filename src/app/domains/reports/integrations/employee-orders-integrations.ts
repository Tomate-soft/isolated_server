import { Injectable } from '@nestjs/common';
import { ReadDataRepository } from 'src/app/data/data-read.repository';

@Injectable()
export class EmployeeOrdersIntegrations {
  constructor(private readonly readDataRepository: ReadDataRepository) {}

  async getEmployeeOrdersForReport(id: string) {
    const response = this.readDataRepository.readEmployeeOrdersRepository.findAllForReport(id);
    return response;
  }
}
