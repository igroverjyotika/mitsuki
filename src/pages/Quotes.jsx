// src/pages/Quotes.jsx
import React, { useEffect, useMemo, useState } from "react";
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

const STATUS_OPTIONS = [
  "QUOTE_GENERATED",
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

function normalizeCreatedAt(data) {
  if (!data) return new Date();
  if (data.createdAt?.toDate) return data.createdAt.toDate();
  if (typeof data.createdTime === "number")
    return new Date(data.createdTime * 1000);
  return new Date();
}

export default function Quotes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((snap) => {
        const data = snap.data();
        return {
          id: snap.id,
          ...data,
          createdAt: normalizeCreatedAt(data),
        };
      });

      setOrders(ordersData);
      setLoading(false);
    };

    fetchOrders();
  }, [currentUser]);

  const quotes = useMemo(
    () => orders.filter((o) => o.status === "QUOTE_GENERATED"),
    [orders],
  );

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      setUpdatingId(orderId);
      await updateDoc(doc(db, "orders", orderId), {
        status: nextStatus,
        statusUpdatedAt: Math.floor(Date.now() / 1000),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating quote status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading quotes...</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Quotes</h1>

        {quotes.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              No quotes yet
            </h2>
            <p className="text-gray-600">
              Generate a quote from your cart/checkout and it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((order) => (
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

                {/* Status dropdown */}
                <div className="mb-4 flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-900">
                    Order State:
                  </label>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="border rounded px-3 py-2 text-sm bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                  {updatingId === order.id && (
                    <span className="text-sm text-gray-500">Updating…</span>
                  )}
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
