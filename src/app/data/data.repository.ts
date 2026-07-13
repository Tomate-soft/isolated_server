import { Injectable } from '@nestjs/common';
import { ReadBillsRepository } from './repositories/bills/read-bills.repository';
import { ReadPaymentsRepository } from './repositories/payments/read-payments.repository';
import { ReadOperatingPeriodsRepository } from './repositories/operating-periods/read-operatingPeriods.repository';
import { ReadRewritedPeriods } from './repositories/rewrited-period/read-rewrited-periods';
import { WriteRewritedPeriods } from './repositories/rewrited-period/write-rewrited-periods';
import { ReadTogoRepository } from './repositories/togo-orders/read-togo.repository';
import { WriteTogoRepository } from './repositories/togo-orders/write-togo.repository';
import { WritePhoneRepository } from './repositories/phone-orders/write-phone.repository';
import { ReadPhoneRepository } from './repositories/phone-orders/read-phone.repository';
import { WriteRappiRepository } from './repositories/rappi-orders/write-rappi.repository';
import { ReadRappiRepository } from './repositories/rappi-orders/read-rappi.repository';
import { WriteCancellations } from './repositories/cancellations/write-cancellations';
import { ReadCancellations } from './repositories/cancellations/read-cancellations';
import { WriteBillsRepository } from './repositories/bills/write-bills.repository';
import { ReadTablesRepository } from './repositories/tables/read-tables-repository';
import { WriteTablesRepository } from './repositories/tables/write-tables-repository';
import { ReadDishes } from './repositories/dishes/read-dishes';
import { WriteUsers } from './repositories/users/write-users';
import { ReadUsers } from './repositories/users/read-users';
import { ReadBranch } from './repositories/branch/read-branch';
import { WriteOperatingPeriodRepository } from './repositories/operating-periods/write-operatingPeriod.repository';

@Injectable()
export class DataRepository {
  constructor(
    public readonly writeRewritedPeriodsRepository: WriteRewritedPeriods,
    public readonly writeTogoRepository: WriteTogoRepository,
    public readonly writeRappiRepository: WriteRappiRepository,
    public readonly writePhoneRepository: WritePhoneRepository,
    public readonly writeCancellationsRepository: WriteCancellations,
    public readonly writeBillsRepository: WriteBillsRepository,
    public readonly writeTablesRepository: WriteTablesRepository,
    public readonly writeUsersRepository: WriteUsers,
    public readonly writeOperatingPeriodRepository: WriteOperatingPeriodRepository,

    // read
    public readonly readDishesRepository: ReadDishes,
    public readonly readUsersRepository: ReadUsers,
    public readonly readBillsRepository: ReadBillsRepository,
    public readonly readPaymentsRepository: ReadPaymentsRepository,
    public readonly readOperatingPeriodsRepository: ReadOperatingPeriodsRepository,
    public readonly readRewritedPeriodsRepository: ReadRewritedPeriods,
    public readonly readTogoRepository: ReadTogoRepository,
    public readonly readRappiRepository: ReadRappiRepository,
    public readonly readPhoneRepository: ReadPhoneRepository,
    public readonly readCancellationsRepository: ReadCancellations,
    public readonly readTablesRepository: ReadTablesRepository,
    public readonly readBranchRepository: ReadBranch,
  ) {}
}
