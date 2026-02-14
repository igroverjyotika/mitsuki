import React from "react";
import { useParams } from "react-router-dom";
import productsData from "../data/Products.json";
import { flattenCatalogToProducts } from "../utils/productCatalog";

export default function Product() {
  const { id } = useParams();
  const p = flattenCatalogToProducts(productsData).find((x) => x.id === id);
  if (!p) return <div>Product not found</div>;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded border">
        <img
          src={p.image}
          alt={p.name}
          className="w-full h-96 object-contain"
        />
      </div>
      <div className="bg-white p-4 rounded border">
        <h1 className="text-2xl font-semibold">{p.name}</h1>
        <p className="mt-2 text-gray-700">{p.desc}</p>
        <p className="mt-4 font-medium">Specs: {p.specs}</p>
        <div className="mt-6">
          <div className="text-2xl font-bold">₹{p.price}</div>
          <div className="mt-3 flex items-center gap-2">
            <button className="px-3 py-1 border rounded">-</button>
            <div className="px-4">1</div>
            <button className="px-3 py-1 border rounded">+</button>
            <button className="ml-4 px-4 py-2 bg-black text-white rounded">
              Add to cart
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Shipping: 2–3 business days
        </p>
      </div>
    </div>
  );
}
