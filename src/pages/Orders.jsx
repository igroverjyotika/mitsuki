// src/pages/Orders.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import logoSvg from "../assets/logo.svg";

const PAID_ORDER_STATUSES = [
  "PAID",
  "DELIVERY_INITIATED",
  "PICKED",
  "IN_TRANSIT",
  "DELIVERED",
  "CLOSED",
];

const statusColors = {
  QUOTE_GENERATED: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  DELIVERY_INITIATED: "bg-purple-100 text-purple-800",
  PICKED: "bg-orange-100 text-orange-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [updatingId, setUpdatingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt
          ? doc.data().createdAt.toDate()
          : new Date(doc.data().createdTime * 1000),
      }));
      setOrders(ordersData);
      setLoading(false);
    };

    fetchOrders();
  }, [currentUser]);

  // Sync active tab with URL query (?tab=orders|quotes)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    if (tab === "orders" || tab === "quotes") {
      setActiveTab(tab);
    } else {
      // Default to orders when no tab is specified (e.g. plain /orders)
      setActiveTab("orders");
    }
  }, [location.search]);

  const handlePayNow = async (order) => {
    // For now, simulate payment success like Quotes page
    alert(
      "Demo: Payment successful! In production, this would open Razorpay gateway.",
    );

    try {
      setUpdatingId(order.id);
      await updateDoc(doc(db, "orders", order.id), {
        status: "PAID",
        paymentMode: "DEMO_UPI",
        transactionId: `DEMO_${Date.now()}`,
        transactionTime: Math.floor(Date.now() / 1000),
        statusUpdatedAt: Math.floor(Date.now() / 1000),
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, status: "PAID", paymentMode: "DEMO_UPI" }
            : o,
        ),
      );
    } catch (error) {
      console.error("Error marking quote as paid:", error);
      alert("Error converting quote to order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const downloadQuote = async (order) => {
    try {
      setDownloadingId(order.id);
      const jsPDFModule = await import("jspdf/dist/jspdf.umd.min.js");
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
      const pdf = new jsPDF();

      // Header logo
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

      // Company contacts (left, just below logo)
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      const contactsX = 14;
      const contactsEmailY = 28;
      const contactsEmailY2 = contactsEmailY + 6;
      const contactsPhoneY = contactsEmailY2 + 6;
      pdf.text("sales@mitsukiindia.com", contactsX, contactsEmailY);
      pdf.text("sales@mitsuki.in", contactsX, contactsEmailY2);
      pdf.text("+91 7988050803 / +91 9999810210", contactsX, contactsPhoneY);

      // Quote title and meta
      pdf.setFontSize(22);
      pdf.setTextColor(40, 40, 40);
      pdf.setFont("helvetica", "bold");
      const quoteTextWidth = pdf.getTextWidth("QUOTATION");
      pdf.text("QUOTATION", 196 - quoteTextWidth, 20);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      const quoteIdText = `Ref # : ${order.id.substring(0, 8).toUpperCase()}`;
      const dateText = `Date  : ${order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}`;
      pdf.text(quoteIdText, 196 - pdf.getTextWidth(quoteIdText), 26);
      pdf.text(dateText, 196 - pdf.getTextWidth(dateText), 31);

      // Divider - position below contact block
      pdf.setDrawColor(220, 220, 220);
      // keep divider above the customer blocks; clamp so it doesn't overlap
      const dividerY = Math.min(44, contactsPhoneY + 2);
      pdf.line(14, dividerY, 196, dividerY);

      // Customer blocks
      pdf.setFontSize(11);
      pdf.setTextColor(40, 40, 40);
      pdf.setFont("helvetica", "bold");
      pdf.text("Bill To:", 14, 48);

      const bill = order.billing || {};
      const ship = order.shippingDetails || order.shipping || {};
      const customerName = bill.name || order.customerName || order.userId || "Valued Customer";
      const customerEmail = bill.email || order.email || "";

      const labelX = 14;
      const valueX = labelX + 28;
      const shipToX = 110;
      const shipValueX = shipToX + 28;

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
      let lineHeight = 5;
      if (typeof pdf.getTextDimensions === "function") {
        const dim = pdf.getTextDimensions("M");
        if (dim && dim.h) lineHeight = dim.h;
      } else if (typeof pdf.getFontSize === "function") {
        lineHeight = pdf.getFontSize() * 0.5;
      }

      if (addrLinesLeft.length > 0) {
        pdf.text(addrLinesLeft, valueX, leftY);
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

      // Ship To
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

      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      pdf.line(labelX, leftY + 8, shipToX - 8, leftY + 8);
      pdf.line(shipToX, rightY + 8, 196, rightY + 8);

      const blockEndY = Math.max(leftY, rightY);
      let y = Math.max(70, blockEndY + 12);

      // Table Header
      const col1 = 14;
      const col2 = 120;
      const col3 = 145;
      const col4 = 175;

      pdf.setFillColor(245, 245, 245);
      pdf.rect(14, y - 5, 182, 8, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(40, 40, 40);
      pdf.text("ITEM DESCRIPTION", col1 + 2, y);
      pdf.text("QTY", col2, y);
      pdf.text("UNIT PRICE", col3, y);
      pdf.text("TOTAL", col4, y);

      y += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);

      const details = order.orderDetails || [];
      details.forEach((detail, index) => {
        const itemName = detail.partCode || "Item";
        const itemQty = detail.items && detail.items[0] ? detail.items[0].units : "1";
        const unitPrice = detail.items && detail.items[0] ? Number(detail.items[0].amount) / Number(itemQty) : 0;
        const lineTotal = detail.items && detail.items[0] ? detail.items[0].amount : (unitPrice * itemQty).toFixed(2);

        pdf.text(itemName, col1 + 2, y);
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`SKU: ${detail.partCode || '-'}`, col1 + 2, y + 4);

        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);
        pdf.text(String(itemQty), col2, y);
        pdf.text(`Rs. ${Number(unitPrice).toFixed(2)}`, col3, y);
        pdf.text(`Rs. ${Number(lineTotal).toFixed(2)}`, col4, y);

        y += 10;

        if (index < details.length - 1) {
          pdf.setDrawColor(240, 240, 240);
          pdf.line(14, y - 4, 196, y - 4);
        }

        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
      });

      y += 5;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(14, y, 196, y);
      y += 8;
      const rightAlignX = 175;
      pdf.setFont("helvetica", "normal");
      pdf.text("Subtotal:", 140, y);
      pdf.text(`Rs. ${order.subtotal ? Number(order.subtotal).toFixed(2) : '0.00'}`, rightAlignX, y);
      y += 6;
      pdf.text("Shipping:", 140, y);
      pdf.text(`Rs. ${order.shipping ? Number(order.shipping).toFixed(2) : '0.00'}`, rightAlignX, y);
      y += 8;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Total:", 140, y);
      pdf.text(`Rs. ${order.total ? Number(order.total).toFixed(2) : '0.00'}`, rightAlignX, y);

      const pageHeight = pdf.internal.pageSize.height;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Thank you for your business!", 105, pageHeight - 15, { align: "center" });
      pdf.text("Generated by Mitsuki India Online Store", 105, pageHeight - 10, { align: "center" });

      pdf.save(`mitsuki-quote-${order.id}.pdf`);
    } catch (err) {
      console.error("Error downloading quote:", err);
      alert("Failed to download quote.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading orders...</div>
        </div>
      </PageWrapper>
    );
  }

  const paidOrders = orders.filter((o) =>
    PAID_ORDER_STATUSES.includes(o.status),
  );
  const quoteOrders = orders.filter((o) => o.status === "QUOTE_GENERATED");

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`pb-2 text-3xl font-bold transition-colors border-b-2 ${activeTab === "orders" ? "text-gray-900 border-gray-900" : "text-gray-400 border-transparent hover:text-gray-700"}`}
          >
            My Orders
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("quotes")}
            className={`pb-2 text-3xl font-bold transition-colors border-b-2 ${activeTab === "quotes" ? "text-gray-900 border-gray-900" : "text-gray-400 border-transparent hover:text-gray-700"}`}
          >
            My Quotes
          </button>
        </div>

        {activeTab === "orders" ? (
          paidOrders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                No paid orders yet
              </h2>
              <p className="text-gray-600">
                Once you pay a quote, it will show up here. Switch to the
                <span className="font-semibold"> My Quotes </span>
                tab to view and pay your saved quotes.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {paidOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white shadow-lg rounded-lg p-6 border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created: {order.createdAt.toLocaleDateString()} at{" "}
                        {order.createdAt.toLocaleTimeString()}
                      </p>
                      {order.validUpto && (
                        <p className="text-sm text-gray-600">
                          Valid until:{" "}
                          {new Date(order.validUpto * 1000).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {String(order.status || "UNKNOWN").replaceAll("_", " ")}
                      </span>
                      {order.total && (
                        <p className="text-lg font-semibold text-gray-900 mt-2">
                          ₹{order.total.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  {order.transactionId && (
                    <div className="mb-4 p-3 bg-green-50 rounded">
                      <h4 className="text-sm font-medium text-green-800">
                        Payment Details
                      </h4>
                      <p className="text-sm text-green-700">
                        Mode: {order.paymentMode} | Transaction:{" "}
                        {order.transactionId} | Time:{" "}
                        {new Date(order.transactionTime * 1000).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Shipment Info */}
                  {order.shipmentStatus &&
                    order.shipmentStatus !== "NOT_STARTED" && (
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <h4 className="text-sm font-medium text-blue-800">
                          Shipment Details
                        </h4>
                        <p className="text-sm text-blue-700">
                          Vendor: {order.shipmentVendor} | Status:{" "}
                          {order.shipmentStatus.replace("_", " ")} | ID:{" "}
                          {order.shipmentIdentifier} (
                          {order.shipmentIdentifierType})
                        </p>
                        {order.deliveryTiming && (
                          <p className="text-sm text-blue-700">
                            Delivery:{" "}
                            {new Date(
                              order.deliveryTiming * 1000,
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Order Details:
                    </h4>
                    {order.orderDetails ? (
                      <div className="space-y-4">
                        {order.orderDetails.map((detail, idx) => (
                          <div key={idx} className="border rounded p-3">
                            <h5 className="font-medium text-gray-800">
                              Part Code: {detail.partCode}
                            </h5>
                            <div className="mt-2 space-y-1">
                              {detail.items.map((item, itemIdx) => (
                                <div
                                  key={itemIdx}
                                  className="text-sm text-gray-600 flex justify-between"
                                >
                                  <span>
                                    Units: {item.units} | Amount: ₹{item.amount}
                                    {item.mutable_properties &&
                                      item.mutable_properties.length > 0 && (
                                        <span className="ml-2">
                                          (
                                          {item.mutable_properties
                                            .map(
                                              (prop) =>
                                                `${prop.propertyName}: ${prop.propertyValue}${prop.unit}`,
                                            )
                                            .join(", ")}
                                          )
                                        </span>
                                      )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Fallback for old format
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name} (x{item.quantity})
                            </span>
                            <span>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {order.subtotal && (
                      <div className="border-t mt-4 pt-4 flex justify-between text-sm">
                        <span>Subtotal: ₹{order.subtotal.toFixed(2)}</span>
                        <span>Shipping: ₹{order.shipping.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons based on status */}
                  <div className="mt-4 flex gap-2">
                    {[
                      "PAID",
                      "DELIVERY_INITIATED",
                      "PICKED",
                      "IN_TRANSIT",
                    ].includes(order.status) && (
                      <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
                        Track Shipment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : quoteOrders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              No quotes yet
            </h2>
            <p className="text-gray-600">
              Generate a quote from your cart/checkout and it will appear
              under the <span className="font-semibold">My Quotes</span> tab.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {quoteOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-lg rounded-lg p-6 border"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Quote #{order.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Created: {order.createdAt.toLocaleDateString()} at{" "}
                      {order.createdAt.toLocaleTimeString()}
                    </p>
                    {order.validUpto && (
                      <p className="text-sm text-gray-600">
                        Valid until:{" "}
                        {new Date(order.validUpto * 1000).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {String(order.status || "UNKNOWN").replaceAll("_", " ")}
                    </span>
                    {order.total && (
                      <p className="text-lg font-semibold text-gray-900 mt-2">
                        ₹{order.total.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Convert quote to paid order */}
                <div className="mb-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePayNow(order)}
                    disabled={updatingId === order.id}
                    className="inline-flex items-center px-4 py-2 rounded text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {updatingId === order.id
                      ? "Processing Payment..."
                      : "Pay Now to Order"}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadQuote(order)}
                    disabled={downloadingId === order.id}
                    className="inline-flex items-center px-4 py-2 rounded text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 transition-colors"
                  >
                    {downloadingId === order.id ? "Preparing..." : "Download Quote"}
                  </button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Quote Details:
                  </h4>

                  {order.orderDetails ? (
                    <div className="space-y-4">
                      {order.orderDetails.map((detail, idx) => (
                        <div key={idx} className="border rounded p-3">
                          <h5 className="font-medium text-gray-800">
                            Part Code: {detail.partCode}
                          </h5>
                          <div className="mt-2 space-y-1">
                            {detail.items.map((item, itemIdx) => (
                              <div
                                key={itemIdx}
                                className="text-sm text-gray-600 flex justify-between"
                              >
                                <span>
                                  Units: {item.units} | Amount: ₹{item.amount}
                                  {item.mutable_properties &&
                                    item.mutable_properties.length > 0 && (
                                      <span className="ml-2">
                                        (
                                        {item.mutable_properties
                                          .map(
                                            (prop) =>
                                              `${prop.propertyName}: ${prop.propertyValue}${prop.unit}`,
                                          )
                                          .join(", ")}
                                        )
                                      </span>
                                    )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(order.items || []).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} (x{item.quantity})
                          </span>
                          <span>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {order.subtotal && (
                    <div className="border-t mt-4 pt-4 flex justify-between text-sm">
                      <span>Subtotal: ₹{order.subtotal.toFixed(2)}</span>
                      <span>Shipping: ₹{order.shipping.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
