// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import PageWrapper from "../components/PageWrapper";

export default function Checkout() {
  const { currentUser } = useAuth();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = 100;
  const total = subtotal + shipping;

  const handleGenerateQuote = async () => {
    if (!currentUser) {
      alert("Please log in to generate a quote.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // Group items by partCode (fallback to id or sku)
      const orderDetails = cartItems.reduce((acc, item) => {
        const partCode = item.partCode || item.id || item.sku;

        if (!partCode) {
          throw new Error(`Item ${item.name} is missing partCode/id/sku`);
        }

        if (!acc[partCode]) {
          acc[partCode] = {
            partCode,
            items: [],
          };
        }
        acc[partCode].items.push({
          units: item.quantity.toString(),
          amount: (item.price * item.quantity).toString(),
          mutable_properties: item.mutable_properties || [],
        });
        return acc;
      }, {});

      const orderData = {
        userId: currentUser.uid,
        createdTime: Math.floor(Date.now() / 1000), // epoch time
        validUpto: Math.floor((Date.now() + 15 * 24 * 60 * 60 * 1000) / 1000), // 15 days from now
        status: "QUOTE_GENERATED",
        paymentMode: "",
        transactionId: "",
        shipmentVendor: "",
        shipmentIdentifierType: "",
        shipmentIdentifier: "",
        shipmentStatus: "NOT_STARTED",
        orderDetails: Object.values(orderDetails),
        // Keep old fields for compatibility
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        shipping,
        total,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "orders"), orderData);
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Error generating quote:", error);
      alert(`Failed to generate quote: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Place Order */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>
              <p className="text-gray-600">
                Orders will be shipped to the address on file. For now, this is
                a demo.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Payment Information
              </h2>
              <p className="text-gray-600">
                A quotation will be generated for your order. You can pay for it
                later from your Orders page.
              </p>
            </div>

            <button
              onClick={handleGenerateQuote}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generating Quote..." : "Generate Quote"}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
