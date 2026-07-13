import { ValueObjectBase } from '../../shared/ValueObejct';

export class Id extends ValueObjectBase<string> {
  constructor(value: string) {
    super(value, 'Invalid period id');
  }

  protected validate(value: string): boolean {
    return value.length > 12;
  }

  static generate(): Id {
    const randomId = crypto.randomUUID();
    return new Id(randomId);
  }
}
