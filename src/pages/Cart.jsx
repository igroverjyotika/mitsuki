// src/pages/Cart.jsx
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import { useCart } from "../context/CartContext";

// Import fallback product image
import product1 from "../assets/products/1.png";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [generatingQuote, setGeneratingQuote] = useState(false);

  const continueShoppingTo = useMemo(() => {
    const state = location.state;
    const returnTo =
      state && typeof state.returnTo === "string" ? state.returnTo : "";
    return returnTo.startsWith("/") ? returnTo : "/shop";
  }, [location.state]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <PageWrapper>
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Add some products to get started!
            </p>
            <Link
              to={continueShoppingTo}
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </PageWrapper>
      </div>
    );
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

    setGeneratingQuote(true);
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
        // Ensure mutable_properties is always populated with length etc if available
        let mutableProps = [];
        if (item.selectedLength) {
          mutableProps.push({
            propertyName: "length",
            propertyValue: item.selectedLength.toString(),
            unit: item.lengthUnit || "mm",
          });
        }
        // Add any other mutable properties from item.mutable_properties
        if (Array.isArray(item.mutable_properties)) {
          for (const prop of item.mutable_properties) {
            if (
              !mutableProps.find((p) => p.propertyName === prop.propertyName)
            ) {
              mutableProps.push(prop);
            }
          }
        }
        acc[partCode].items.push({
          units: item.quantity.toString(),
          amount: (item.price * item.quantity).toString(),
          mutable_properties: mutableProps,
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
        subtotal,
        shipping,
        total,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      try {
        const jsPDFModule = await import("jspdf/dist/jspdf.umd.min.js");
        const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text("Quotation", 14, 20);

        pdf.setFontSize(11);
        pdf.text(`Quote ID: ${docRef.id}`, 14, 30);
        pdf.text(`Customer: ${currentUser.email || currentUser.uid}`, 14, 36);
        const created = new Date(orderData.createdTime * 1000)
          .toISOString()
          .slice(0, 10);
        pdf.text(`Date: ${created}`, 14, 42);

        pdf.setFontSize(12);
        let y = 54;
        pdf.text("Items:", 14, y);
        y += 6;

        cartItems.forEach((item, index) => {
          const line1 = `${index + 1}. ${item.name} (SKU: ${
            item.sku || item.partCode || item.id
          })`;
          const line2 = `Qty: ${item.quantity}  Unit: ₹${item.price.toFixed(
            2,
          )}  Total: ₹${(item.price * item.quantity).toFixed(2)}`;

          pdf.setFontSize(11);
          pdf.text(line1, 14, y);
          y += 5;
          pdf.text(line2, 18, y);
          y += 7;
        });

        if (y > 240) {
          pdf.addPage();
          y = 20;
        }

        pdf.setFontSize(12);
        pdf.text("Summary:", 14, y);
        y += 6;
        pdf.setFontSize(11);
        pdf.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 18, y);
        y += 5;
        pdf.text(`Shipping: ₹${shipping.toFixed(2)}`, 18, y);
        y += 5;
        pdf.text(`Total: ₹${total.toFixed(2)}`, 18, y);

        pdf.save(`mitsuki-quote-${docRef.id}.pdf`);
      } catch (pdfError) {
        console.error("Error generating PDF quote:", pdfError);
      }

      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Error generating quote:", error);
      alert(`Failed to generate quote: ${error.message}`);
    }
    setGeneratingQuote(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <PageWrapper>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemImage = item?.image || product1;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.id}`}
                      className="flex-shrink-0 w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
                    >
                      <img
                        src={itemImage}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4 mb-2">
                        <div>
                          <Link
                            to={`/product/${item.id}`}
                            className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.brand} • SKU: {item.sku}
                            {item.selectedLength && (
                              <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                                • Length: {item.selectedLength}{" "}
                                {item.lengthUnit}
                              </span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
                          title="Remove item"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Qty:
                          </span>
                          <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 font-semibold min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            ₹{item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Removed free-shipping threshold promo */}

              <div className="space-y-3">
                <button
                  onClick={handleGenerateQuote}
                  disabled={generatingQuote}
                  className="block w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-center rounded-lg font-bold shadow-lg transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300"
                >
                  {generatingQuote ? "Generating Quote..." : "Generate Quote"}
                </button>
                <Link
                  to="/checkout"
                  className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Proceed to Payment
                </Link>
                <Link
                  to="/shop"
                  className="block w-full px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-center rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>100% Genuine Products</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
