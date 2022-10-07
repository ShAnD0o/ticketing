import { PaymentCreatedPublisher } from "./../events/publishers/payment-created-publisher";
// import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
  BadRequestError,
} from "@shandotickets/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Can not pay for Cancelled Order ...");
    }
    // build user for some amount of mony
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100, // price in cent (100 cent =1$)
      source: token,
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
