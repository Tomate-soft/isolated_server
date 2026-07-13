import { Injectable } from '@nestjs/common';
import { OperatingPeriodIntegration } from './operating-period.service';
import { RewritedPeriodIntegration } from './rewrited-period.service';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly operatingPeriodIntegration: OperatingPeriodIntegration,
    private readonly rewritedPeriodIntegration: RewritedPeriodIntegration,
  ) {}

  async findForConvert(id: string) {
    const response = await this.operatingPeriodIntegration.findForConvert(id);
    return response;
  }
  async createRewritePeriod(body: any) {
    const response = await this.rewritedPeriodIntegration.createRewritePeriod(body);
    return response;
  }

  async rewritePeriodModifyProperties(id: string, body: any) {
    const response = await this.rewritedPeriodIntegration.modifyProperties(id, body);
    return response;
  }
}
