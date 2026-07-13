import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { OrderBase } from './order-base.schema';

@Schema({ timestamps: true })
export class EmployeeOrder extends OrderBase {
  @Prop({
    trim: true,
    default: 'EMPLOYEE_ORDER',
  })
  sellType: string;

  @Prop({
    trim: true,
  })
  orderName?: string;

  @Prop({
    default: 1,
    required: true,
    trim: true,
  })
  diners?: number;
}

export const EmployeeOrderSchema = SchemaFactory.createForClass(EmployeeOrder);
