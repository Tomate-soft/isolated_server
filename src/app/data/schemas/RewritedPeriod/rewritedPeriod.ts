import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { CashierSession } from 'src/schemas/cashierSession/cashierSession';
import { DailyRegister } from 'src/schemas/dailyRegister/createDailyRegister';
import { MoneyMovement } from 'src/schemas/moneyMovements/moneyMovement.schema';
import { OperationalClousure } from 'src/schemas/operatingPeriod/operationalClousure';
import { User } from 'src/schemas/users.schema';

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
  name: string;
  diners: number;
  initialTime: string;
  finalTime: string;
  resumeTime: string;
  status: string;
}

@Schema({ timestamps: true })
export class RewritedPeriod {
  @Prop({ default: true })
  status: boolean;

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

  @Prop()
  createdAt: Date;

  @Prop({ default: [] })
  registers?: CheckInRegister[];
}

export const RewritedPeriodSchema = SchemaFactory.createForClass(RewritedPeriod);
