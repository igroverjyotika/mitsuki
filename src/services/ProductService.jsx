import productsData from "../data/Products.json";
import { flattenCatalogToProducts } from "../utils/productCatalog";

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// In future: const API_URL = 'https://api.mitsuki.in';

class ProductService {
  // Get all products with optional filters
  async getProducts(filters = {}) {
    await delay(300); // Simulate network delay

    let products = flattenCatalogToProducts(productsData);

    // Apply filters
    if (filters.category) {
      products = products.filter((p) => p.category === filters.category);
    }

    if (filters.brand) {
      products = products.filter((p) => p.brand === filters.brand);
    }

    if (filters.inStock) {
      products = products.filter((p) => p.inStock === true);
    }

    if (filters.minPrice) {
      products = products.filter((p) => p.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      products = products.filter((p) => p.price <= filters.maxPrice);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "rating":
          products.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }

    return {
      products,
      total: products.length,
      categories: productsData.categories,
      brands: productsData.brands,
    };
  }

  // Get single product by ID
  async getProduct(id) {
    await delay(200);

    // Search in the complex nested structure
    let foundProduct = null;
    let foundPart = null;
    let foundCategory = null;

    for (const category of productsData.categories) {
      for (const part of category.part) {
        const product = part.products.find((p) => p.partCode === id);
        if (product) {
          foundProduct = product;
          foundPart = part;
          foundCategory = category;
          break;
        }
      }
      if (foundProduct) break;
    }

    if (foundProduct) {
      // Transform the product to match the expected format
      const specs = foundProduct.specifications.reduce((acc, spec) => {
        acc[spec.propertyName] = spec.value;
        return acc;
      }, {});

      // Calculate price (respect minimumPayableUnit when present)
      let price = 0;
      if (foundProduct.price && foundProduct.price.static === "yes") {
        price = parseFloat(foundProduct.price.value);
      } else if (foundProduct.price) {
        const lengthProp = (foundPart.mutable_properties || []).find(
          (p) => p?.propertyName === "length",
        );
        const pricePerUnit = parseFloat(foundProduct.price.value);
        const minPayable = lengthProp?.minimumPayableUnit
          ? parseFloat(lengthProp.minimumPayableUnit)
          : NaN;
        if (!Number.isNaN(minPayable)) {
          price = pricePerUnit * minPayable;
        } else if (lengthProp?.default != null) {
          const length = parseFloat(lengthProp.default);
          price = pricePerUnit * (Number.isNaN(length) ? 0 : length);
        } else {
          price = pricePerUnit;
        }
      }

      return {
        id: foundProduct.partCode,
        name:
          foundPart?.partName && foundProduct?.partCode
            ? `${foundPart.partName} (${foundProduct.partCode})`
            : foundProduct.partCode,
        price: price,
        originalPrice: price,
        sku: foundProduct.partCode,
        brand: foundPart.partName,
        description: Object.entries(specs)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
        image: "/src/assets/products/1.png",
        images: ["/src/assets/products/1.png"], // Array of images
        inStock: true,
        category: foundCategory.categoryName,
        specifications: specs,
        discount: 0, // No discount by default
        rating: 4.5, // Default rating
        reviewCount: 0, // Default review count
        featured: false, // Default featured status
        // Pricing helpers for ProductDetail
        mutableProperties: foundPart.mutable_properties || [],
        pricePerUnit:
          foundProduct.price?.static === "yes"
            ? null
            : parseFloat(foundProduct.price?.value ?? 0),
        minimumPayableUnit: (foundPart.mutable_properties || []).find(
          (p) => p?.propertyName === "length",
        )?.minimumPayableUnit ?? null,
        // Add the original nested data for reference
        originalProduct: foundProduct,
        originalPart: foundPart,
        originalCategory: foundCategory,
      };
    }

    return null;
  }

  // Get featured products
  async getFeaturedProducts(limit = 4) {
    await delay(200);
    const all = flattenCatalogToProducts(productsData);
    const featured = all.filter((p) => p.featured);
    return (featured.length ? featured : all).slice(0, limit);
  }

  // Get categories
  async getCategories() {
    await delay(100);
    return productsData.categories;
  }

  // Get brands
  async getBrands() {
    await delay(100);
    // Brands are not explicitly provided in Products.json; derive from partName.
    const brandSet = new Set();
    for (const category of productsData.categories || []) {
      for (const part of category.part || []) {
        if (part?.partName) brandSet.add(part.partName);
      }
    }
    return Array.from(brandSet);
  }
}

export default new ProductService();
