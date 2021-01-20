import { NotAuthorizedError } from "./../../../common/src/errors/not-authorized-error";
import {
  NotFoundError,
  OrderStatus,
  currentUser,
  requireAuth,
} from "@sjoedwards/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order could not be found");
    }

    if (order.userId !== req.currentUser.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;

    await order.save();

    // Publish event to say this was cancelled

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
