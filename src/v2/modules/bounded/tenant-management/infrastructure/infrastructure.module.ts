import { Module } from '@nestjs/common';
import { LicenseAuditPublisher } from './adapter/events/license-audit.publisher';
import { PostgresLicenseKeyRepository } from './adapter/postgres/repositories/postgres-license-key.repository';
import { PostgresTenantRepository } from './adapter/postgres/repositories/postgres-tenant.repository';
import { PostgresModule } from './persistence/postgres/postgres.module';

@Module({
  imports: [PostgresModule],
  providers: [LicenseAuditPublisher, PostgresTenantRepository, PostgresLicenseKeyRepository],
  exports: [PostgresTenantRepository, PostgresLicenseKeyRepository],
})
export class InfrastructureModule {}
