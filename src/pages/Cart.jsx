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
import logoSvg from "../assets/logo.svg";

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
              to="/shop"
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
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  const generateQuoteInternal = async (billing, shipping) => {
    // this contains the original logic that creates order, PDF and clears cart
    // We'll reuse the existing code by setting local variables before the main try block
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
        let mutableProps = [];
        if (item.selectedLength) {
          mutableProps.push({
            propertyName: "length",
            propertyValue: item.selectedLength.toString(),
            unit: item.lengthUnit || "mm",
          });
        }
        if (Array.isArray(item.mutable_properties)) {
          for (const prop of item.mutable_properties) {
            if (!mutableProps.find((p) => p.propertyName === prop.propertyName)) {
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
        createdTime: Math.floor(Date.now() / 1000),
        validUpto: Math.floor((Date.now() + 15 * 24 * 60 * 60 * 1000) / 1000),
        status: "QUOTE_GENERATED",
        paymentMode: "",
        transactionId: "",
        shipmentVendor: "",
        shipmentIdentifierType: "",
        shipmentIdentifier: "",
        shipmentStatus: "NOT_STARTED",
        orderDetails: Object.values(orderDetails),
        subtotal,
        shipping: shippingCost,
        total,
        billing: billing || {},
        shippingDetails: shipping || {},
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      // generate PDF using same code as before, but using customerAddress/customerPhone
      const jsPDFModule = await import("jspdf/dist/jspdf.umd.min.js");
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
      const pdf = new jsPDF();

      // --- Header Section ---
      try {
        const resp = await fetch(logoSvg);
        const svgText = await resp.text();
        const svgDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
        const img = new Image();
        img.src = svgDataUrl;
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
        });
        const intrinsicW = img.width || 60;
        const intrinsicH = img.height || 60;
        const scale = 3;
        const canvas = document.createElement("canvas");
        canvas.width = intrinsicW * scale;
        canvas.height = intrinsicH * scale;
        const ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, intrinsicW, intrinsicH);
        const pngDataUrl = canvas.toDataURL("image/png");
        pdf.addImage(pngDataUrl, "PNG", 14, 10, 40, 16);
      } catch (err) {
        console.warn("Failed to load logo for PDF:", err);
      }

      // Company contacts (positioned left, just below the logo)
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      // logo is placed at x=14, y=10 with height ~16 -> start contacts below at y=28
      const contactsX = 14;
      const contactsEmailY = 28;
      const contactsEmailY2 = contactsEmailY + 6;
      const contactsPhoneY = contactsEmailY2 + 6;
      // show emails stacked to avoid overflow
      pdf.text("sales@mitsukiindia.com", contactsX, contactsEmailY);
      pdf.text("sales@mitsuki.in", contactsX, contactsEmailY2);
      pdf.text("+91 7988050803 / +91 9999810210", contactsX, contactsPhoneY);

      // Quote Details
      pdf.setFontSize(22);
      pdf.setTextColor(40, 40, 40);
      pdf.setFont("helvetica", "bold");
      const quoteTextWidth = pdf.getTextWidth("QUOTATION");
      pdf.text("QUOTATION", 196 - quoteTextWidth, 20);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      const quoteIdText = `Ref # : ${docRef.id.substring(0, 8).toUpperCase()}`;
      const dateText = `Date  : ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
      pdf.text(quoteIdText, 196 - pdf.getTextWidth(quoteIdText), 26);
      pdf.text(dateText, 196 - pdf.getTextWidth(dateText), 31);

      // Divider - place below the contact block to avoid overlap
      pdf.setDrawColor(220, 220, 220);
      // keep divider above the customer blocks; clamp so it doesn't overlap
      const dividerY = Math.min(44, contactsPhoneY + 2);
      pdf.line(14, dividerY, 196, dividerY);

      // --- Customer Section ---
      pdf.setFontSize(11);
      pdf.setTextColor(40, 40, 40);
      pdf.setFont("helvetica", "bold");
      pdf.text("Bill To:", 14, 48);

      const bill = billing || {};
      const ship = shipping || {};
      const customerName = bill.name || currentUser.name || currentUser.email || "Valued Customer";
      const customerEmail = bill.email || currentUser.email || "";

      // Layout positions
      const labelX = 14;
      const valueX = labelX + 28;
      const shipToX = 110;
      const shipValueX = shipToX + 28;

      // Left (Bill To)
      let leftY = 54;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("Name:", labelX, leftY);
      pdf.setFont("helvetica", "normal");
      pdf.text(customerName, valueX, leftY);

      leftY += 6;
      pdf.setFont("helvetica", "bold");
      pdf.text("Address:", labelX, leftY);
      pdf.setFont("helvetica", "normal");
      const addrLinesLeft = (bill.address) ? pdf.splitTextToSize(bill.address, 70) : [];
      // determine an accurate line height if available
      let lineHeight = 5;
      if (typeof pdf.getTextDimensions === "function") {
        const dim = pdf.getTextDimensions("M");
        if (dim && dim.h) lineHeight = dim.h;
      } else if (typeof pdf.getFontSize === "function") {
        lineHeight = pdf.getFontSize() * 0.5;
      }

      if (addrLinesLeft.length > 0) {
        pdf.text(addrLinesLeft, valueX, leftY);
        // position Email baseline: last line baseline + consistent gap (same as Name->Address)
        leftY = leftY + Math.max(0, addrLinesLeft.length - 1) * lineHeight + 6;
      } else {
        leftY += 6;
      }
      pdf.setFont("helvetica", "bold");
      pdf.text("Email:", labelX, leftY);
      pdf.setFont("helvetica", "normal");
      if (customerEmail) pdf.text(customerEmail, valueX, leftY);

      leftY += 6;
      pdf.setFont("helvetica", "bold");
      pdf.text("Phone:", labelX, leftY);
      pdf.setFont("helvetica", "normal");
      if (bill.phone) pdf.text(bill.phone, valueX, leftY);

      // Right (Ship To)
      let rightY = 54;
      pdf.setFont("helvetica", "bold");
      pdf.text("Ship To:", shipToX, 48);

      pdf.text("Name:", shipToX, rightY);
      pdf.setFont("helvetica", "normal");
      pdf.text(ship.name || customerName, shipValueX, rightY);

      rightY += 6;
      pdf.setFont("helvetica", "bold");
      pdf.text("Address:", shipToX, rightY);
      pdf.setFont("helvetica", "normal");
      const addrLinesRight = (ship.address) ? pdf.splitTextToSize(ship.address, 70) : [];
      if (addrLinesRight.length > 0) {
        pdf.text(addrLinesRight, shipValueX, rightY);
        rightY = rightY + Math.max(0, addrLinesRight.length - 1) * lineHeight + 6;
      } else {
        rightY += 6;
      }
      pdf.setFont("helvetica", "bold");
      pdf.text("Email:", shipToX, rightY);
      pdf.setFont("helvetica", "normal");
      if (ship.email) pdf.text(ship.email, shipValueX, rightY);

      rightY += 6;
      pdf.setFont("helvetica", "bold");
      pdf.text("Phone:", shipToX, rightY);
      pdf.setFont("helvetica", "normal");
      if (ship.phone) pdf.text(ship.phone, shipValueX, rightY);
      // draw horizontal separators under each block for visual separation
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      // left block line (under Bill To)
      pdf.line(labelX, leftY + 8, shipToX - 8, leftY + 8);
      // right block line (under Ship To)
      pdf.line(shipToX, rightY + 8, 196, rightY + 8);

      const blockEndY = Math.max(leftY, rightY);
      let y = Math.max(70, blockEndY + 12);

      // --- Table Header ---
      const col1 = 14;  // Item
      const col2 = 120; // Qty
      const col3 = 145; // Unit Price
      const col4 = 175; // Total

      // Header Background
      pdf.setFillColor(245, 245, 245);
      pdf.rect(14, y - 5, 182, 8, 'F');

      // Header Text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(40, 40, 40);
      pdf.text("ITEM DESCRIPTION", col1 + 2, y);
      pdf.text("QTY", col2, y);
      pdf.text("UNIT PRICE", col3, y);
      pdf.text("TOTAL", col4, y);

      // --- Table Body ---
      y += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);

      cartItems.forEach((item, index) => {
        const itemName = item.name.length > 45 ? item.name.substring(0, 45) + "..." : item.name;
        const itemSku = item.sku || item.partCode || item.id;
        const unitPrice = item.price.toFixed(2);
        const lineTotal = (item.price * item.quantity).toFixed(2);

        pdf.text(itemName, col1 + 2, y);
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`SKU: ${itemSku}`, col1 + 2, y + 4);

        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);
        pdf.text(String(item.quantity), col2, y);
        pdf.text(`Rs. ${unitPrice}`, col3, y);
        pdf.text(`Rs. ${lineTotal}`, col4, y);

        y += 10;

        if (index < cartItems.length - 1) {
          pdf.setDrawColor(240, 240, 240);
          pdf.line(14, y - 4, 196, y - 4);
        }

        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
      });

      // Totals etc (same as before)
      y += 5;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(14, y, 196, y);
      y += 8;
      const rightAlignX = 175;
      pdf.setFont("helvetica", "normal");
      pdf.text("Subtotal:", 140, y);
      pdf.text(`Rs. ${subtotal.toFixed(2)}`, rightAlignX, y);
      y += 6;
      pdf.text("Shipping:", 140, y);
      pdf.text(`Rs. ${shippingCost.toFixed(2)}`, rightAlignX, y);
      y += 8;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Total:", 140, y);
      pdf.text(`Rs. ${total.toFixed(2)}`, rightAlignX, y);

      const pageHeight = pdf.internal.pageSize.height;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Thank you for your business!", 105, pageHeight - 15, { align: "center" });
      pdf.text("Generated by Mitsuki India Online Store", 105, pageHeight - 10, { align: "center" });

      pdf.save(`mitsuki-quote-${docRef.id}.pdf`);

      clearCart();
      navigate("/orders?tab=quotes");
    } catch (error) {
      console.error("Error generating quote:", error);
      alert(`Failed to generate quote: ${error.message}`);
    } finally {
      setGeneratingQuote(false);
    }
  };

  const handleGenerateQuote = async () => {
    if (!currentUser) {
      alert("Please log in to generate a quote.");
      navigate("/login");
      return;
    }

    // build canonical billing and shipping objects from profile (with fallbacks)
    const billing = currentUser.billing || {
      name: currentUser.name || "",
      address: currentUser.address || "",
      phone: currentUser.phone || "",
      email: currentUser.email || "",
    };
    const shipping = currentUser.shipping || { ...billing };

    if (!billing.address || !billing.phone) {
      setShowProfilePrompt(true);
      return;
    }

    setGeneratingQuote(true);
    await generateQuoteInternal(billing, shipping);
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 sm:py-10">
      <PageWrapper>
        {showProfilePrompt && (
          <div className="mb-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200">
            Please enter your Bill To and Ship To details in <a href="/profile" className="font-semibold underline">My Profile</a> before generating a quote.
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemImage = item?.image || product1;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.id}`}
                      className="flex-shrink-0 w-full sm:w-24 h-40 sm:h-24 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
                    >
                      <img
                        src={itemImage}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
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
                          className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0 self-start"
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

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
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
                        <div className="text-left sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
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
            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-800 lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
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
                  className="block w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-center rounded-lg font-bold shadow-lg transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300"
                >
                  {generatingQuote ? "Generating Quote..." : "Generate Quote"}
                </button>
                <Link
                  to="/checkout"
                  className="block w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Proceed to Payment
                </Link>
                <Link
                  to="/shop"
                  className="block w-full px-6 py-3 sm:py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-center rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
