import { PipelineStage, Types } from 'mongoose';
import { FINISHED_STATUS } from 'src/libs/status.libs';
import { lookPaymentsStages } from './look-payments';

export const orderPipeline = (operatingPeriodId: string, label: string): PipelineStage[] => {
  const paymentStage = lookPaymentsStages();

  return [
    {
      $match: {
        operatingPeriod: new Types.ObjectId(operatingPeriodId),
        status: FINISHED_STATUS,
      },
    },
    ...paymentStage, // Buscamos los pagos de Rappi/Togo/Phone
    {
      $group: {
        _id: '$_id',
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
    {
      $group: {
        _id: { $literal: label }, // Aquí el label será 'rappi', 'togo', etc.
        count: { $sum: 1 },
        totalCashAmount: { $sum: '$orderCashAmount' },
        totalSalesAmount: { $sum: '$orderTotal' },
        totalDebitAmount: { $sum: '$orderDebitAmount' },
        totalCreditAmount: { $sum: '$orderCreaditAmount' },
        totalTransferAmount: { $sum: '$orderTransferAmount' },
        totalQrAmount: { $sum: '$orderQrAmount' },
      },
    },
  ];
};
