import { PipelineStage } from 'mongoose';

export const lookPaymentsStages = (): PipelineStage[] => {
  return [
    // 1. Traer el documento de pago desde la colección 'payments'
    {
      $lookup: {
        from: 'payments',
        localField: 'payment',
        foreignField: '_id',
        as: 'paymentDetails',
      },
    },
    // 2. Aplanar el Pago (Primer flatMap: de array a objeto)
    {
      $unwind: {
        path: '$paymentDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    // 3. Aplanar las transacciones inyectadas (Segundo flatMap)
    // Esto descompone el array 'transactions' que ya vive dentro de paymentDetails
    {
      $unwind: {
        path: '$paymentDetails.transactions',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
};
