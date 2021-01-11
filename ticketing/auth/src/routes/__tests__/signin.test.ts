import request from "supertest";
import { app } from "../../app";

test("fails when an email that does not exist is supplied", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

test("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password1" });

  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

test("succeeds when a correct username and password is supplied - cookie is dropped", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password1" });

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password1" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
