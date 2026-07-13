import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { dailyClosurePipeline } from './pipelines/daily-clousure.pipeline';
import { InjectModel } from '@nestjs/mongoose';
import { Bills } from '@schema/sales/bills.schema';

@Injectable()
export class DailyClousureQuery {
  constructor(
    @InjectModel(OperatingPeriod.name)
    private readonly operatingPeriodModel: Model<OperatingPeriod>,
    @InjectModel(Bills.name) private readonly billsModel: Model<Bills>,
  ) {}

  async execute(periodId: string) {
    const pipeline = dailyClosurePipeline(periodId);
    const response = await this.billsModel.aggregate(pipeline);
    return response;
  }
}
