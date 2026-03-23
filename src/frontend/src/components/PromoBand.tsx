import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function PromoBand() {
  return (
    <section
      className="relative overflow-hidden py-24"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.09 0.005 265) 0%, oklch(0.12 0.04 150) 50%, oklch(0.09 0.005 265) 100%)",
      }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.65 0.22 150 / 0.1) 0%, transparent 70%)",
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
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
              Booster Packs Available
            </span>
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>

          <h2 className="font-display mx-auto max-w-3xl text-5xl font-black uppercase leading-none tracking-tight text-foreground md:text-7xl">
            UNLEASH YOUR <span className="text-emerald-400">SERPENT</span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
            Crack open a booster pack and discover rare serpents you never knew
            existed. Every pack holds 5 random cards — anything from Common to
            the legendary Mewsnark.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-emerald-500 font-display text-base font-black uppercase tracking-widest text-white shadow-lg hover:bg-emerald-400"
              data-ocid="promo.primary_button"
              onClick={() =>
                document
                  .getElementById("boosters")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              OPEN PACKS
            </Button>
            <p className="font-body text-sm text-muted-foreground">
              Packs from $4.99 · Boxes from $39.99
            </p>
          </div>

          {/* Features */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: "🐍",
                title: "500 Unique Cards",
                desc: "All snake types and rarities",
              },
              {
                icon: "✨",
                title: "5 Rarity Tiers",
                desc: "Common to Legendary",
              },
              {
                icon: "📦",
                title: "Booster Boxes",
                desc: "36 packs per box",
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
