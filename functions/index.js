const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

require("dotenv").config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const razorpayKeyId =
  process.env.RAZORPAY_KEY_ID ||
  (functions.config().razorpay && functions.config().razorpay.key_id);
const razorpayKeySecret =
  process.env.RAZORPAY_KEY_SECRET ||
  (functions.config().razorpay && functions.config().razorpay.key_secret);

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn(
    "Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
  );
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

app.post(["/create-order", "/api/create-order"], async (req, res) => {
  if (!razorpayKeyId || !razorpayKeySecret) {
    return res.status(500).json({
      error: "Razorpay credentials are not configured.",
    });
  }

  const { amount, currency, receipt } = req.body;

  if (amount == null || !currency || !receipt) {
    return res.status(400).json({
      error: "Missing required fields: amount, currency, receipt.",
    });
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount < 100) {
    return res.status(400).json({
      error: "Amount must be a number and at least 100 paise.",
    });
  }

  try {
    const order = await razorpay.orders.create({
      amount: numericAmount,
      currency,
      receipt,
      payment_capture: 1,
    });

    return res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    const errorMsg = error.message || JSON.stringify(error);
    const errorDescription = error.description || "";
    console.error("Razorpay create order failed:", errorMsg, errorDescription);

    if (error.statusCode === 401) {
      return res.status(401).json({ error: "Razorpay authentication failed." });
    }

    return res.status(500).json({
      error: "Unable to create Razorpay order.",
      details: process.env.NODE_ENV === "development" ? errorMsg : undefined,
    });
  }
});

app.post(["/verify-payment", "/api/verify-payment"], (req, res) => {
  if (!razorpayKeySecret) {
    return res.status(500).json({
      error: "Razorpay credentials are not configured.",
    });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      error: "Missing required Razorpay fields.",
    });
  }

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Invalid payment signature." });
  }

  return res.json({ success: true });
});

exports.api = functions.https.onRequest(app);
