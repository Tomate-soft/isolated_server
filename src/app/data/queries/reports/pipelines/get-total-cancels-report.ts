import { PipelineStage } from 'mongoose';

export function getCancellationTotalByWaiterPipeline(period: string): PipelineStage[] {
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
            $project: {
              cancellationFor: 1,
              // Convertimos el string a double y lo renombramos a 'amount'
              amount: { $toDouble: '$cancelledAmount' },
              operatingPeriod: 1,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: '$cancellationFor',
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
