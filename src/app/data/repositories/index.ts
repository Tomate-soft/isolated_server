import { ReadBillsRepository } from './bills/read-bills.repository';
import { WriteBillsRepository } from './bills/write-bills.repository';
import { ReadRewritedPeriods } from './rewrited-period/read-rewrited-periods';
import { WriteRewritedPeriods } from './rewrited-period/write-rewrited-periods';
import { ReadOperatingPeriodsRepository } from './operating-periods/read-operatingPeriods.repository';
import { ReadPaymentsRepository } from './payments/read-payments.repository';
import { WriteTogoRepository } from './togo-orders/write-togo.repository';
import { ReadTogoRepository } from './togo-orders/read-togo.repository';
import { ReadRappiRepository } from './rappi-orders/read-rappi.repository';
import { WriteRappiRepository } from './rappi-orders/write-rappi.repository';
import { ReadPhoneRepository } from './phone-orders/read-phone.repository';
import { WritePhoneRepository } from './phone-orders/write-phone.repository';
import { ReadCancellations } from './cancellations/read-cancellations';
import { WriteCancellations } from './cancellations/write-cancellations';
import { ReadTablesRepository } from './tables/read-tables-repository';
import { WriteTablesRepository } from './tables/write-tables-repository';
import { ReadSubcategoriesRepository } from './subcategories/read-subcategories.repository';
import { ReadDishes } from './dishes/read-dishes';
import { ReadModifiers } from './modifiers/read-modifiers';
import { ReadProducts } from './products/read-products';
import { ReadUsers } from './users/read-users';
import { WriteUsers } from './users/write-users';
import { ReadBranch } from './branch/read-branch';
import { ReadEmployeeOrders } from './employee-orders/read-employee-orders';
import { WriteOperatingPeriodRepository } from './operating-periods/write-operatingPeriod.repository';

// models
export const providersRepositoriesModule = [
  ReadBillsRepository,
  WriteBillsRepository,
  ReadPaymentsRepository,
  ReadOperatingPeriodsRepository,
  ReadRewritedPeriods,
  WriteRewritedPeriods,
  WriteTogoRepository,
  ReadTogoRepository,
  ReadRappiRepository,
  WriteRappiRepository,
  ReadPhoneRepository,
  WritePhoneRepository,
  ReadCancellations,
  WriteCancellations,
  ReadTablesRepository,
  WriteTablesRepository,
  ReadSubcategoriesRepository,
  ReadDishes,
  ReadModifiers,
  ReadProducts,
  ReadUsers,
  WriteUsers,
  ReadBranch,
  ReadEmployeeOrders,
  WriteOperatingPeriodRepository,
];

export const exportsRepositoriesModule = [
  ReadBillsRepository,
  WriteBillsRepository,
  ReadPaymentsRepository,
  ReadOperatingPeriodsRepository,
  ReadRewritedPeriods,
  WriteRewritedPeriods,
  WriteTogoRepository,
  ReadTogoRepository,
  ReadRappiRepository,
  WriteRappiRepository,
  ReadPhoneRepository,
  WritePhoneRepository,
  ReadCancellations,
  WriteCancellations,
  ReadTablesRepository,
  WriteTablesRepository,
  ReadSubcategoriesRepository,
  ReadDishes,
  ReadModifiers,
  ReadProducts,
  ReadUsers,
  WriteUsers,
  ReadBranch,
  ReadEmployeeOrders,
  WriteOperatingPeriodRepository,
];
