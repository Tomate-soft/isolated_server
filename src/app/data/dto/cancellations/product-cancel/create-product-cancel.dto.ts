import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductCancelDto {
  @IsNotEmpty({ message: 'El producto es obligatorio' })
  @IsString({ message: 'El producto debe ser un texto' })
  @MaxLength(100, { message: 'El producto no puede exceder 100 caracteres' })
  product: string;

  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser un texto' })
  @MaxLength(50, { message: 'El código no puede exceder 50 caracteres' })
  code: string;

  @IsOptional()
  @IsString({ message: 'La nota debe ser un texto' })
  @MaxLength(200, { message: 'La nota no puede exceder 200 caracteres' })
  note?: string;

  @IsNotEmpty({ message: 'El tipo de cancelación es obligatorio' })
  @IsEnum(CancellationProductTypes, {
    message: `Tipo de cancelación inválido. Valores válidos: ${Object.values(CancellationProductTypes).join(', ')}`,
  })
  cancelType: CancellationProductTypes;

  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  amount: number;

  @IsNotEmpty({ message: 'El usuario que cancela es obligatorio' })
  @IsString({ message: 'cancellationBy debe ser un texto' })
  @MaxLength(100)
  cancellationBy: string;

  @IsNotEmpty({ message: 'El motivo de cancelación es obligatorio' })
  @IsString({ message: 'cancellationFor debe ser un texto' })
  @MaxLength(100)
  cancellationFor: string;

  @IsNotEmpty({ message: 'La razón de cancelación es obligatoria' })
  @IsString({ message: 'cancellationReason debe ser un texto' })
  @MaxLength(200)
  cancellationReason: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString({ message: 'El período operativo debe ser un texto' })
  @MaxLength(50)
  operatingPeriod?: string;
}
