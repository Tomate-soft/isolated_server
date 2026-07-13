import { Controller, Get } from '@nestjs/common';
import { MachineIdentifierService } from './machine-identifier.service';

@Controller('machine-identifier')
export class MachineIdentifierController {
  constructor(private readonly machineIdentifierService: MachineIdentifierService) {}

  @Get('generate-identifier')
  generateAndSaveIdentifier() {
    this.machineIdentifierService.generateAndSaveIdentifier();
    return 'Identificador de máquina generado y guardado.';
  }
}
