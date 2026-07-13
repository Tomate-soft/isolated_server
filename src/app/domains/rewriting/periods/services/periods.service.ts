import { Injectable, NotFoundException } from '@nestjs/common';
import { IntegrationsService } from '../../integrations/integrations.service';

@Injectable()
export class PeriodsService {
  constructor(private readonly integrations: IntegrationsService) {}

  async convertPeriod(periodId: string) {
    const integrations = this.integrations;
    const operatingPeriod = await integrations.findForConvert(periodId);
    if (!operatingPeriod) {
      throw new NotFoundException('No se encontro el periodo');
    }
    const clonedData = JSON.parse(JSON.stringify(operatingPeriod));
    delete clonedData._id;
    const newPeriod = await integrations.createRewritePeriod(clonedData);

    return {
      period: operatingPeriod,
      received: newPeriod,
    };
  }

  async rewritePeriodModifyProperties(periodId: string, body: any) {
    const integrations = this.integrations;
    const response = await integrations.rewritePeriodModifyProperties(periodId, body);
    return response;
  }
}
