import { natsWrapper } from "./../nats-wrapper";
import { requireAuth, validateRequest } from "@sjoedwards/common";
import { body } from "express-validator";
import { Router, Response, Request } from "express";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

const router = Router();
router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title must not be empty"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive value"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser.id,
    });

    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
