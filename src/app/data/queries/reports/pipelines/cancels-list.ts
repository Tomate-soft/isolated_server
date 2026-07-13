import { PipelineStage } from 'mongoose';

export function getAllGeneralCancellationsListPipeline(period: string): PipelineStage[] {
  return [
    {
      $match: {
        operatingPeriod: period,
        // Filtramos para obtener solo las que NO tienen la propiedad product
        $or: [{ product: { $exists: false } }, { product: null }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'cancellationBy',
        foreignField: '_id',
        as: 'authDetails',
      },
    },
    { $unwind: { path: '$authDetails', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        operatingPeriod: 1,
        description: 1,
        cancellationReason: 1,
        createdAt: 1,
        cancelType: 1,
        code: 1,
        // Como no hay producto, este campo no se proyecta o se marca como 'Orden Completa'
        productName: { $literal: 'Orden Completa' },

        amount: {
          $toDouble: {
            $ifNull: ['$cancelledAmount', { $ifNull: ['$amount', '0'] }],
          },
        },

        waiter: '$cancellationFor',
        authorizedBy: {
          $concat: [
            { $toString: { $ifNull: ['$authDetails.employeeNumber', '0'] } },
            ' - ',
            { $ifNull: ['$authDetails.name', ''] },
            ' ',
            { $ifNull: ['$authDetails.lastName', ''] },
          ],
        },
      },
    },
    { $sort: { createdAt: -1 } },
  ];
}
