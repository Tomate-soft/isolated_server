import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CancellationTypes } from '@schema/cancellations/order-cancel.schema';

export class CreateOrderCancelDto {
  @ApiProperty({ description: 'Código único de la cancelación', example: 'CANC-001' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Tipo de cancelación',
    enum: CancellationTypes,
    example: CancellationTypes.TOGO_ORDER_CANCELLATION,
  })
  @IsNotEmpty()
  @IsEnum(CancellationTypes)
  cancelType: CancellationTypes;

  @ApiProperty({ description: 'Monto de la cancelación', example: 150.5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Persona que realiza la cancelación', example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  cancellationBy: string;

  @ApiProperty({
    description: 'Persona o entidad para la que se cancela',
    example: 'Cliente ID 123',
  })
  @IsNotEmpty()
  @IsString()
  cancellationFor: string;

  @ApiProperty({ description: 'Razón de la cancelación', example: 'Error en el pedido' })
  @IsNotEmpty()
  @IsString()
  cancellationReason: string;

  @ApiProperty({
    description: 'Descripción adicional (opcional)',
    example: 'El cliente cambió de opinión',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Período operativo (opcional)',
    example: 'turno-mañana',
    required: false,
  })
  @IsOptional()
  @IsString()
  operatingPeriod?: string;
}
