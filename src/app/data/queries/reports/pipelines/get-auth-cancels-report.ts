import { PipelineStage } from 'mongoose';

export function getAuthCancellationTotalByWaiterPipeline(period: string): PipelineStage[] {
  return [
    {
      $match: { operatingPeriod: period },
    },
    {
      $unionWith: {
        coll: 'cancellations',
        pipeline: [
          { $match: { operatingPeriod: period } },
          {
            $lookup: {
              from: 'users',
              localField: 'cancellationBy',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              cancellationBy: {
                $concat: [
                  // Convertimos el número a string aquí
                  { $toString: { $ifNull: ['$userDetails.employeeNumber', '0'] } },
                  '',
                  { $ifNull: ['$userDetails.name', ''] },
                  ' ',
                  { $ifNull: ['$userDetails.lastName', ''] },
                ],
              },
              amount: { $toDouble: { $ifNull: ['$cancelledAmount', '0'] } },
              operatingPeriod: 1,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: '$cancellationBy',
        totalAmount: { $sum: '$amount' },
        cancellationCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
    {
      $project: {
        _id: 0,
        waiter: '$_id',
        totalAmount: 1,
        cancellationCount: 1,
      },
    },
  ];
}
