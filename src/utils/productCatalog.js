// Utilities for working with the nested product catalog in src/data/Products.json
import defaultProductImage from "../assets/products/1.png";
import linearMTK from "../assets/linear-motion/MTK.jpg";
import linearLMUU from "../assets/linear-motion/LMUU.jpeg";
import linearLMLUU from "../assets/linear-motion/LMLUU.jpg";
import linearLMHUU from "../assets/linear-motion/LMHUU.avif";
import linearLMHLUU from "../assets/linear-motion/LMHLUU.jpg";
import linearLMFUU from "../assets/linear-motion/LMFUU.jpg";
import linearLMFLUU from "../assets/linear-motion/LMFLUU.jpg";
import linearLMKUU from "../assets/linear-motion/LMKUU.jpg";
import linearLMKLUU from "../assets/linear-motion/LMKLUU.webp";

function mediaPayload(imageUrl) {
  const safeUrl = imageUrl || defaultProductImage;
  return {
    image: safeUrl,
    images: [safeUrl],
  };
}

const LINEAR_IMAGE_ALIAS = {
  Linear_motion_pdf_image_1: linearMTK,
};

const LINEAR_RULES = [
  { matcher: (code) => code.startsWith("MTK"), asset: linearMTK },
  {
    matcher: (code) => code.startsWith("LMK") && code.includes("LUU"),
    asset: linearLMKLUU,
  },
  { matcher: (code) => code.startsWith("LMK"), asset: linearLMKUU },
  {
    matcher: (code) => code.startsWith("LMF") && code.includes("LUU"),
    asset: linearLMFLUU,
  },
  { matcher: (code) => code.startsWith("LMF"), asset: linearLMFUU },
  {
    matcher: (code) => code.startsWith("LMH") && code.includes("LUU"),
    asset: linearLMHLUU,
  },
  { matcher: (code) => code.startsWith("LMH"), asset: linearLMHUU },
  {
    matcher: (code) => code.startsWith("LM") && code.includes("LUU"),
    asset: linearLMLUU,
  },
  { matcher: (code) => code.startsWith("LM"), asset: linearLMUU },
];

function resolveLinearMotionImage(partCode = "") {
  const normalized = String(partCode).toUpperCase();
  if (!normalized) return null;

  for (const rule of LINEAR_RULES) {
    if (rule.matcher(normalized)) {
      return rule.asset;
    }
  }

  return null;
}

export function getCatalogProductMedia(rawProduct = {}, context = {}) {
  const imageKey = rawProduct?.image;
  if (imageKey && LINEAR_IMAGE_ALIAS[imageKey]) {
    return mediaPayload(LINEAR_IMAGE_ALIAS[imageKey]);
  }

  const categoryName = context?.category?.categoryName || "";
  if (categoryName === "Linear Motion") {
    const linearImage = resolveLinearMotionImage(rawProduct?.partCode);
    if (linearImage) return mediaPayload(linearImage);
  }

  return mediaPayload();
}

export function buildSpecificationsMap(specifications = []) {
  return (specifications || []).reduce((acc, spec) => {
    if (!spec || !spec.propertyName) return acc;
    acc[spec.propertyName] = spec.value;
    return acc;
  }, {});
}

export function computeCatalogProductPrice({ product, part }) {
  if (!product?.price) return 0;

  const value = parseFloat(product.price.value ?? 0);
  if (Number.isNaN(value)) return 0;

  if (product.price.static === "yes") return value;

  // Mutable price: usually per-mm, use default length if available.
  const mutableProp = part?.mutable_properties?.[0];
  // Prefer using minimumPayableUnit as the canonical chargeable length if provided
  // (this represents the minimum billable units). Fallback to `default`.
  const minPayable =
    mutableProp?.minimumPayableUnit != null
      ? parseFloat(mutableProp.minimumPayableUnit)
      : null;
  if (minPayable != null && !Number.isNaN(minPayable)) {
    return value * minPayable;
  }

  if (mutableProp?.default != null) {
    const length = parseFloat(mutableProp.default);
    if (!Number.isNaN(length)) return value * length;
  }

  return value;
}

export function flattenCatalogToProducts(productsData) {
  const categories = Array.isArray(productsData?.categories)
    ? productsData.categories
    : [];

  const flat = [];

  for (const category of categories) {
    const parts = Array.isArray(category?.part) ? category.part : [];

    for (const part of parts) {
      const rawProducts = Array.isArray(part?.products) ? part.products : [];

      for (const raw of rawProducts) {
        const specs = buildSpecificationsMap(raw?.specifications);
        const price = computeCatalogProductPrice({ product: raw, part });
        const media = getCatalogProductMedia(raw, { part, category });

        const pricePerUnit =
          raw?.price?.static === "yes" ? null : parseFloat(raw?.price?.value ?? 0);

        const mutableProperties = Array.isArray(part?.mutable_properties)
          ? part.mutable_properties
          : [];

        flat.push({
          id: raw?.partCode,
          name:
            part?.partName && raw?.partCode
              ? `${part.partName} (${raw.partCode})`
              : raw?.partCode,
          price: Number.isFinite(price) ? Number(price.toFixed(2)) : 0,
          originalPrice: Number.isFinite(price) ? Number(price.toFixed(2)) : 0,
          sku: raw?.partCode,
          brand: part?.partName,
          description: Object.entries(specs)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", "),
          image: media.image,
          images: media.images,
          inStock: true,
          category: category?.categoryName,
          specifications: specs,
          discount: 0,
          rating: 4.5,
          reviewCount: 0,
          featured: false,
          // Extra fields for ProductDetail / pricing
          mutableProperties,
          pricePerUnit: Number.isFinite(pricePerUnit) ? pricePerUnit : null,
          minimumPayableUnit:
            mutableProperties?.find((p) => p.propertyName === "length")
              ?.minimumPayableUnit ?? null,
          // Keep originals for deep-links/debug
          originalProduct: raw,
          originalPart: part,
          originalCategory: category,
        });
      }
    }
  }

  // Remove any empties / bad IDs
  return flat.filter((p) => typeof p.id === "string" && p.id.length > 0);
}
