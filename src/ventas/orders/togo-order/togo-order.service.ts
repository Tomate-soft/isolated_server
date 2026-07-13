import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createToGoOrderDto } from 'src/dto/ventas/orders/createToGoOrder.dto';
import { updateToGoOrderDto } from 'src/dto/ventas/orders/updateToGoOrder.dto';
import { Branch } from 'src/schemas/business/branchSchema';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { calculateBillTotal } from 'src/utils/business/CalculateTotals';
import { branchId } from 'src/variablesProvisionales';
import { InternProduct } from './types';

@Injectable()
export class TogoOrderService {
  constructor(
    @InjectModel(ToGoOrder.name) private toGoOrderModel: Model<ToGoOrder>,
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
    @InjectModel(OperatingPeriod.name)
    private operatingPeriodModel: Model<OperatingPeriod>,
  ) {}

  async update(id: string, body: updateToGoOrderDto) {
    const checkTotal = calculateBillTotal(body.products);
    const formatProducts = body.products.map((product: InternProduct) => {
      const { active, ...rest } = product;
      return {
        ...rest,
        active: true,
      };
    });

    const sendData = { ...body, checkTotal, products: formatProducts };
    return await this.toGoOrderModel.findByIdAndUpdate(id, sendData, {
      new: true,
    });
  }
  async create(body: createToGoOrderDto) {
    const session = await this.toGoOrderModel.startSession();

    try {
      let createdOrder; // Variable para almacenar el documento creado

      await session.withTransaction(async () => {
        // Lógica de la transacción

        const branch = await this.branchModel.findById(branchId).session(session);
        if (!branch) {
          throw new NotFoundException('No se encontró la sucursal.');
        }

        const periodId = branch.operatingPeriod;
        const operatingPeriod = await this.operatingPeriodModel.findById(periodId).session(session);

        if (!operatingPeriod) {
          throw new NotFoundException('No se encontró el período operativo.');
        }

        const lastOrderInPeriod = await this.toGoOrderModel
          .aggregate([
            {
              $match: {
                operatingPeriod: operatingPeriod._id,
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                code: 1,
              },
            },
          ])
          .session(session);

        const nextBillCode = lastOrderInPeriod.length
          ? this.getNextOrderCode(parseFloat(lastOrderInPeriod[0].code))
          : 1;

        const formatCode = this.formatCode(nextBillCode.toString());
        const formatProducts = body.products.map((product: InternProduct) => {
          const { active, ...rest } = product;
          return {
            ...rest,
            active: true,
          };
        });

        const newOrderData = {
          ...body,
          code: formatCode,
          operatingPeriod: operatingPeriod._id,
          products: formatProducts,
        };

        const newOrder = new this.toGoOrderModel(newOrderData);
        await newOrder.save({ session });

        // Asignar el documento creado a la variable de la función principal
        createdOrder = newOrder;
      });

      session.endSession();

      // Retornamos el documento que guardamos en la variable
      return createdOrder;
    } catch (error) {
      session.endSession();

      if (error.code === 11000) {
        throw new ConflictException('Ya existe una orden con estos datos.');
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error al crear la orden:', error);
      throw new InternalServerErrorException('Ocurrió un error inesperado al crear la orden.');
    }
  }

  async findAll() {
    return await this.toGoOrderModel.find();
  }

  // Método para obtener el siguiente código de orden
  private getNextOrderCode(lastOrderCode: number): number {
    // Incrementar el código de orden actual en 1
    return lastOrderCode + 1;
  }

  // Método para formatear a 6 dígitos
  private formatCode(code: string): string {
    return code.padStart(6, '0');
  }
}
