import { Router } from "express";
import rateLimit from "express-rate-limit";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";
import { initializeTransaction } from "../lib/paystack";

export const ordersRouter = Router();

// Rate limit checkout attempts per IP to blunt scripted order spam.
const checkoutLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, slow down." }
});

type CheckoutBody = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  items: { productId: string; quantity: number }[];
};

ordersRouter.post("/", checkoutLimiter, async (req, res) => {
  const body = req.body as CheckoutBody;

  if (!body.customerName || !body.customerEmail || !body.shippingAddress || !body.items?.length) {
    return res.status(400).json({ error: "Missing required checkout fields." });
  }

  // Load the real products from the DB — the client only sends
  // productId + quantity. We NEVER trust a price sent from the browser;
  // the total charged is always recomputed here from live DB prices.
  const productIds = body.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  try {
    const lineItems = body.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (item.quantity < 1 || item.quantity > product.stock) {
        throw new Error(`Requested quantity for ${product.name} exceeds available stock`);
      }
      return {
        productId: product.id,
        productName: product.name,
        unitPriceKobo: product.priceKobo, // snapshot price now, at order time
        quantity: item.quantity
      };
    });

    const totalKobo = lineItems.reduce((sum, l) => sum + l.unitPriceKobo * l.quantity, 0);
    const paystackReference = `tag-${randomUUID()}`;

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        shippingAddress: body.shippingAddress,
        totalKobo,
        status: "pending",
        paystackReference,
        items: { create: lineItems }
      }
    });

    const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";
    const transaction = await initializeTransaction({
      email: body.customerEmail,
      amountKobo: totalKobo,
      reference: paystackReference,
      callbackUrl: `${clientUrl}/order-success?reference=${paystackReference}`
    });

    res.json({ orderId: order.id, authorizationUrl: transaction.authorization_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    res.status(400).json({ error: message });
  }
});

// Lets the success page poll order status.
ordersRouter.get("/:reference", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { paystackReference: req.params.reference },
    include: { items: true }
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json({ order });
});
