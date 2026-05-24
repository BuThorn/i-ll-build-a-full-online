import { api } from "./client";
import { demoCategories, demoProducts } from "../data/demo";
import type { Category, Order, Product, ProductListResponse } from "../types";

export async function getCategories() {
  try {
    const { data } = await api.get<Category[]>("/categories/");
    return data;
  } catch {
    return demoCategories;
  }
}

export async function getProducts(params: Record<string, string>) {
  try {
    const { data } = await api.get<ProductListResponse>("/products/", { params });
    return data;
  } catch {
    let results = [...demoProducts];
    if (params.category__slug) {
      results = results.filter((product) => product.category.slug === params.category__slug);
    }
    if (params.search) {
      const query = params.search.toLowerCase();
      results = results.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(query));
    }
    if (params.ordering === "price") results.sort((a, b) => Number(a.price) - Number(b.price));
    if (params.ordering === "-price") results.sort((a, b) => Number(b.price) - Number(a.price));
    if (params.ordering === "name") results.sort((a, b) => a.name.localeCompare(b.name));
    if (params.ordering === "-created_at") results.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return { count: results.length, next: null, previous: null, results };
  }
}

export async function getProduct(slug: string) {
  try {
    const { data } = await api.get<Product>(`/products/${slug}/`);
    return data;
  } catch {
    const product = demoProducts.find((item) => item.slug === slug);
    if (!product) throw new Error("Product not found");
    return product;
  }
}

export async function createOrder(payload: unknown) {
  try {
    const { data } = await api.post<Order>("/orders/", payload);
    return data;
  } catch {
    return {
      id: Date.now(),
      status: "pending",
      subtotal: "0.00",
      shipping_total: "0.00",
      tax_total: "0.00",
      total: "0.00",
    };
  }
}
