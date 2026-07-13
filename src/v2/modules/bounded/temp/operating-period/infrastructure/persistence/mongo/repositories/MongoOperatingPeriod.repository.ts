import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { OperatingPeriodRepository } from '../../../../core/domain/ports/outbound/OperatingPeriodRepository';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model } from 'mongoose';
import { getPeriodsByMonthPipeline } from '../pipelines/getByMonth.pipeline';

export class MongoOperatingPeriodRepository implements OperatingPeriodRepository {
  constructor(
    @InjectModel(OperatingPeriod.name) private operatingPeriodModel: Model<OperatingPeriod>,
  ) {}

  async findById(id: string) {
    return await this.operatingPeriodModel.findById(id).exec();
  }

  async findByMonth(month: string): Promise<OperatingPeriod[]> {
    // month format: "YYYY-MM"
    const [year, monthNumber] = month.split('-');
    
    if (!year || !monthNumber) {
      throw new Error('Invalid month format. Use YYYY-MM');
    }

    if (!this.validateMonthFormat(month)) {
      throw new Error('Invalid month format. Use YYYY-MM');
    }

    const startDate = new Date(`${year}-${monthNumber}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    const pipeline = getPeriodsByMonthPipeline(startDate, endDate);
    return await this.operatingPeriodModel.aggregate(pipeline).exec();
      // .find({
      //   createdAt: {
      //     $gte: startDate,
      //     $lt: endDate,
      //   },
      // })
      // .select('_id operationalClousure status createdAt')
      // .exec();
  }

  validateMonthFormat(month: string): boolean {
    const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
    return regex.test(month);
  }
}
