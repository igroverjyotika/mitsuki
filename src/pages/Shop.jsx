// src/pages/Shop.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import productsData from "../data/Products.json";
import { getCatalogProductMedia } from "../utils/productCatalog";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = (searchParams.get("query") || "").toLowerCase().trim();
  const urlCategory = searchParams.get("category");
  const urlPart = searchParams.get("part");
  const { addToCart, cartItems, updateQuantity } = useCart();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);

  const parseJsonParam = (key) => {
    try {
      const raw = searchParams.get(key);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
    return Array.from(values);
  };

  const handleProductClick = (product, price, specs) => {
    // Find the part and category this product belongs to
    let productPart = selectedPart;
    let productCategory = selectedCategory;

    if (!productPart || !productCategory) {
      // Find from all categories
      for (const category of categories) {
        for (const part of category.part) {
          if (part.products.some((p) => p.partCode === product.partCode)) {
            productPart = part;
            productCategory = category;
            break;
          }
        }
        if (productPart) break;
      }
    }

    const media = getCatalogProductMedia(product, {
      part: productPart,
      category: productCategory,
    });

    const detailProduct = {
      id: product.partCode,
      name: product.partCode,
      price: price,
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
      pricePerUnit: parseFloat(product.price.value),
    };

    navigate(`/product/${product.partCode}`, {
      state: {
        product: detailProduct,
        category: productCategory,
        part: productPart,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full">
          {/* Breadcrumb (match reference) */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
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
                <Link
                  to={`/shop?category=${encodeURIComponent(selectedCategory.categoryName)}`}
                  className="hover:text-gray-900 transition-colors font-medium text-gray-900"
                >
                  {selectedCategory.categoryName}
                </Link>
              </>
            )}
            {selectedPart && (
              <>
                <span className="text-gray-400">/</span>
                <Link
                  to={`/shop?category=${encodeURIComponent(selectedCategory?.categoryName || "")}&part=${encodeURIComponent(selectedPart.partName)}`}
                  className="hover:text-gray-900 transition-colors font-medium text-gray-900"
                >
                  {selectedPart.partName}
                </Link>
              </>
            )}
          </nav>

          {/* Heading + Part tabs */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900">
              {selectedCategory?.categoryName || "All Products"}
            </h1>

            {selectedCategory?.part?.length > 0 && (
              <div className="mt-5 flex items-center gap-3 overflow-x-auto pb-2">
                {selectedCategory.part.map((part) => {
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
                    onClick={() => {
                      setFilters({});
                      setSelections({});
                      updateParams((p) => {
                        p.delete("filters");
                        p.delete("selections");
                      });
                    }}
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
            <div className="lg:col-span-1 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">
                    Categories
                  </h3>
                  <span className="text-gray-400">^</span>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedPart(null);
                      setFilters({});
                      setSelections({});
                      updateParams((p) => {
                        p.delete("category");
                        p.delete("part");
                        p.delete("filters");
                        p.delete("selections");
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

                        {active && category.part?.length > 0 && (
                          <div className="mt-2 ml-3 space-y-2">
                            {filteredProducts.map((product) => {
                                // Find the part this product belongs to for price calculation
                                let productPart = selectedPart;
                                let productCategory = selectedCategory;
                                if (!productPart && selectedCategory) {
                                  for (const part of selectedCategory.part) {
                                    if (
                                      part.products.some(
                                        (p) => p.partCode === product.partCode,
                                      )
                                    ) {
                                      productPart = part;
                                      productCategory = selectedCategory;
                                      break;
                                    }
                                  }
                                } else if (!productPart) {
                                  for (const category of categories) {
                                    for (const part of category.part) {
                                      if (
                                        part.products.some(
                                          (p) => p.partCode === product.partCode,
                                        )
                                      ) {
                                        productPart = part;
                                        productCategory = category;
                                        break;
                                      }
                                    }
                                    if (productPart) break;
                                  }
                                }

                                const price = productPart
                                  ? calculatePrice(product, productPart)
                                  : parseFloat(product.price?.value || 0);
                                const specs = product.specifications.reduce((acc, spec) => {
                                  acc[spec.propertyName] = spec.value;
                                  return acc;
                                }, {});
                                const media = getCatalogProductMedia(product, {
                                  part: productPart,
                                  category: productCategory,
                                });
                                const resolvedCategoryName =
                                  productCategory?.categoryName ||
                                  selectedCategory?.categoryName ||
                                  "Unknown";

                                const cartProduct = {
                                  id: product.partCode,
                                  name: product.partCode,
                                  price: price,
                                  sku: product.partCode,
                                  brand: productPart?.partName || "Unknown",
                                  description: Object.entries(specs)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", "),
                                  image: media.image,
                                  images: media.images,
                                  inStock: true,
                                  category: resolvedCategoryName,
                                  specifications: specs,
                                  partCode: product.partCode,
                                };
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
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 xl:col-span-4">
              {/* Filters */}
              {selectedPart &&
                selectedPart.filterProperties &&
                selectedPart.filterProperties.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
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
                      onClick={() => {
                        setFilters({});
                        setSelections({});
                        updateParams((p) => {
                          p.delete("filters");
                          p.delete("selections");
                        });
                      }}
                      className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    // Find the part this product belongs to for price calculation
                    let productPart = selectedPart;
                    let productCategory = selectedCategory;
                    if (!productPart && selectedCategory) {
                      for (const part of selectedCategory.part) {
                        if (
                          part.products.some(
                            (p) => p.partCode === product.partCode,
                          )
                        ) {
                          productPart = part;
                          productCategory = selectedCategory;
                          break;
                        }
                      }
                    }
                    if (!productPart) {
                      for (const category of categories) {
                        for (const part of category.part) {
                          if (
                            part.products.some(
                              (p) => p.partCode === product.partCode,
                            )
                          ) {
                            productPart = part;
                            productCategory = category;
                            break;
                          }
                        }
                        if (productPart) break;
                      }
                    }

                    const price = productPart
                      ? calculatePrice(product, productPart)
                      : parseFloat(product.price?.value || 0);
                    const specs = product.specifications.reduce((acc, spec) => {
                      acc[spec.propertyName] = spec.value;
                      return acc;
                    }, {});
                    const media = getCatalogProductMedia(product, {
                      part: productPart,
                      category: productCategory,
                    });
                    const resolvedCategoryName =
                      productCategory?.categoryName ||
                      selectedCategory?.categoryName ||
                      "Unknown";

                    const cartProduct = {
                      id: product.partCode,
                      name: product.partCode,
                      price: price,
                      sku: product.partCode,
                      brand: productPart?.partName || "Unknown",
                      description: Object.entries(specs)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", "),
                      image: media.image,
                      images: media.images,
                      inStock: true,
                      category: resolvedCategoryName,
                      specifications: specs,
                      partCode: product.partCode,
                    };

                    const cartItem = cartItems.find(
                      (item) => item.id === product.partCode,
                    );

                    return (
                      <div
                        key={product.partCode}
                        onClick={() => handleProductClick(product, price, specs)}
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
                          <h3 className="text-base font-bold text-gray-900 mb-2 truncate">
                            {product.partCode}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {productPart?.partName || "Unknown"}
                          </p>
                          <div className="text-xl font-bold text-gray-900 mb-3">
                            ₹{price.toFixed(2)}
                          </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
          p.set("selections", JSON.stringify(next));
        });
        return next;
      }
    });
  };

  const calculatePrice = (product, part) => {
    if (product.price.static === "yes") {
      return parseFloat(product.price.value);
    } else {
      // Find the mutable property (usually length)
      const mutableProp = part.mutable_properties?.[0];
      if (mutableProp) {
        const length = parseFloat(mutableProp.default);
        const pricePerUnit = parseFloat(product.price.value);
        return pricePerUnit * length;
      }
      return parseFloat(product.price.value);
    }
  };

  const getUniqueValues = (propertyName) => {
    if (!selectedPart) return [];
    const values = new Set();
    selectedPart.products.forEach((product) => {
      const spec = product.specifications.find(
        (s) => s.propertyName === propertyName,
      );
      if (spec) values.add(spec.value);
    });
    return Array.from(values);
        <div className="min-h-screen bg-white flex items-center justify-center">

  const handleProductClick = (product, price, specs) => {
    // Find the part and category this product belongs to
    let productPart = selectedPart;
    let productCategory = selectedCategory;
    const media = getCatalogProductMedia(product, {
      part: productPart,
      category: productCategory,
    });

    const detailProduct = {
      id: product.partCode,
      name: product.partCode,
      price: price,
      sku: product.partCode,
      brand: productPart?.partName || "Unknown",
      description: Object.entries(specs)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", "),
      image: media.image,
      images: media.images,
      category: productCategory?.categoryName || "Unknown",
      discount: 0,
      rating: 4.5,
      reviewCount: 0,
      reviews: 0,
      featured: false,
      stockQuantity: 100,
      applications: [],
      features: [],
      mutableProperties: productPart?.mutable_properties || [],
      pricePerUnit: parseFloat(product.price.value),
    };

    navigate(`/product/${product.partCode}`, {
      state: {
        product: detailProduct,
        category: productCategory,
        part: productPart,
      },
    });
  };

  if (loading) {

            {/* Heading + Part tabs */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900">
                {selectedCategory?.categoryName || "All Products"}
              </h1>

              {selectedCategory?.part?.length > 0 && (
                <div className="mt-5 flex items-center gap-3 overflow-x-auto pb-2">
                  {selectedCategory.part.map((part) => {
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
                      onClick={() => {
                        setFilters({});
                        setSelections({});
                        updateParams((p) => {
                          p.delete("filters");
                          p.delete("selections");
                        });
                      }}
                      className="whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg">Loading products...</div>
      </div>
    );
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">
                      Categories
                    </h3>
                    <span className="text-gray-400">^</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedPart(null);
                        setFilters({});
                        setSelections({});
                        updateParams((p) => {
                          p.delete("category");
                          p.delete("part");
                          p.delete("filters");
                          p.delete("selections");
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

                          {active && category.part?.length > 0 && (
                            <div className="mt-2 ml-3 space-y-2">
                              {category.part.map((part) => {
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
            <Link
              to="/shop"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Shop
            </Link>
            {selectedCategory && (
              <>
                <span className="text-gray-400">›</span>
                <Link
                  to={`/shop?category=${encodeURIComponent(selectedCategory.categoryName)}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-gray-900 dark:text-white"
                >
                  {selectedCategory.categoryName}
                </Link>
              </>
            )}
            {selectedPart && (
              <>
                <span className="text-gray-400">›</span>
                <Link
                  to={`/shop?category=${encodeURIComponent(selectedCategory?.categoryName || "")}&part=${encodeURIComponent(selectedPart.partName)}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-gray-900 dark:text-white"
                >
                  {selectedPart.partName}
                </Link>
              </>
            )}
          </nav>

          <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span>📂</span>
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <span className="font-medium">
                        {category.categoryName}
                      </span>
                      {selectedCategory === category && (
                        <span className="text-white">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selections */}
              {selectedPart &&
                selectedPart.selectionProperties &&
                selectedPart.selectionProperties.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-base font-bold mb-4 text-gray-900">
                      Selections
                    </h3>
                    <div className="space-y-4">
                      {selectedPart.selectionProperties.map((prop, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {prop}
                          </label>
                          <div className="space-y-2">
                            <button
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
                            {getUniqueValues(prop).map((value, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  handleSelectionChange(prop, value)
                                }
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
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 xl:col-span-4">
              {/* Filters */}
              {selectedPart &&
                selectedPart.filterProperties &&
                selectedPart.filterProperties.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                    <h3 className="text-base font-bold mb-4 text-gray-900">
                      Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPart.filterProperties.map((property, index) => (
                        <div key={index} className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2 capitalize flex items-center gap-1">
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
                            {getUniqueValues(property).map((value, idx) => (
                              <option key={idx} value={value}>
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
                      onClick={() => {
                        setFilters({});
                        setSelections({});
                        updateParams((p) => {
                          p.delete("filters");
                          p.delete("selections");
                        });
                      }}
                      className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    // Find the part this product belongs to for price calculation
                    let productPart = selectedPart;
                    let productCategory = selectedCategory;
                    if (!productPart && selectedCategory) {
                      // Find which part this product belongs to
                      for (const part of selectedCategory.part) {
                        if (
                          part.products.some(
                            (p) => p.partCode === product.partCode,
                          )
                        ) {
                          productPart = part;
                          productCategory = selectedCategory;
                          break;
                        }
                      }
                    }
                    if (!productPart) {
                      // Find from all categories
                      for (const category of categories) {
                        for (const part of category.part) {
                          if (
                            part.products.some(
                              (p) => p.partCode === product.partCode,
                            )
                          ) {
                            productPart = part;
                            productCategory = category;
                            break;
                          }
                        }
                        if (productPart) break;
                      }
                    }

                    const price = productPart
                      ? calculatePrice(product, productPart)
                      : parseFloat(product.price?.value || 0);
                    const specs = product.specifications.reduce((acc, spec) => {
                      acc[spec.propertyName] = spec.value;
                      return acc;
                    }, {});
                    const media = getCatalogProductMedia(product, {
                      part: productPart,
                      category: productCategory,
                    });
                    const resolvedCategoryName =
                      productCategory?.categoryName ||
                      selectedCategory?.categoryName ||
                      "Unknown";

                    const cartProduct = {
                      id: product.partCode,
                      name: product.partCode,
                      price: price,
                      sku: product.partCode,
                      brand: productPart?.partName || "Unknown",
                      description: Object.entries(specs)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", "),
                      image: media.image,
                      images: media.images,
                      inStock: true,
                      category: resolvedCategoryName,
                      specifications: specs,
                      partCode: product.partCode, // Add partCode for checkout
                    };

                    const cartItem = cartItems.find(
                      (item) => item.id === product.partCode,
                    );

                    return (
                      <div
                        key={product.partCode}
                        onClick={() =>
                          handleProductClick(product, price, specs)
                        }
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden group"
                      >
                        {/* Product Image */}
                        <div className="w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative">
                          <img
                            src={media.image}
                            alt={product.partCode}
                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            In Stock
                          </div>
                        </div>

                        <div className="p-4">
                          {/* Product Name/Code */}
                          <h3 className="text-base font-bold text-gray-900 mb-2 truncate">
                            {product.partCode}
                          </h3>

                          {/* Brand */}
                          <p className="text-sm text-gray-600 mb-2">
                            {productPart?.partName || "Unknown"}
                          </p>

                          {/* Price */}
                          <div className="text-xl font-bold text-gray-900 mb-3">
                            ₹{price.toFixed(2)}
                          </div>

                          {/* Cart Controls */}
                          <div className="mt-3">
                            {cartItem ? (
                              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                                <button
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(cartProduct);
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
