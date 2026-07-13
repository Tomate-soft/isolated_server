import { PipelineStage } from 'mongoose';

export function getAllproductsCancellationsListPipeline(period: string): PipelineStage[] {
  return [
    {
      $match: {
        operatingPeriod: period,
        product: { $exists: true, $ne: null },
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
    {
      $lookup: {
        from: 'bills',
        localField: 'accountId',
        foreignField: '_id',
        as: 'accountDetails',
      },
    },
    { $unwind: { path: '$authDetails', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$accountDetails' } },
    {
      $project: {
        operatingPeriod: 1,
        description: 1,
        cancellationReason: 1,
        createdAt: 1,
        productName: '$product.productName',
        tableNum: '$accountDetails.tableNum',

        // Manejo de monto (buscando en ambos nombres posibles de campo)
        amount: {
          $toDouble: {
            $ifNull: ['$cancelledAmount', { $ifNull: ['$amount', '0'] }],
          },
        },
        accountId: 1,
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
// --force
