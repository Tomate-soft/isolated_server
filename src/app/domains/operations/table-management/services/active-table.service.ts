import { Injectable } from '@nestjs/common';
import { OperationsIntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class ActiveTableService {
  constructor(private integrations: OperationsIntegrationsService) {}

  async enableTables(body: any) {
    if (Array.isArray(body)) {
      await Promise.all(
        body.map(async (element: any) => {
          return await this.integrations.modifyTableProperties(element, {
            active: true,
            availability: true,
          });
        }),
      );
    }
    return await this.integrations.modifyTableProperties(body, {
      active: true,
      availability: true,
    });
  }
}
