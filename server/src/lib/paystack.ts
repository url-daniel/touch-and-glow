import crypto from "crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

type InitializeArgs = {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
};

type InitializeResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

// Starts a Paystack transaction and returns the hosted checkout URL to
// redirect the customer to. Called only from the server — the secret key
// never reaches the browser.
export async function initializeTransaction(
  args: InitializeArgs
): Promise<InitializeResponse["data"]> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: args.email,
      amount: args.amountKobo, // Paystack expects the lowest currency unit (kobo)
      reference: args.reference,
      callback_url: args.callbackUrl
    })
  });

  const json = (await res.json()) as InitializeResponse;
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to initialize Paystack transaction");
  }
  return json.data;
}

// Verifies that a webhook payload genuinely came from Paystack by
// recomputing the HMAC SHA512 signature with our secret key and comparing
// it to the signature Paystack sent in the x-paystack-signature header.
// Do this BEFORE trusting anything in the payload.
export function verifyWebhookSignature(rawBody: Buffer, signatureHeader: string | undefined): boolean {
  if (!signatureHeader) return false;
  const hash = crypto.createHmac("sha512", getSecretKey()).update(rawBody).digest("hex");
  const a = Buffer.from(hash);
  const b = Buffer.from(signatureHeader);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Double-checks a transaction directly with Paystack's API as a second
// line of defense beyond the webhook signature.
export async function verifyTransaction(reference: string) {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const json = await res.json() as {
    status?: boolean;
    message?: string;
    data?: {
      status: string;
      reference: string;
      amount: number;
    };
  };

  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to verify Paystack transaction");
  }

  return json.data as {
    status: string;
    reference: string;
    amount: number;
  };
}