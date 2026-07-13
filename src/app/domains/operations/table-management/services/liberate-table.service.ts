import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';
import { FREE_STATUS } from 'src/libs/status.libs';

@Injectable()
export class LiberateTableService {
  constructor(private integrations: OperationsIntegrationsService) {}

  async liberateTable(id: string) {
    return await this.integrations.modifyTableProperties(id, {
      status: FREE_STATUS,
      bill: [],
      diners: 1,
    });
  }
}
