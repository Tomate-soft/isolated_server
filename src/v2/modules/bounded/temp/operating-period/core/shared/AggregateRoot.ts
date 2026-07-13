import { Id } from '../domain/vo/PeriodId.vo';

export abstract class AggregateRoot<T> {
  id: Id;

  abstract equalsTo(e: T): boolean;
}
