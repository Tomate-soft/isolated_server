import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { DailyRegister } from '../dailyRegister/createDailyRegister';
import { Schema as MongooseSchema } from 'mongoose';
import { CashierSession } from '../cashierSession/cashierSession';
import { OperationalClousure } from './operationalClousure';
import { User } from '../users.schema';
import { MoneyMovement } from '../moneyMovements/moneyMovement.schema';

interface CashIn {
  init: boolean;
  amount: string;
}

export enum State {
  ACTIVE = 'ACTIVE',
  CONFLICT = 'CONFLICT',
  CLOSED = 'CLOSED',
  APPROVED = 'APPROVED',
}

export interface CheckInRegister {
  idempotencyKey?: string;
  name: string;
  diners: number;
  initialTime: string;
  finalTime: string;
  resumeTime: string;
  status: string;
}

@Schema({ timestamps: true })
export class OperatingPeriod {
  @Prop({ default: true })
  status: boolean;

  @Prop()
  createdAt: Date;

  @Prop({
    default: [],
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'DailyRegister' }],
  })
  dailyRegisters: DailyRegister[];

  @Prop({
    default: [],
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CashierSession' }],
  })
  sellProcess: CashierSession[];

  @Prop({ required: true, default: '0.00' })
  withdrawals?: string;

  @Prop({
    type: {
      init: { type: Boolean, default: false },
      amount: { type: String, default: '$0.00' },
    },
    default: { init: false, amount: '$0.00' },
  })
  cashIn: CashIn;

  @Prop({
    trim: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'MoneyMovement' }],
    ref: 'MoneyMovement',
    default: [],
  })
  moneyMovements: MoneyMovement[];

  // Aquí solo referenciamos la clase
  @Prop({ type: OperationalClousure })
  operationalClousure?: OperationalClousure;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  approvedBy?: User;

  @Prop({ default: [] })
  registers?: CheckInRegister[];
}

export const OperatingPeriodSchema = SchemaFactory.createForClass(OperatingPeriod);

// Índice compuesto para optimizar queries de rango de fechas
OperatingPeriodSchema.index({ createdAt: 1, status: 1 });
