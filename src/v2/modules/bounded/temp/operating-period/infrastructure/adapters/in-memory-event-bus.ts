import { EventBase } from '../../core/shared/DomainEvent';
import { DomainEventBus } from '../../core/shared/DomainEventBus';
import { EventSubscriber } from '../../core/shared/EventSubscriber';

export class InMemoryEventBus implements DomainEventBus {
  private subscribers: EventSubscriber[] = [];

  subscribe(subscriber: EventSubscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: EventSubscriber): void {
    const subscriberIndex = this.subscribers.indexOf(subscriber);
    this.subscribers.splice(subscriberIndex, 1);
  }

  publish(event: EventBase): void {
    this.subscribers
      .filter((subscriber) => subscriber.suscribeTo() === event.getName())
      .forEach((subscriber) => subscriber.onEvent(event));
  }
}
