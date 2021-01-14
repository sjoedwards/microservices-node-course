import { requireAuth, validateRequest } from "@sjoedwards/common";
import { body } from "express-validator";
import { Router, Response, Request } from "express";
import { Ticket } from "../models/ticket";

const router = Router();
router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Price must be greater than zero"),
    body("price").isFloat({ gt: 0 }),
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
    res.status(201).send({ ticket });
  }
);

export { router as createTicketRouter };
