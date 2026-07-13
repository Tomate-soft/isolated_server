import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export enum CancellationProductTypes {
  TOGO_ORDER_PRODUCT_CANCELLATION = 'TOGO_ORDER_PRODUCT_CANCELLATION',
  RAPPI_ORDER_PRODUCT_CANCELLATION = 'RAPPI_ORDER_PRODUCT_CANCELLATION',
  PHONE_ORDER_PRODUCT_CANCELLATION = 'PHONE_ORDER_PRODUCT_CANCELLATION',
  BILL_PRODUCT_CANCELLATION = 'BILL_PRODUCT_CANCELLATION',
  BILL_NOTE_PRODUCT_CANCELLATION = 'BILL_NOTE_PRODUCT_CANCELLATION',
}

@Schema({ timestamps: true })
export class ProductCancel {
  @Prop({
    required: true,
  })
  product: string;

  @Prop({
    required: true,
  })
  code: string;

  @Prop({
    trim: true,
    default: '--',
  })
  note?: string;

  @Prop({
    required: true,
    trim: true,
  })
  cancelType: CancellationProductTypes;

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

export const OrderCancelSchema = SchemaFactory.createForClass(ProductCancel);
