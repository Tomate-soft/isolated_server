import { PipelineStage } from 'mongoose';

export function getPeriodsByMonthPipeline(start: Date, end: Date): PipelineStage[] {
  return [
    {
      // 1. Filtrar los periodos operativos del mes
      $match: {
        createdAt: { $gte: start, $lt: end },
      },
    },
    {
      // 2. Traer las cuentas vinculadas al periodo operativo
      $lookup: {
        from: 'bills',
        localField: '_id',
        foreignField: 'operatingPeriod',
        as: 'invoicedAccounts',
      },
    },
    {
      // 3. Traer los pagos relacionados de golpe
      $lookup: {
        from: 'payments',
        localField: 'invoicedAccounts.payment',
        foreignField: '_id',
        as: 'allPayments',
      },
    },
    {
      // 4. Filtrar, Formatear y Recortar propiedades pesadas
      $project: {
        _id: 1,
        status: 1,
        createdAt: 1,
        operationalClousure: 1,

        // Aquí limpiamos el array dejando SOLO las propiedades necesarias de la cuenta
        invoicedAccounts: {
          $map: {
            input: {
              // Primero filtramos para quedarnos solo con las facturadas
              $filter: {
                input: '$invoicedAccounts',
                as: 'bill',
                cond: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: '$allPayments',
                          as: 'payment',
                          cond: {
                            $and: [
                              { $in: ['$$payment._id', { $ifNull: ['$$bill.payment', []] }] },
                              { $eq: ['$$payment.billing', true] }
                            ]
                          }
                        }
                      }
                    },
                    0
                  ]
                }
              }
            },
            as: 'b',
            in: {
              // --- ELIGE AQUÍ QUÉ PROPIEDADES DEJAR ---
              id: { $toString: '$$b._id' }, // Mapeamos a string plano de una vez
              code: '$$b.code',
              sellType: '$$b.sellType',
              checkTotal: '$$b.checkTotal',
              status: '$$b.status',
              tableNum: '$$b.tableNum',
              user: '$$b.user',
              createdAt: '$$b.createdAt'
              // Rompemos la referencia a 'products', 'notes', 'transferHistory', etc.
            }
          }
        },

        // Contador de cuentas facturadas (Misma lógica sobre las filtradas)
        totalInvoicedAccounts: {
          $size: {
            $filter: {
              input: '$invoicedAccounts',
              as: 'bill',
              cond: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$allPayments',
                        as: 'payment',
                        cond: {
                          $and: [
                            { $in: ['$$payment._id', { $ifNull: ['$$bill.payment', []] }] },
                            { $eq: ['$$payment.billing', true] }
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              }
            }
          }
        },

        // Extraer el folio numérico más grande (últimos 3 dígitos)
        highestFolioNumber: {
          $max: {
            $map: {
              input: {
                $filter: {
                  input: '$invoicedAccounts',
                  as: 'bill',
                  cond: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: '$allPayments',
                            as: 'payment',
                            cond: {
                              $and: [
                                { $in: ['$$payment._id', { $ifNull: ['$$bill.payment', []] }] },
                                { $eq: ['$$payment.billing', true] }
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              }
            }
          },
              as: 'b',
              in: { $toInt: { $substr: ['$$b.code', 3, 3] } }
            }
          }
        }
      }
    },
    {
      // 5. Proyecto de salida limpia
      $project: {
        _id: 1,
        status: 1,
        createdAt: 1,
        operationalClousure: 1,
        invoicedAccounts: 1,
        totalInvoicedAccounts: 1,
        highestFolioNumber: { $ifNull: ['$highestFolioNumber', 0] }
      }
    },
    {
      // 6. Ordenar cronológicamente
      $sort: { createdAt: 1 },
    },
  ];
}