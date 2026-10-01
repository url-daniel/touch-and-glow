import "dotenv/config";
import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { webhookRouter } from "./routes/paystack-webhook";
import { shopifyRouter } from "./routes/shopify";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173"
  })
);

// Raw request bodies needed for HMAC verification before express.json()
app.use("/api/paystack/webhook", express.raw({ type: "application/json" }), webhookRouter);
app.use("/api/shopify/webhooks", express.raw({ type: "application/json" }), shopifyRouter);

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/shopify", shopifyRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Touch And GLOW API listening on http://localhost:${port}`);
});
