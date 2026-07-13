import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export enum CancellationTypes {
  TOGO_ORDER_CANCELLATION = 'TOGO_ORDER_CANCELLATION',
  RAPPI_ORDER_CANCELLATION = 'RAPPI_ORDER_CANCELLATION',
  PHONE_ORDER_CANCELLATION = 'PHONE_ORDER_CANCELLATION',
  BILL_CANCELLATION = 'BILL_CANCELLATION',
}

@Schema({ timestamps: true })
export class OrderCancel {
  @Prop({
    required: true,
  })
  code: string;

  @Prop({
    required: true,
    trim: true,
  })
  cancelType: CancellationTypes;

  @Prop({
    required: true,
    trim: true,
  })
  amount: number;

  @Prop({
    required: true,
    trim: true,
  })
  cancellationBy: string;

  @Prop({
    required: true,
    trim: true,
  })
  cancellationFor: string;

  @Prop({
    required: true,
    trim: true,
  })
  cancellationReason: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true, default: 'no-identified' })
  operatingPeriod?: string;
}

export const OrderCancelSchema = SchemaFactory.createForClass(OrderCancel);
