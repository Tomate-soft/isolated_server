import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class GetAllTablesService {
  constructor(private readonly dataRepository: DataRepository) {}

  async getAllTables() {
    return this.dataRepository.readTablesRepository.getAllTablesForCheckin();
  }
}
