import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Card } from "../backend";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddToCart } from "../hooks/useQueries";

interface CardGridProps {
  cards: Card[];
  title: string;
  columns?: 3 | 4;
  isLoading?: boolean;
}

const RARITY_CONFIG: Record<
  string,
  { label: string; color: string; stars: number }
> = {
  Common: {
    label: "COMMON",
    color: "bg-foreground/20 text-foreground/70",
    stars: 1,
  },
  Rare: { label: "RARE", color: "bg-blue-500/20 text-blue-400", stars: 2 },
  Epic: { label: "EPIC", color: "bg-purple-500/20 text-purple-400", stars: 3 },
  Legendary: { label: "LEGENDARY", color: "bg-gold/20 text-gold", stars: 5 },
};

const SKELETONS = ["a", "b", "c", "d"];

function CardSkeleton({ id }: { id: string }) {
  return (
    <div
      key={id}
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <Skeleton className="aspect-[5/7] w-full bg-muted" />
      <div className="p-4">
        <Skeleton className="mb-2 h-4 w-3/4 bg-muted" />
        <Skeleton className="mb-3 h-3 w-1/2 bg-muted" />
        <Skeleton className="h-9 w-full bg-muted" />
      </div>
    </div>
  );
}

export default function CardGrid({
  cards,
  title,
  columns = 4,
  isLoading = false,
}: CardGridProps) {
  const { identity, login } = useInternetIdentity();
  const { setCartCount, cartCount, setIsCartOpen } = useCart();
  const addToCart = useAddToCart();

  const gridClass =
    columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  async function handleAddToCart(card: Card) {
    if (!identity) {
      toast.error("Please log in to add items to your cart", {
        action: { label: "Login", onClick: login },
      });
      return;
    }
    try {
      await addToCart.mutateAsync(card.id);
      setCartCount(cartCount + 1);
      toast.success(`${card.name} added to cart!`, {
        action: { label: "View Cart", onClick: () => setIsCartOpen(true) },
      });
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    }
  }

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground md:text-5xl">
            {title}
          </h2>
          <div className="mx-6 hidden h-px flex-1 bg-border md:block" />
          <span className="font-display text-sm font-bold uppercase tracking-widest text-gold">
            {isLoading ? "..." : `${cards.length} Cards`}
          </span>
        </div>

        <div className={`grid gap-6 ${gridClass}`}>
          {isLoading
            ? SKELETONS.slice(0, columns).map((id) => (
                <CardSkeleton key={id} id={id} />
              ))
            : cards.map((card, i) => {
                const rarity =
                  RARITY_CONFIG[card.rarity] ?? RARITY_CONFIG.Common;
                const imageUrl = card.imageId?.getDirectURL();
                const price = (Number(card.priceInCents) / 100).toFixed(2);

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-gold"
                    data-ocid={`cards.item.${i + 1}`}
                  >
                    <div className="relative aspect-[5/7] overflow-hidden bg-secondary">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={card.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-secondary to-muted">
                          <Package className="mb-3 h-12 w-12 text-foreground/20" />
                          <span className="font-display text-2xl font-black text-foreground/30">
                            {card.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute left-3 top-3">
                        <span
                          className={`rounded-full px-2.5 py-1 font-display text-[10px] font-black uppercase tracking-wider ${rarity.color}`}
                        >
                          {rarity.label}
                        </span>
                      </div>
                      {Number(card.stock) <= 5 && Number(card.stock) > 0 && (
                        <div className="absolute right-3 top-3">
                          <Badge className="bg-destructive/80 font-display text-[10px] font-bold uppercase">
                            Only {card.stock.toString()} left!
                          </Badge>
                        </div>
                      )}
                      {Number(card.stock) === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                          <span className="font-display text-lg font-black uppercase tracking-widest text-foreground/60">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 line-clamp-1 font-display text-sm font-black uppercase tracking-tight text-foreground">
                        {card.name}
                      </h3>
                      <div className="mb-3 flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, j) => (
                          <Star
                            key={`star-${card.id}-${j}`}
                            className={`h-3 w-3 ${j < rarity.stars ? "fill-gold text-gold" : "fill-transparent text-foreground/20"}`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-muted-foreground">
                          {rarity.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xl font-black text-foreground">
                          ${price}
                        </span>
                        <Button
                          size="sm"
                          disabled={
                            Number(card.stock) === 0 || addToCart.isPending
                          }
                          onClick={() => handleAddToCart(card)}
                          className="bg-gold font-display text-xs font-black uppercase tracking-wider text-primary-foreground hover:bg-gold-dim disabled:opacity-50"
                          data-ocid={`cards.primary_button.${i + 1}`}
                        >
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          ADD TO CART
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
        </div>

        {!isLoading && cards.length === 0 && (
          <div className="py-20 text-center" data-ocid="cards.empty_state">
            <Package className="mx-auto mb-4 h-16 w-16 text-foreground/20" />
            <p className="font-display text-xl font-black uppercase tracking-wide text-foreground/40">
              No Cards Available
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for new arrivals.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
