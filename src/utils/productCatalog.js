// Utilities for working with the nested product catalog in src/data/Products.json

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
          image: "/src/assets/products/1.png",
          images: ["/src/assets/products/1.png"],
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
