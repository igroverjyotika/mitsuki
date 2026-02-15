// src/components/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Toast from "./Toast";

// Import all product images
import product1 from "../assets/products/1.png";

export default function ProductCard({ product }) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [showToast, setShowToast] = useState(false);

  const discountPercentage = product.discount || 0;
  const hasDiscount = discountPercentage > 0;
  const productImage = product?.image || product1;

  // Check if product is in cart and get quantity
  const cartItem = cartItems.find((item) => item.id === product.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setShowToast(true);
  };

  const handleUpdateQuantity = (e, newQuantity) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, newQuantity);
  };

  return (
    <>
      {showToast && (
        <Toast
          message="Added to cart!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        {/* Product Image */}
        <Link
          to={`/product/${product.id}`}
          className="block relative overflow-hidden bg-gray-50 dark:bg-gray-700 aspect-square"
        >
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercentage}%
            </span>
          )}

          {/* Stock Badge Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Compact Product Info */}
        <div className="p-4 space-y-2">
          {/* Product Name */}
          <Link
            to={`/product/${product.id}`}
            className="block font-semibold text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 min-h-[40px]"
          >
            {product.name}
          </Link>

          {/* Price Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                ₹{product.price}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons - Side by Side */}
          {isInCart ? (
            <div className="flex gap-2 pt-2">
              {/* View Details */}
              <Link
                to={`/product/${product.id}`}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium text-sm transition-colors"
              >
                Details
              </Link>

              {/* Quantity Controls */}
              <div className="flex items-center bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-lg">
                <button
                  onClick={(e) => handleUpdateQuantity(e, cartQuantity - 1)}
                  className="px-2 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-l-lg transition-colors"
                >
                  −
                </button>
                <span className="px-3 py-2 text-sm font-bold text-gray-900 dark:text-white">
                  {cartQuantity}
                </span>
                <button
                  onClick={(e) => handleUpdateQuantity(e, cartQuantity + 1)}
                  className="px-2 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-r-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 pt-2">
              {/* View Details */}
              <Link
                to={`/product/${product.id}`}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium text-sm transition-colors"
              >
                View Details
              </Link>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  product.inStock
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
                title="Add to Cart"
              >
                🛒
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
