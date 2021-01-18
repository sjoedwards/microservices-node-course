import { requireAuth } from "@sjoedwards/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  // Populate is going to take the ObjectId for ticket and then populate the order
  const orders = await Order.find({ userId: req.currentUser.id }).populate(
    "ticket"
  );

  res.send(orders);
});

export { router as indexOrderRouter };
