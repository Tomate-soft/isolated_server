import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, ClientSession } from 'mongoose';
import { CreateBillDto } from 'src/dto/ventas/bills/createBill.Dto';
import { UpdateBillDto } from 'src/dto/ventas/bills/updateBill.Dto';
import { Bills } from '@schema/sales/bills.schema';
import { BILL_TO_BILL, BILL_TO_NOTE, NOTE_TO_BILL, NOTE_TO_NOTE } from './cases';
import { Notes } from 'src/schemas/ventas/notes.schema';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { OperatingPeriodService } from 'src/operating-period/operating-period.service';
import { PhoneOrder } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { RappiOrder } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { ToGoOrder } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { User } from 'src/schemas/users.schema';
import { Table } from 'src/schemas/tables/tableSchema';
import { ENABLE_STATUS, FINISHED_STATUS } from 'src/libs/status.libs';
import { calculateBillTotal } from 'src/utils/business/CalculateTotals';
// import { RedisService } from 'src/data/redis/redis.service';
import { BillsCounter } from 'src/schemas/counters/billsCounter.schema';

@Injectable()
export class BillsService {
  private readonly logger = new Logger(BillsService.name);
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY_MS = 400;
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(ToGoOrder.name) private toGoOrderModel: Model<ToGoOrder>,
    @InjectModel(RappiOrder.name) private rappiOrderModel: Model<RappiOrder>,
    @InjectModel(PhoneOrder.name) private phoneOrderModel: Model<PhoneOrder>,
    @InjectModel(Bills.name) private billsModel: Model<Bills>,
    @InjectModel(BillsCounter.name)
    private billsCounterModel: Model<BillsCounter>,
    @InjectModel(Notes.name) private noteModel: Model<Notes>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
    @InjectModel(OperatingPeriod.name)
    private operatingPeriodModel: Model<OperatingPeriod>,
    private readonly operatingPeriodService: OperatingPeriodService,
    // private readonly redisService: RedisService,
  ) {}

  async findAll() {
    try {
      return await this.billsModel
        .find()
        .populate({
          path: 'payment',
        })
        .populate({
          path: 'notes',
          populate: { path: 'discount' },
        })
        .populate({ path: 'discount' });
    } catch (error) {
      throw new Error(error);
    }
  }

  // async changeWaiterService(id: string, body: { userId: string }) {
  //   const session = await this.connection.startSession();

  //   try {
  //     return await session.withTransaction(
  //       async () => {
  //         // 1. Obtener datos necesarios en paralelo
  //         const [currentTable, newUser] = await Promise.all([
  //           this.tableModel.findById(id).select('user bill').session(session).lean().exec(),
  //           this.userModel
  //             .findById(body.userId)
  //             .select('name lastName employeeNumber')
  //             .session(session)
  //             .lean()
  //             .exec(),
  //         ]);

  //         // Validaciones
  //         if (!currentTable) {
  //           throw new Error(`Table with id ${id} not found`);
  //         }
  //         if (!newUser) {
  //           throw new Error(`User with id ${body.userId} not found`);
  //         }
  //         if (!currentTable.bill?.[0]) {
  //           throw new Error(`Table ${id} has no associated bill`);
  //         }

  //         const oldUserId = currentTable.user;
  //         const billId = currentTable.bill[0];
  //         const newUserId = body.userId;

  //         // 2. Preparar operaciones bulk para usuarios
  //         const userUpdates = [];

  //         // Agregar mesa al nuevo usuario
  //         userUpdates.push(
  //           this.userModel
  //             .updateOne(
  //               { _id: newUserId },
  //               { $addToSet: { tables: id } }, // addToSet evita duplicados
  //               { session },
  //             )
  //             .exec(),
  //         );

  //         // Remover mesa del usuario anterior (si existe y es diferente)
  //         if (oldUserId && oldUserId.toString() !== newUserId.toString()) {
  //           userUpdates.push(
  //             this.userModel
  //               .updateOne({ _id: oldUserId }, { $pull: { tables: id } }, { session })
  //               .exec(),
  //           );
  //         }

  //         // 3. Ejecutar todas las actualizaciones en paralelo
  //         const [updatedBill] = await Promise.all([
  //           // Actualizar factura
  //           this.billsModel
  //             .findByIdAndUpdate(
  //               billId,
  //               {
  //                 user: `${newUser.name} ${newUser.lastName}`,
  //                 userCode: newUser.employeeNumber,
  //                 userId: newUser._id,
  //               },
  //               { new: true, session },
  //             )
  //             .lean()
  //             .exec(),
  //           // Actualizar mesa
  //           this.tableModel.updateOne({ _id: id }, { user: newUserId }, { session }).exec(),
  //           // Actualizar usuarios
  //           ...userUpdates,
  //         ]);

  //         if (!updatedBill) {
  //           throw new Error(`Failed to update bill ${billId}`);
  //         }

  //         return updatedBill;
  //       },
  //       {
  //         readPreference: 'primary',
  //         readConcern: { level: 'local' },
  //         writeConcern: { w: 'majority' },
  //       },
  //     );
  //   } catch (error) {
  //     throw new Error(`Failed to change waiter: ${error.message}`);
  //   } finally {
  //     await session.endSession();
  //   }
  // }

  async changeWaiterService(id: string, body: { userId: string }) {
    const session = await this.connection.startSession();
    try {
      const result = await session.withTransaction(
        async () => {
          // 1. Leer documentos necesarios
          const currentTable = await this.tableModel
            .findById(id)
            .select('user bill')
            .session(session)
            .exec();

          const newUser = await this.userModel
            .findById(body.userId)
            .select('name lastName employeeNumber')
            .session(session)
            .exec();

          // Validaciones
          if (!currentTable) {
            throw new Error(`Mesa con id ${id} no encontrada`);
          }

          if (!newUser) {
            throw new Error(`Usuario con id ${body.userId} no encontrado`);
          }

          if (!currentTable.bill?.length) {
            throw new Error(`La mesa ${id} no tiene cuenta asociada`);
          }

          const oldUserId = currentTable.user;
          const billId = currentTable.bill[0]; // asumiendo que bill es un array y tomas el primero
          const newUserId = body.userId;

          // 2. Actualizar la cuenta (bill) → esta sí la necesitamos de vuelta
          const updatedBill = await this.billsModel.findByIdAndUpdate(
            billId,
            {
              $set: {
                user: `${newUser.name} ${newUser.lastName}`,
                userCode: newUser.employeeNumber,
                userId: newUser._id,
              },
            },
            {
              new: true, // devolver el documento actualizado
              session,
            },
          );

          if (!updatedBill) {
            throw new Error(`No se pudo actualizar la cuenta ${billId}`);
          }

          // 3. Actualizar la mesa con el nuevo mesero
          const tableUpdate = await this.tableModel.updateOne(
            { _id: id },
            { $set: { user: newUserId } },
            { session },
          );

          if (tableUpdate.matchedCount === 0) {
            throw new Error(`No se encontró la mesa al intentar actualizarla`);
          }

          // 4. Agregar la mesa al nuevo mesero
          await this.userModel.updateOne(
            { _id: newUserId },
            { $addToSet: { tables: id } },
            { session },
          );

          // 5. Quitar la mesa del mesero anterior (solo si existe y es diferente)
          if (oldUserId && oldUserId.toString() !== newUserId.toString()) {
            await this.userModel.updateOne(
              { _id: oldUserId },
              { $pull: { tables: id } },
              { session },
            );
          }

          // Todo salió bien → devolvemos la cuenta actualizada (o lo que necesites)
          return updatedBill;
        },
        {
          // Opciones recomendadas para transacciones
          readConcern: { level: 'snapshot' },
          writeConcern: { w: 'majority' },
          maxTimeMS: 8000, // evita que se quede colgada demasiado tiempo
        },
      );

      return result;
    } catch (error: any) {
      console.error('Error al cambiar mesero:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });

      // Puedes relanzar o transformar el error según tu estrategia
      throw new Error(`Fallo al cambiar mesero: ${error.message}`);
    } finally {
      await session.endSession();
    }
  }

  async findOne(id: string) {
    try {
      return await this.billsModel
        .findById(id)
        .populate({
          path: 'payment',
        })
        .populate({
          path: 'notes',
          populate: { path: 'discount' },
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  // async create(createBill: CreateBillDto) {
  //   try {
  //     // Obtenemos el inicio y fin del día actual
  //     const startOfDay = new Date();
  //     startOfDay.setHours(0, 0, 0, 0);
  //     const endOfDay = new Date();
  //     endOfDay.setHours(23, 59, 59, 999);

  //     // Ejecutamos todas las consultas en paralelo usando Promise.all
  //     const [table, user, period, lastBill] = await Promise.all([
  //       this.tableModel.findById(createBill.table).select('tableNum').lean(),
  //       this.userModel
  //         .findById(createBill.user)
  //         .select('name lastName employeeNumber')
  //         .lean(),
  //       this.operatingPeriodService.getCurrent(),
  //       this.billsModel
  //         .findOne({
  //           table: createBill.table, // Usamos directamente el ObjectId de la mesa
  //           createdAt: { $gte: startOfDay, $lte: endOfDay },
  //         })
  //         .select('code')
  //         .sort({ code: -1 })
  //         .lean(),
  //     ]);

  //     // Calculamos el siguiente número de factura
  //     let nextBillNumber = 1;
  //     if (lastBill?.code) {
  //       const lastConsecutive = parseInt(lastBill.code.slice(-3));
  //       nextBillNumber = lastConsecutive + 1;
  //     }

  //     // Formateamos el código: mesa(3) + consecutivo(3)
  //     const formatCode = `${table.tableNum.toString().padStart(3, '0')}${nextBillNumber
  //       .toString()
  //       .padStart(3, '0')}`;

  //     // Creamos la factura con todos los datos
  //     const billToCreate = new this.billsModel({
  //       ...createBill,
  //       code: formatCode,
  //       user: `${user.name} ${user.lastName}`,
  //       userCode: user.employeeNumber.toString(),
  //       userId: createBill.user,
  //       products: createBill.products,
  //       tableNum: table.tableNum,
  //       table: createBill.table,
  //       operatingPeriod: period[0]._id,
  //     });

  //     await billToCreate.save();
  //     return billToCreate;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  private getNextBillCode(lastBillCode: number): number {
    const lastBillCodeString = lastBillCode.toString();
    const billFolio = lastBillCodeString.slice(2);
    return parseInt(billFolio) + 1;
  }

  async delete(id: string) {
    return await this.billsModel.findByIdAndDelete(id);
  }
  ///////////////

  async recommandBillService(id: string, body: { products: any[] }, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const currentBill = await this.billsModel.findById(id);

      if (!currentBill) {
        throw new NotFoundException('Cuenta no encontrada');
      }
      if (currentBill.status === FINISHED_STATUS) {
        throw new NotFoundException('La cuenta ya ha sido cobrada');
      }

      // 🔧 AQUÍ ESTÁ EL CAMBIO: Merge inteligente de productos
      const mergedProducts = this.mergeProductsWithConcurrencyRobust(
        currentBill.products || [],
        body.products,
      );

      const sendProducts = mergedProducts.map((p) => ({
        ...p,
        active: true,
      }));

      const updatedBill = await this.billsModel.findOneAndUpdate(
        { _id: id, __v: currentBill.__v },
        {
          $set: {
            products: sendProducts,
          },
          $inc: { __v: 1 },
        },
        { new: true },
      );

      if (updatedBill) {
        return updatedBill; // ✅ se actualizó correctamente
      }

      // 🔄 si no se pudo actualizar (conflicto), hacemos un pequeño delay antes del siguiente intento
      await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms de espera
    }

    // Si llega aquí, después de N intentos, lanzamos excepción
    throw new ConflictException(
      'No se pudo actualizar la cuenta después de varios intentos. Intenta de nuevo.',
    );
  }

  // 🔧 Método auxiliar para hacer el merge inteligente
  private mergeProductsWithConcurrency(currentProducts: any[], incomingProducts: any[]) {
    console.log('Productos actuales en BD:', currentProducts.length);
    console.log('Productos enviados desde frontend:', incomingProducts.length);

    // 1. Crear mapa de productos actuales para búsqueda eficiente
    const currentProductsMap = new Map();
    currentProducts.forEach((product) => {
      const key = product.id || product._id?.toString();
      if (key) {
        currentProductsMap.set(key, product);
      }
    });

    // 2. Separar productos usando la propiedad active
    const existingProducts = incomingProducts.filter((p) => p.active === true);
    const newProducts = incomingProducts.filter((p) => p.active !== true); // Sin active o active: false

    console.log(`Separados: ${existingProducts.length} existentes, ${newProducts.length} nuevos`);

    // 3. Empezar con productos actuales de BD
    let mergedProducts = [...currentProducts];

    // 4. Actualizar productos existentes (que tienen active: true)
    existingProducts.forEach((incomingProduct) => {
      const index = mergedProducts.findIndex(
        (existing) =>
          (existing.id || existing._id?.toString()) ===
          (incomingProduct.id || incomingProduct._id?.toString()),
      );

      if (index !== -1) {
        mergedProducts[index] = {
          ...mergedProducts[index],
          ...incomingProduct,
          id: mergedProducts[index].id || mergedProducts[index]._id, // Mantener ID original
        };
      }
    });

    // 5. Agregar productos nuevos con IDs únicos
    const newProductsWithIds = newProducts.map((product) => {
      const cleanProduct = { ...product };

      return {
        ...cleanProduct,
        id: this.generateUniqueId(),
        createdAt: new Date(),
      };
    });

    // 6. Combinar todo
    const result = [...mergedProducts, ...newProductsWithIds];
    console.log('Productos finales:', result.length);

    return result;
  }

  // 🆔 Generar _id único para line items (compatible con MongoDB)
  private generateUniqueId(): string {
    // Generar ObjectId válido manualmente
    const timestamp = Math.floor(Date.now() / 1000)
      .toString(16)
      .padStart(8, '0');
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('');

    return timestamp + randomHex;

    // 🔧 ALTERNATIVA: Si tienes mongoose o mongodb driver:
    // return new mongoose.Types.ObjectId().toString();
    // return new ObjectId().toString();
  }

  // 🎯 VERSIÓN ALTERNATIVA: Si prefieres usar ObjectId
  private generateUniqueIdWithObjectId(): string {
    // Si usas mongoose:
    // return new mongoose.Types.ObjectId().toString();

    // Si usas MongoDB driver nativo:
    // return new ObjectId().toString();

    // Versión manual compatible:
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 🔧 VERSIÓN MÁS ROBUSTA del merge (opcional)
  private mergeProductsWithConcurrencyRobust(currentProducts: any[], incomingProducts: any[]) {
    const existingProducts = incomingProducts.filter((p) => p.active === true);
    const newProducts = incomingProducts.filter((p) => p.active === false);

    // 1. Crear mapa de productos actuales para búsqueda eficiente
    const currentProductsMap = new Map();
    currentProducts.forEach((product, index) => {
      const key = product.id || product._id?.toString();
      if (key) {
        currentProductsMap.set(key, { product, index });
      }
    });

    // 2. Clonar array actual para modificarlo
    let mergedProducts = [...currentProducts];

    // 3. Actualizar productos existentes
    existingProducts.forEach((incomingProduct) => {
      const existing = currentProductsMap.get(incomingProduct.id);

      if (existing) {
        // Actualizar producto existente manteniendo campos importantes
        mergedProducts[existing.index] = {
          ...existing.product,
          ...incomingProduct,
          id: existing.product.id || existing.product._id, // Mantener ID original
          _id: existing.product._id, // Mantener _id si existe
          active: true, // Remover flag active
        };
      } else {
        console.warn(`Producto marcado como existente pero no encontrado: ${incomingProduct.id}`);
      }
    });

    // 4. Agregar productos nuevos
    if (newProducts.length > 0) {
      const newProductsWithIds = newProducts.map((product) => {
        const cleanProduct = { ...product };
        delete cleanProduct.active; // Remover flag active

        return {
          ...cleanProduct,
          id: this.generateUniqueId(),
          createdAt: new Date(),
          // Agregar otros campos que necesites para productos nuevos
        };
      });

      mergedProducts = [...mergedProducts, ...newProductsWithIds];
    }

    return mergedProducts;
  }

  ///////////////

  // async recommandBillService(
  //   id: string,
  //   body: { products: any[] },
  //   retries = 3,
  // ) {
  //   console.log('NUEVO METODO DE RECOMMEND BILL');
  //   console.log(body);
  //   for (let attempt = 1; attempt <= retries; attempt++) {
  //     const currentBill = await this.billsModel.findById(id);

  //     if (!currentBill) {
  //       throw new NotFoundException('Cuenta no encontrada');
  //     }

  //     if (currentBill.status === FINISHED_STATUS) {
  //       throw new NotFoundException('La cuenta ya ha sido cobrada');
  //     }

  //     const updatedBill = await this.billsModel.findOneAndUpdate(
  //       { _id: id, __v: currentBill.__v },
  //       {
  //         $set: {
  //           products: body.products,
  //         },
  //         $inc: { __v: 1 },
  //       },
  //       { new: true },
  //     );

  //     if (updatedBill) {
  //       return updatedBill; // ✅ se actualizó correctamente
  //     }

  //     // 🔄 si no se pudo actualizar (conflicto), hacemos un pequeño delay antes del siguiente intento
  //     await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms de espera
  //   }

  //   // Si llega aquí, después de N intentos, lanzamos excepción
  //   throw new ConflictException(
  //     'No se pudo actualizar la cuenta después de varios intentos. Intenta de nuevo.',
  //   );
  // }

  async update(id: string, updatedBill: UpdateBillDto) {
    const currentBill = await this.billsModel.findById(id).lean();
    if (currentBill.status === FINISHED_STATUS) {
      throw new NotFoundException('La cuenta ya ha sido cobrada');
    }
    const checkTotal = calculateBillTotal(updatedBill.products);
    const sendData = { ...updatedBill, checkTotal };

    return await this.billsModel.findByIdAndUpdate(id, sendData, {
      new: true,
    });
  }

  async transferProducts(body: any) {
    const session = await this.billsModel.startSession();
    session.startTransaction();

    // receiving data
    const receivingProducts = body.receivingBill.products;

    const receivingUpdate = {
      products: receivingProducts,
    };

    // send data
    const sendBillProducts = body.sendBill.products;

    const updateSendBill = {
      products: sendBillProducts,
    };

    try {
      switch (body.case) {
        case BILL_TO_BILL:
          // hacemos los cambios en la cuenta principal
          const currentReceivingBill = await this.billsModel.findByIdAndUpdate(
            body.receivingBill._id,
            receivingUpdate,
          );

          const currentSendBill = await this.billsModel.findByIdAndUpdate(
            body.sendBill._id,
            updateSendBill,
          );

          if (!currentReceivingBill) {
            throw new NotFoundException(`No se encuentra la cuenta, error`);
          }
          await session.commitTransaction();
          session.endSession();
          return currentReceivingBill;

        case NOTE_TO_NOTE:
          const updateReceivingNote = await this.noteModel.findByIdAndUpdate(
            body.receivingBill._id,
            receivingUpdate,
          );
          const currentBill = await this.billsModel
            .findById(body.receivingBill.accountId)
            .populate({ path: 'notes' });

          const noteToNoteTotal = currentBill.notes
            .reduce((a, b) => {
              return a + parseInt(b.checkTotal);
            }, 0)
            .toString();
          const noteToNoteProducts = currentBill.notes.flatMap((element) => element.products);
          const updateDataBillToNote = {
            products: noteToNoteProducts,
            checkTotal: noteToNoteTotal,
          };

          const updateReceivingBillToNote = await this.billsModel.findByIdAndUpdate(
            currentBill._id,
            updateDataBillToNote,
            { new: true },
          );

          // Ahora actualizamos la mesa que envio
          const updateSendNote = await this.noteModel.findByIdAndUpdate(
            body.sendBill._id,
            updateSendBill,
          );

          const currentSendBillNoteToNote = await this.billsModel
            .findById(body.sendBill.accountId)
            .populate({ path: 'notes' });

          const noteToNoteSendTotal = currentBill.notes
            .reduce((a, b) => {
              return a + parseInt(b.checkTotal);
            }, 0)
            .toString();

          const noteToNoteSendProducts = currentSendBillNoteToNote.notes.flatMap(
            (element) => element.products,
          );
          const updateDatasSendBillToNote = {
            products: noteToNoteSendProducts,
            checkTotal: noteToNoteSendTotal,
          };

          const updateSendBillToNote = await this.billsModel.findByIdAndUpdate(
            currentBill._id,
            updateDatasSendBillToNote,
            { new: true },
          );
          await session.commitTransaction();
          session.endSession();
          return updateReceivingNote;

        case BILL_TO_NOTE:
          // actualizamos la nota que recibe
          const updateReceivingBillToNoteCase = await this.noteModel.findByIdAndUpdate(
            body.receivingBill._id,
            receivingUpdate,
          );
          const currentBillToNote = await this.billsModel
            .findById(body.receivingBill.accountId)
            .populate({ path: 'notes' });

          const billToNoteTotal = currentBillToNote.notes
            .reduce((a, b) => {
              return a + parseInt(b.checkTotal);
            }, 0)
            .toString();
          const BillToNoteProducts = currentBillToNote.notes.flatMap((element) => element.products);
          const updateDataBillToNoteCase = {
            products: BillToNoteProducts,
            checkTotal: billToNoteTotal,
          };

          const updReceivingBillToNoteCase = await this.billsModel.findByIdAndUpdate(
            currentBillToNote._id,
            updateDataBillToNoteCase,
            { new: true },
          );

          // ahora actualizamos la cuenta que envia
          const currentSendBilltoNote = await this.billsModel.findByIdAndUpdate(
            body.sendBill._id,
            updateSendBill,
          );

          await session.commitTransaction();
          session.endSession();
          return updateReceivingBillToNoteCase;

        case NOTE_TO_BILL:
          console.log('Ultimo metodo funciona');
          const currentReceivingNoteToBill = await this.billsModel.findByIdAndUpdate(
            body.receivingBill._id,
            receivingUpdate,
          );

          // actualizamos la nota que envia por ultimo
          const updateSendNoteToBill = await this.noteModel.findByIdAndUpdate(
            body.sendBill._id,
            updateSendBill,
          );

          const currentNoteToBill = await this.billsModel
            .findById(body.sendBill.accountId)
            .populate({ path: 'notes' });

          const noteToBillSendTotal = currentNoteToBill.notes
            .reduce((a, b) => {
              return a + parseInt(b.checkTotal);
            }, 0)
            .toString();

          const noteToBillSendProducts = currentNoteToBill.notes.flatMap(
            (element) => element.products,
          );
          const updateDatasSendNoteToBill = {
            products: noteToBillSendProducts,
            checkTotal: noteToBillSendTotal,
          };

          const updateSendNoteToBillCase = await this.billsModel.findByIdAndUpdate(
            currentBill._id,
            updateDatasSendNoteToBill,
            { new: true },
          );

          await session.commitTransaction();
          session.endSession();
          return currentReceivingNoteToBill;

        default:
          throw new Error('No existe el caso');
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
    }
  }

  // TODO: POPULAR PAYMENTS
  // METER EL ID A LAS CUNETAS DE DELIVERY
  async findCurrent(id?: string) {
    // const redis = this.redisService.getClient();
    // const cacheKey = `currentPeriod:${id ?? 'default'}`;

    // // Revisar cache primero
    // const cached = await redis.get(cacheKey);
    // if (cached) {
    //   return JSON.parse(cached);
    // }
    const session = await this.operatingPeriodModel.startSession();
    session.startTransaction();
    try {
      const currentPeriod = id
        ? await this.operatingPeriodService.getCurrent(id)
        : await this.operatingPeriodService.getCurrent();

      if (!currentPeriod) {
        throw new NotFoundException('No se encontro ningun periodo actualmente');
      }
      // traeremos todas  las cuentas que matching con el periodo actual
      const bills = await this.findCurrentBySellType(currentPeriod[0]._id.toString(), 'onsite');
      // traeremos todas las ordenes que matching con el periodo actual
      const toGoOrders = await this.findCurrentBySellType(
        currentPeriod[0]._id.toString(),
        'TOGO_ORDER',
      );
      const rappiOrders = await this.findCurrentBySellType(
        currentPeriod[0]._id.toString(),
        'RAPPI_ORDER',
      );
      const phoneOrders = await this.findCurrentBySellType(
        currentPeriod[0]._id.toString(),
        'PHONE_ORDER',
      );

      const allOrders = [...bills, ...toGoOrders, ...rappiOrders, ...phoneOrders];
      await session.commitTransaction();

      // Guardar en Redis después de la transacción
      // await redis.set(cacheKey, JSON.stringify(allOrders), 'EX', 120);
      return allOrders;
    } catch (error) {
      console.error(error);
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findCurrentBySellType(id: string, type: string) {
    const session = await this.operatingPeriodModel.startSession();
    session.startTransaction();
    try {
      await session.commitTransaction();
      session.endSession();

      if (type === 'onsite') {
        const bills = await this.billsModel
          .find({
            operatingPeriod: id,
          })
          .populate({
            path: 'payment',
          })
          .populate({
            path: 'notes',
            populate: {
              path: 'discount',
            },
          })
          .populate({
            path: 'discount',
          });
        return bills;
      }
      if (type === 'TOGO_ORDER') {
        const toGoOrders = await this.toGoOrderModel
          .find({
            operatingPeriod: id,
          })
          .populate({
            path: 'payment',
          });
        return toGoOrders;
      }
      if (type === 'PHONE_ORDER') {
        const phoneOrders = await this.phoneOrderModel
          .find({
            operatingPeriod: id,
          })
          .populate({
            path: 'payment',
          });
        return phoneOrders;
      }
      if (type === 'RAPPI_ORDER') {
        const rappiOrders = await this.rappiOrderModel
          .find({
            operatingPeriod: id,
          })
          .populate({
            path: 'payment',
          });
        return rappiOrders;
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getAllHistoryOrders() {
    const session = await this.operatingPeriodModel.startSession();
    let results = [];
    await session.withTransaction(async () => {
      const currentPeriod = await this.operatingPeriodService.getCurrent();
      const currentPeriodId = currentPeriod[0]._id.toString();
      const [bills, toGoOrders, rappiOrders, phoneOrders] = await Promise.all([
        this.billsModel.find().populate({
          path: 'notes',
          populate: [
            {
              path: 'discount',
            },
          ],
        }),
        this.toGoOrderModel.find().lean(),
        this.rappiOrderModel.find().lean(),
        this.phoneOrderModel.find().lean(),
      ]);

      const allOrders = [...bills, ...toGoOrders, ...rappiOrders, ...phoneOrders];
      const filterOrders = allOrders.filter(
        (order) => order.operatingPeriod.toString() != currentPeriodId,
      );
      results = filterOrders;
      return filterOrders;
    });
    return results;
  }

  async findCurrenTogoService(type: string, id?: string) {
    try {
      const currentPeriod = id
        ? await this.operatingPeriodService.getCurrent(id)
        : await this.operatingPeriodService.getCurrent();

      const ordersArray = await this.findCurrentBySellType(currentPeriod[0]._id.toString(), type);
      return ordersArray;
    } catch (error) {
      throw new NotFoundException('No se pudieron encontrar las cuentas');
    }
  }

  async findCurrrentByUserCurrent(userId: string) {
    const session = await this.operatingPeriodModel.startSession();
    session.startTransaction();
    try {
      const currentPeriod = await this.operatingPeriodService.getCurrent();
      const currentPeriodId = currentPeriod[0]._id.toString();
      const bills = await this.billsModel
        .find({
          operatingPeriod: currentPeriodId,
          userId: userId,
        })
        .populate({
          path: 'payment',
        });
      if (!bills) {
        throw new NotFoundException('No se encontro ninguna cuenta');
      }
      await session.commitTransaction();
      session.endSession();
      return bills;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  private formatCode(code: string): string {
    // todo
    // formatear correctamente el codigo de la factura
    return code.padStart(6, '0');
  }

  async create(createBill: CreateBillDto) {
    let attempt = 0;

    while (attempt < this.MAX_RETRIES) {
      // 🔑 CLAVE: Nueva sesión para cada intento
      const session: ClientSession = await this.connection.startSession();

      try {
        attempt++;
        this.logger.log(`Creating bill attempt ${attempt}/${this.MAX_RETRIES}`, {
          tableId: createBill.table,
          userId: createBill.user,
        });

        // Iniciar transacción DESPUÉS de crear la sesión
        session.startTransaction({
          readConcern: { level: 'majority' },
          writeConcern: { w: 'majority' },
          // Timeout más corto para detectar problemas rápido
          maxTimeMS: 10000, // 10 segundos
        });

        const result = await this.createBillWithTransaction(createBill, session);

        // Commit explícito y controlado
        await session.commitTransaction();

        this.logger.log('Bill created successfully', {
          billId: result._id,
          billCode: result.code,
          attempt,
        });

        return result;
      } catch (error) {
        this.logger.warn(`Bill creation attempt ${attempt} failed`, {
          error: error.message,
          errorCode: error.code,
          tableId: createBill.table,
          attempt,
        });

        // Abort seguro - verificar si la transacción está activa
        try {
          if (session.inTransaction()) {
            await session.abortTransaction();
          }
        } catch (abortError) {
          this.logger.warn('Error aborting transaction', {
            abortError: abortError.message,
            originalError: error.message,
          });
        }

        // Determinar si debemos reintentar
        const shouldRetry = this.shouldRetryError(error, attempt);

        if (!shouldRetry) {
          this.logger.error('Bill creation failed - not retrying', {
            error: error.message,
            tableId: createBill.table,
            attempt,
            reason: 'Non-retryable error',
          });
          throw error;
        }

        // Si es el último intento, fallar
        if (attempt >= this.MAX_RETRIES) {
          this.logger.error('Bill creation failed after all retries', {
            error: error.message,
            tableId: createBill.table,
            totalAttempts: attempt,
          });
          throw error;
        }

        // Delay con jitter antes del siguiente intento
        const delay = this.calculateRetryDelay(attempt);
        this.logger.log(`Waiting ${delay}ms before retry ${attempt + 1}`, {
          tableId: createBill.table,
        });
        await this.sleep(delay);
      } finally {
        // 🔑 CRÍTICO: Siempre cerrar la sesión
        try {
          await session.endSession();
        } catch (sessionError) {
          this.logger.warn('Error ending session', {
            error: sessionError.message,
            attempt,
          });
        }
      }
    }

    // Este punto nunca debería alcanzarse, pero por seguridad
    throw new Error(`Failed to create bill after ${this.MAX_RETRIES} attempts`);
  }

  private async createBillWithTransaction(createBill: CreateBillDto, session: ClientSession) {
    try {
      // Verificar que la sesión esté activa
      if (!session.inTransaction()) {
        throw new Error('Session is not in an active transaction');
      }

      // Obtenemos el rango del día actual
      // const { startOfDay, endOfDay } = this.getDayRange();

      // 🔧 OPTIMIZACIÓN: Consultas en paralelo con timeouts individuales
      const [table, user, period] = await Promise.all([
        this.tableModel
          .findById(createBill.table)
          .select('tableNum')
          .maxTimeMS(5000) // 3 segundos timeout
          .lean()
          .session(session) as Promise<{ tableNum: string; _id: any } | null>,

        this.userModel
          .findById(createBill.user)
          .select('name lastName employeeNumber')
          .maxTimeMS(5000)
          .lean()
          .session(session) as Promise<{
          name: string;
          lastName: string;
          employeeNumber: number;
          _id: any;
        } | null>,

        // No usar sesión para este query si no modifica datos
        this.operatingPeriodService.getCurrent() as Promise<Array<{ _id: any }>>,
      ]);

      // Validaciones con errores específicos
      if (!table) {
        throw new BadRequestException(`Table with id ${createBill.table} not found`);
      }
      if (!user) {
        throw new BadRequestException(`User with id ${createBill.user} not found`);
      }
      if (!period?.length) {
        throw new BadRequestException('No active operating period found');
      }

      // 🔧 OPTIMIZACIÓN: Query más específico con índice optimizado
      // const lastBill = await this.billsModel
      //   .findOne({
      //     table: createBill.table,
      //     createdAt: { $gte: startOfDay, $lte: endOfDay },
      //   })
      //   .select('code')
      //   .sort({ code: -1 })
      //   .maxTimeMS(3000)
      //   .lean()
      //   .session(session);
      const pruebadecopunter = await this.billsCounterModel.findOne();
      const newBillCode = `${pruebadecopunter.restaurantCounter.toString().padStart(6, '0')}`;
      const nextBillNumber = this.calculateNextBillNumber(newBillCode);
      const formatCode = this.formatBillCode(table.tableNum, nextBillNumber);

      // Preparar datos de la cuenta
      const billData = {
        ...createBill,
        code: formatCode,
        user: `${user.name} ${user.lastName.slice(0, 1)}`,
        userCode: user.employeeNumber.toString(),
        userId: createBill.user,
        products: createBill.products || [],
        tableNum: table.tableNum,
        table: createBill.table,
        operatingPeriod: period[0]._id,
        // Agregar timestamp explícito para debugging
        createdAt: new Date(),
      };

      this.logger.log('Creating bill with data', {
        code: formatCode,
        tableId: createBill.table,
        userId: createBill.user,
        productsCount: billData.products.length,
      });

      // Crear la cuenta con manejo mejorado de errores
      const [billToCreate] = await this.billsModel.create([billData], {
        session,
        // Opciones adicionales para debugging
        runValidators: true,
      });

      if (!billToCreate || !billToCreate._id) {
        throw new Error('Bill creation returned empty result');
      }

      this.logger.log('Bill created in database', {
        billId: billToCreate._id,
        code: billToCreate.code,
      });

      // AUMENTAREMOS EL COUNTER
      await this.billsCounterModel.findOneAndUpdate({
        $set: { restaurantCounter: pruebadecopunter.restaurantCounter + 1 },
      });

      // ponemos la me con estatus "enable"
      await this.tableModel.findByIdAndUpdate(createBill.table, {
        status: ENABLE_STATUS,
        bill: [billToCreate._id],
      });

      await this.tableModel.findByIdAndUpdate(createBill.table, {
        $set: {
          status: ENABLE_STATUS,
        },
      });

      return billToCreate;
    } catch (error) {
      this.logger.error('Error in createBillWithTransaction', {
        error: error.message,
        errorCode: error.code,
        errorName: error.name,
        tableId: createBill.table,
        sessionId: session.id,
      });

      // Mejorar el manejo de errores específicos
      if (error.code === 11000) {
        const duplicateField = this.extractDuplicateField(error.message);
        throw new ConflictException(
          `Duplicate bill detected: ${duplicateField}. Another user may be creating a bill for this table.`,
        );
      }

      // Errores de timeout de MongoDB
      if (error.name === 'MongoTimeoutError' || error.message.includes('timeout')) {
        throw new Error('Database timeout - server may be overloaded');
      }

      // Errores de transacción
      if (error.message.includes('transaction')) {
        throw new Error(`Transaction error: ${error.message}`);
      }

      throw error;
    }
  }

  // 🔧 Lógica mejorada para determinar si reintentar
  private shouldRetryError(error: any, attempt: number): boolean {
    // No reintentar errores de validación
    if (error instanceof BadRequestException) {
      return false;
    }

    // No reintentar si ya es el último intento
    if (attempt >= this.MAX_RETRIES) {
      return false;
    }

    // Reintentar errores de concurrencia
    if (this.isConcurrencyError(error)) {
      return true;
    }

    // Reintentar errores de transacción específicos
    if (
      error.message.includes('transaction number') ||
      error.message.includes('in-progress transactions')
    ) {
      return true;
    }

    // Reintentar timeouts
    if (
      error.name === 'MongoTimeoutError' ||
      error.message.includes('timeout') ||
      error.message.includes('ETIMEDOUT')
    ) {
      return true;
    }

    // Reintentar errores de conexión
    if (error.message.includes('connection') || error.message.includes('network')) {
      return true;
    }

    // Para otros errores, no reintentar
    return false;
  }

  // 🔧 Delay mejorado con más jitter
  private calculateRetryDelay(attempt: number): number {
    const baseDelay = this.RETRY_DELAY_MS || 1000;
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const maxDelay = 5000; // Máximo 5 segundos
    const jitter = Math.random() * 200; // 0-200ms de jitter

    return Math.min(exponentialDelay, maxDelay) + jitter;
  }

  // 🔧 Mejorar detección de errores de concurrencia
  private isConcurrencyError(error: any): boolean {
    if (error instanceof ConflictException) return true;
    if (error.code === 11000) return true; // MongoDB duplicate key
    if (error.name === 'MongoError' && error.message.includes('duplicate key')) return true;
    if (error.message.includes('E11000')) return true; // Otro formato de duplicate key

    return false;
  }

  // 🔧 Extraer campo duplicado para mejor error message
  private extractDuplicateField(errorMessage: string): string {
    const match = errorMessage.match(/dup key: { (.+?) :/);
    return match ? match[1] : 'unknown field';
  }

  // 🔧 Mejorar logging del día range
  private getDayRange() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    this.logger.debug('Day range calculated', {
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
    });

    return { startOfDay, endOfDay };
  }

  private calculateNextBillNumber(lastBillCode?: string): number {
    if (!lastBillCode) {
      this.logger.debug('No previous bill found, starting with number 1');
      return 1;
    }

    const lastConsecutive = parseInt(lastBillCode.slice(-3), 10);
    const nextNumber = isNaN(lastConsecutive) ? 1 : lastConsecutive + 1;

    this.logger.debug('Next bill number calculated', {
      lastBillCode,
      lastConsecutive,
      nextNumber,
    });

    return nextNumber;
  }

  private formatBillCode(tableNum: string, billNumber: number): string {
    const formatted = `${tableNum.padStart(3, '0')}${billNumber.toString().padStart(3, '0')}`;

    this.logger.debug('Bill code formatted', {
      tableNum,
      billNumber,
      formatted,
    });

    return formatted;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 🔧 NUEVO: Método para limpiar sesiones colgadas (llamar periodicamente)
  async cleanupStaleSessions(): Promise<void> {
    try {
      // Este método puede ayudar a limpiar sesiones que quedaron abiertas
      const admin = this.connection.db.admin();
      const sessions = await admin.command({ listSessions: {} });

      this.logger.log(`Active MongoDB sessions: ${sessions.cursor.firstBatch.length}`);

      // Aquí podrías implementar lógica para cerrar sesiones muy antigas
      // Pero normalmente MongoDB las limpia automáticamente
    } catch (error) {
      this.logger.warn('Could not cleanup stale sessions', {
        error: error.message,
      });
    }
  }
  ////////////////////////////////////////
  /// Metodo de creacion refactorizado ///
  ////////////////////////////////////////

  //   async create(createBill: CreateBillDto) {
  //     let attempt = 0;

  //     while (attempt < this.MAX_RETRIES) {
  //       const session: ClientSession = await this.connection.startSession();

  //       try {
  //         session.startTransaction();

  //         const result = await this.createBillWithTransaction(
  //           createBill,
  //           session,
  //         );

  //         await session.commitTransaction();
  //         return result;
  //       } catch (error) {
  //         await session.abortTransaction();

  //         attempt++;

  //         // Si es un error de concurrencia (código duplicado) y no es el último intento
  //         if (this.isConcurrencyError(error) && attempt < this.MAX_RETRIES) {
  //           this.logger.warn(
  //             `Concurrency conflict detected on attempt ${attempt}. Retrying...`,
  //             { tableId: createBill.table, attempt },
  //           );

  //           // Delay exponencial con jitter para reducir colisiones
  //           const delay =
  //             this.RETRY_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 50;
  //           await this.sleep(delay);
  //           continue;
  //         }

  //         // Si no es un error de concurrencia o es el último intento, propagar el error
  //         this.logger.error('Failed to create bill after retries', {
  //           error: error.message,
  //           tableId: createBill.table,
  //           attempts: attempt,
  //         });
  //         throw error;
  //       } finally {
  //         await session.endSession();
  //       }
  //     }
  //   }

  //   private async createBillWithTransaction(
  //     createBill: CreateBillDto,
  //     session: ClientSession,
  //   ) {
  //     // Obtenemos el rango del día actual (calculado una sola vez)
  //     const { startOfDay, endOfDay } = this.getDayRange();

  //     // Ejecutamos consultas en paralelo para datos que no cambian
  //     const [table, user, period] = await Promise.all([
  //       this.tableModel
  //         .findById(createBill.table)
  //         .select('tableNum')
  //         .lean()
  //         .session(session),
  //       this.userModel
  //         .findById(createBill.user)
  //         .select('name lastName employeeNumber')
  //         .lean()
  //         .session(session),
  //       this.operatingPeriodService.getCurrent(),
  //     ]);

  //     // Validamos que existan los recursos necesarios
  //     if (!table) {
  //       throw new Error(`Table with id ${createBill.table} not found`);
  //     }
  //     if (!user) {
  //       throw new Error(`User with id ${createBill.user} not found`);
  //     }
  //     if (!period?.length) {
  //       throw new Error('No active operating period found');
  //     }

  //     // Obtenemos el último bill de la mesa del día usando índice compuesto optimizado
  //     // y aplicamos lock para prevenir condiciones de carrera
  //     const lastBill = await this.billsModel
  //       .findOne({
  //         table: createBill.table,
  //         createdAt: { $gte: startOfDay, $lte: endOfDay },
  //       })
  //       .select('code')
  //       .sort({ code: -1 })
  //       .lean()
  //       .session(session);

  //     // Calculamos el siguiente número de factura
  //     const nextBillNumber = this.calculateNextBillNumber(lastBill?.code);

  //     // Formateamos el código con padding optimizado
  //     const formatCode = this.formatBillCode(table.tableNum, nextBillNumber);

  //     // Creamos la factura con validación de unicidad
  //     const billData = {
  //       ...createBill,
  //       code: formatCode,
  //       user: `${user.name} ${user.lastName.slice(0, 1)}`,
  //       userCode: user.employeeNumber.toString(),
  //       userId: createBill.user,
  //       products: createBill.products,
  //       tableNum: table.tableNum,
  //       table: createBill.table,
  //       operatingPeriod: period[0]._id,
  //     };

  //     try {
  //       // Usamos create con session para transaccionalidad
  //       const [billToCreate] = await this.billsModel.create([billData], {
  //         session,
  //       });
  //       return billToCreate;
  //     } catch (error) {
  //       // Si hay error de clave duplicada, es un problema de concurrencia
  //       if (error.code === 11000) {
  //         throw new ConflictException(`Bill code ${formatCode} already exists`);
  //       }
  //       throw error;
  //     }
  //   }

  //   private getDayRange() {
  //     const now = new Date();
  //     const startOfDay = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate(),
  //       0,
  //       0,
  //       0,
  //       0,
  //     );
  //     const endOfDay = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate(),
  //       23,
  //       59,
  //       59,
  //       999,
  //     );

  //     return { startOfDay, endOfDay };
  //   }

  //   private calculateNextBillNumber(lastBillCode?: string): number {
  //     if (!lastBillCode) {
  //       return 1;
  //     }

  //     // Extraemos los últimos 3 dígitos de manera más eficiente
  //     const lastConsecutive = parseInt(lastBillCode.slice(-3), 10);
  //     return isNaN(lastConsecutive) ? 1 : lastConsecutive + 1;
  //   }

  //   private formatBillCode(tableNum: string, billNumber: number): string {
  //     // Optimizamos el formateo usando template literals
  //     return `${tableNum.padStart(3, '0')}${billNumber.toString().padStart(3, '0')}`;
  //   }

  //   private isConcurrencyError(error: any): boolean {
  //     return (
  //       error instanceof ConflictException ||
  //       error.code === 11000 || // MongoDB duplicate key error
  //       (error.name === 'MongoError' && error.message.includes('duplicate key'))
  //     );
  //   }

  //   private sleep(ms: number): Promise<void> {
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }
  // }

  ////////////////////////////////////////
}
