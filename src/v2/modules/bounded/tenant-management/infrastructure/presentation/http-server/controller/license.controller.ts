import { Body, Controller, Get, Param, Post, Put, UseFilters } from '@nestjs/common';
import { DomainHttpExceptionFilter } from '../exception-filters/domain-http-exception.filter';
import {
  ActivateLicenseRequest,
  IssueLicenseRequest,
  RenewLicenseRequest,
  RevokeLicenseRequest,
  ValidateTenantOperationRequest,
} from '../models/license.models';
import { LicenseKeyPrimitives } from '../../../../core/domain/types/LicenseKeyPrimitives';
import { LicenseAppService } from '../../../../core/application/ports/inbound/license-app-service.port';

@UseFilters(DomainHttpExceptionFilter)
@Controller('v2/licenses')
export class LicenseController {
  constructor(private readonly licenseAppService: LicenseAppService) {}

  @Post()
  issue(@Body() body: IssueLicenseRequest): Promise<LicenseKeyPrimitives> {
    return this.licenseAppService.issue({
      ...body,
      validFrom: body.validFrom ? new Date(body.validFrom) : undefined,
      validUntil: new Date(body.validUntil),
    });
  }

  @Put(':licenseKeyId/activate')
  activate(
    @Param('licenseKeyId') licenseKeyId: string,
    @Body() body: ActivateLicenseRequest,
  ): Promise<LicenseKeyPrimitives> {
    return this.licenseAppService.activate(licenseKeyId, body);
  }

  @Put(':licenseKeyId/renew')
  renew(
    @Param('licenseKeyId') licenseKeyId: string,
    @Body() body: RenewLicenseRequest,
  ): Promise<LicenseKeyPrimitives> {
    return this.licenseAppService.renew(licenseKeyId, {
      ...body,
      validFrom: body.validFrom ? new Date(body.validFrom) : undefined,
      validUntil: new Date(body.validUntil),
    });
  }

  @Put(':licenseKeyId/revoke')
  revoke(
    @Param('licenseKeyId') licenseKeyId: string,
    @Body() body: RevokeLicenseRequest,
  ): Promise<LicenseKeyPrimitives> {
    return this.licenseAppService.revoke(licenseKeyId, {
      ...body,
      revokedAt: body.revokedAt ? new Date(body.revokedAt) : undefined,
    });
  }

  @Get(':licenseKeyId')
  getById(@Param('licenseKeyId') licenseKeyId: string): Promise<LicenseKeyPrimitives> {
    return this.licenseAppService.getById(licenseKeyId);
  }

  @Post('tenant/:tenantId/validate-operation')
  validateTenantOperation(
    @Param('tenantId') tenantId: string,
    @Body() body: ValidateTenantOperationRequest,
  ): Promise<void> {
    return this.licenseAppService.validateTenantOperation(tenantId, body);
  }
}
