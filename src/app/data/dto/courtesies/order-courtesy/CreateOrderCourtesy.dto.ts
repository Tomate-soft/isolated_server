import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderCourtesyDto {
  @IsString()
  code: string;

  @IsString()
  type: string;

  @IsString()
  discountByUser: string;

  @IsString()
  discountFor: string;

  @IsString()
  discountReason: string;

  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  operatingPeriod?: string;

  @IsString()
  order_id: string;

  @IsString()
  sellType: string;

  @IsString()
  order_code: string;
}
