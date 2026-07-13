import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from 'src/schemas/business/branchSchema';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { branchId } from 'src/variablesProvisionales';

interface OperatingPeriodsResponse {
  count: number;
  data: OperatingPeriod[];
}

@Injectable()
export class ReadOperatingPeriodsRepository {
  constructor(
    @InjectModel(OperatingPeriod.name)
    private operatingPeriodsModel: Model<OperatingPeriod>,
    @InjectModel(Branch.name)
    private branchModel: Model<Branch>,
  ) {}

  async findAll(page: number = 1, limit: number = 50): Promise<OperatingPeriodsResponse> {
    const skip = (page - 1) * limit;

    const [periods, periodsCount] = await Promise.all([
      this.operatingPeriodsModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.operatingPeriodsModel.countDocuments({}),
    ]);
    return { count: periodsCount, data: periods };
  }

  async findById(id: string): Promise<OperatingPeriod> {
    const response = await this.operatingPeriodsModel.findById(id).lean();
    return response;
  }

  async findLastCompletePeriod(): Promise<OperatingPeriod> {
    return await this.operatingPeriodsModel
      .find({ status: 'complete' })
      .sort({ createdAt: -1 })
      .skip(1)
      .limit(1)
      .lean();
  }

  async findMoneyMovementsByPeriodId(id: string): Promise<OperatingPeriod> {
    const response = await this.operatingPeriodsModel
      .findById(id)
      .select('moneyMovements')
      .populate('moneyMovements')
      .lean();
    return response;
  }

  async findForConvert(id: string): Promise<OperatingPeriod> {
    return await this.operatingPeriodsModel.findById(id).lean();
  }

  async getTablePeriodRegister() {
    const branch = await this.branchModel.findById(branchId).select('operatingPeriod');
    const periodId = branch.operatingPeriod;
    const response = await this.operatingPeriodsModel
      .findById(periodId)
      .select('_id registers')
      .lean();
    return response;
  }

  async getWaitListRegisters() {
    const branch = await this.branchModel.findById(branchId).select('operatingPeriod');
    const periodId = branch.operatingPeriod;
    const response = await this.operatingPeriodsModel.findById(periodId).select('registers').lean();
    return response;
  }
}
