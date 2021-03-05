import { Ticket } from "../ticket";

const buildTicket = () => {
  return Ticket.build({ price: 5, title: "concert", userId: "123" });
};
it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket
  const ticket = buildTicket();
  // Save to the database
  await ticket.save();
  // Fetch it twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // Make two separate changes to the tickets
  firstInstance.set({ price: 10 });
  secondInstance.set({ price: 15 });
  // Save the first fetched ticket
  await firstInstance.save();
  // Save the second fetched ticket - expect to see an error as version outdated

  let error;
  try {
    await secondInstance.save();
  } catch (e) {
    error = e;
  }
  expect(error).toBeDefined();
});

it("increments the version number on multiple saves", async () => {
  const ticket = buildTicket();
  await ticket.save();
  expect(ticket.version).toBe(0);
  await ticket.save();
  expect(ticket.version).toBe(1);
  await ticket.save();
  expect(ticket.version).toBe(2);
});
