import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from 'src/schemas/business/branchSchema';

@Injectable()
export class ReadBranch {
  constructor(@InjectModel(Branch.name) private readonly branchModel: Model<Branch>) {}

  async getCurrentperiodId(branchId: string): Promise<Branch | null> {
    const branch = await this.branchModel.findById(branchId).select('operatingPeriod').lean();
    return branch;
  }
}
