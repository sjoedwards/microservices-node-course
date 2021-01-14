import request from "supertest";
import { app } from "../../app";
import { createTicket } from "../../test/utils";

test("can fetch a list of tickets ", async () => {
  await createTicket(app);
  await createTicket(app);
  await createTicket(app);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body).toHaveLength(3);
});
