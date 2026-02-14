import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import productService from "../services/ProductService";
import { useCart } from "../context/CartContext";

// Import fallback product image
import product1 from "../assets/products/1.png";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLength, setSelectedLength] = useState(null);
  const [lengthInput, setLengthInput] = useState("");
  const [lengthError, setLengthError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);

    // First check if product data was passed via navigation state
    if (location.state && location.state.product) {
      const productData = location.state.product;
      setProduct(productData);
      // Set default length if mutable properties exist
      if (
        productData.mutableProperties &&
        productData.mutableProperties.length > 0
      ) {
        const lengthProp = productData.mutableProperties.find(
          (prop) => prop.propertyName === "length",
        );
        if (lengthProp) {
          setSelectedLength(parseFloat(lengthProp.default));
          setLengthInput(String(parseFloat(lengthProp.default)));
        }
      }
      setLoading(false);
      return;
    }

    // Otherwise fetch from service
    try {
      const data = await productService.getProduct(id);
      setProduct(data);
      // Set default length if mutable properties exist
      if (data.mutableProperties && data.mutableProperties.length > 0) {
        const lengthProp = data.mutableProperties.find(
          (prop) => prop.propertyName === "length",
        );
        if (lengthProp) {
          setSelectedLength(parseFloat(lengthProp.default));
          setLengthInput(String(parseFloat(lengthProp.default)));
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <Link to="/shop" className="text-blue-600 hover:underline">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const imageArray = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || product1];
  const productImages = imageArray.map((img) => img || product1);
  const hasDiscount = product.discount > 0;

  // Calculate price: if length is selected (or typed), use pricePerUnit * chargeable units.
  const calculateCurrentPrice = () => {
    // If product has a pricePerUnit and a selected length, determine how many
    // units we should charge for. Charge for at least `minimumPayableUnit` if set.
    const pricePerUnit = product.pricePerUnit;

    // Prefer top-level minimumPayableUnit, but fall back to mutableProperties
    const lengthProp = product.mutableProperties?.find(
      (prop) => prop.propertyName === "length",
    );
    const rawMinPayable =
      product.minimumPayableUnit ?? lengthProp?.minimumPayableUnit ?? null;
    const minPayableValue = rawMinPayable != null ? parseFloat(rawMinPayable) : NaN;
    const minPayable = !Number.isNaN(minPayableValue) && minPayableValue > 0
      ? minPayableValue
      : 0;

    const typedLength = parseFloat(lengthInput);
    const effectiveLength =
      Number.isFinite(typedLength) && typedLength > 0
        ? typedLength
        : selectedLength;

    if (pricePerUnit != null && effectiveLength) {
      const chargedUnits = Math.max(effectiveLength, minPayable || 0);
      return (pricePerUnit * chargedUnits).toFixed(2);
    }

    // Fallback to precomputed product.price
    return Number.isFinite(product.price) ? product.price.toFixed(2) : "0.00";
  };

  const currentPrice = calculateCurrentPrice();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <PageWrapper className="md:py-6 lg:py-8">
        <div className="py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link
              to="/"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <span>›</span>
            <Link
              to="/shop"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Shop
            </Link>
            {location.state?.category && (
              <>
                <span>›</span>
                <Link
                  to={`/shop?category=${encodeURIComponent(location.state.category.categoryName)}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {location.state.category.categoryName}
                </Link>
              </>
            )}
            {location.state?.part && (
              <>
                <span>›</span>
                <Link
                  to={`/shop?category=${encodeURIComponent(location.state.category?.categoryName || "")}&part=${encodeURIComponent(location.state.part.partName)}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {location.state.part.partName}
                </Link>
              </>
            )}
            <span>›</span>
            <span className="text-gray-900 dark:text-white">
              {product.name}
            </span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 aspect-square flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-600 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="space-y-6 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
              {/* Brand & Category */}
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.brand}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>

              {/* SKU & Rating */}
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  SKU: <span className="font-semibold">{product.sku}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{currentPrice}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save {product.discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Length Selector */}
              {product.mutableProperties &&
                product.mutableProperties.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Length:
                      </span>
                      <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() => {
                            const lengthProp = product.mutableProperties.find(
                              (prop) => prop.propertyName === "length",
                            );
                            if (lengthProp) {
                              const min = parseFloat(lengthProp.minimum);
                              const multiplier = parseFloat(
                                lengthProp.multiplier,
                              );
                              const base = Number.isFinite(selectedLength)
                                ? selectedLength
                                : parseFloat(lengthInput) || min;
                              const newLength = Math.max(
                                min,
                                base - multiplier,
                              );
                              setSelectedLength(newLength);
                              setLengthInput(String(newLength));
                              setLengthError(null);
                            }
                          }}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={lengthInput}
                          onChange={(e) => {
                            const nextValue = e.target.value;
                            setLengthInput(nextValue);

                            const lengthProp = product.mutableProperties.find(
                              (prop) => prop.propertyName === "length",
                            );
                            if (!lengthProp) return;

                            const min = parseFloat(lengthProp.minimum);
                            const max = parseFloat(lengthProp.maximum);
                            const value = parseFloat(nextValue);

                            if (Number.isNaN(value)) {
                              setLengthError("Please enter a valid number");
                              return;
                            }

                            if (value < min) {
                              setLengthError(`Minimum is ${min} ${lengthProp.unit}`);
                              setSelectedLength(value);
                              return;
                            }

                            if (value > max) {
                              setLengthError(`Maximum is ${max} ${lengthProp.unit}`);
                              setSelectedLength(value);
                              return;
                            }

                            // valid
                            setSelectedLength(value);
                            setLengthError(null);
                          }}
                          onBlur={() => {
                            // Normalize invalid entries on blur if needed
                            const lengthProp = product.mutableProperties.find(
                              (prop) => prop.propertyName === "length",
                            );
                            if (!lengthProp) return;
                            const min = parseFloat(lengthProp.minimum);
                            const max = parseFloat(lengthProp.maximum);
                            const value = parseFloat(lengthInput);

                            if (Number.isNaN(value)) {
                              setLengthInput(String(min));
                              setSelectedLength(min);
                              setLengthError(null);
                              return;
                            }

                            if (value < min) {
                              setLengthInput(String(min));
                              setSelectedLength(min);
                              setLengthError(null);
                              return;
                            }

                            if (value > max) {
                              setLengthInput(String(max));
                              setSelectedLength(max);
                              setLengthError(null);
                              return;
                            }
                          }}
                          className={`px-4 py-2 w-24 text-center bg-transparent border-0 focus:outline-none ${lengthError ? "ring-2 ring-red-500 rounded" : ""}`}
                        />
                        <span className="px-2 text-gray-600 dark:text-gray-400">
                          {
                            product.mutableProperties.find(
                              (prop) => prop.propertyName === "length",
                            )?.unit
                          }
                        </span>
                        <button
                          onClick={() => {
                            const lengthProp = product.mutableProperties.find(
                              (prop) => prop.propertyName === "length",
                            );
                            if (lengthProp) {
                              const max = parseFloat(lengthProp.maximum);
                              const multiplier = parseFloat(
                                lengthProp.multiplier,
                              );
                              const base = Number.isFinite(selectedLength)
                                ? selectedLength
                                : parseFloat(lengthInput) || max;
                              const newLength = Math.min(
                                max,
                                base + multiplier,
                              );
                              setSelectedLength(newLength);
                              setLengthInput(String(newLength));
                              setLengthError(null);
                            }
                          }}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {lengthError && (
                        <div className="text-sm text-red-600 mt-1">{lengthError}</div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Range:{" "}
                      {
                        product.mutableProperties.find(
                          (prop) => prop.propertyName === "length",
                        )?.minimum
                      }{" "}
                      -{" "}
                      {
                        product.mutableProperties.find(
                          (prop) => prop.propertyName === "length",
                        )?.maximum
                      }{" "}
                      {
                        product.mutableProperties.find(
                          (prop) => prop.propertyName === "length",
                        )?.unit
                      }
                    </div>
                  </div>
                )}

              {/* Stock Status */}
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="font-semibold">
                    In Stock ({product.stockQuantity} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="font-semibold">Out of Stock</span>
                </div>
              )}

              {/* Description Preview */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Quantity:
                </span>
                <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6">
                <button
                  onClick={() => {
                    // Add to cart logic with selected length
                    const cartItem = {
                      id: `${product.id}-${selectedLength}`, // Make unique ID for different lengths
                      name: product.name,
                      price: parseFloat(currentPrice),
                      sku: product.sku,
                      partCode: product.sku || product.id, // Add partCode for checkout
                      brand: product.brand,
                      description: product.description,
                      image: product.image,
                      inStock: product.inStock,
                      category: product.category,
                      specifications: product.specifications,
                      quantity: quantity,
                      selectedLength: selectedLength,
                      lengthUnit: product.mutableProperties?.find(
                        (prop) => prop.propertyName === "length",
                      )?.unit,
                      baseProductId: product.id, // Keep reference to base product
                    };
                    addToCart(cartItem);
                    navigate("/cart");
                  }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  ⚡ Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
            {/* Tab Headers */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex gap-8">
                {["description", "specifications", "features"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="py-8">
              {activeTab === "description" && (
                <div className="space-y-4 max-w-3xl">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {product.description}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                    Applications
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {product.applications.map((app, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-green-500">✓</span>
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="max-w-2xl">
                  <div className="grid gap-3">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {value}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
                  {product.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
                    >
                      <span className="text-blue-600 dark:text-blue-400 text-xl">
                        ✓
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
