import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CashierSession } from 'src/schemas/cashierSession/cashierSession';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { Table } from 'src/schemas/tables/tableSchema';
import { User } from 'src/schemas/users.schema';
import { Discount } from 'src/schemas/ventas/discounts.schema';
import { Notes } from 'src/schemas/ventas/notes.schema';
import { Payment } from 'src/schemas/ventas/payment.schema';

@Schema({ timestamps: true })
export class Bills {
  //replace
  @Prop({
    required: true,
    trim: true,
  })
  code: string;

  @Prop({
    trim: true,
    default: 'ON_SITE_ORDER',
  })
  sellType: string;

  @Prop({
    required: true,
    trim: true,
  })
  user: string;

  @Prop({
    required: true,
    trim: true,
  })
  userCode: string;

  @Prop({
    required: true,
    trim: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;

  @Prop({
    required: true,
    trim: true,
  })
  checkTotal: string;

  @Prop({
    required: true,
    default: 'enable',
  })
  status: 'enable' | 'disable' | 'cancelled' | 'finished' | 'forPayment';

  @Prop({
    default: [],
  })
  products?: object[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Payment' }],
    default: [],
  })
  payment?: Payment[];

  @Prop({
    required: true,
    trim: true,
  })
  tableNum: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Table',
  })
  table: Table;

  @Prop({
    trim: true,
    default: null,
  })
  billName?: string | null;

  @Prop({
    trim: true,
    default: null,
  })
  comments?: string | null;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Notes' }],
    default: [],
  })
  notes?: Notes[];

  @Prop({
    default: [],
  })
  transferHistory?: string[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'CashierSession',
    default: null,
  })
  cashierSession?: CashierSession | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Discount', default: null })
  discount?: Discount | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'OperatingPeriod', index: true })
  operatingPeriod?: OperatingPeriod;

  @Prop({
    default: 1,
    required: true,
    trim: true,
  })
  diners?: number;
}

export interface BillsDocument extends Document, Bills {}
export const BillSchema = SchemaFactory.createForClass(Bills);

BillSchema.index({createdAt: - 1});
BillSchema.index({ operatingPeriod: 1, createdAt: -1 });
BillSchema.index({ userId: 1, createdAt: -1 });
// force the creation of the indexes in the database
