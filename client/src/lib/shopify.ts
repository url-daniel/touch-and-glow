import type { Product, ShopifyVariant } from "@/types";
import { formatPrice } from "@/types";

const RAW_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "";
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || "2024-07";

function normalizeShopifyDomain(raw: string): string {
  if (!raw) return "";
  let domain = raw.trim();

  // If user pasted full admin URL: https://admin.shopify.com/store/xyz
  const adminMatch = domain.match(/admin\.shopify\.com\/store\/([^/?#]+)/i);
  if (adminMatch && adminMatch[1]) {
    return `${adminMatch[1]}.myshopify.com`;
  }

  // Strip protocol and trailing slashes
  domain = domain.replace(/^https?:\/\//, "").replace(/\/+$/, "").trim();

  // If user entered just the store slug without a dot
  if (domain && !domain.includes(".")) {
    return `${domain}.myshopify.com`;
  }

  return domain;
}

// Clean domain by stripping protocol and normalizing admin URLs
const SHOPIFY_DOMAIN = normalizeShopifyDomain(RAW_DOMAIN);

export function isShopifyConfigured(): boolean {
  return (
    Boolean(SHOPIFY_DOMAIN) &&
    Boolean(STOREFRONT_ACCESS_TOKEN) &&
    !SHOPIFY_DOMAIN.includes("your-store") &&
    !STOREFRONT_ACCESS_TOKEN.includes("your_storefront")
  );
}

export function getShopifyDomain(): string {
  return SHOPIFY_DOMAIN;
}

// Fallback demo products for immediate preview before live credentials are set
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "gid://shopify/Product/tag-demo-1",
    name: "Golden Nectar Glow Oil",
    slug: "golden-nectar-glow-oil",
    description:
      "A featherlight restorative face oil formulated with cold-pressed rosehip seed, botanical squalane, and vitamin C. Delivers an instant luminous sheen while deeply nourishing the lipid barrier.",
    price: 32000,
    priceFormatted: formatPrice(32000, "NGN"),
    currencyCode: "NGN",
    imageUrl:
      "https://images.unsplash.com/photo-1608248597358-1e4e20986161?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608248597358-1e4e20986161?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 25,
    availableForSale: true,
    variants: [
      {
        id: "gid://shopify/ProductVariant/tag-demo-1-30ml",
        title: "30ml Standard",
        availableForSale: true,
        quantityAvailable: 15,
        price: { amount: "32000.00", currencyCode: "NGN" }
      },
      {
        id: "gid://shopify/ProductVariant/tag-demo-1-50ml",
        title: "50ml Luxury",
        availableForSale: true,
        quantityAvailable: 10,
        price: { amount: "48000.00", currencyCode: "NGN" }
      }
    ],
    defaultVariantId: "gid://shopify/ProductVariant/tag-demo-1-30ml",
    priceKobo: 3200000
  },
  {
    id: "gid://shopify/Product/tag-demo-2",
    name: "Velvet Silk Cleansing Balm",
    slug: "velvet-silk-cleansing-balm",
    description:
      "An indulgent oil-to-milk balm cleanser that effortlessly melts away stubborn SPF, makeup, and daily impurities without stripping moisture. Leaves skin remarkably supple and soft.",
    price: 24500,
    priceFormatted: formatPrice(24500, "NGN"),
    currencyCode: "NGN",
    imageUrl:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 18,
    availableForSale: true,
    variants: [
      {
        id: "gid://shopify/ProductVariant/tag-demo-2-100ml",
        title: "100ml Jar",
        availableForSale: true,
        quantityAvailable: 18,
        price: { amount: "24500.00", currencyCode: "NGN" }
      }
    ],
    defaultVariantId: "gid://shopify/ProductVariant/tag-demo-2-100ml",
    priceKobo: 2450000
  },
  {
    id: "gid://shopify/Product/tag-demo-3",
    name: "Ceramide Infusion Recovery Cream",
    slug: "ceramide-infusion-recovery-cream",
    description:
      "A barrier-restoring moisture cream packed with 5 essential ceramides, centella asiatica, and hyaluronic acid. Clinically hydrates for 48 hours for plump, calm skin.",
    price: 28000,
    priceFormatted: formatPrice(28000, "NGN"),
    currencyCode: "NGN",
    imageUrl:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 12,
    availableForSale: true,
    variants: [
      {
        id: "gid://shopify/ProductVariant/tag-demo-3-50ml",
        title: "50ml Airless Pump",
        availableForSale: true,
        quantityAvailable: 12,
        price: { amount: "28000.00", currencyCode: "NGN" }
      }
    ],
    defaultVariantId: "gid://shopify/ProductVariant/tag-demo-3-50ml",
    priceKobo: 2800000
  },
  {
    id: "gid://shopify/Product/tag-demo-4",
    name: "Brightening Niacinamide Essence",
    slug: "brightening-niacinamide-essence",
    description:
      "A concentrated 10% niacinamide and licorice root treatment water designed to refine uneven tone, minimize enlarged pores, and boost translucent radiance.",
    price: 21000,
    priceFormatted: formatPrice(21000, "NGN"),
    currencyCode: "NGN",
    imageUrl:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    stock: 30,
    availableForSale: true,
    variants: [
      {
        id: "gid://shopify/ProductVariant/tag-demo-4-120ml",
        title: "120ml Glass Bottle",
        availableForSale: true,
        quantityAvailable: 30,
        price: { amount: "21000.00", currencyCode: "NGN" }
      }
    ],
    defaultVariantId: "gid://shopify/ProductVariant/tag-demo-4-120ml",
    priceKobo: 2100000
  }
];

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error(
      "Shopify configuration missing. Please set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN."
    );
  }

  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Shopify API error [${response.status}]: ${errorBody}`);
  }

  const json = await response.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join(", "));
  }

  return json.data as T;
}

const PRODUCTS_QUERY = `
  query getProducts($first: Int = 24) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 6) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 30) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

interface RawShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        url: string;
        altText?: string | null;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        quantityAvailable?: number | null;
        price: {
          amount: string;
          currencyCode: string;
        };
        selectedOptions?: {
          name: string;
          value: string;
        }[];
      };
    }[];
  };
}

function transformShopifyProduct(node: RawShopifyProductNode): Product {
  const images = node.images?.edges?.map((e) => e.node.url) ?? [];
  const imageUrl =
    images[0] ||
    "https://images.unsplash.com/photo-1608248597358-1e4e20986161?auto=format&fit=crop&w=800&q=80";

  const variants: ShopifyVariant[] = (node.variants?.edges || []).map((e) => ({
    id: e.node.id,
    title: e.node.title,
    availableForSale: e.node.availableForSale,
    quantityAvailable: e.node.quantityAvailable,
    price: e.node.price,
    selectedOptions: e.node.selectedOptions
  }));

  const defaultVariant = variants[0];
  const priceAmount = defaultVariant
    ? parseFloat(defaultVariant.price.amount)
    : parseFloat(node.priceRange.minVariantPrice.amount);
  const currency = defaultVariant
    ? defaultVariant.price.currencyCode
    : node.priceRange.minVariantPrice.currencyCode;

  // Approximate stock ceiling from Shopify variants
  const totalStock = variants.reduce(
    (sum, v) => sum + (v.quantityAvailable !== null && v.quantityAvailable !== undefined ? Math.max(0, v.quantityAvailable) : (v.availableForSale ? 10 : 0)),
    0
  );

  return {
    id: node.id,
    name: node.title,
    slug: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    price: priceAmount,
    priceFormatted: formatPrice(priceAmount, currency),
    currencyCode: currency,
    imageUrl,
    images: images.length > 0 ? images : [imageUrl],
    stock: totalStock > 0 ? totalStock : (node.availableForSale ? 10 : 0),
    availableForSale: node.availableForSale,
    variants,
    defaultVariantId: defaultVariant ? defaultVariant.id : node.id,
    priceKobo: Math.round(priceAmount * 100)
  };
}

export async function fetchShopifyProducts(): Promise<Product[]> {
  if (!isShopifyConfigured()) {
    // Return realistic fallback demo products when credentials are pending
    return FALLBACK_PRODUCTS;
  }

  try {
    const data = await shopifyFetch<{
      products: {
        edges: { node: RawShopifyProductNode }[];
      };
    }>(PRODUCTS_QUERY);

    if (!data.products || !data.products.edges || data.products.edges.length === 0) {
      return [];
    }

    return data.products.edges.map((e) => transformShopifyProduct(e.node));
  } catch (err) {
    console.error("Failed to fetch products from Shopify:", err);
    // Graceful fallback to demo products if network/store configuration error occurs
    return FALLBACK_PRODUCTS;
  }
}

export async function fetchShopifyProductBySlug(slug: string): Promise<Product | null> {
  if (!isShopifyConfigured()) {
    const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    return fallback || null;
  }

  try {
    const data = await shopifyFetch<{
      product: RawShopifyProductNode | null;
    }>(PRODUCT_BY_HANDLE_QUERY, { handle: slug });

    if (!data.product) {
      // Check fallback if handle matches demo
      return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
    }

    return transformShopifyProduct(data.product);
  } catch (err) {
    console.error(`Failed to fetch product '${slug}' from Shopify:`, err);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

export async function createShopifyCheckout(
  lines: { variantId: string; quantity: number }[]
): Promise<{ checkoutUrl: string; cartId: string }> {
  if (!isShopifyConfigured()) {
    throw new Error(
      "Shopify is not configured yet. Please configure VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in your environment."
    );
  }

  const formattedLines = lines.map((line) => ({
    merchandiseId: line.variantId,
    quantity: line.quantity
  }));

  const data = await shopifyFetch<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        cost: {
          totalAmount: {
            amount: string;
            currencyCode: string;
          };
        };
      };
      userErrors: { code?: string; field?: string[]; message: string }[];
    };
  }>(CART_CREATE_MUTATION, {
    input: {
      lines: formattedLines
    }
  });

  const result = data.cartCreate;
  if (result.userErrors && result.userErrors.length > 0) {
    const msg = result.userErrors.map((e) => e.message).join(", ");
    throw new Error(`Shopify Cart error: ${msg}`);
  }

  if (!result.cart?.checkoutUrl) {
    throw new Error("Failed to generate Shopify checkout URL.");
  }

  return {
    checkoutUrl: result.cart.checkoutUrl,
    cartId: result.cart.id
  };
}
