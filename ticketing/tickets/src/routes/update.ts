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
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser.id) {
      throw new NotAuthorizedError();
    }
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
