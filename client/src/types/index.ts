export type ShopifyVariant = {
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

export type ShopifyImage = {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  descriptionHtml?: string;
  price: number;
  priceFormatted: string;
  currencyCode: string;
  imageUrl: string;
  images: string[];
  stock: number;
  availableForSale: boolean;
  variants: ShopifyVariant[];
  defaultVariantId: string;
  priceKobo?: number;
};

export type CartLine = {
  productId: string;
  variantId: string;
  name: string;
  variantTitle?: string;
  price: number;
  priceFormatted: string;
  currencyCode: string;
  quantity: number;
  imageUrl: string;
  stock: number;
  priceKobo?: number;
};

export function formatPrice(amount: number | string, currencyCode: string = "NGN"): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return `${currencyCode} 0.00`;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(numericAmount);
  } catch {
    return `${currencyCode} ${numericAmount.toFixed(2)}`;
  }
}

export function nairaFromKobo(kobo: number): string {
  return formatPrice(kobo / 100, "NGN");
}
