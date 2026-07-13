import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseFilters } from '@nestjs/common';
import { DomainHttpExceptionFilter } from '../exception-filters/domain-http-exception.filter';
import {
  CreateTenantRequest,
  UpdateTenantProfileRequest,
  UpdateTenantSecurityPolicyRequest,
} from '../models/tenant.models';
import { TenantPrimitives } from '../../../../core/domain/types/TenantPrimitives';
import { TenantAppService } from '../../../../core/application/ports/inbound/tenant-app-service.port';

@UseFilters(DomainHttpExceptionFilter)
@Controller('v2/tenants')
export class TenantController {
  constructor(private readonly tenantAppService: TenantAppService) {}

  @Post()
  create(@Body() body: CreateTenantRequest): Promise<TenantPrimitives> {
    return this.tenantAppService.create(body);
  }

  @Put(':tenantId/activate')
  activate(@Param('tenantId') tenantId: string): Promise<TenantPrimitives> {
    return this.tenantAppService.activate(tenantId);
  }

  @Put(':tenantId/suspend')
  suspend(@Param('tenantId') tenantId: string): Promise<TenantPrimitives> {
    return this.tenantAppService.suspend(tenantId);
  }

  @Delete(':tenantId')
  delete(@Param('tenantId') tenantId: string): Promise<TenantPrimitives> {
    return this.tenantAppService.delete(tenantId);
  }

  @Patch(':tenantId/profile')
  updateProfile(
    @Param('tenantId') tenantId: string,
    @Body() body: UpdateTenantProfileRequest,
  ): Promise<TenantPrimitives> {
    return this.tenantAppService.updateProfile(tenantId, body);
  }

  @Patch(':tenantId/security-policy')
  updateSecurityPolicy(
    @Param('tenantId') tenantId: string,
    @Body() body: UpdateTenantSecurityPolicyRequest,
  ): Promise<TenantPrimitives> {
    return this.tenantAppService.updateSecurityPolicy(tenantId, body);
  }

  @Get(':tenantId')
  getById(@Param('tenantId') tenantId: string): Promise<TenantPrimitives> {
    return this.tenantAppService.getById(tenantId);
  }

  @Get()
  listAll(): Promise<TenantPrimitives[]> {
    return this.tenantAppService.listAll();
  }
}
