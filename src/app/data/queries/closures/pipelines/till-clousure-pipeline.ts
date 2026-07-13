import { PipelineStage, Types } from 'mongoose';

export function tillClosurePipeline(operatingPeriodId: string): PipelineStage[] {
  return [
    {
      $match: {
        _id: new Types.ObjectId(operatingPeriodId),
      },
    },
    // {
    //   $group: {
    //     _id: '$code',
    //     total: { $sum: 1 },
    //   },
    // },
    // {
    //   $sort: {
    //     total: -1,
    //   },
    // },
  ];
}
