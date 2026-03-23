import { useMemo } from "react";
import type { Card } from "../backend";
import { ExternalBlob } from "../backend";
import BoosterShop from "../components/BoosterShop";
import CardGrid from "../components/CardGrid";
import Hero from "../components/Hero";
import PromoBand from "../components/PromoBand";
import { useCards } from "../hooks/useQueries";

const CARD_IMAGE =
  "/assets/generated/basketball-card-placeholder.dim_400x560.jpg";

const FIRST_NAMES = [
  "Slam",
  "Three-Point",
  "Fadeaway",
  "Crossover",
  "Alley-Oop",
  "Fast-Break",
  "Midrange",
  "Post-Up",
  "Drive",
  "Corner",
  "Downtown",
  "Baseline",
  "Pick-and-Roll",
  "Full-Court",
  "Clutch",
  "Buzzer",
  "Glass",
  "Paint",
  "Transition",
  "Isolation",
];

const LAST_NAMES = [
  "Dunkowitz",
  "Torres",
  "Franklin",
  "King",
  "Adams",
  "Johnson",
  "Williams",
  "Davis",
  "Martinez",
  "Thompson",
  "Garcia",
  "Robinson",
  "Walker",
  "Harris",
  "Mitchell",
  "Lewis",
  "Anderson",
  "Taylor",
  "White",
  "Moore",
];

const TYPES = [
  "Point Guard",
  "Shooting Guard",
  "Small Forward",
  "Power Forward",
  "Center",
  "Sixth Man",
  "Playmaker",
  "Defender",
  "Scorer",
  "Dunker",
  "Passer",
  "Rebounder",
];

const FLAVOR_TEMPLATES: Record<string, string[]> = {
  "Point Guard": [
    "Dishes {n} assists per game with pinpoint precision.",
    "Has {n} career triple-doubles and counting.",
    "Controls the tempo, recording {n} steals this season.",
  ],
  "Shooting Guard": [
    "Drains {n}% from beyond the arc.",
    "Scored {n} points in a single playoff game.",
    "Holds the record for {n} consecutive free throws.",
  ],
  "Small Forward": [
    "Averages {n} points per game in clutch moments.",
    "Defends all five positions, tallying {n} blocks.",
    "Has {n} career All-Star appearances.",
  ],
  "Power Forward": [
    "Pulls down {n} rebounds per contest.",
    "Scores {n} points in the paint every night.",
    "Has {n} double-doubles this season.",
  ],
  Center: [
    "Protects the rim with {n} blocks per game.",
    "Dominates with {n} points and {n} rebounds.",
    "Has not missed a free throw in {n} attempts.",
  ],
  "Sixth Man": [
    "Provides instant offense with {n} points off the bench.",
    "Won the Sixth Man award {n} times.",
    "Sparks runs of {n} unanswered points.",
  ],
  Playmaker: [
    "Orchestrates {n}-point comebacks from the bench.",
    "Creates open shots, recording {n} hockey assists.",
    "Vision rated {n} out of 100 by scouts.",
  ],
  Defender: [
    "Holds opponents to {n}% shooting on the wing.",
    "Has {n} career Defensive Player of the Year votes.",
    "Averages {n} deflections per 36 minutes.",
  ],
  Scorer: [
    "Drops {n} points before the fourth quarter.",
    "Hit {n} consecutive shots in a single quarter.",
    "True shooting percentage of {n}% this season.",
  ],
  Dunker: [
    "Threw down {n} dunks in a single playoff run.",
    "Won the Slam Dunk Contest with a {n}-point score.",
    "Vertical leap measured at {n} inches.",
  ],
  Passer: [
    "Dishes {n} assists without a turnover in a stretch.",
    "Career assist-to-turnover ratio of {n}-to-1.",
    "Recorded {n} assists in a single half.",
  ],
  Rebounder: [
    "Grabs {n} offensive boards per game.",
    "Has {n} career rebounding titles.",
    "Once grabbed {n} rebounds in a single game.",
  ],
};

function getFlavor(type: string, index: number): string {
  const templates = FLAVOR_TEMPLATES[type] || FLAVOR_TEMPLATES["Point Guard"];
  const template = templates[index % templates.length];
  const n = 10 + ((index * 37 + 13) % 90);
  return template.replace(/\{n\}/g, String(n));
}

function generateBasketballCards(): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < 500; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName =
      LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const extraVariant =
      i >= FIRST_NAMES.length * LAST_NAMES.length
        ? ` ${Math.floor(i / (FIRST_NAMES.length * LAST_NAMES.length)) + 2}`
        : "";
    const name = `${firstName} ${lastName}${extraVariant}`;

    const type = TYPES[i % TYPES.length];

    // Rarity distribution: 50% Common, 30% Uncommon, 15% Rare, 4% Epic, 1% Legendary
    const roll = (i * 73 + 17) % 100;
    let rarity: string;
    let hp: number;
    let priceInCents: number;

    if (roll < 50) {
      rarity = "Common";
      hp = 50 + (i % 31);
      priceInCents = 199 + (i % 401);
    } else if (roll < 80) {
      rarity = "Uncommon";
      hp = 70 + (i % 31);
      priceInCents = 499 + (i % 801);
    } else if (roll < 95) {
      rarity = "Rare";
      hp = 90 + (i % 31);
      priceInCents = 999 + (i % 1501);
    } else if (roll < 99) {
      rarity = "Epic";
      hp = 110 + (i % 31);
      priceInCents = 1999 + (i % 3001);
    } else {
      rarity = "Legendary";
      hp = 130 + (i % 71);
      priceInCents = 4999 + (i % 15001);
    }

    const stock = BigInt(Math.floor((500 - i) / 10) + 1);
    const description = getFlavor(type, i);

    cards.push({
      id: `gen-${String(i + 1).padStart(3, "0")}`,
      name,
      description: `[${type} • ${rarity} • Rating ${hp}] ${description}`,
      priceInCents: BigInt(priceInCents),
      rarity,
      stock,
      createdAt: BigInt(Date.now() - i * 86400000),
      imageId: ExternalBlob.fromURL(CARD_IMAGE),
    });
  }
  return cards;
}

const ALL_CARDS = generateBasketballCards();

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
