import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class DisableTableService {
  constructor(private integrations: OperationsIntegrationsService) {}

  async disableTable(body: any) {
    if (Array.isArray(body)) {
      await Promise.all(
        body.map(async (element: any) => {
          return await this.integrations.modifyTableProperties(element, {
            active: false,
            availability: false,
          });
        }),
      );
    }
    return await this.integrations.modifyTableProperties(body, {
      active: false,
      availability: false,
    });
  }
}
