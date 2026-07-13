import { Test, TestingModule } from '@nestjs/testing';
import { TableManagement } from './table-management';

describe('TableManagement', () => {
  let provider: TableManagement;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableManagement],
    }).compile();

    provider = module.get<TableManagement>(TableManagement);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
