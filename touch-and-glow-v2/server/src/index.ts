import "dotenv/config";
import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { webhookRouter } from "./routes/paystack-webhook";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173"
  })
);

// The Paystack webhook needs the RAW request body to verify its HMAC
// signature, so it's mounted with express.raw() before the global
// express.json() parser touches it. Every other route gets parsed JSON.
app.use("/api/paystack/webhook", express.raw({ type: "application/json" }), webhookRouter);

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Touch And GLOW API listening on http://localhost:${port}`);
});
