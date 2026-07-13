import { Injectable } from '@nestjs/common';
import { IntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class SubcategoriesService {
  constructor(private integration: IntegrationsService) {}

  async getSubcategoriesForCommand(): Promise<any[]> {
    return await this.integration.getSubcategoriesForCommand();
  }
}
