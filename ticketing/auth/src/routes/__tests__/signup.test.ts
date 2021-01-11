import request from "supertest";
import { app } from "../../app";

test("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
});

test("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test", password: "password" })
    .expect(400);
});

test("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1" })
    .expect(400);
});

test("returns a 400 with missing email and password", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);

  return request(app)
    .post("/api/users/signup")
    .send({ email: "sam@sam.test" })
    .expect(400);
});

test("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "sam@sam.test", password: "password1" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "sam@sam.test", password: "password1" })
    .expect(400);
});

// Cookie only set on secure connection...
test("sets a cookie on successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
