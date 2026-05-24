import type { Category, Product } from "../types";

export const demoCategories: Category[] = [
  { id: 1, name: "Home", slug: "home", description: "Home essentials for daily routines." },
  { id: 2, name: "Travel", slug: "travel", description: "Travel tools built for quick, tidy movement." },
  { id: 3, name: "Desk", slug: "desk", description: "Desk pieces for focused, comfortable work." },
];

export const demoProducts: Product[] = [
  {
    id: 1,
    category: demoCategories[0],
    name: "Linen Storage Basket",
    slug: "linen-storage-basket",
    description: "A structured basket for throws, towels, and everyday clutter.",
    price: "42.00",
    compare_at_price: null,
    image_url: "",
    stock: 18,
    in_stock: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    category: demoCategories[1],
    name: "Canvas Weekender",
    slug: "canvas-weekender",
    description: "A durable carryall with a padded laptop sleeve and shoe pocket.",
    price: "128.00",
    compare_at_price: null,
    image_url: "",
    stock: 9,
    in_stock: true,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: 3,
    category: demoCategories[2],
    name: "Walnut Monitor Stand",
    slug: "walnut-monitor-stand",
    description: "Raises your display and keeps notebooks tucked neatly underneath.",
    price: "76.00",
    compare_at_price: null,
    image_url: "",
    stock: 14,
    in_stock: true,
    created_at: "2026-01-03T00:00:00Z",
  },
  {
    id: 4,
    category: demoCategories[0],
    name: "Ceramic Pour-Over Set",
    slug: "ceramic-pour-over-set",
    description: "A clean ceramic brewer with matching server for slow mornings.",
    price: "58.00",
    compare_at_price: null,
    image_url: "",
    stock: 12,
    in_stock: true,
    created_at: "2026-01-04T00:00:00Z",
  },
];

