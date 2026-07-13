import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class ChangeDinersService {
  constructor(private integrations: OperationsIntegrationsService) {}

  async changeDiners(id: string, body: any) {
    return await this.integrations.modifyTableProperties(id, body);
  }
}
