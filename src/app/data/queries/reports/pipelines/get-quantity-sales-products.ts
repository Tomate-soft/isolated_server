import { PipelineStage, Types } from 'mongoose';
import { FINISHED_STATUS } from 'src/libs/status.libs';

// Operador match primer etapa
export function getQuantitySalesProductsPipeline(period: string): PipelineStage[] {
  const periodObjectId = new Types.ObjectId(period);

  return [
    { $match: { status: FINISHED_STATUS, operatingPeriod: periodObjectId } },
    {
      $unwind: '$products',
    },
    {
      $addFields: {
        unitPrice: {
          $ifNull: [{ $arrayElemAt: ['$products.prices.price', 0] }, 0],
        },
      },
    },
    {
      $group: {
        _id: '$products.productName',
        totalQuantity: { $sum: '$products.quantity' },
        unitPrice: { $first: '$unitPrice' },
        totalRevenue: {
          $sum: {
            $multiply: ['$products.quantity', '$unitPrice'],
          },
        },
      },
    },
    {
      $sort: { totalQuantity: -1 },
    },
    {
      $project: {
        _id: 0,
        productName: '$_id',
        unitPrice: 1,
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
  ];
}
