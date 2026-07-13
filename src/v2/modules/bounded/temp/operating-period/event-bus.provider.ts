import { InMemoryEventBus } from "./infrastructure/adapters/in-memory-event-bus";
import { EVENT_BUS_PROVIDER } from "./shared/constants";

// EVENT BUS
export const EventBusProvider = {
  provide: EVENT_BUS_PROVIDER,
  useFactory: () => {
    return new InMemoryEventBus();
  }
};
