import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export abstract class BaseCourtesy {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  discountByUser: string;

  @Prop({ required: true })
  discountFor: string;

  @Prop({ required: true })
  discountReason: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'no-identified' })
  operatingPeriod?: string;
}
