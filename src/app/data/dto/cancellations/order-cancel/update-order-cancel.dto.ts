import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CancellationTypes } from '@schema/cancellations/order-cancel.schema';

export class UpdateOrderCancelDto {
  @ApiProperty({
    description: 'Código único de la cancelación (solo si se actualiza)',
    example: 'CANC-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'Tipo de cancelación (solo si se actualiza)',
    enum: CancellationTypes,
    example: CancellationTypes.TOGO_ORDER_CANCELLATION,
    required: false,
  })
  @IsOptional()
  @IsEnum(CancellationTypes)
  cancelType?: CancellationTypes;

  @ApiProperty({
    description: 'Monto de la cancelación (solo si se actualiza)',
    example: 150.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiProperty({
    description: 'Persona que realiza la cancelación (solo si se actualiza)',
    example: 'Juan Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  cancellationBy?: string;

  @ApiProperty({
    description: 'Persona o entidad para la que se cancela (solo si se actualiza)',
    example: 'Cliente ID 123',
    required: false,
  })
  @IsOptional()
  @IsString()
  cancellationFor?: string;

  @ApiProperty({
    description: 'Razón de la cancelación (solo si se actualiza)',
    example: 'Error en el pedido',
    required: false,
  })
  @IsOptional()
  @IsString()
  cancellationReason?: string;

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
