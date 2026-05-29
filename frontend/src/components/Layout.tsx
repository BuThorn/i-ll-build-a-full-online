import { LayoutDashboard, ShoppingBag, UserRound } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function Layout() {
  const { count } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-mist/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Northstar Goods
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white">
              Shop
            </NavLink>
            {user?.is_staff && (
              <NavLink to="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white">
                <LayoutDashboard className="mr-2 inline h-4 w-4" /> Dashboard
              </NavLink>
            )}
            <NavLink to="/cart" className="focus-ring relative rounded-md p-2 hover:bg-white" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </NavLink>
            {isAuthenticated ? (
              <button className="focus-ring rounded-md px-3 py-2 text-sm font-medium hover:bg-white" onClick={logout}>
                Logout
              </button>
            ) : (
              <NavLink to="/login" className="focus-ring rounded-md p-2 hover:bg-white" aria-label="Login">
                <UserRound className="h-5 w-5" />
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

