// Enum is sort of like an object
// If of type 'subject' means it can be any of those in the enum
export enum Subjects {
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:updated",
  OrderCreated = "order:created",
  OrderCancelled = "order:cancelled",
  ExpirationComplete = "expiration:complete",
}
