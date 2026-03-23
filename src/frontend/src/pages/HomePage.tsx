import { useMemo } from "react";
import type { Card } from "../backend";
import { ExternalBlob } from "../backend";
import BoosterShop from "../components/BoosterShop";
import CardGrid from "../components/CardGrid";
import Hero from "../components/Hero";
import PromoBand from "../components/PromoBand";
import { useCards } from "../hooks/useQueries";

const TYPE_IMAGES: Record<string, string> = {
  Normal: "/assets/generated/snakecard-food-snakeyn.dim_400x560.jpg",
  Psychic: "/assets/generated/snakecard-mewsnark.dim_400x560.jpg",
  Fire: "/assets/generated/snakecard-blazerpent.dim_400x560.jpg",
  Ice: "/assets/generated/snakecard-glacicoil.dim_400x560.jpg",
  Grass: "/assets/generated/snakecard-viperleaf.dim_400x560.jpg",
  Electric: "/assets/generated/snakecard-thundersss.dim_400x560.jpg",
  Water: "/assets/generated/snakecard-aquanoodle.dim_400x560.jpg",
  Dark: "/assets/generated/snakecard-shadowslith.dim_400x560.jpg",
  Rock: "/assets/generated/snakecard-boulderboa.dim_400x560.jpg",
  Poison: "/assets/generated/snakecard-toxicurl.dim_400x560.jpg",
  Steel: "/assets/generated/snakecard-ironscale.dim_400x560.jpg",
  Dragon: "/assets/generated/snakecard-dracoserp.dim_400x560.jpg",
};

const PREFIXES = [
  "Coil",
  "Scale",
  "Venom",
  "Fang",
  "Hiss",
  "Slither",
  "Serpent",
  "Python",
  "Cobra",
  "Viper",
  "Mamba",
  "Adder",
  "Boa",
  "Anaconda",
  "Asp",
  "Naga",
  "Hydra",
  "Basilisk",
  "Krait",
  "Taipan",
];

const SUFFIXES = [
  "mon",
  "ite",
  "eon",
  "zard",
  "ent",
  "oid",
  "ix",
  "on",
  "us",
  "yx",
  "era",
  "ula",
  "ling",
  "pent",
  "serp",
  "snek",
  "wyrm",
  "noodle",
  "coil",
  "strike",
];

const TYPES = [
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Rock",
  "Poison",
  "Dark",
  "Steel",
  "Dragon",
  "Psychic",
  "Normal",
];

const FLAVOR_TEMPLATES: Record<string, string[]> = {
  Fire: [
    "Its scales reach temperatures of {n}°F.",
    "Breathes fire hot enough to melt {n} tons of steel.",
    "Lives in volcanic craters above {n}°F.",
  ],
  Water: [
    "Swims through ocean depths at {n} mph.",
    "Controls currents spanning {n} miles.",
    "Can hold its breath for {n} minutes.",
  ],
  Grass: [
    "Camouflages among jungle ferns in the wild.",
    "Its venom causes {n} flowers to bloom on contact.",
    "Photosynthesizes {n} calories per sunbeam.",
  ],
  Electric: [
    "Generates {n} volts in a single strike.",
    "Charges the air with {n} static bursts.",
    "Short-circuits {n} devices within range.",
  ],
  Ice: [
    "Its coils freeze rivers at {n}°F below zero.",
    "Exhales blizzards reaching {n} mph winds.",
    "Hibernates under {n} feet of arctic ice.",
  ],
  Rock: [
    "Its hide is harder than {n}-carat diamonds.",
    "Crushes boulders weighing {n} tons.",
    "Burrows through {n} feet of solid granite.",
  ],
  Poison: [
    "Its venom dissolves {n} grams of iron overnight.",
    "Secretes {n} toxic compounds from its fangs.",
    "Leaves a trail of {n} wilted plants.",
  ],
  Dark: [
    "Vanishes into shadows, unseen for {n} days.",
    "Drains {n} lumens of light from the area.",
    "Haunts the dreams of {n} sleeping trainers.",
  ],
  Steel: [
    "Its scales deflect {n} bullets simultaneously.",
    "Weighs {n} kilograms of pure metallic muscle.",
    "Conducts electricity at {n} million ohms.",
  ],
  Dragon: [
    "Ancient legends describe {n} kingdoms it destroyed.",
    "Its roar echoes across {n} mountain ranges.",
    "Soars at {n},000 feet above the clouds.",
  ],
  Psychic: [
    "Reads {n} minds simultaneously without effort.",
    "Predicts events {n} seconds into the future.",
    "Bends {n} spoons with a single glance.",
  ],
  Normal: [
    "Consumes {n} meals a day and still wants more.",
    "Traveled {n} miles in search of the perfect meal.",
    "Befriended {n} trainers with its cheerful hiss.",
  ],
};

function getFlavor(type: string, index: number): string {
  const templates = FLAVOR_TEMPLATES[type] || FLAVOR_TEMPLATES.Normal;
  const template = templates[index % templates.length];
  const n = 10 + ((index * 37 + 13) % 990);
  return template.replace("{n}", String(n));
}

function generateSnakeymonCards(): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < 500; i++) {
    const prefix = PREFIXES[i % PREFIXES.length];
    const suffix = SUFFIXES[Math.floor(i / PREFIXES.length) % SUFFIXES.length];
    const extraVariant =
      i >= PREFIXES.length * SUFFIXES.length
        ? ` ${Math.floor(i / (PREFIXES.length * SUFFIXES.length)) + 2}`
        : "";
    const name = `${prefix}${suffix}${extraVariant}`;

    const type = TYPES[i % TYPES.length];

    // Rarity distribution: 50% Common, 30% Uncommon, 15% Rare, 4% Epic, 1% Legendary
    const roll = (i * 73 + 17) % 100;
    let rarity: string;
    let hp: number;
    let priceInCents: number;

    if (roll < 50) {
      rarity = "Common";
      hp = 50 + (i % 31); // 50–80
      priceInCents = 199 + (i % 401); // $1.99–$5.99
    } else if (roll < 80) {
      rarity = "Uncommon";
      hp = 70 + (i % 31); // 70–100
      priceInCents = 499 + (i % 801); // $4.99–$12.99
    } else if (roll < 95) {
      rarity = "Rare";
      hp = 90 + (i % 31); // 90–120
      priceInCents = 999 + (i % 1501); // $9.99–$24.99
    } else if (roll < 99) {
      rarity = "Epic";
      hp = 110 + (i % 31); // 110–140
      priceInCents = 1999 + (i % 3001); // $19.99–$49.99
    } else {
      rarity = "Legendary";
      hp = 130 + (i % 71); // 130–200
      priceInCents = 4999 + (i % 15001); // $49.99–$199.99
    }

    const stock = BigInt(Math.floor((500 - i) / 10) + 1);
    const imageUrl = TYPE_IMAGES[type] || TYPE_IMAGES.Normal;
    const description = getFlavor(type, i);

    cards.push({
      id: `gen-${String(i + 1).padStart(3, "0")}`,
      name,
      description: `[${type} • ${rarity} • HP ${hp}] ${description}`,
      priceInCents: BigInt(priceInCents),
      rarity,
      stock,
      createdAt: BigInt(Date.now() - i * 86400000),
      imageId: ExternalBlob.fromURL(imageUrl),
    });
  }
  return cards;
}

const ALL_CARDS = generateSnakeymonCards();

export default function HomePage() {
  const { data: backendCards, isLoading } = useCards();

  const cards = useMemo(() => {
    if (isLoading) return [];
    if (backendCards && backendCards.length > 0) return backendCards;
    return ALL_CARDS;
  }, [backendCards, isLoading]);

  const trending = cards.slice(0, 12);
  const recent = cards.slice(488, 500);

  return (
    <div>
      <Hero />

      <div id="trending">
        <CardGrid
          cards={trending}
          title="TRENDING NOW"
          columns={4}
          isLoading={isLoading}
        />
      </div>

      <PromoBand />

      <BoosterShop />

      <CardGrid
        cards={recent}
        title="RECENT ARRIVALS"
        columns={4}
        isLoading={isLoading}
      />
    </div>
  );
}
