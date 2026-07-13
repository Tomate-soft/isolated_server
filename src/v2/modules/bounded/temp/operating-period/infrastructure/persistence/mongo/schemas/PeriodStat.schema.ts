import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class MongoPeriodStat {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  descript: string;
}

export const PeriodStatSchema = SchemaFactory.createForClass(MongoPeriodStat);
