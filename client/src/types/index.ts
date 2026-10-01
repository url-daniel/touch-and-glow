export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceKobo: number;
  imageUrl: string;
  stock: number;
};

export type CartLine = {
  productId: string;
  name: string;
  priceKobo: number;
  quantity: number;
  imageUrl: string;
  stock: number; // live stock ceiling, used to cap quantity in the UI
};

export function nairaFromKobo(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}
