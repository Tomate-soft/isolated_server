import { Module } from '@nestjs/common';
import { LicenseController } from './controller/license.controller';
import { TenantController } from './controller/tenant.controller';
import { DomainHttpExceptionFilter } from './exception-filters/domain-http-exception.filter';

@Module({
  controllers: [TenantController, LicenseController],
  providers: [DomainHttpExceptionFilter],
})
export class HttpServerModule {}
