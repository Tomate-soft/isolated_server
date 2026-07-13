import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { OperatingPeriod } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { Payment } from 'src/schemas/ventas/payment.schema';
import { Discount } from 'src/schemas/ventas/discounts.schema';

@Schema({ timestamps: true })
export class OrderBase {
  // Define common properties for sales orders here
  @Prop({
    required: true,
    trim: true,
  })
  code: string;

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
  })
  userId: string;

  @Prop({
    required: true,
    trim: true,
  })
  checkTotal: number;

  @Prop({
    required: true,
    default: 'enable',
  })
  status: 'enable' | 'disable' | 'cancelled' | 'finished' | 'forPayment';

  @Prop({
    default: [],
    trim: true,
  })
  products: [];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Payment' }],
    default: [],
  })
  payment?: Payment[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'OperatingPeriod' })
  operatingPeriod?: OperatingPeriod;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Discount', default: null })
  discount?: Discount | null;
}

export const OrderBaseSchema = SchemaFactory.createForClass(OrderBase);
