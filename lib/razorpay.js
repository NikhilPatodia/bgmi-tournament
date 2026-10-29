import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance = null;

/** Lazy Razorpay SDK singleton (server-only). */
export function getRazorpay() {
  if (razorpayInstance) return razorpayInstance;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials are not configured");
  }

  razorpayInstance = new Razorpay({ key_id, key_secret });
  return razorpayInstance;
}

/** Verify Razorpay webhook signature. */
export function verifyWebhookSignature(body, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature || "")
    );
  } catch {
    return false;
  }
}

/** Verify checkout payment signature (client confirm). */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const payload = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature || "")
    );
  } catch {
    return false;
  }
}
