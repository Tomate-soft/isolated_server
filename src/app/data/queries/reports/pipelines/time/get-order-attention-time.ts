import { PipelineStage, Types } from 'mongoose';
import { FINISHED_STATUS } from 'src/libs/status.libs';

export const getOrderAttentionTimePipeline = (period: string): PipelineStage[] => {
  const periodObjectId = new Types.ObjectId(period);

  return [
    {
      $match: {
        operatingPeriod: periodObjectId,
        status: FINISHED_STATUS,
        // Opcional: asegurarte de que ambos campos existan
        createdAt: { $exists: true },
        updatedAt: { $exists: true },
        // Opcional: updatedAt > createdAt
        $expr: { $gt: ['$updatedAt', '$createdAt'] },
      },
    },

    // 1. Calcular la diferencia en milisegundos
    {
      $addFields: {
        timeDiffMs: {
          $subtract: ['$updatedAt', '$createdAt'],
        },
      },
    },

    // 2. Convertir a segundos, minutos, horas (más legibles)
    {
      $addFields: {
        timeDiffSeconds: { $divide: ['$timeDiffMs', 1000] },
        timeDiffMinutes: { $divide: ['$timeDiffMs', 1000 * 60] },
        timeDiffHours: { $divide: ['$timeDiffMs', 1000 * 60 * 60] },
      },
    },

    // 3. Opcional: redondear para que sea más limpio
    {
      $addFields: {
        timeDiffSecondsRounded: { $round: ['$timeDiffSeconds', 0] },
        timeDiffMinutesRounded: { $round: ['$timeDiffMinutes', 1] }, // 1 decimal
        timeDiffHoursRounded: { $round: ['$timeDiffHours', 2] },
      },
    },

    // 4. Proyectar lo que te interesa (elige lo que necesites)
    {
      $project: {
        _id: 1,
        code: 1,
        tableNum: 1,
        userCode: 1,
        user: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        total: { $toDouble: '$checkTotal' },
        diners: 1,
        // Diferencias de tiempo (elige el formato que prefieras)
        timeDiffMs: 1,
        timeDiffSeconds: 1,
        timeDiffMinutes: '$timeDiffMinutesRounded',
        timeDiffHours: '$timeDiffHoursRounded',
        // Opcional: formato humano legible (string)
        tiempoFormateado: {
          $concat: [{ $toString: { $round: ['$timeDiffMinutesRounded', 1] } }, ' minutos'],
        },
      },
    },

    // Opcional: ordenar por el tiempo más largo primero
    { $sort: { tableNum: 1, timeDiffMs: 1 } },
  ];
};
// force
