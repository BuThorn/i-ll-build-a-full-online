export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: number;
  category: Category;
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_at_price: string | null;
  image_url: string;
  stock: number;
  in_stock: boolean;
  created_at: string;
};

export type ProductListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: number;
  status: string;
  subtotal: string;
  shipping_total: string;
  tax_total: string;
  total: string;
};

