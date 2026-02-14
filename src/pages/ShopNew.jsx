import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import productsData from "../data/Products.json";
import { getCatalogProductMedia } from "../utils/productCatalog";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { Search as SearchIcon, X } from "lucide-react";

function safeParseJson(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export default function ShopNew() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [toast, setToast] = useState(null);

  const rawQuery = searchParams.get("query") || "";
  const query = rawQuery.toLowerCase().trim();
  const isSearchActive = Boolean(rawQuery.trim());
  const urlCategory = searchParams.get("category") || "";
  const urlPart = searchParams.get("part") || "";

  const categories = useMemo(() => productsData.categories || [], []);

  const selectedCategory = useMemo(() => {
    if (!urlCategory) return null;
    return categories.find((c) => c.categoryName === urlCategory) || null;
  }, [categories, urlCategory]);

  const selectedPart = useMemo(() => {
    if (!selectedCategory) return null;
    const parts = Array.isArray(selectedCategory.part)
      ? selectedCategory.part
      : [];
    if (urlPart) return parts.find((p) => p.partName === urlPart) || null;
    return parts[0] || null;
  }, [selectedCategory, urlPart]);

  const contextByPartCode = useMemo(() => {
    const map = new Map();
    for (const category of categories || []) {
      for (const part of category.part || []) {
        for (const product of part.products || []) {
          if (product?.partCode) {
            map.set(product.partCode, { category, part });
          }
        }
      }
    }
    return map;
  }, [categories]);

  const buildDisplayName = (partCode, partName) => {
    if (partName && partCode) return `${partName} (${partCode})`;
    return partCode || partName || "Product";
  };

  const getListPriceInfo = (product, part) => {
    const pricePerUnit = parseFloat(product?.price?.value || 0);
    if (!Number.isFinite(pricePerUnit)) {
      return { amount: 0, unitLabel: null, perUnit: null };
    }

    if (product?.price?.static === "yes") {
      return { amount: pricePerUnit, unitLabel: null, perUnit: null };
    }

    const lengthProp = (part?.mutable_properties || []).find(
      (p) => p?.propertyName === "length",
    );
    const unitLabel = product?.price?.unit || lengthProp?.unit || null;
    const defaultLength = parseFloat(lengthProp?.default || 0);

    if (Number.isFinite(defaultLength) && defaultLength > 0) {
      return {
        amount: pricePerUnit * defaultLength,
        unitLabel,
        perUnit: `${pricePerUnit.toFixed(2)}/${unitLabel || "unit"}`,
        defaultLength,
      };
    }

    // No default length available; show per-unit price as the main number.
    return {
      amount: pricePerUnit,
      unitLabel,
      perUnit: `${pricePerUnit.toFixed(2)}/${unitLabel || "unit"}`,
      defaultLength: null,
    };
  };

  const [filters, setFilters] = useState(() =>
    safeParseJson(searchParams.get("filters")),
  );
  const [selections, setSelections] = useState(() =>
    safeParseJson(searchParams.get("selections")),
  );
  const [inlineSearchOpen, setInlineSearchOpen] = useState(() =>
    Boolean(rawQuery.trim()),
  );
  const [searchInput, setSearchInput] = useState(rawQuery);
  const searchInputRef = useRef(null);

  // Keep local state in sync if URL changes (back/forward)
  useEffect(() => {
    setFilters(safeParseJson(searchParams.get("filters")));
    setSelections(safeParseJson(searchParams.get("selections")));
  }, [searchParams]);

  useEffect(() => {
    setSearchInput(rawQuery);
  }, [rawQuery]);

  useEffect(() => {
    if (inlineSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [inlineSearchOpen]);

  useEffect(() => {
    if (searchParams.get("searchOpen") === "1") {
      setInlineSearchOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete("searchOpen");
      setSearchParams(next, { replace: true, preventScrollReset: true });
    }
  }, [searchParams, setSearchParams]);

  const updateParams = (updater, { replace = false } = {}) => {
    const next = new URLSearchParams(searchParams);
    updater(next);
    setSearchParams(next, { replace, preventScrollReset: true });
  };

  const clearFilterParams = () => {
    setFilters({});
    setSelections({});
    updateParams((p) => {
      p.delete("filters");
      p.delete("selections");
    });
  };

  const handleCategorySelect = (category) => {
    const firstPart = category?.part?.[0] || null;
    setFilters({});
    setSelections({});
    setSearchInput("");
    updateParams((p) => {
      p.set("category", category.categoryName);
      if (firstPart) p.set("part", firstPart.partName);
      else p.delete("part");
      p.delete("filters");
      p.delete("selections");
      p.delete("query");
    });
  };

  const handlePartSelect = (part) => {
    setFilters({});
    setSelections({});
    setSearchInput("");
    updateParams((p) => {
      if (selectedCategory?.categoryName)
        p.set("category", selectedCategory.categoryName);
      p.set("part", part.partName);
      p.delete("filters");
      p.delete("selections");
      p.delete("query");
    });
  };

  const handleFilterChange = (propertyName, value) => {
    setFilters((prev) => {
      const next = { ...prev, [propertyName]: value };
      updateParams((p) => {
        const cleaned = Object.fromEntries(
          Object.entries(next).filter(([, v]) => v),
        );
        if (Object.keys(cleaned).length === 0) p.delete("filters");
        else p.set("filters", JSON.stringify(cleaned));
      });
      return next;
    });
  };

  const handleSelectionChange = (propertyName, value) => {
    setSelections((prev) => {
      let next = { ...prev };
      if (value === null || prev[propertyName] === value) {
        delete next[propertyName];
      } else {
        next[propertyName] = value;
      }

      updateParams((p) => {
        if (Object.keys(next).length === 0) p.delete("selections");
        else p.set("selections", JSON.stringify(next));
      });

      return next;
    });
  };

  const handleInlineSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchInput.trim();
    updateParams((p) => {
      if (trimmed) {
        p.set("query", trimmed);
      } else {
        p.delete("query");
      }
    });
  };

  const handleClearQuery = () => {
    setSearchInput("");
    updateParams((p) => {
      p.delete("query");
    });
  };

  const handleCollapseSearch = () => {
    setInlineSearchOpen(false);
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const calculatePrice = (product, part) => {
    if (product?.price?.static === "yes")
      return parseFloat(product.price.value);
    const mutableProp = part?.mutable_properties?.[0];
    if (mutableProp) {
      const length = parseFloat(mutableProp.default);
      const pricePerUnit = parseFloat(product.price.value);
      return pricePerUnit * length;
    }
    return parseFloat(product?.price?.value || 0);
  };

  const getUniqueValues = (propertyName, part = selectedPart) => {
    if (!part) return [];
    const values = new Set();
    (part.products || []).forEach((product) => {
      const spec = (product.specifications || []).find(
        (s) => s.propertyName === propertyName,
      );
      if (spec?.value) values.add(spec.value);
    });
    return Array.from(values);
  };

  const filteredProducts = useMemo(() => {
    let products = [];

    if (selectedPart) {
      products = [...(selectedPart.products || [])];
    } else if (selectedCategory) {
      (selectedCategory.part || []).forEach((part) => {
        products = [...products, ...(part.products || [])];
      });
    } else {
      categories.forEach((category) => {
        (category.part || []).forEach((part) => {
          products = [...products, ...(part.products || [])];
        });
      });
    }

    if (selectedPart?.selectionProperties?.length) {
      products = products.filter((product) =>
        selectedPart.selectionProperties.every((prop) => {
          const selectedValue = selections[prop];
          if (!selectedValue) return true;
          const spec = (product.specifications || []).find(
            (s) => s.propertyName === prop,
          );
          return spec && spec.value === selectedValue;
        }),
      );
    }

    if (selectedPart?.filterProperties?.length) {
      for (const filterKey of Object.keys(filters)) {
        if (!filters[filterKey]) continue;
        products = products.filter((product) => {
          const spec = (product.specifications || []).find(
            (s) => s.propertyName === filterKey,
          );
          return spec && spec.value === filters[filterKey];
        });
      }
    }

    if (query) {
      products = products.filter((product) => {
        const lowerPartCode = (product.partCode || "").toLowerCase();
        const partCodeMatch = lowerPartCode.includes(query);

        const specMatch = (product.specifications || []).some((spec) =>
          (spec.value || "").toLowerCase().includes(query),
        );

        const ctx = contextByPartCode.get(product.partCode);
        const partName = (ctx?.part?.partName || "").toLowerCase();
        const categoryName = (ctx?.category?.categoryName || "").toLowerCase();
        const displayName = buildDisplayName(product.partCode, ctx?.part?.partName).toLowerCase();
        const nameMatch =
          partName.includes(query) ||
          categoryName.includes(query) ||
          displayName.includes(query);

        return partCodeMatch || specMatch || nameMatch;
      });
    }

    return products;
  }, [
    categories,
    selectedCategory,
    selectedPart,
    filters,
    selections,
    query,
    contextByPartCode,
  ]);

  const handleProductClick = (product, price, specs, ctx) => {
    const productPart = selectedPart || ctx?.part || null;
    const productCategory = selectedCategory || ctx?.category || null;
    const media = getCatalogProductMedia(product, {
      part: productPart,
      category: productCategory,
    });

    const detailProduct = {
      id: product.partCode,
      name: buildDisplayName(product.partCode, productPart?.partName),
      price,
      sku: product.partCode,
      brand: productPart?.partName || "Unknown",
      description: Object.entries(specs)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", "),
      image: media.image,
      images: media.images,
      inStock: true,
      category: productCategory?.categoryName || "Unknown",
      specifications: specs,
      discount: 0,
      rating: 4.5,
      reviewCount: 0,
      reviews: 0,
      featured: false,
      stockQuantity: 100,
      originalPrice: price,
      applications: [],
      features: [],
      mutableProperties: productPart?.mutable_properties || [],
      pricePerUnit: parseFloat(product.price?.value || 0),
    };

    navigate(`/product/${product.partCode}`, {
      state: {
        product: detailProduct,
        category: productCategory,
        part: productPart,
      },
    });
  };

  const showPartsTabs = selectedCategory?.part?.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type || "success"}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction}
            onClose={() => setToast(null)}
          />
        )}
        {/* Breadcrumb + inline search */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <Link
              to="/"
              className="hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <span>🏠</span>
              Home
            </Link>
            <span className="text-gray-400">›</span>
            <Link
              to="/shop"
              className="hover:text-gray-900 transition-colors font-medium"
            >
              Products
            </Link>
            {selectedCategory && (
              <>
                <span className="text-gray-400">/</span>
                <span className="font-medium text-gray-900">
                  {selectedCategory.categoryName}
                </span>
              </>
            )}
          </nav>

          <div className="flex w-full lg:w-auto justify-end">
            {!inlineSearchOpen ? (
              <button
                type="button"
                onClick={() => setInlineSearchOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <SearchIcon className="w-4 h-4" />
                <span>Search catalog</span>
                {isSearchActive && (
                  <span className="ml-1 max-w-[140px] truncate rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                    “{rawQuery}”
                  </span>
                )}
              </button>
            ) : (
              <form
                onSubmit={handleInlineSearchSubmit}
                className="flex w-full lg:w-auto max-w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm"
              >
                <SearchIcon className="w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 min-w-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-900"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleCollapseSearch}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                  aria-label="Collapse search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            {selectedCategory?.categoryName || "All Products"}
          </h1>

          {showPartsTabs && (
            <div className="mt-5 flex items-center gap-3 overflow-x-auto pb-2">
              {(selectedCategory.part || []).map((part) => {
                const active = selectedPart?.partName === part.partName;
                return (
                  <button
                    key={part.partName}
                    type="button"
                    onClick={() => handlePartSelect(part)}
                    className={`whitespace-nowrap rounded-lg px-6 py-2 text-sm font-semibold transition-colors border ${
                      active
                        ? "bg-white text-gray-900 border-gray-900"
                        : "bg-gray-100 text-gray-700 border-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {part.partName}
                  </button>
                );
              })}

              <div className="ml-auto flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearFilterParams}
                  className="whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Categories
                </h3>
                <span className="text-gray-400">^</span>
              </div>

              <div className="mt-4 space-y-2 max-h-[65vh] overflow-auto pr-1">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({});
                    setSelections({});
                    setSearchInput("");
                    updateParams((p) => {
                      p.delete("category");
                      p.delete("part");
                      p.delete("filters");
                      p.delete("selections");
                      p.delete("query");
                    });
                  }}
                  className={`w-full text-left text-sm transition-colors ${
                    !selectedCategory
                      ? "font-semibold text-gray-900 underline underline-offset-8"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  All Products
                </button>

                {categories.map((category) => {
                  const active =
                    selectedCategory?.categoryName === category.categoryName;
                  return (
                    <div key={category.categoryName}>
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full text-left text-sm transition-colors ${
                          active
                            ? "font-semibold text-gray-900 underline underline-offset-8"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        {category.categoryName}
                      </button>

                      {active && (category.part || []).length > 0 && (
                        <div className="mt-2 ml-3 space-y-2">
                          {(category.part || []).map((part) => {
                            const partActive =
                              selectedPart?.partName === part.partName;
                            return (
                              <button
                                key={part.partName}
                                type="button"
                                onClick={() => handlePartSelect(part)}
                                className={`block w-full text-left text-sm transition-colors ${
                                  partActive
                                    ? "font-semibold text-gray-900"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                              >
                                {part.partName}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selections */}
            {selectedPart?.selectionProperties?.length > 0 && (
              <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                <h3 className="text-base font-bold mb-4 text-gray-900">
                  Selections
                </h3>
                <div className="space-y-4">
                  {selectedPart.selectionProperties.map((prop) => (
                    <div key={prop}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {prop}
                      </label>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleSelectionChange(prop, null)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                            !selections[prop]
                              ? "bg-gray-900 text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span>All</span>
                          {!selections[prop] && (
                            <span className="text-white">✓</span>
                          )}
                        </button>

                        {getUniqueValues(prop).map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleSelectionChange(prop, value)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                              selections[prop] === value
                                ? "bg-gray-900 text-white"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span>{value}</span>
                            {selections[prop] === value && (
                              <span className="text-white">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main */}
          <main className="lg:col-span-3 xl:col-span-4">
            {selectedPart?.filterProperties?.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-6">
                <h3 className="text-base font-bold mb-4 text-gray-900">
                  Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedPart.filterProperties.map((property) => (
                    <div key={property} className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {property}
                      </label>
                      <select
                        value={filters[property] || ""}
                        onChange={(e) =>
                          handleFilterChange(property, e.target.value)
                        }
                        className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all duration-200"
                      >
                        <option value="">All</option>
                        {getUniqueValues(property).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="text-7xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Products Found
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                    Try adjusting your filters, selections, or search criteria
                    to find more products.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilterParams}
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const ctx = contextByPartCode.get(product.partCode);
                  const productPart = selectedPart || ctx?.part || null;
                  const productCategory =
                    selectedCategory || ctx?.category || null;
                  const priceInfo = getListPriceInfo(product, productPart);
                  const price = priceInfo.amount;
                  const specs = (product.specifications || []).reduce(
                    (acc, spec) => {
                      acc[spec.propertyName] = spec.value;
                      return acc;
                    },
                    {},
                  );

                  const cartItem = cartItems.find(
                    (item) => item.id === product.partCode,
                  );
                  const lengthProp = (
                    productPart?.mutable_properties || []
                  ).find((p) => p?.propertyName === "length");
                  const selectedLength =
                    priceInfo?.defaultLength != null
                      ? Number(priceInfo.defaultLength)
                      : lengthProp?.default
                        ? Number(parseFloat(lengthProp.default))
                        : null;

                  const displayName = buildDisplayName(
                    product.partCode,
                    productPart?.partName,
                  );
                  const media = getCatalogProductMedia(product, {
                    part: productPart,
                    category: productCategory,
                  });
                  const cartProduct = {
                    id: product.partCode,
                    name: displayName,
                    price,
                    sku: product.partCode,
                    brand:
                      productPart?.partName ||
                      productCategory?.categoryName ||
                      "Unknown",
                    description: Object.entries(specs)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", "),
                    image: media.image,
                    images: media.images,
                    inStock: true,
                    category: productCategory?.categoryName || "Unknown",
                    specifications: specs,
                    partCode: product.partCode,
                    ...(selectedLength != null
                      ? {
                          selectedLength,
                          lengthUnit: lengthProp?.unit || product?.price?.unit,
                        }
                      : null),
                  };

                  return (
                    <div
                      key={product.partCode}
                      onClick={() =>
                        handleProductClick(product, price, specs, ctx)
                      }
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
                    >
                      <div className="w-full h-44 bg-white overflow-hidden relative flex items-center justify-center">
                        <img
                          src={media.image}
                          alt={product.partCode}
                          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                          {productPart?.partName || product.partCode}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          Part Code:{" "}
                          <span className="font-semibold">
                            {product.partCode}
                          </span>
                        </p>

                        <div className="text-xl font-bold text-gray-900">
                          ₹{price.toFixed(2)}
                        </div>
                        {priceInfo.perUnit && (
                          <div className="text-xs text-gray-600 mt-1">
                            ₹{priceInfo.perUnit}
                            {priceInfo.defaultLength != null && (
                              <span className="ml-2">
                                • Default: {priceInfo.defaultLength}{" "}
                                {priceInfo.unitLabel || ""}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-3">
                          {cartItem ? (
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(
                                    product.partCode,
                                    cartItem.quantity - 1,
                                  );
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full text-gray-900 font-bold shadow-sm transition-colors"
                              >
                                -
                              </button>
                              <span className="font-bold text-gray-900 text-sm px-3">
                                {cartItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(
                                    product.partCode,
                                    cartItem.quantity + 1,
                                  );
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full text-gray-900 font-bold shadow-sm transition-colors"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(cartProduct);
                                setToast({
                                  message: `${displayName} added to cart`,
                                  type: "success",
                                  actionLabel: "View Cart",
                                  onAction: () => navigate("/cart"),
                                });
                              }}
                              className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                            >
                              <span>🛒</span>
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
