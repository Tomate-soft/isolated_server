import { EventBase } from '../../shared/DomainEvent';
import { Id } from '../vo/PeriodId.vo';

export abstract class Entity<T> {
  // id: Id;
  id: Id;
  private events: EventBase[] = [];

  abstract equalsTo(entity: T): boolean;

  record(event: EventBase): void {
    this.events.push(event);
  }

  pullEvents(): EventBase[] {
    const domainEvents = this.events.slice();
    this.events = [];
    return domainEvents;
  }
}
