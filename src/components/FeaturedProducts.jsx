// src/components/FeaturedProducts.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import productsData from "../data/Products.json";
import FeaturedProductTile from "./FeaturedProductTile";
import { flattenCatalogToProducts } from "../utils/productCatalog";
import PageWrapper from "./PageWrapper";

const PAGE_SIZE = 6;
const AUTOPLAY_MS = 3500;

export default function FeaturedProducts({
  title = "Our Wide Range of Products",
  subtitle = "Check out what's new in our company!",
  maxItems = 18,
}) {
  // Home page should not rotate through the entire catalog.
  // Curate a small, stable subset so the section feels intentional.
  const list = useMemo(() => {
    const all = flattenCatalogToProducts(productsData);
    const limit = Math.max(PAGE_SIZE, Number(maxItems) || 0);

    const picked = [];
    const pickedIds = new Set();

    // Prefer variety: pick one per partName (stored as `brand`) first.
    const seenBrands = new Set();
    for (const p of all) {
      if (picked.length >= limit) break;
      const brandKey = p?.brand ?? "";
      if (!brandKey || seenBrands.has(brandKey)) continue;
      picked.push(p);
      pickedIds.add(p.id);
      seenBrands.add(brandKey);
    }

    // Fill remaining slots with the next products in stable order.
    for (const p of all) {
      if (picked.length >= limit) break;
      if (pickedIds.has(p.id)) continue;
      picked.push(p);
      pickedIds.add(p.id);
    }

    return picked;
  }, [maxItems]);
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));

  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    timerRef.current = window.setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    startTimer();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const start = page * PAGE_SIZE;
  const visible = list.slice(start, start + PAGE_SIZE);

  const prev = () => {
    setPage((p) => (p - 1 + totalPages) % totalPages);
    startTimer();
  };

  const next = () => {
    setPage((p) => (p + 1) % totalPages);
    startTimer();
  };

  return (
    <section className="bg-white py-12 border-t border-gray-100">
      <PageWrapper>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-base text-gray-600">{subtitle}</p>
          </div>

          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative mt-10">
          <button
            type="button"
            onClick={prev}
            className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-300/80 hover:bg-gray-400/80 backdrop-blur-sm items-center justify-center shadow-sm"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visible.map((p) => (
              <FeaturedProductTile key={p.id} product={p} />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-300/80 hover:bg-gray-400/80 backdrop-blur-sm items-center justify-center shadow-sm"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPage(idx);
                  startTimer();
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === page ? "w-6 bg-gray-800" : "w-2 bg-gray-300"
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </PageWrapper>
    </section>
  );
}
