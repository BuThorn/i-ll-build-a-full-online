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
  created_at: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
};

export type DashboardDailyStat = {
  date: string;
  orders: number;
  revenue: string;
};

export type DashboardMonthlyStat = {
  month: string;
  orders: number;
  revenue: string;
};

export type DashboardStats = {
  users: number;
  products: number;
  orders: number;
  total_sales: string;
  daily: DashboardDailyStat[];
  monthly: DashboardMonthlyStat[];
};

export type AuthResponse = {
  access: string;
  refresh: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

