import { EventBase } from './DomainEvent';
import { EventSubscriber } from './EventSubscriber';

export interface DomainEventBus {
  subscribe(subscriber: EventSubscriber): void;
  unsubscribe(subscriber: EventSubscriber): void;
  publish(event: EventBase): void;
}
