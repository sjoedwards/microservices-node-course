import mongoose from "mongoose";
import request, { Test } from "supertest";
import { TicketDoc, Ticket } from "./../models/ticket";
import { Express } from "express";

export const buildTicket = async (
  id = mongoose.Types.ObjectId().toHexString(),
  title = "title",
  price = 20
): Promise<TicketDoc> => {
  const ticket = Ticket.build({ id, title, price });

  await ticket.save();

  return ticket;
};

export const createOrder = async (
  app: Express,
  ticketId: string,
  cookie = global.signin()
): Promise<Test> => {
  return request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId })
    .expect(201);
};
