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
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
