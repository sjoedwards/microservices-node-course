import mongoose from "mongoose";
import { requireAuth } from "@sjoedwards/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError()
    })
    // Make sure the ticket isn't already reserved

    // Calculate an expiration date - 15 minutes

    // Build the order and save to the database

    // Tell the rest of the application who might need the database - publish event
    res.send({});
  }
);

export { router as newOrderRouter };
