import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PeriodStatRepository } from '../../../../core/domain/ports/outbound/PeriodStatRepository';
import { CreatePeriodStateDto } from '../../../../core/domain/dto/CreatePeriodState.dto';
import { MongoPeriodStat } from '../schemas/PeriodStat.schema';
import { PeriodStatDto } from '../../../../core/domain/entities/PeriodStat';
import { PeriodStat } from '../../../../core/domain/entities/PeriodStat';

export class MongoPeriodStateRepository implements PeriodStatRepository {
  constructor(@InjectModel(MongoPeriodStat.name) private periodStatModel: Model<MongoPeriodStat>) {}

  async save(data: CreatePeriodStateDto): Promise<void> {
    await this.periodStatModel.create(data);
  }

  async getById(id: string): Promise<PeriodStatDto | null> {
    const result = await this.periodStatModel.findOne({ id }).exec();
    return result
      ? PeriodStat.create({
          id: result.id,
          state: result.state,
          descript: result.descript,
        }).toJSON()
      : null;
  }

  async getAll(): Promise<PeriodStatDto[]> {
    const results = await this.periodStatModel.find().exec();
    return results.map((result) =>
      PeriodStat.create({
        id: result.id,
        state: result.state,
        descript: result.descript,
      }).toJSON(),
    );
  }
}
