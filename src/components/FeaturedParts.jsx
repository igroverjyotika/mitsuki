import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import productsData from "../data/Products.json";
import PageWrapper from "./PageWrapper";
import { getCatalogProductMedia } from "../utils/productCatalog";

import product1 from "../assets/products/1.png";
import product2 from "../assets/products/2.png";
import product3 from "../assets/products/3.png";
import product4 from "../assets/products/4.png";

const DEFAULT_PAGE_SIZE = 8;

const tileImages = [product1, product2, product3, product4];

function pickTileImage(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return tileImages[hash % tileImages.length];
}

function extractParts(data) {
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const byName = new Map();

  for (const category of categories) {
    const parts = Array.isArray(category?.part) ? category.part : [];
    for (const part of parts) {
      const name =
        typeof part?.partName === "string" ? part.partName.trim() : "";
      if (!name) continue;

      const productCount = Array.isArray(part?.products)
        ? part.products.length
        : 0;

      const existing = byName.get(name);
      if (existing) {
        existing.productCount += productCount;
      } else {
        byName.set(name, {
          name,
          productCount,
          part,
          category,
        });
      }
    }
  }

  return Array.from(byName.values());
}

function pickRealImage(part, category, fallbackName) {
  const firstProduct = part?.products?.[0];
  if (firstProduct) {
    const media = getCatalogProductMedia(firstProduct, { part, category });
    if (media?.image) return media.image;
  }
  return pickTileImage(fallbackName || part?.partName || "Product");
}

export default function FeaturedParts({
  title = "Featured Products",
  subtitle = "Discover our top-selling products, trusted by industries across India",
  maxItems = 24,
  pageSize = DEFAULT_PAGE_SIZE,
}) {
  const parts = useMemo(() => {
    const all = extractParts(productsData);
    const limit = Math.max(1, Number(maxItems) || 0);
    return all.slice(0, limit);
  }, [maxItems]);

  const size = Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE);
  const visible = parts.slice(0, size);

  return (
    <section className="bg-white py-14">
      <PageWrapper>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            {title}
          </h2>
          <p className="mt-3 text-base md:text-lg text-gray-600">{subtitle}</p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {visible.map((part) => (
              <Link
                key={part.name}
                to="/shop"
                className="group rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/15"
                title={part.name}
              >
                <div className="mx-auto w-full max-w-[160px] aspect-[4/3] rounded-xl bg-white shadow-sm ring-1 ring-gray-100 flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:ring-gray-200">
                  <img
                    src={pickRealImage(part.part, part.category, part.name)}
                    alt={part.name}
                    className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                </div>

                <div className="mt-3 text-[15px] md:text-[16px] font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
                  {part.name}
                </div>

                <div className="mt-1.5 text-xs md:text-sm font-semibold text-blue-600">
                  {Math.max(0, part.productCount)} SKUs
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            >
              View All Featured Products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </PageWrapper>
    </section>
  );
}
