declare module "light-event-bus" {
  interface Subscription {
    unsubscribe(): void;
  }
  export class EventBus<T extends Record<string, unknown>> {
    subscribe<K extends keyof T>(
      eventName: K,
      handler: (arg: T[K]) => void
    ): Subscription;
    publish<K extends keyof T>(eventName: K, arg: T[K]): void;
  }
}
