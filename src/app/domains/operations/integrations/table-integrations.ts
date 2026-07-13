import { Injectable } from '@nestjs/common';
import { DataRepository } from 'src/app/data/data.repository';

@Injectable()
export class TableIntegrations {
  constructor(private readonly dataRepository: DataRepository) {}

  async modifyTableProperties(id: string, body: any) {
    const response = await this.dataRepository.writeTablesRepository.modifyTableProperties(
      id,
      body,
    );
    return response;
  }

  async toNextRelease() {
    const response = await this.dataRepository.readTablesRepository.toNextRelease();
    return response;
  }
}
