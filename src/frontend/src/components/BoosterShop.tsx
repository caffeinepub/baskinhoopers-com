import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, PackageOpen } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const BOOSTER_PACKS = [
  {
    id: "standard-pack",
    name: "Standard Pack",
    contents: "5 random cards, at least 1 Rare",
    price: "$4.99",
    tag: "STARTER",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    image: "/assets/generated/snakeymon-booster-pack.dim_300x420.jpg",
  },
  {
    id: "rare-surge-pack",
    name: "Rare Surge Pack",
    contents: "5 cards, 2 guaranteed Rare",
    price: "$9.99",
    tag: "POPULAR",
    tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    image: "/assets/generated/snakeymon-booster-pack.dim_300x420.jpg",
  },
  {
    id: "legendary-haul-pack",
    name: "Legendary Haul Pack",
    contents: "5 cards, 1 guaranteed Legendary",
    price: "$19.99",
    tag: "BEST VALUE",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    image: "/assets/generated/snakeymon-booster-pack.dim_300x420.jpg",
  },
];

const BOOSTER_BOXES = [
  {
    id: "base-set-box",
    name: "Base Set Box",
    contents: "24 packs · 120 cards total",
    price: "$99.99",
    tag: "COLLECTOR",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    image: "/assets/generated/snakeymon-booster-box.dim_400x300.jpg",
  },
  {
    id: "premium-serpent-box",
    name: "Premium Serpent Box",
    contents: "12 packs + 1 guaranteed Legendary card",
    price: "$74.99",
    tag: "PREMIUM",
    tagColor: "bg-gold/20 text-gold border-gold/30",
    image: "/assets/generated/snakeymon-booster-box.dim_400x300.jpg",
  },
];

function handleBoosterClick() {
  toast.info("Booster packs coming soon! 🐍", {
    description: "We're preparing the serpent stash. Stay tuned!",
  });
}

export default function BoosterShop() {
  return (
    <section
      className="relative py-20"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.11 0.02 160) 0%, oklch(0.09 0.005 265) 100%)",
      }}
    >
      {/* Decorative snake-scale pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, oklch(0.9 0.15 150) 0px, transparent 2px, transparent 30px), repeating-linear-gradient(-60deg, oklch(0.9 0.15 150) 0px, transparent 2px, transparent 30px)",
        }}
      />

      <div className="container relative mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
            <Package className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              Limited Edition
            </span>
          </div>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground md:text-5xl">
            BOOSTER <span className="text-emerald-400">PACKS</span> &amp;{" "}
            <span className="text-gold">BOXES</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Tear open a pack and discover your serpent destiny. Every pack
            guaranteed to strike.
          </p>
        </motion.div>

        {/* Booster Packs */}
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <PackageOpen className="h-5 w-5 text-emerald-400" />
            <h3 className="font-display text-xl font-black uppercase tracking-widest text-foreground/80">
              Booster Packs
            </h3>
            <div className="h-px flex-1 bg-emerald-500/20" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BOOSTER_PACKS.map((pack, i) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                data-ocid={`booster.item.${i + 1}`}
              >
                {/* Badge */}
                <div className="absolute right-3 top-3 z-10">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-widest ${pack.tagColor}`}
                  >
                    {pack.tag}
                  </span>
                </div>

                {/* Pack image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={pack.image}
                    alt={pack.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="font-display text-lg font-black uppercase tracking-wide text-foreground">
                    {pack.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {pack.contents}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-2xl font-black text-gold">
                      {pack.price}
                    </span>
                    <Button
                      size="sm"
                      className="bg-emerald-500/20 font-display text-xs font-black uppercase tracking-widest text-emerald-300 hover:bg-emerald-500/40"
                      onClick={handleBoosterClick}
                      data-ocid={`booster.pack.button.${i + 1}`}
                    >
                      ADD TO CART
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Booster Boxes */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <Package className="h-5 w-5 text-gold" />
            <h3 className="font-display text-xl font-black uppercase tracking-widest text-foreground/80">
              Booster Boxes
            </h3>
            <div className="h-px flex-1 bg-gold/20" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {BOOSTER_BOXES.map((box, i) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative flex overflow-hidden rounded-2xl border border-gold/20 bg-gold/5 backdrop-blur-sm"
                data-ocid={`booster.box.item.${i + 1}`}
              >
                {/* Box image */}
                <div className="relative w-48 flex-shrink-0 overflow-hidden">
                  <img
                    src={box.image}
                    alt={box.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-widest ${box.tagColor}`}
                    >
                      {box.tag}
                    </span>
                    <h4 className="mt-2 font-display text-xl font-black uppercase tracking-wide text-foreground">
                      {box.name}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {box.contents}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-3xl font-black text-gold">
                      {box.price}
                    </span>
                    <Button
                      className="bg-gold/20 font-display text-xs font-black uppercase tracking-widest text-gold hover:bg-gold/40"
                      onClick={handleBoosterClick}
                      data-ocid={`booster.box.button.${i + 1}`}
                    >
                      ADD TO CART
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
