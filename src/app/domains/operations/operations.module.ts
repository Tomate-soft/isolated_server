import { Module } from '@nestjs/common';
import { ClousureController } from './clousure/controllers/clousure.controller';
import { ClousureService } from './clousure/services/clousure.service';
import { DailyClousureService } from './clousure/services/daily-clousure.service';
import { DataModule } from 'src/app/data/data.module';
import { BillsIntegrationsService } from './integrations/bills-integrations.service';
import { CancellationsController } from './cancellations/controllers/cancellations.controller';
import { CancellationsService } from './cancellations/services/cancellations.service';
import { TogoIntegration } from './integrations/togo.integration';
import { OperationsIntegrationsService } from './integrations/integrations.service';
import { PhoneIntegrations } from './integrations/phone-integrations';
import { RappiIntegrations } from './integrations/rappi-integrations';
import { NotifyIntegrations } from './integrations/notify-integrations';
import { NotificationsModule } from '../notifications/notifications.module';
import { CancellationsIntegrations } from './integrations/cancellations-integrations';
import { TableIntegrations } from './integrations/table-integrations';
import { TablesManagementController } from './table-management/controllers/tables-management.controller';
import { TablesManagementService } from './table-management/services/tables-management.service';
import { ChangeDinersService } from './table-management/services/change-diners.service';
import { ChangeStatusService } from './table-management/services/change-status.service';
import { LiberateTableService } from './table-management/services/liberate-table.service';
import { PaymentsController } from './payments/controllers/payments.controller';
import { PaymentsIntegrations } from './integrations/payments-integrations';
import { PaymentsService } from './payments/services/payments.service';
import { OnsitePaymentsService } from './payments/services/onsite-payments.service';
import { TogoPaymentsService } from './payments/services/togo-payments.service';
import { PhonePaymentsService } from './payments/services/phone-payments.service';
import { RappiPaymentsService } from './payments/services/rappi-payments.service';
import { ActionsIntegration } from './integrations/actions-integration';
import { ActionsService } from './actions/services/actions.service';
import { TransferBillForUserService } from './actions/services/transfer-bill-for-user.service';
import { ActionsController } from './actions/controllers/actions.controller';
import { ActiveTableService } from './table-management/services/active-table.service';
import { DisableTableService } from './table-management/services/disable-table.service';
import { UserIntegrations } from './integrations/user-integrations';
import { TillClousureService } from './clousure/services/till-clousure.service';
import { ToNextReleaseService } from './table-management/services/to-next-release.service';
import { GetAllTablesService } from './table-management/services/get-all-tables.service';

@Module({
  imports: [DataModule, NotificationsModule],
  controllers: [
    ClousureController,
    CancellationsController,
    TablesManagementController,
    PaymentsController,
    ActionsController,
  ],
  providers: [
    ClousureService,
    DailyClousureService,
    OperationsIntegrationsService,
    BillsIntegrationsService,
    CancellationsService,
    TogoIntegration,
    PhoneIntegrations,
    RappiIntegrations,
    NotifyIntegrations,
    CancellationsIntegrations,
    TableIntegrations,
    TablesManagementService,
    ChangeDinersService,
    ChangeStatusService,
    LiberateTableService,
    PaymentsIntegrations,
    PaymentsService,
    OnsitePaymentsService,
    TogoPaymentsService,
    PhonePaymentsService,
    RappiPaymentsService,
    ActionsIntegration,
    ActionsService,
    TransferBillForUserService,
    ActiveTableService,
    DisableTableService,
    UserIntegrations,
    TillClousureService,
    ToNextReleaseService,
    GetAllTablesService,
  ],
})
export class OperationsModule {}
