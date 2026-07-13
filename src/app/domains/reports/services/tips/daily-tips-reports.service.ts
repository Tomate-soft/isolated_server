import { Injectable } from '@nestjs/common';
import { ReportsIntegrations } from '../../integrations/integrations';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { MoneyMovement } from 'src/schemas/moneyMovements/moneyMovement.schema';
import { FILTER_TIPS, TotalDailyTipsByUserInPeriod } from '../../types/daily-reports-types';
import { toDate } from 'src/app/common/libs/toDate';
import { ExtendedMoneyMovement } from 'src/app/common/types/mongo';
import { getNameInDescription } from './helpers/getName';

@Injectable()
export class DailyTipsReportsService {
  constructor(private readonly integration: ReportsIntegrations) {}

  async getDailyTipsReports(id: string): Promise<TotalDailyTipsByUserInPeriod[]> {
    const filter = FILTER_TIPS;
    const response: OperatingPeriod = await this.integration.getMoneyMovementsByPeriodId(id);
    const movementArray: MoneyMovement[] = response.moneyMovements;
    const filteredMovements = movementArray.filter((element: MoneyMovement) =>
      element.title.toLowerCase().includes(filter.toLowerCase()),
    );

    const report: TotalDailyTipsByUserInPeriod[] = filteredMovements.map(
      (element: ExtendedMoneyMovement) => {
        const amount = element.amount;
        const name = getNameInDescription(element.description);
        const createdAt = toDate(element.createdAt);
        const updatedAt = toDate(element.updatedAt);
        const aprrovedBy = element.user;

        return {
          amount,
          name,
          createdAt,
          updatedAt,
          aprrovedBy,
        };
      },
    );

    return report;
  }
}
