import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import Toast from "./Toast";

import product1 from "../assets/products/1.png";
import product2 from "../assets/products/2.png";
import product3 from "../assets/products/3.png";
import product4 from "../assets/products/4.png";

const imageMap = {
  "/src/assets/products/1.png": product1,
  "/src/assets/products/2.png": product2,
  "/src/assets/products/3.png": product3,
  "/src/assets/products/4.png": product4,
};

function StarsRow({ count = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, idx) => (
        <span key={idx} className="text-yellow-400 text-sm leading-none">
          ☆
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-1">(0)</span>
    </div>
  );
}

export default function FeaturedProductTile({ product }) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const productImage = useMemo(
    () => imageMap[product.image] || product1,
    [product.image],
  );

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setShowToast(true);
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

      <div className="bg-gray-100 rounded-2xl p-5 flex items-center gap-5">
        <Link to={`/product/${product.id}`} className="flex-shrink-0">
          <div className="w-28 h-20 bg-white/70 rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={`/product/${product.id}`}
            className="block font-semibold text-gray-900 leading-snug line-clamp-2"
          >
            {product.name}
          </Link>

          <div className="mt-2">
            <StarsRow />
          </div>

          <div className="mt-3 font-bold text-gray-900">₹ {product.price}</div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            product.inStock
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          title="Add to cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
