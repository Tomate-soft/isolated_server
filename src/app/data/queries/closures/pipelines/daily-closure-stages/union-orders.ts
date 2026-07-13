import { PipelineStage, Types } from 'mongoose';
import { orderPipeline } from './match-order';
import { lookPaymentsStages } from './look-payments';
import { FINISHED_STATUS } from 'src/libs/status.libs';

type OrderSource = 'onsite' | 'togo' | 'rappi' | 'phone';

const sources: { collection: string; label: OrderSource }[] = [
  { collection: 'togoorders', label: 'togo' },
  { collection: 'rappiorders', label: 'rappi' },
  { collection: 'phoneorders', label: 'phone' },
];

export const unionOrdersStages = (operatingPeriodId: string): PipelineStage[] => {
  const paymentStage = lookPaymentsStages();

  const initialGroup: PipelineStage[] = [
    {
      $match: {
        operatingPeriod: new Types.ObjectId(operatingPeriodId),
        status: FINISHED_STATUS,
      },
    },
    ...paymentStage, // Aquí ocurre el flatMap de transacciones

    // PASO 1: Agrupar por CADA ORDEN para limpiar duplicados
    {
      $group: {
        _id: '$_id', // Agrupamos por el ID único de la orden
        // Tomamos el checkTotal una sola vez (evita inflar la venta)
        orderTotal: {
          $first: {
            $convert: {
              input: { $trim: { input: { $ifNull: ['$checkTotal', '0'] }, chars: 's$ ' } },
              to: 'double',
              onError: 0,
              onNull: 0,
            },
          },
        },
        // Sumamos las transacciones de cash de ESTA orden específica
        orderCashAmount: {
          $sum: {
            $cond: [
              { $eq: ['$paymentDetails.transactions.paymentType', 'cash'] },
              {
                $convert: {
                  input: '$paymentDetails.transactions.payQuantity',
                  to: 'double',
                  onError: 0,
                  onNull: 0,
                },
              },
              0,
            ],
          },
        },
        orderDebitAmount: {
          $sum: {
            $cond: [
              { $eq: ['$paymentDetails.transactions.paymentType', 'debit'] },
              {
                $convert: {
                  input: '$paymentDetails.transactions.payQuantity',
                  to: 'double',
                  onError: 0,
                  onNull: 0,
                },
              },
              0,
            ],
          },
        },
        orderCreditAmount: {
          $sum: {
            $cond: [
              { $eq: ['$paymentDetails.transactions.paymentType', 'credit'] },
              {
                $convert: {
                  input: '$paymentDetails.transactions.payQuantity',
                  to: 'double',
                  onError: 0,
                  onNull: 0,
                },
              },
              0,
            ],
          },
        },
        orderTransferAmount: {
          $sum: {
            $cond: [
              { $eq: ['$paymentDetails.transactions.paymentType', 'transfer'] },
              {
                $convert: {
                  input: '$paymentDetails.transactions.payQuantity',
                  to: 'double',
                  onError: 0,
                  onNull: 0,
                },
              },
              0,
            ],
          },
        },
        orderQrAmount: {
          $sum: {
            $cond: [
              { $eq: ['$paymentDetails.transactions.paymentType', 'qrCode'] },
              {
                $convert: {
                  input: '$paymentDetails.transactions.payQuantity',
                  to: 'double',
                  onError: 0,
                  onNull: 0,
                },
              },
              0,
            ],
          },
        },
      },
    },

    // PASO 2: Agrupar TODO para el reporte de 'onsite'
    {
      $group: {
        _id: { $literal: 'onsite' },
        count: { $sum: 1 }, // Ahora sí, cada documento es 1 orden real
        totalCashAmount: { $sum: '$orderCashAmount' },
        totalDebitAmount: { $sum: '$orderDebitAmount' },
        totalCreditAmount: { $sum: '$orderCreditAmount' },
        totalTransferAmount: { $sum: '$orderTransferAmount' },
        totalQrAmount: { $sum: '$orderQrAmount' },
        totalSalesAmount: { $sum: '$orderTotal' },
      },
    },
  ];

  const unionStages = sources.map(({ collection, label }) => ({
    $unionWith: {
      coll: collection,
      pipeline: orderPipeline(operatingPeriodId, label),
    },
  }));

  return [...initialGroup, ...unionStages] as PipelineStage[];
};
