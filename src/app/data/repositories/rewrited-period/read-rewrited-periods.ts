import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewritedPeriod } from '@schema/RewritedPeriod/rewritedPeriod';
import { Model } from 'mongoose';

@Injectable()
export class ReadRewritedPeriods {
  constructor(
    @InjectModel(RewritedPeriod.name) private readonly rewritedPeriodModel: Model<RewritedPeriod>,
  ) {}

  async findAll() {
    return await this.rewritedPeriodModel.find().exec();
  }
}
