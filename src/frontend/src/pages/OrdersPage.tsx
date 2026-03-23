import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Package, ShoppingBag, Truck } from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCards, useMyOrders } from "../hooks/useQueries";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    [OrderStatus.pending]: {
      label: "Pending",
      className: "bg-muted text-muted-foreground border-border",
    },
    [OrderStatus.printing]: {
      label: "Printing",
      className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    [OrderStatus.shipped]: {
      label: "Shipped",
      className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    [OrderStatus.delivered]: {
      label: "Delivered",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  };

export default function OrdersPage() {
  const { identity, login } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: orders, isLoading } = useMyOrders(principal);
  const { data: allCards } = useCards();

  if (!identity) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center">
        <ShoppingBag className="h-16 w-16 text-foreground/20" />
        <h2 className="font-display text-3xl font-black uppercase tracking-tight text-foreground">
          Login to View Orders
        </h2>
        <p className="text-muted-foreground">
          Sign in to see your order history.
        </p>
        <Button
          onClick={login}
          className="bg-gold font-display font-black uppercase tracking-wider text-primary-foreground hover:bg-gold-dim"
          data-ocid="orders.primary_button"
        >
          LOGIN
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground">
          My <span className="text-gold">Orders</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track your Snakeymon card orders
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4" data-ocid="orders.loading_state">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48 bg-muted" />
                  <Skeleton className="h-3 w-32 bg-muted" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card py-20 text-center"
          data-ocid="orders.empty_state"
        >
          <Package className="h-16 w-16 text-foreground/20" />
          <p className="font-display text-xl font-black uppercase tracking-wide text-foreground/40">
            No orders yet
          </p>
          <Button
            variant="outline"
            asChild
            className="border-border font-display font-bold uppercase tracking-wider hover:border-gold hover:text-gold"
            data-ocid="orders.secondary_button"
          >
            <Link to="/">SHOP NOW</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const statusCfg =
              STATUS_CONFIG[order.status] ?? STATUS_CONFIG[OrderStatus.pending];
            const orderCards = order.cardIds
              .map((id) => allCards?.find((c) => c.id === id))
              .filter(Boolean);
            const date = new Date(Number(order.createdAt) / 1_000_000);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-gold/30"
                data-ocid={`orders.item.${i + 1}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Order
                      </p>
                      <span className="font-mono text-sm text-foreground/80">
                        #{order.id.slice(0, 12)}...
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    className={`font-display text-xs font-bold uppercase tracking-wider border ${statusCfg.className}`}
                    data-ocid="orders.row"
                  >
                    {statusCfg.label}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {orderCards.length > 0 ? (
                    orderCards.map((card) => (
                      <span
                        key={card!.id}
                        className="rounded-full border border-border bg-secondary px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-foreground/80"
                      >
                        {card!.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {order.cardIds.length} card
                      {order.cardIds.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                  <span className="font-display text-lg font-black text-gold">
                    ${(Number(order.totalPrice) / 100).toFixed(2)}
                  </span>
                  {order.trackingNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4 text-blue-400" />
                      <span className="font-mono text-blue-400">
                        {order.trackingNumber}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Ships to: {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state ||
                      order.shippingAddress.country}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
