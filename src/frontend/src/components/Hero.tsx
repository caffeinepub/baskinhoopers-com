import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.09 0.005 265) 0%, oklch(0.12 0.04 45) 50%, oklch(0.09 0.005 265) 100%)",
        minHeight: "92vh",
      }}
    >
      {/* Orange glow accent */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.70 0.20 50) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.17 80) 0%, transparent 70%)",
          transform: "translate(-40%, 40%)",
        }}
      />

      <div className="container relative mx-auto flex min-h-[92vh] flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-4 inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5">
            <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              Custom Basketball Cards · Collect Them All
            </span>
          </div>

          <h1 className="font-display mx-auto max-w-4xl text-5xl font-black uppercase leading-none tracking-tight text-foreground md:text-7xl lg:text-8xl">
            COLLECT THE GREATEST{" "}
            <span className="text-orange-400">BASKETBALL CARDS</span>
            <br />
            <span className="text-gold">BASKIN</span>{" "}
            <span className="text-foreground/60">HOOPERS</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Custom-made basketball cards featuring the greatest players,
            moments, and styles. Collect your favorites and build the ultimate
            deck.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-orange-500 font-display text-base font-black uppercase tracking-widest text-white shadow-lg hover:bg-orange-400"
              onClick={() =>
                document
                  .getElementById("trending")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="hero.primary_button"
            >
              SHOP NOW
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-foreground/30 font-display text-base font-bold uppercase tracking-wider text-foreground/80 hover:border-orange-500 hover:text-orange-400"
              data-ocid="hero.secondary_button"
            >
              VIEW ALL CARDS
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8">
            {[
              { label: "Basketball Cards", value: "500+" },
              { label: "Collectors", value: "10,000+" },
              { label: "Rarity Tiers", value: "4" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-black text-orange-400 md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 font-display text-xs font-bold uppercase tracking-widest text-foreground/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-6 w-6 text-foreground/30" />
        </motion.div>
      </div>
    </section>
  );
}
