import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Package } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ShippingAddress } from "../backend";
import { usePlaceOrder } from "../hooks/useQueries";

export default function SuccessPage() {
  const placeOrder = usePlaceOrder();
  const [orderId, setOrderId] = useState<string | null>(null);
  const didPlace = useRef(false);

  useEffect(() => {
    if (didPlace.current) return;
    const raw = localStorage.getItem("pendingShippingAddress");
    if (!raw) return;
    let addr: ShippingAddress;
    try {
      addr = JSON.parse(raw) as ShippingAddress;
    } catch {
      return;
    }
    didPlace.current = true;
    placeOrder.mutate(addr, {
      onSuccess: (id) => {
        setOrderId(id);
        localStorage.removeItem("pendingShippingAddress");
      },
    });
  }, [placeOrder]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gold/10">
          <CheckCircle className="h-12 w-12 text-gold" />
        </div>
        <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground">
          ORDER <span className="text-gold">CONFIRMED!</span>
        </h1>
        <p className="max-w-md text-muted-foreground">
          Your snake cards are being prepared! We'll print and ship them to you
          soon.
        </p>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-gold/30 bg-gold/5 px-6 py-4 text-center"
            data-ocid="success.panel"
          >
            <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Order ID
            </p>
            <p className="mt-1 font-mono text-sm text-gold">{orderId}</p>
          </motion.div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="outline"
            className="border-border font-display font-black uppercase tracking-widest hover:border-gold hover:text-gold"
            asChild
            data-ocid="success.secondary_button"
          >
            <Link to="/orders">
              <Package className="mr-2 h-4 w-4" />
              TRACK ORDER
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-gold font-display font-black uppercase tracking-widest text-primary-foreground hover:bg-gold-dim"
            asChild
            data-ocid="success.primary_button"
          >
            <Link to="/">CONTINUE SHOPPING</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
