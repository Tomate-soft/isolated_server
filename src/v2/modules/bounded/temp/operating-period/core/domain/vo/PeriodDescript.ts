import { ValueObjectBase } from '../../shared/ValueObejct';

export class PeriodDescript extends ValueObjectBase<string> {
  constructor(descript: string) {
    super(
      descript,
      'La descripción del periodo no puede estar vacía y no debe exceder el numero de caracteres permitido.',
    );
  }

  validate(value: string): boolean {
    if (!value) return false;
    return value.length <= 255;
  }

  static createShortDescript(name: string): string {
    return `El period fue aprovado por ${name}`;
  }

  static createDescript(name: string, note: string, date: Date): string {
    const dateString = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `El periodo ${name} con nota ${note} fue aprobado el ${dateString}`;
  }
}
