import { PipelineStage } from 'mongoose';

export const getProductsCourtesiesPipeline = (period: string): PipelineStage[] => {
  // redeploy --force
  return [
    {
      $match: {
        // Convertimos el string 'period' a ObjectId para que coincida con el tipo en BD
        operatingPeriod: period,
        discountType: 'COURTESY_APPLY_PRODUCTS',
      },
    },
    {
      $lookup: {
        from: 'bills', // ESCRIBELO EN MINÚSCULAS: es el estándar de MongoDB
        localField: 'accountId', // Ya es ObjectId, lo usamos directo
        foreignField: '_id',
        as: 'accountData',
      },
    },
    {
      $lookup: {
        from: 'users', // ESCRIBELO EN MINÚSCULAS
        localField: 'discountByUser', // Ya es ObjectId, lo usamos directo
        foreignField: '_id',
        as: 'userData',
      },
    },
    { $unwind: { path: '$accountData', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        // Convertimos montos de String a Number para cálculos
        discountMountNum: { $toDouble: '$discountMount' },
        totalDiscountQuantityNum: { $toDouble: '$totalDiscountQuantity' },
      },
    },
    {
      $project: {
        _id: 1,
        discountType: 1,
        discountMount: '$discountMountNum',
        totalDiscountQuantity: '$totalDiscountQuantityNum',
        discountReason: 1,
        productName: 1,
        discountFor: 1,
        accountInfo: {
          id: '$accountData._id',
          identifier: '$accountData.user',
          code: '$accountData.code',
        },
        userName: '$userData.name',
        createdAt: 1,
      },
    },
  ];
};
