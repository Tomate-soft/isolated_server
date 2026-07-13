import { DynamicModule, Module, Type } from '@nestjs/common';
import { TenantRepository } from './domain/ports/outbound/tenant-repository.port';
import { LicenseKeyRepository } from './domain/ports/outbound/license-key-repository.port';
import { TenantDomainService } from './domain/services/tenant.service';
import { LicenseKeyDomainService } from './domain/services/license-key.service';

export type CoreModuleOptions = {
  modules: Type[];
  adapters?: {
    tenantRepository: Type<TenantRepository>;
    licenseRepository: Type<LicenseKeyRepository>;
  };
};

export const TENANT_DOMAIN_SERVICE = 'TENANT_DOMAIN_SERVICE';
export const LICENSE_DOMAIN_SERVICE = 'LICENSE_DOMAIN_SERVICE';
export const TENANT_REPOSITORY = 'TENANT_REPOSITORY';
export const LICENSE_KEY_REPOSITORY = 'LICENSE_KEY_REPOSITORY';

// export const
@Module({})
export class CoreModule {
  static register(options: CoreModuleOptions): DynamicModule {
    const { modules, adapters } = options;
    const { tenantRepository, licenseRepository } = adapters || {};

    /* aplication providers */
    const tenantDomainServiceProvider = {
      provide: TENANT_DOMAIN_SERVICE,
      useFactory: (repository: TenantRepository) => {
        return new TenantDomainService(repository);
      },
      inject: [TENANT_REPOSITORY],
    };

    const licenseDomainServiceProvider = {
      provide: LICENSE_DOMAIN_SERVICE,
      useFactory: (repository: LicenseKeyRepository) => {
        return new LicenseKeyDomainService(repository);
      },
      inject: [LICENSE_KEY_REPOSITORY],
    };

    /* repository providers */
    const tenantRepositoryProvider = {
      provide: TENANT_REPOSITORY,
      useExisting: tenantRepository,
    };

    const licenseRepositoryProvider = {
      provide: LICENSE_KEY_REPOSITORY,
      useExisting: licenseRepository,
    };

    return {
      module: CoreModule,
      global: true,
      imports: [...modules],
      providers: [
        tenantDomainServiceProvider,
        licenseDomainServiceProvider,
        tenantRepositoryProvider,
        licenseRepositoryProvider,
      ],
      exports: [TENANT_DOMAIN_SERVICE, LICENSE_DOMAIN_SERVICE],
    };
  }
}
