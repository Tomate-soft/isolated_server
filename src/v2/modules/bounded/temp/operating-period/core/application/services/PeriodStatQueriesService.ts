import { PeriodStatDto } from '../../domain/entities/PeriodStat';
import { GetPeriodStatByIdUseCase } from './use-cases/GetPeriodStatById.uc';
import { GetStatListUseCase } from './use-cases/GetStatList.uc';

export class PeriodStatQueriesService {
  constructor(
    private readonly getByIdUseCase: GetPeriodStatByIdUseCase,
    private readonly getStatListUseCase: GetStatListUseCase,
  ) {}

  async getById(id: string): Promise<PeriodStatDto | null> {
    const result = await this.getByIdUseCase.run(id);
    return result;
  }

  getList(): Promise<PeriodStatDto[]> {
    return this.getStatListUseCase.run();
  }
}
