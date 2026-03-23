import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function PromoBand() {
  return (
    <section
      className="relative overflow-hidden py-24"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.09 0.005 265) 0%, oklch(0.14 0.02 60) 50%, oklch(0.09 0.005 265) 100%)",
      }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.17 80 / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-gold">
              Custom Cards Available
            </span>
            <Sparkles className="h-5 w-5 text-gold" />
          </div>

          <h2 className="font-display mx-auto max-w-3xl text-5xl font-black uppercase leading-none tracking-tight text-foreground md:text-7xl">
            DESIGN YOUR OWN <span className="text-gold">LEGEND</span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
            Submit your player, choose your rarity, and we'll hand-craft a
            one-of-a-kind basketball card that belongs in every serious
            collector's binder.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-gold font-display text-base font-black uppercase tracking-widest text-primary-foreground shadow-gold hover:bg-gold-dim"
              data-ocid="promo.primary_button"
              asChild
            >
              <a href="mailto:info@baskethoopers.com?subject=Custom Card Order">
                GET STARTED
              </a>
            </Button>
            <p className="font-body text-sm text-muted-foreground">
              Starting at $29.99 · 2-week turnaround
            </p>
          </div>

          {/* Features */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: "🎨",
                title: "Custom Artwork",
                desc: "Unique design for every card",
              },
              {
                icon: "✨",
                title: "Foil Finishes",
                desc: "Gold, silver & holographic",
              },
              {
                icon: "📦",
                title: "Premium Pack",
                desc: "Shipped in collector sleeve",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card/50 p-6 text-left"
              >
                <div className="mb-2 text-2xl">{f.icon}</div>
                <div className="font-display text-sm font-black uppercase tracking-wide text-foreground">
                  {f.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
