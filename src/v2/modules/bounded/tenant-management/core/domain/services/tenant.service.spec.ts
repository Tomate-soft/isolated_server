import { TenantDomainService } from './tenant.service';
import { TenantRepository } from '../ports/outbound/tenant-repository.port';
import { TenantEntity } from '../entities/tenant.entity';

describe('TenantDomainService', () => {
  it('create() should persist and return primitives', async () => {
    const repo: TenantRepository = {
      save: jest.fn(async (tenant: TenantEntity) => tenant),
      findById: jest.fn(async () => null),
      findAll: jest.fn(async () => []),
      findByStatus: jest.fn(async () => []),
      existsById: jest.fn(async () => false),
      deleteById: jest.fn(async () => undefined),
    };

    const service = new TenantDomainService(repo);

    const createdAt = new Date('2026-01-01T00:00:00.000Z');

    const result = await service.create({
      name: 'TomateSoft',
      legal_name: 'TomateSoft S.A. de C.V.',
      tax_id: 'TOM260101XXX',
      country_code: 'MX',
      currency_code: 'MXN',
      timezone: 'America/Mexico_City',
      created_at: createdAt,
      updated_at: createdAt,
    });

    expect(repo.save).toHaveBeenCalledTimes(1);

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'TomateSoft',
        legal_name: 'TomateSoft S.A. de C.V.',
        tax_id: 'TOM260101XXX',
        country_code: 'MX',
        currency_code: 'MXN',
        timezone: 'America/Mexico_City',
        created_at: createdAt,
        updated_at: createdAt,
      }),
    );
  });
});
