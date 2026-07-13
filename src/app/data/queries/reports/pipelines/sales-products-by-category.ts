import { PipelineStage, Types } from 'mongoose';
import { FINISHED_STATUS } from 'src/libs/status.libs';

export const salesProductsByCategoryPipeline = (period: string): PipelineStage[] => {
  const periodObjectId = new Types.ObjectId(period);

  return [
    {
      $match: {
        operatingPeriod: periodObjectId,
        status: FINISHED_STATUS,
      },
    },
    // ← NUEVO: Calcula el tamaño del array ANTES de unwind (para cada orden original)
    {
      $addFields: {
        productCount: {
          $size: { $ifNull: ['$products', []] }, // maneja arrays vacíos/null → 0
        },
      },
    },
    {
      $unwind: '$products', // ahora unwind, pero ya tenemos productCount (mismo en todas las filas de la orden)
    },
    // Filtra solo si productCount > 0 (opcional, para evitar divide by 0, pero unwind ya ignora vacíos)
    {
      $match: { productCount: { $gt: 0 } },
    },
    {
      $group: {
        _id: '$userCode',
        user: { $first: '$user' },
        date: { $first: '$createdAt' }, // toma la primera fecha (puedes cambiar a $max si quieres la más reciente)

        // ← Corregido: ahora cuenta ÓRDENES reales (suma 1 / productCount por cada producto → 1 por orden)
        orders: {
          $sum: { $divide: [1, '$productCount'] }, // da float, puedes $round si quieres int
        },

        // ← Corregido: suma diners reales (diners / productCount por producto → diners por orden)
        totalDiners: {
          $sum: { $divide: ['$diners', '$productCount'] },
        },

        // Cantidad de bebidas (sin cambio, porque es por producto)
        products: {
          $sum: {
            $cond: [
              {
                $in: [
                  '$products.category',
                  [
                    'AGUAS FRESCAS',
                    'REFRESCOS',
                    'PREPARADOS SIN ALCOHOL',
                    'CERVEZAS',
                    'PREPARADOS CON ALCOHOL',
                  ],
                ],
              },
              { $toDouble: '$products.quantity' },
              0,
            ],
          },
        },

        // ← Corregido: suma total real (checkTotal / productCount por producto → checkTotal por orden)
        total: {
          $sum: { $divide: [{ $toDouble: '$checkTotal' }, '$productCount'] },
        },
      },
    },
    {
      $project: {
        _id: 1,
        user: 1,
        date: 1,
        orders: 1,
        totalDiners: 1,
        products: 1, // cantidad total de bebidas (unidades)
        total: 1,
      },
    },
    // Opcional: redondear si orders/diners/totalDiners salen con decimales raros
    // { $addFields: { orders: { $round: ['$orders', 0] }, totalDiners: { $round: ['$totalDiners', 0] }, total: { $round: ['$total', 2] } } }
  ];
};
