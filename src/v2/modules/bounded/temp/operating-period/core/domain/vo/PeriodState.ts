import { ValueObjectBase } from '../../shared/ValueObejct';

export class PeriodState extends ValueObjectBase<string> {
  constructor(value: string) {
    super(value, 'Invalid period status');
  }

  protected validate(value: string): boolean {
    if (!value) return false;
    return value === 'APPROVED';
  }
}
