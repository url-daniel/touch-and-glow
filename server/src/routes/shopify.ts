import { Router, Request, Response } from "express";
import crypto from "crypto";

export const shopifyRouter = Router();

// Endpoint to verify Shopify configuration on the server
shopifyRouter.get("/status", (_req: Request, res: Response) => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const hasStorefrontToken = Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
  const hasWebhookSecret = Boolean(process.env.SHOPIFY_WEBHOOK_SECRET);

  res.json({
    status: "ok",
    configured: Boolean(domain && hasStorefrontToken),
    domain: domain || null,
    hasWebhookSecret
  });
});

// Shopify webhook listener for orders/create, orders/paid, inventory updates
// Note: Mount this route with express.raw({ type: "application/json" }) to preserve raw bytes for HMAC verification
shopifyRouter.post("/webhooks", (req: Request, res: Response) => {
  const hmacHeader = req.headers["x-shopify-hmac-sha256"] as string | undefined;
  const topic = req.headers["x-shopify-topic"] as string | undefined;
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (secret && hmacHeader) {
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(typeof req.body === "string" ? req.body : JSON.stringify(req.body));
    const generatedHash = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("base64");

    if (generatedHash !== hmacHeader) {
      console.warn("Shopify webhook HMAC verification failed.");
      return res.status(401).send("HMAC verification failed");
    }
  }

  // Parse payload
  let payload: Record<string, unknown> = {};
  try {
    payload = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString("utf-8")) : req.body;
  } catch {
    // If already parsed or empty
  }

  console.log(`Received Shopify webhook [${topic || "unknown"}]`, payload?.id || "");

  // Acknowledge receipt immediately so Shopify does not retry
  return res.status(200).json({ received: true, topic });
});
