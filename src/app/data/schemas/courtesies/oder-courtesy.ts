import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseCourtesy } from './BaseCourtesy';

@Schema({ timestamps: true })
export class OrderCourtesy extends BaseCourtesy {
  @Prop({ required: true })
  order_id: string;

  @Prop({ required: true })
  sellType: string;

  @Prop({ required: true })
  order_code: string;
}

export const OrderCourtesySchema = SchemaFactory.createForClass(OrderCourtesy);
