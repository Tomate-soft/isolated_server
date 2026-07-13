import { PipelineStage } from 'mongoose';

export function findByOperatingPeriodPipeline(
  operatingPeriod: string,
  page: number,
  limit: number,
): PipelineStage[] {
  const skip = (page - 1) * limit;

  return [
    {
      $match: { operatingPeriod },
    },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'notes',
              localField: 'notes',
              foreignField: '_id',
              as: 'notes',
            },
          },
          {
            $unwind: { path: '$notes', preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: 'discounts',
              localField: 'notes.discount',
              foreignField: '_id',
              as: 'notes.discount',
            },
          },
        ],
        count: [{ $count: 'total' }],
      },
    },
    {
      $project: {
        data: 1,
        count: { $arrayElemAt: ['$count.total', 0] },
      },
    },
  ];
}
