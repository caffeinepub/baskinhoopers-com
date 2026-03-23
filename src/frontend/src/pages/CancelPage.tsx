import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function CancelPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground">
          ORDER <span className="text-muted-foreground">CANCELLED</span>
        </h1>
        <p className="max-w-md text-muted-foreground">
          Your order was cancelled. Your cart is still saved — continue shopping
          whenever you're ready.
        </p>
        <Button
          size="lg"
          className="bg-gold font-display font-black uppercase tracking-widest text-primary-foreground hover:bg-gold-dim"
          asChild
          data-ocid="cancel.primary_button"
        >
          <Link to="/">BACK TO SHOP</Link>
        </Button>
      </motion.div>
    </div>
  );
}
