import { natsWrapper } from "./../nats-wrapper";
import { TicketUpdatedPublisher } from "./../events/publishers/ticket-updated-publisher";
import { body } from "express-validator";
import {
  NotFoundError,
  validateRequest,
  requireAuth,
  NotAuthorizedError,
} from "@sjoedwards/common";
import { Request, Response, Router } from "express";
import { Ticket } from "../models/ticket";

const router = Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat().withMessage("Title is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser.id) {
      throw new NotAuthorizedError();
    }

    // This just sets the property on the object in memory, it doesn't save it
    ticket.set({ title: req.body.title, price: req.body.price });

    // Persist to the database
    await ticket.save();

    // TODO We don't really want to do this here... Because the reality is that if this failed, an error would throw, then what?
    // The database would be out of sync with the events
    // Instead we need to save the event to a database, and have code which reads from the database, and then updates
    // a 'sent' attribute to true in the table as a callback of the event successfully being published
    // Alternatively Could have a callback that rolls back saving to the database perhaps.
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    // A 'database transaction' essentially means that theres a collection of information we need to save to the
    // database. If any of this information fails to save, then roll back saving of the entire collection

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
