import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class BillsCounter {
  @Prop({
    default: 1,
  })
  restaurantCounter: number;

  @Prop({
    default: 1,
  })
  togoCounter: number;
}

export const BillsCounterSchema = SchemaFactory.createForClass(BillsCounter);
