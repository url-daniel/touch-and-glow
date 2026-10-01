# Touch And GLOW — Headless Shopify Storefront (React + Express)

A headless e-commerce storefront for **Touch And GLOW**, powered by **Shopify Storefront API** (GraphQL) on the frontend (deployed to **Vercel**) and an optional Node/Express backend (deployed to **Render**).

---

## Architecture Overview

- **`/client` (Vercel)**: React 18 + Vite + Tailwind CSS + Zustand.
  - Fetches live products, images, inventory, and variants directly from Shopify via the **Shopify Storefront API**.
  - Handles line items and variant selections.
  - Generates instant Shopify checkout sessions via `cartCreate` GraphQL mutation and redirects customers straight to Shopify's high-converting, 256-bit SSL encrypted checkout.
  - Supports 1-Click Shop Pay, Apple Pay, Google Pay, Credit/Debit cards, automatic tax calculation, and localized currencies.
  - Comes with graceful demo fallback and a setup helper if live credentials are not yet entered.
- **`/server` (Render)**: Node / Express API.
  - Supports Shopify webhooks (`/api/shopify/webhooks`) with HMAC SHA256 signature verification.
  - Provides status health-checks (`/api/shopify/status`).
  - Retains legacy custom order/Paystack endpoints for backward compatibility.

---

## 1. Shopify Setup Guide

### Step A: Get your Storefront API Access Token
1. Go to your **Shopify Admin** (`https://admin.shopify.com/store/YOUR-STORE`).
2. Navigate to **Settings** > **Apps and sales channels** > **Develop apps**.
3. Click **Allow custom app development** (if prompted), then click **Create an app**.
4. Name the app (e.g. `Touch And Glow Headless`).
5. Click **Configure Storefront API scopes** and enable:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_customer_tags`
6. Click **Save**, then click **Install app**.
7. Under **Storefront API access token**, copy the token (starts with `shpat_...` or similar).

---

## 2. Deploying to Vercel (`/client`)

In your **Vercel Project Settings** > **Environment Variables**, add:

| Variable Name | Example Value | Description |
|---|---|---|
| `VITE_SHOPIFY_STORE_DOMAIN` | `your-store-name.myshopify.com` | Your Shopify store domain |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | `shpat_xxxxxxxxxxxxxxxxxxxxx` | Your public Storefront API token |
| `VITE_SHOPIFY_API_VERSION` | `2024-07` | Storefront API version |
| `VITE_API_URL` | `https://touch-and-glow.onrender.com` | Optional Render backend URL |

Trigger a redeploy on Vercel or push your git branch to update.

---

## 3. Deploying to Render (`/server`)

In your **Render Dashboard** > **Environment**, configure:

| Variable Name | Example Value | Description |
|---|---|---|
| `PORT` | `4000` | Port for the Express server |
| `CLIENT_URL` | `https://your-app.vercel.app` | Your Vercel frontend URL (for CORS) |
| `SHOPIFY_STORE_DOMAIN` | `your-store-name.myshopify.com` | Your Shopify store domain |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | `shpat_xxxxxxxxxxxxxxxxxxxxx` | Storefront API token |
| `SHOPIFY_WEBHOOK_SECRET` | `shpss_xxxxxxxxxxxxxxxxxxxx` | Secret for Shopify webhooks (optional) |

If you configure Shopify webhooks, point them in Shopify Admin to:
`https://your-server.onrender.com/api/shopify/webhooks`

---

## 4. Local Development

### Client (Frontend)
```bash
cd client
cp .env.example .env
# Edit .env and enter your VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Server (Backend)
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
The API runs on [http://localhost:4000](http://localhost:4000).

---

## How Checkout Flows

1. The customer selects a product and chooses their desired variant (e.g. 30ml, 50ml, shade).
2. The item is saved to the shopping bag with its Shopify `variantId`.
3. In the shopping bag (`/checkout`), the customer clicks **Proceed to Shopify Checkout** (or clicks **Buy with Shopify** directly from the product page).
4. The client executes the `cartCreate` mutation against the Shopify Storefront API.
5. Shopify returns the secure `checkoutUrl`.
6. The user is redirected to Shopify's checkout to complete shipping, taxes, and payment via Shop Pay, credit card, Apple Pay, etc.
7. Upon order placement, Shopify notifies the customer via email and redirects to the confirmation page.
