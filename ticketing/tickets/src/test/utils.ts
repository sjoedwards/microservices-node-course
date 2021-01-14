import { Express } from "express";
import request, { Test } from "supertest";

export const createTicket = (
  app: Express,
  { title, price, cookie }: { title: string; price: number; cookie: string[] }
): Test =>
  request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price });
