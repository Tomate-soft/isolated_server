import { PipelineStage, Types } from 'mongoose';
import { unionOrdersStages } from './daily-closure-stages/union-orders';
import { FINISHED_STATUS } from 'src/libs/status.libs';

export function dailyClosurePipeline(operatingPeriodId: string): PipelineStage[] {
  const unionOrders = unionOrdersStages(operatingPeriodId);
  // force
  return [
    {
      $match: {
        operatingPeriod: new Types.ObjectId(operatingPeriodId),
        status: FINISHED_STATUS,
      },
    },
    ...unionOrders,
    {
      $group: {
        _id: null,
        main: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'onsite'] }, '$count', 0],
          },
        },
        togo: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'togo'] }, '$count', 0],
          },
        },
        rappi: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'rappi'] }, '$count', 0],
          },
        },
        phone: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'phone'] }, '$count', 0],
          },
        },
        onsiteSalesAmount: {
          $sum: { $cond: [{ $eq: ['$_id', 'onsite'] }, '$totalSalesAmount', 0] },
        },
        togoSalesAmount: { $sum: { $cond: [{ $eq: ['$_id', 'togo'] }, '$totalSalesAmount', 0] } },
        rappiSalesAmount: { $sum: { $cond: [{ $eq: ['$_id', 'rappi'] }, '$totalSalesAmount', 0] } },
        phoneSalesAmount: { $sum: { $cond: [{ $eq: ['$_id', 'phone'] }, '$totalSalesAmount', 0] } },

        // CASH by channel
        onsiteCash: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'onsite'] }, '$totalCashAmount', 0],
          },
        },
        togoCash: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'togo'] }, '$totalCashAmount', 0],
          },
        },

        rappiCash: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'rappi'] }, '$totalCashAmount', 0],
          },
        },
        phoneCash: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'phone'] }, '$totalCashAmount', 0],
          },
        },

        // DEBIT byChannel
        onsiteDebit: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'onsite'] }, '$totalDebitAmount', 0],
          },
        },
        togoDebit: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'togo'] }, '$totalDebitAmount', 0],
          },
        },
        rappiDebit: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'rappi'] }, '$totalDebitAmount', 0],
          },
        },
        phoneDebit: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'phone'] }, '$totalDebitAmount', 0],
          },
        },

        // CREDIT byChannel
        onsiteCredit: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'onsite'] }, '$totalCreditAmount', 0],
          },
        },
        togoCredit: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'togo'] }, '$totalCreditAmount', 0],
          },
        },
        rappiCredit: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'rappi'] }, '$totalCreditAmount', 0],
          },
        },
        phoneCredit: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'phone'] }, '$totalCreditAmount', 0],
          },
        },

        // TRANSFER byChannel
        onsiteTransfer: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'onsite'] }, '$totalTransferAmount', 0],
          },
        },
        togoTransfer: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'togo'] }, '$totalTransferAmount', 0],
          },
        },
        rappiTransfer: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'rappi'] }, '$totalTransferAmount', 0],
          },
        },
        phoneTransfer: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'phone'] }, '$totalTransferAmount', 0],
          },
        },

        // Qr byChannel
        onsiteQr: {
          $sum: { $cond: [{ $eq: ['$_id', 'onsite'] }, '$totalQrAmount', 0] },
        },
        togoQr: {
          $sum: { $cond: [{ $eq: ['$_id', 'togo'] }, '$totalQrAmount', 0] },
        },
        rappiQr: {
          $sum: { $cond: [{ $eq: ['$_id', 'rappi'] }, '$totalQrAmount', 0] },
        },
        phoneQr: {
          $sum: { $cond: [{ $eq: ['$_id', 'phone'] }, '$totalQrAmount', 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        mainOrders: '$main',
        togoOrders: '$togo',
        rappiOrders: '$rappi',
        phoneOrders: '$phone',
        totalOrders: { $add: ['$main', '$togo', '$rappi', '$phone'] },
        onsiteSalesAmount: '$onsiteSalesAmount',
        togoSalesAmount: '$togoSalesAmount',
        rappiSalesAmount: '$rappiSalesAmount',
        phoneSalesAmount: '$phoneSalesAmount',
        totalSalesAmount: {
          $add: [
            { $toDouble: { $ifNull: ['$onsiteSalesAmount', 0] } },
            { $toDouble: { $ifNull: ['$togoSalesAmount', 0] } },
            { $toDouble: { $ifNull: ['$rappiSalesAmount', 0] } },
            { $toDouble: { $ifNull: ['$phoneSalesAmount', 0] } },
          ],
        },

        onsiteCashAmount: '$onsiteCash',
        togoCashAmount: '$togoCash',
        rappiCashAmount: '$rappiCash',
        phoneCashAmount: '$phoneCash',
        totalCashAmount: {
          $add: [
            { $toDouble: { $ifNull: ['$onsiteCash', 0] } },
            { $toDouble: { $ifNull: ['$togoCash', 0] } },
            { $toDouble: { $ifNull: ['$rappiCash', 0] } },
            { $toDouble: { $ifNull: ['$phoneCash', 0] } },
          ],
        },

        onsiteDebitAmount: '$onsiteDebit',
        togoDebitAmount: '$togoDebit',
        rappiDebitAmount: '$rappiDebit',
        phoneDebitAmount: '$phoneDebit',
        totalDebitAmount: {
          $add: [
            { $toDouble: { $ifNull: ['$onsiteDebit', 0] } },
            { $toDouble: { $ifNull: ['$togoDebit', 0] } },
            { $toDouble: { $ifNull: ['$rappiDebit', 0] } },
            { $toDouble: { $ifNull: ['$phoneDebit', 0] } },
          ],
        },

        onsiteCreditAmount: '$onsiteCredit',
        togoCreditAmount: '$togoCredit',
        rappiCreditAmount: '$rappiCredit',
        phoneCreditAmount: '$phoneCredit',
        totalCreditAmount: {
          $add: [
            { $toDouble: { $ifNull: ['$onsiteCredit', 0] } },
            { $toDouble: { $ifNull: ['$togoCredit', 0] } },
            { $toDouble: { $ifNull: ['$rappiCredit', 0] } },
            { $toDouble: { $ifNull: ['$phoneCredit', 0] } },
          ],
        },

        onsiteTransferAmount: '$onsiteTransfer',
        togoTransferAmount: '$togoTransfer',
        rappiTransferAmount: '$rappiTransfer',
        phoneTransferAmount: '$phoneTransfer',
        totalTransferAmount: {
          $add: [
            { $toDouble: { $ifNull: ['$onsiteTransfer', 0] } },
            { $toDouble: { $ifNull: ['$togoTransfer', 0] } },
            { $toDouble: { $ifNull: ['$rappiTransfer', 0] } },
            { $toDouble: { $ifNull: ['$phoneTransfer', 0] } },
          ],
        },

        onsiteQrAmount: '$onsiteQr',
        togoQrAmount: '$togoQr',
        rappiQrAmount: '$rappiQr',
        phoneQrAmount: '$phoneQr',
        totalQrAmount: {
          $add: [
            { $toDouble: { $ifNull: ['$onsiteQr', 0] } },
            { $toDouble: { $ifNull: ['$togoQr', 0] } },
            { $toDouble: { $ifNull: ['$rappiQr', 0] } },
            { $toDouble: { $ifNull: ['$phoneQr', 0] } },
          ],
        },

        totalSellBychannels: {
          $add: [
            { $toDouble: { $ifNull: ['$onsiteCash', 0] } },
            { $toDouble: { $ifNull: ['$togoCash', 0] } },
            { $toDouble: { $ifNull: ['$rappiCash', 0] } },
            { $toDouble: { $ifNull: ['$phoneCash', 0] } },
            { $toDouble: { $ifNull: ['$onsiteDebit', 0] } },
            { $toDouble: { $ifNull: ['$togoDebit', 0] } },
            { $toDouble: { $ifNull: ['$rappiDebit', 0] } },
            { $toDouble: { $ifNull: ['$phoneDebit', 0] } },
            { $toDouble: { $ifNull: ['$onsiteCredit', 0] } },
            { $toDouble: { $ifNull: ['$togoCredit', 0] } },
            { $toDouble: { $ifNull: ['$rappiCredit', 0] } },
            { $toDouble: { $ifNull: ['$phoneCredit', 0] } },
            { $toDouble: { $ifNull: ['$onsiteTransfer', 0] } },
            { $toDouble: { $ifNull: ['$togoTransfer', 0] } },
            { $toDouble: { $ifNull: ['$rappiTransfer', 0] } },
            { $toDouble: { $ifNull: ['$phoneTransfer', 0] } },
            { $toDouble: { $ifNull: ['$onsiteQr', 0] } },
            { $toDouble: { $ifNull: ['$togoQr', 0] } },
            { $toDouble: { $ifNull: ['$rappiQr', 0] } },
            { $toDouble: { $ifNull: ['$phoneQr', 0] } },
          ],
        },
      },
    },
  ];
}

// 1.- vamos a sacar el total de ventas

//  const resumeData = {
//         state: State.CLOSED,
//         totalSellsAmount: totalSells,
//         totalRestaurantAmount: totalRestaurantSellsAmount,
//         totalToGoOrdersAmount: totalToGoSellsAmount,
//         totalPhoneAmount: totalPhoneSellsAmount,
//         totalQrAmount: totalQrSellsResponse.totalAmount,
//         totalRappiAmount: totalRappiSellsAmount,
//         togoOrdersTotal: totalToGoSellsCount,
//         totalCashInAmount: totalCashSellsAmount,
//         phoneOrdersTotal: totalPhoneSellsCount,
//         rappiOrdersTotal: totalRappiSellsCount,
//         totalDebitAmount: totalDebitSellsAmount,
//         totalCreditAmount: totalCreditSellsAmount,
//         totalTransferAmount: totalTransferSellsAmount,
//         restaurantOrdersTotal: totalRestaurantSellsCount,
//         finishedAccounts: accountsBilled.length,
//         totalDiners: totalDiners,
//         numberOfDiscounts: discountTotal.length,
//         discountTotalAmount: discountTotalAmount,
//         // discountsData: discountTotal.map((item) => item.toObject()),
//         numberOfCourtesy: courtesyTotal.length,
//         courtesyTotalAmount: courtesyTotalAmount,
//         // courtesyData: courtesyTotal.map((item) => item.toObject()),
//         numberOfCancellations: cancellationsArray.length,
//         cancellationsTotalAmount: cancellationsTotalAmount,
//         balanceSheet: balanceSheet,
//         // cancellationsData: cancellationTotal.map((item) => item.toObject()),
//       };
