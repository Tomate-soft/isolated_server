import { PipelineStage, Types } from 'mongoose';
import { FINISHED_STATUS } from 'src/libs/status.libs';

export const getSellTypeSalesPipeline = (period: string): PipelineStage[] => {
  const periodObjectId = new Types.ObjectId(period);
  return [
    {
      $match: {
        operatingPeriod: periodObjectId,
        status: FINISHED_STATUS,
      },
    },
    {
      $group: {
        _id: '$userCode',
        user: { $first: '$user' },
        date: { $first: '$createdAt' },
        orders: { $sum: 1 },
        totalDiners: { $sum: '$diners' },
        total: {
          $sum: {
            $convert: {
              input: '$checkTotal',
              to: 'double',
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        user: 1,
        date: 1,
        orders: 1,
        total: 1,
        totalDiners: 1,
      },
    },
  ];
};

//  bebidasPorPersona: {
//           $round: [
//             {
//               $cond: {
//                 if: { $gt: ['$totalDiners', 0] },
//                 then: { $divide: ['$bebidasQty', '$totalDiners'] },
//                 else: 0,
//               },
//             },
//             2,
//           ],
//         },
