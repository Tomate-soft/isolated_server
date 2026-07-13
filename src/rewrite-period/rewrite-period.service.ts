import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewritedPeriod } from '@schema/RewritedPeriod/rewritedPeriod';
import { Model } from 'mongoose';

@Injectable()
export class RewritePeriodService {
  constructor(
    @InjectModel(RewritedPeriod.name)
    private readonly rewritePeriodModel: Model<RewritedPeriod>,
  ) {}

  async createRewritePeriod(body: any) {
    const newRewritePeriod = new this.rewritePeriodModel(body);
    return await newRewritePeriod.save();
  }

  async findAll() {
    return await this.rewritePeriodModel.find().exec();
  }
}
