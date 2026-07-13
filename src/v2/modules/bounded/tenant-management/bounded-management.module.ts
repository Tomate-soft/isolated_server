import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PostgresLicenseKeyRepository } from './infrastructure/adapter/postgres/repositories/postgres-license-key.repository';
import { PostgresTenantRepository } from './infrastructure/adapter/postgres/repositories/postgres-tenant.repository';

@Module({
  imports: [
    CoreModule.register({
      modules: [InfrastructureModule],
      adapters: {
        tenantRepository: PostgresTenantRepository, // Aquí debes proporcionar la clase concreta que implementa TenantRepository
        licenseRepository: PostgresLicenseKeyRepository, // Aquí debes proporcionar la clase concreta que implementa LicenseKeyRepository
      },
    }),
    InfrastructureModule,
  ],
})
export class BoundedManagementModule {}
