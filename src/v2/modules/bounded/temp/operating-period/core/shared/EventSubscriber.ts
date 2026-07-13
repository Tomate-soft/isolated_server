import { EventBase, EventName } from './DomainEvent';

export interface EventSubscriber {
  suscribeTo(): EventName;
  onEvent(event: EventBase): void;
}
