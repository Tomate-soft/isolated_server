import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bills } from '@schema/sales/bills.schema';

@Injectable()
export class BillHistoryService {
  constructor(
    // @InjectModel(Bills.name, 'RS_HISTORICAL')
    // private readonly billModelHist: Model<Bills>,
    @InjectModel(Bills.name)
    private readonly billModelRS0: Model<Bills>,
  ) {}

  // Consultar todos los bills históricos
  async findAll()/*: Promise<Bills[]> */ {
    console.log("findAll called");
    // return this.billModelHist.find().lean();
  }

  // Crear uno o varios bills históricos
  async create(bills: Partial<Bills> | Partial<Bills>[]) /*: Promise<void> */{
    console.log("create called with bills:", bills);
    // if (!bills) return;
    // const data = Array.isArray(bills) ? bills : [bills];
    // if (data.length === 0) return;

    // await this.billModelHist.insertMany(data, { ordered: false });
    // console.log(`Insertados ${data.length} bills en rs_historical`);
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
        // await this.billModelHist.insertMany(bills, { ordered: false });
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
}
