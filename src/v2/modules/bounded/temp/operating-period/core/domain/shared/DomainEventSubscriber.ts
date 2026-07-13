import { DomainEvent } from '../../shared/DomainEvent';
import { EventSubscriber } from '../../shared/EventSubscriber';

export interface DomainEventSubscriber<T> extends EventSubscriber {
  onEvent(event: DomainEvent<T>): void;
}
