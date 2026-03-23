# Snakeymon-IO

## Current State
- TCG-style storefront with a card grid, hero, cart, Stripe checkout, and admin panel
- Sample cards are basketball-themed (holdover from previous project)
- 6 sample cards shown when backend is empty
- No booster packs or booster boxes

## Requested Changes (Diff)

### Add
- More snake-themed sample cards (expand to ~12 cards) with proper Snakeymon names, types, HP, moves, and flavor text
- Booster Packs section: display 2-3 pack options (e.g. Standard Pack 5 cards, Rare Pack 3 guaranteed rares, Legendary Pack 1 guaranteed legendary)
- Booster Boxes section: display 1-2 box options (e.g. Base Set Box with 24 packs, Premium Box with 12 packs + guaranteed legendary)
- Each pack/box shows contents description, price, and Add to Cart button
- A new dedicated shop section on HomePage with tabs or headings for: Individual Cards, Booster Packs, Booster Boxes

### Modify
- Replace all basketball-themed SAMPLE_CARDS with Snakeymon-themed cards (Food Snakeyn, Mewsnark, and ~10 more snake monsters)
- Expand card grid to show more cards (at least 8 in grid)
- Hero text and branding updated to Snakeymon theme

### Remove
- Basketball references in sample data and hero copy

## Implementation Plan
1. Replace SAMPLE_CARDS in HomePage.tsx with 12 Snakeymon cards (varied rarities, snake names, HP/moves flavor)
2. Create a BoosterShop component showing packs and boxes as product cards with images, content descriptions, and prices
3. Add pack/box sample data as frontend-only static definitions (name, price, contents, image)
4. Update HomePage to include BoosterShop section below the card grid
5. Regenerate card art images for snake theme
6. Update hero content to Snakeymon branding
