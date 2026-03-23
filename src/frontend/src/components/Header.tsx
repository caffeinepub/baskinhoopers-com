import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { LogOut, Shield, ShoppingCart, User } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCart as useCartQuery } from "../hooks/useQueries";

export default function Header() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { cartCount, setCartCount, setIsCartOpen } = useCart();
  const principal = identity?.getPrincipal();
  const { data: cart } = useCartQuery(principal);

  useEffect(() => {
    if (cart) {
      setCartCount(cart.items.length);
    } else {
      setCartCount(0);
    }
  }, [cart, setCartCount]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 no-underline"
          data-ocid="nav.link"
        >
          <span className="font-display text-xl font-black tracking-tight text-orange-400">
            🏀 BASKIN HOOPERS
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="font-display text-sm font-bold uppercase tracking-widest text-foreground/80 transition-colors hover:text-orange-400"
            data-ocid="nav.link"
          >
            Shop Cards
          </Link>
          <a
            href="/#trending"
            className="font-display text-sm font-bold uppercase tracking-widest text-foreground/80 transition-colors hover:text-orange-400"
            data-ocid="nav.link"
          >
            Featured
          </a>
          <a
            href="/#boosters"
            className="font-display text-sm font-bold uppercase tracking-widest text-foreground/80 transition-colors hover:text-orange-400"
            data-ocid="nav.link"
          >
            Card Packs
          </a>
          <a
            href="mailto:info@baskinhoopers.com"
            className="font-display text-sm font-bold uppercase tracking-widest text-foreground/80 transition-colors hover:text-orange-400"
            data-ocid="nav.link"
          >
            Contact
          </a>
          {identity && (
            <Link
              to="/admin"
              className="font-display text-sm font-bold uppercase tracking-widest text-foreground/80 transition-colors hover:text-orange-400"
              data-ocid="nav.link"
            >
              <Shield className="mr-1 inline h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-foreground/80 transition-colors hover:text-orange-400"
            data-ocid="cart.open_modal_button"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 p-0 text-[10px] font-black text-white">
                {cartCount}
              </Badge>
            )}
          </button>

          {identity ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="hidden border-border font-display text-xs font-bold uppercase tracking-wider text-foreground/80 hover:border-orange-400 hover:text-orange-400 md:flex"
              data-ocid="auth.button"
            >
              <LogOut className="mr-1 h-3 w-3" />
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="bg-orange-500 font-display text-xs font-black uppercase tracking-wider text-white hover:bg-orange-400"
              data-ocid="auth.button"
            >
              <User className="mr-1 h-3 w-3" />
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
