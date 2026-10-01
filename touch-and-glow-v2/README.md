# Touch And GLOW — E-commerce Storefront (React + Express)

Two separate projects:

- **`/server`** — Node/Express API, Prisma (Postgres), Paystack integration
- **`/client`** — React (Vite) frontend, talks to the API over HTTP

This replaces the earlier Next.js version with a plain Express backend, as
requested — same data model, same security logic (price snapshots, atomic
stock deduction, idempotent webhook, rate limiting), just split into two
deployable services instead of one.

## 1. Set up the server

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:
- `DATABASE_URL` — a Postgres connection string (free options: Supabase, Neon, Railway)
- `PAYSTACK_SECRET_KEY` — from https://dashboard.paystack.com (use `sk_test_...` while developing)
- `CLIENT_URL` — where the frontend runs (`http://localhost:5173` in dev)

Then set up the database:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

Run it:

```bash
npm run dev
```

The API listens on `http://localhost:4000` by default.

## 2. Set up the client

```bash
cd client
npm install
cp .env.example .env
```

`VITE_API_URL` should point at the server (`http://localhost:4000` in dev).

Run it:

```bash
npm run dev
```

The storefront runs on `http://localhost:5173`.

## 3. Paystack webhook setup (required for orders to ever get marked "paid")

Paystack confirms payment by calling your **server** directly, not through
the browser. In the Paystack dashboard, set your webhook URL to:

```
https://your-server-domain.com/api/paystack/webhook
```

**To test locally**, tunnel the server (not the client) with
[ngrok](https://ngrok.com):

```bash
ngrok http 4000
```

Use the ngrok HTTPS URL + `/api/paystack/webhook` as the webhook URL while
testing.

## How a purchase flows through the system

1. Client fetches products from `GET /api/products` and holds the cart in
   Zustand (`localStorage`-persisted — convenience only, never trusted for
   money).
2. At checkout, the client sends only `{ customerName, email, items: [{productId, quantity}] }`
   to `POST /api/orders` on the server — **no prices are sent from the browser.**
3. The server looks up each product's current price/stock, snapshots the
   price per line item, creates the order as `pending`, and calls
   Paystack's Initialize Transaction API.
4. The client is redirected to Paystack's hosted checkout.
5. After payment, Paystack sends a `charge.success` webhook to
   `POST /api/paystack/webhook`. The handler:
   - Verifies the HMAC SHA512 signature against the raw request body
     (mounted with `express.raw()`, not `express.json()`, specifically so
     the bytes used for verification are untouched).
   - Re-verifies the transaction directly via Paystack's Verify API.
   - Skips reprocessing if the order is already `successful` (Paystack can
     redeliver the same webhook event more than once).
   - Atomically decrements stock inside a Prisma transaction using a
     conditional `WHERE stock >= quantity` update, so concurrent purchases
     can never oversell.
   - Marks the order `successful`.
6. The client's order-success page polls `GET /api/orders/:reference`
   until the status flips, then clears the cart.

## Why two projects instead of one

- Deploy independently (e.g. client on Vercel/Netlify as a static site,
  server on Render/Railway/Fly.io or a VPS)
- No framework coupling — swap the frontend later without touching the API
- Matches a conventional React + Express/FastAPI split if that's the
  mental model you want to work in

## Production checklist before going live

- [ ] Switch Paystack keys to live keys
- [ ] Set `CLIENT_URL` (server) and `VITE_API_URL` (client) to real domains
- [ ] Add `helmet` and stricter CORS config on the server for production
- [ ] Swap the in-memory rate limiter for a shared store (Redis/Upstash) if
      you run more than one server instance
- [ ] Add real product photography (currently placeholder blocks)
- [ ] Add order confirmation emails (not included — wire up Resend,
      Postmark, etc. in the webhook handler after marking an order successful)
- [ ] Add an admin view for managing products/orders (not included)
