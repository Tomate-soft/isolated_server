import { PipelineStage } from 'mongoose';

/**
 * @param {number} skip - El número de documentos a omitir (offset).
 * @param {number} limit - El número máximo de documentos a devolver.
 * @returns {Array} Un array que representa el pipeline de agregación.
 */
export function getAllBillsPipeline(page = 1, limit = 10): PipelineStage[] {
  const skip = (page - 1) * limit;

  // ATENCIÓN: Reemplaza 'notes_collection' y 'discounts' con los nombres reales
  // de tus colecciones en la base de datos para los lookups.
  const NOTES_COLLECTION_NAME = 'notes'; // Ejemplo: si el modelo Notes es 'Note', la colección puede ser 'notes'
  const DISCOUNT_COLLECTION_NAME = 'discounts'; // Ejemplo: si el modelo Discount es 'Discount', la colección puede ser 'discounts'

  return [
    // 1. POPULATE ANIDADO: Simular populate('notes', { populate: [{ path: 'discount' }] })

    // --- POPULATE notes ---
    {
      $lookup: {
        from: NOTES_COLLECTION_NAME,
        localField: 'notes',
        foreignField: '_id',
        as: 'notes',
      },
    },

    // Desanidar notes temporalmente para enlazar 'discount'
    // 'preserveNullAndEmptyArrays: true' mantiene las facturas sin notas.
    {
      $unwind: {
        path: '$notes',
        preserveNullAndEmptyArrays: true,
      },
    },

    // --- POPULATE notes.discount ---
    {
      $lookup: {
        from: DISCOUNT_COLLECTION_NAME,
        localField: 'notes.discount',
        foreignField: '_id',
        as: 'notes.discount',
      },
    },

    // Desanidar el resultado del discount (si se populó)
    {
      $unwind: {
        path: '$notes.discount',
        preserveNullAndEmptyArrays: true,
      },
    },

    // 2. REAGRUPAR: Reconstruir el array 'notes' populado dentro de cada factura.
    // Usamos $$ROOT para mantener todos los campos originales de la factura.
    {
      $group: {
        _id: '$_id',
        notes: { $push: '$notes' },
        root: { $first: '$$ROOT' },
      },
    },

    // Reemplazar la raíz del documento con el original, sobrescribiendo el campo 'notes' con el array populado.
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$root', { notes: '$notes' }],
        },
      },
    },

    // 3. PAGINACIÓN Y CONTEO: Usar $facet para hacer ambas operaciones en paralelo.
    {
      $facet: {
        bills: [
          // Ordenar: .sort({ createdAt: -1 })
          { $sort: { createdAt: -1 } },
          // Paginación: .skip(skip).limit(limit)
          { $skip: Number(skip) },
          { $limit: Number(limit) },
        ],
        billsCount: [
          // Conteo total: this.billsModel.countDocuments({})
          // Como no hay etapa $match antes, cuenta todos los documentos originales.
          { $count: 'count' },
        ],
      },
    },
  ];
}
