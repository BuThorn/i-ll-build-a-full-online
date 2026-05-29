import { useEffect, useState } from "react";
import { Loader2, LayoutDashboard, Users, Box, ShoppingBag, DollarSign } from "lucide-react";

import { getDashboardStats, getRecentOrders } from "../api/dashboard";
import type { DashboardStats, Order } from "../types";

function formatCurrency(value: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [dashboardStats, recentOrders] = await Promise.all([getDashboardStats(), getRecentOrders(6)]);
        setStats(dashboardStats);
        setOrders(recentOrders);
      } catch (err) {
        setError("Unable to load admin dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-ink" />
        <p className="mt-4 text-center text-black/70">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error ?? "Admin dashboard data is unavailable."}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">Store control center</h1>
            <p className="mt-2 max-w-2xl text-sm text-black/70">Monitor revenue, order flow, user growth and product performance from a single control surface.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:w-[320px]">
            <div className="rounded-2xl border border-black/10 bg-mist p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total Sales</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{formatCurrency(stats.total_sales)}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-mist p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Orders</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{stats.orders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="space-y-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Performance summary</p>
              <h2 className="mt-1 text-xl font-semibold text-ink">Key metrics</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
              <DollarSign className="h-4 w-4" /> Revenue growth
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Customers", value: stats.users, icon: Users },
              { label: "Products", value: stats.products, icon: Box },
              { label: "Active orders", value: stats.orders, icon: ShoppingBag },
              { label: "Revenue", value: formatCurrency(stats.total_sales), icon: DollarSign },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-3xl border border-black/10 bg-mist p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-ink shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-2 text-xl font-semibold text-ink">{item.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-black/10 bg-mist p-5">
              <p className="text-sm text-slate-500">Daily revenue</p>
              <div className="mt-4 space-y-3">
                {stats.daily.slice(-8).map((item) => (
                  <div key={item.date} className="flex items-center justify-between rounded-2xl bg-white p-3 text-sm shadow-sm">
                    <span>{item.date}</span>
                    <span className="font-semibold text-ink">{formatCurrency(item.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-black/10 bg-mist p-5">
              <p className="text-sm text-slate-500">Monthly revenue</p>
              <div className="mt-4 space-y-3">
                {stats.monthly.slice(-6).map((item) => (
                  <div key={item.month} className="flex items-center justify-between rounded-2xl bg-white p-3 text-sm shadow-sm">
                    <span>{item.month}</span>
                    <span className="font-semibold text-ink">{formatCurrency(item.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Order activity</p>
              <h2 className="mt-1 text-xl font-semibold text-ink">Recent orders</h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">No recent orders available.</p>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-black/10">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0 even:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-ink">#{order.id}</td>
                      <td className="px-4 py-4 text-slate-700">{order.status}</td>
                      <td className="px-4 py-4 text-slate-900">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-4 text-slate-600">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
