import { Router } from "express";
import { prisma } from "../lib/prisma";
import { verifyWebhookSignature, verifyTransaction } from "../lib/paystack";

export const webhookRouter = Router();

// Paystack calls this URL server-to-server when a payment event happens.
// Configure it in the Paystack dashboard as:
//   https://yourdomain.com/api/paystack/webhook
//
// IMPORTANT: this route is mounted with express.raw() in src/index.ts
// (not express.json()) because the HMAC signature is computed over the
// exact raw request bytes — parsing JSON first would change those bytes
// and break verification.
webhookRouter.post("/", async (req, res) => {
  const rawBody = req.body as Buffer; // raw bytes, thanks to express.raw() in index.ts
  const signature = req.header("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    // Reject anything that isn't cryptographically proven to be from
    // Paystack — this is what stops an attacker from POSTing a fake
    // "charge.success" event to mark their own order as paid.
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(rawBody.toString("utf8"));

  if (event.event !== "charge.success") {
    return res.json({ received: true });
  }

  const reference: string = event.data.reference;

  // Belt-and-braces: re-verify the transaction directly against Paystack's
  // API rather than trusting the webhook payload's fields alone.
  const verified = await verifyTransaction(reference);
  if (verified.status !== "success") {
    return res.json({ received: true });
  }

  const order = await prisma.order.findUnique({
    where: { paystackReference: reference },
    include: { items: true }
  });

  if (!order) {
    return res.json({ received: true });
  }

  // Idempotency: Paystack can and will retry webhook delivery for the same
  // event. If we've already marked this order successful, skip straight
  // out — reprocessing would double-deduct stock and could double-fulfill
  // the order.
  if (order.status === "successful") {
    return res.json({ received: true, alreadyProcessed: true });
  }

  if (verified.amount !== order.totalKobo) {
    return res.status(400).json({ error: "Amount mismatch" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Atomic, race-safe stock deduction: the WHERE clause only succeeds
      // if there's still enough stock, so two simultaneous webhook
      // deliveries (or two orders racing for the last unit) can never
      // push stock negative.
      for (const item of order.items) {
        const result = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } }
        });
        if (result.count === 0) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }
      }

      await tx.order.update({ where: { id: order.id }, data: { status: "successful" } });
    });
  } catch (err) {
    // Stock ran out between order creation and payment confirmation.
    // In production: trigger a refund via the Paystack API and notify
    // the customer. Left as a clear extension point here.
    console.error("Stock deduction failed for order", order.id, err);
    await prisma.order.update({ where: { id: order.id }, data: { status: "failed" } });
    return res.status(409).json({ error: "Stock unavailable" });
  }

  res.json({ received: true });
});
