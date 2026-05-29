import { api } from "./client";
import type { DashboardStats, OrderListResponse } from "../types";

export async function getDashboardStats() {
  const { data } = await api.get<DashboardStats>("/dashboard/stats/");
  return data;
}

export async function getRecentOrders(limit = 5) {
  const { data } = await api.get<OrderListResponse>("/orders/", {
    params: {
      page_size: limit,
      ordering: "-created_at",
    },
  });
  return data.results;
}
