import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, MapPin, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ShippingAddress } from "../backend";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCards,
  useCart as useCartQuery,
  useRemoveFromCart,
} from "../hooks/useQueries";

const EMPTY_ADDRESS: ShippingAddress = {
  name: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

export default function CartDrawer() {
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const { isCartOpen, setIsCartOpen, setCartCount } = useCart();
  const principal = identity?.getPrincipal();
  const { data: cart, isLoading: cartLoading } = useCartQuery(principal);
  const { data: allCards } = useCards();
  const removeFromCart = useRemoveFromCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);

  const cartItems = cart?.items ?? [];
  const cartCards = cartItems
    .map((id) => allCards?.find((c) => c.id === id))
    .filter(Boolean);
  const total = cartCards.reduce(
    (sum, card) => sum + Number(card!.priceInCents),
    0,
  );

  async function handleRemove(cardId: string) {
    await removeFromCart.mutateAsync(cardId);
    setCartCount(Math.max(0, cartItems.length - 1));
  }

  function handleCheckoutClick() {
    if (!identity) {
      login();
      return;
    }
    if (!actor || cartCards.length === 0) return;
    setShowAddressDialog(true);
  }

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !address.name ||
      !address.email ||
      !address.street ||
      !address.city ||
      !address.zip
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!actor) return;
    setShowAddressDialog(false);
    setCheckingOut(true);
    try {
      // Save shipping address to localStorage keyed by a temp key;
      // SuccessPage will read it after Stripe redirects back.
      localStorage.setItem("pendingShippingAddress", JSON.stringify(address));
      const origin = window.location.origin;
      const items = cartCards.map((card) => ({
        productName: card!.name,
        currency: "usd",
        quantity: BigInt(1),
        priceInCents: card!.priceInCents,
        productDescription: card!.description || card!.name,
      }));
      const sessionUrl = await actor.createCheckoutSession(
        items,
        `${origin}/success`,
        `${origin}/cancel`,
      );
      window.location.href = sessionUrl;
    } catch {
      toast.error("Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  }

  function updateAddress(field: keyof ShippingAddress, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col border-border bg-card p-0 sm:max-w-md"
          data-ocid="cart.sheet"
        >
          <SheetHeader className="border-b border-border p-6">
            <SheetTitle className="font-display text-xl font-black uppercase tracking-tight text-foreground">
              <ShoppingBag className="mr-2 inline h-5 w-5 text-gold" />
              YOUR CART
              {cartItems.length > 0 && (
                <span className="ml-2 text-sm font-bold text-muted-foreground">
                  ({cartItems.length} items)
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          {!identity ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
              <ShoppingBag className="h-16 w-16 text-foreground/20" />
              <p className="font-display text-lg font-black uppercase tracking-wide text-foreground/60">
                Log in to view your cart
              </p>
              <Button
                onClick={login}
                className="bg-gold font-display font-black uppercase tracking-wider text-primary-foreground hover:bg-gold-dim"
                data-ocid="cart.primary_button"
              >
                LOGIN TO CONTINUE
              </Button>
            </div>
          ) : cartLoading ? (
            <div className="flex-1 space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-16 w-12 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-3 w-1/2 bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : cartCards.length === 0 ? (
            <div
              className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center"
              data-ocid="cart.empty_state"
            >
              <ShoppingBag className="h-16 w-16 text-foreground/20" />
              <p className="font-display text-lg font-black uppercase tracking-wide text-foreground/40">
                Your cart is empty
              </p>
              <Button
                variant="outline"
                onClick={() => setIsCartOpen(false)}
                className="border-border font-display font-bold uppercase tracking-wider hover:border-gold hover:text-gold"
                data-ocid="cart.secondary_button"
              >
                KEEP SHOPPING
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-6">
                  {cartCards.map((card, i) => (
                    <div
                      key={card!.id}
                      className="flex gap-4"
                      data-ocid={`cart.item.${i + 1}`}
                    >
                      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                        {card!.imageId?.getDirectURL() ? (
                          <img
                            src={card!.imageId.getDirectURL()}
                            alt={card!.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <span className="font-display text-sm font-black text-foreground/30">
                              {card!.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 items-start justify-between">
                        <div>
                          <p className="font-display text-sm font-black uppercase tracking-tight text-foreground">
                            {card!.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {card!.rarity}
                          </p>
                          <p className="mt-1 font-display text-base font-black text-gold">
                            ${(Number(card!.priceInCents) / 100).toFixed(2)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(card!.id)}
                          className="ml-2 p-1 text-muted-foreground transition-colors hover:text-destructive"
                          data-ocid={`cart.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t border-border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-xl font-black text-foreground">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
                <Separator className="mb-4 bg-border" />
                <Button
                  className="w-full bg-gold font-display text-base font-black uppercase tracking-widest text-primary-foreground shadow-gold hover:bg-gold-dim"
                  onClick={handleCheckoutClick}
                  disabled={checkingOut}
                  data-ocid="cart.submit_button"
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "CHECKOUT"
                  )}
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Secure checkout via Stripe
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Shipping Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent
          className="border-border bg-card text-foreground sm:max-w-lg"
          data-ocid="cart.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-black uppercase tracking-tight">
              <MapPin className="mr-2 inline h-5 w-5 text-gold" />
              Shipping Address
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70">
                  Full Name *
                </Label>
                <Input
                  value={address.name}
                  onChange={(e) => updateAddress("name", e.target.value)}
                  placeholder="Jane Doe"
                  className="mt-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
                  data-ocid="cart.input"
                />
              </div>
              <div className="col-span-2">
                <Label className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70">
                  Email *
                </Label>
                <Input
                  type="email"
                  value={address.email}
                  onChange={(e) => updateAddress("email", e.target.value)}
                  placeholder="jane@example.com"
                  className="mt-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
                  data-ocid="cart.input"
                />
              </div>
              <div className="col-span-2">
                <Label className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70">
                  Street Address *
                </Label>
                <Input
                  value={address.street}
                  onChange={(e) => updateAddress("street", e.target.value)}
                  placeholder="123 Main St"
                  className="mt-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
                  data-ocid="cart.input"
                />
              </div>
              <div>
                <Label className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70">
                  City *
                </Label>
                <Input
                  value={address.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  placeholder="Los Angeles"
                  className="mt-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
                  data-ocid="cart.input"
                />
              </div>
              <div>
                <Label className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70">
                  State
                </Label>
                <Input
                  value={address.state}
                  onChange={(e) => updateAddress("state", e.target.value)}
                  placeholder="CA"
                  className="mt-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
                  data-ocid="cart.input"
                />
              </div>
              <div>
                <Label className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70">
                  ZIP / Postal Code *
                </Label>
                <Input
                  value={address.zip}
                  onChange={(e) => updateAddress("zip", e.target.value)}
                  placeholder="90001"
                  className="mt-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
                  data-ocid="cart.input"
                />
              </div>
              <div>
                <Label className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70">
                  Country
                </Label>
                <Input
                  value={address.country}
                  onChange={(e) => updateAddress("country", e.target.value)}
                  placeholder="US"
                  className="mt-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
                  data-ocid="cart.input"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border font-display font-bold uppercase tracking-wider hover:border-gold hover:text-gold"
                onClick={() => setShowAddressDialog(false)}
                data-ocid="cart.cancel_button"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gold font-display font-black uppercase tracking-widest text-primary-foreground hover:bg-gold-dim"
                data-ocid="cart.confirm_button"
              >
                PROCEED TO PAYMENT
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
