import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class ToNextReleaseService {
  constructor(private integrations: OperationsIntegrationsService) {}

  async toNextRelease() {
    const response = await this.integrations.getToNextRelease();
    return response;
  }
}
