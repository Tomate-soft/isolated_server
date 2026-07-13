import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bills } from '@schema/sales/bills.schema';

@Injectable()
export class BillHistoryService {
  constructor(
    @InjectModel(Bills.name, 'RS_HISTORICAL')
    private readonly billModelHist: Model<Bills>,
    @InjectModel(Bills.name)
    private readonly billModelRS0: Model<Bills>,
  ) {}

  // Consultar todos los bills históricos
  async findAll(): Promise<Bills[]> {
    return this.billModelHist.find().lean();
  }

  // Crear uno o varios bills históricos
  async create(bills: Partial<Bills> | Partial<Bills>[]): Promise<void> {
    if (!bills) return;
    const data = Array.isArray(bills) ? bills : [bills];
    if (data.length === 0) return;

    await this.billModelHist.insertMany(data, { ordered: false });
    console.log(`Insertados ${data.length} bills en rs_historical`);
  }

  async syncFromRS0Safe(batchSize = 1000, maxRetries = 3): Promise<void> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const bills = await this.billModelRS0.find().limit(batchSize).lean();

        if (bills.length === 0) {
          console.log('No hay bills para sincronizar');
          return;
        }

        // Insertar en histórica
        await this.billModelHist.insertMany(bills, { ordered: false });
        // Borrar de rs0
        await this.billModelRS0.deleteMany({
          _id: { $in: bills.map((b) => b._id) },
        });

        console.log(`Sincronizados ${bills.length} bills y rs0 vaciada`);
        break;
      } catch (err) {
        console.error(`Error al sincronizar (intento ${attempt + 1}):`, err.message);
        attempt++;
        if (attempt >= maxRetries) throw new Error('Fallaron todos los intentos de sincronización');
        console.log('Reintentando...');
      }
    }
  }

  //   async syncFromRS0WithTransaction(
  //     maxRetries = 3,
  //     batchSize = 1000,
  //   ): Promise<void> {
  //     let attempt = 0;
  //     while (attempt < maxRetries) {
  //       const session = await this.billModelRS0.db.startSession();
  //       try {
  //         session.startTransaction();

  //         const billsBatch = await this.billModelRS0
  //           .find()
  //           .limit(batchSize)
  //           .session(session)
  //           .lean();

  //         if (billsBatch.length === 0) {
  //           console.log('No hay bills para sincronizar');
  //           await session.endSession();
  //           return;
  //         }

  //         await this.billModelHist.insertMany(billsBatch, {
  //           ordered: false,
  //           session,
  //         });
  //         await this.billModelRS0
  //           .deleteMany({ _id: { $in: billsBatch.map((b) => b._id) } })
  //           .session(session);

  //         await session.commitTransaction();
  //         console.log(`Sincronizados ${billsBatch.length} bills y rs0 vaciada`);
  //         await session.endSession();
  //         break; // Si todo va bien, salimos del while
  //       } catch (err) {
  //         console.error(
  //           `Error en transacción (intento ${attempt + 1}):`,
  //           err.message,
  //         );
  //         await session.abortTransaction();
  //         await session.endSession();
  //         attempt++;
  //         if (attempt >= maxRetries)
  //           throw new Error('Fallaron todos los intentos de sincronización');
  //         console.log('Reintentando...');
  //       }
  //     }
  //   }
}
