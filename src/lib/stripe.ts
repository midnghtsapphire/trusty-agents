// Stripe pricing tiers configuration
export const PRICING_TIERS = {
  starter: {
    name: "Starter",
    price: 49,
    priceId: "price_1Sy45oP8T6VGDCG5yK0i2Lyo",
    productId: "prod_TvvxSivy0EF7fs",
    features: [
      "1 AI agent",
      "100 minutes/month",
      "Basic call handling",
      "Email support",
    ],
    agentLimit: 1,
    includedMinutes: 100,
  },
  pro: {
    name: "Pro",
    price: 149,
    priceId: "price_1Sy460P8T6VGDCG5UcreXIDq",
    productId: "prod_Tvvx1GHB9RtMy9",
    features: [
      "3 AI agents",
      "500 minutes/month",
      "CRM integration",
      "Priority support",
      "Custom greetings",
    ],
    agentLimit: 3,
    includedMinutes: 500,
  },
  business: {
    name: "Business",
    price: 299,
    priceId: "price_1Sy468P8T6VGDCG5b6JnA3SO",
    productId: "prod_Tvvy3v1We4yRlz",
    features: [
      "10 AI agents",
      "2,000 minutes/month",
      "Advanced CRM sync",
      "Dedicated support",
      "Custom integrations",
      "White-label options",
    ],
    agentLimit: 10,
    includedMinutes: 2000,
  },
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;

// One-time payment products
export const ONE_TIME_PRODUCTS = {
  callReports: {
    name: "Call Reports Pack",
    price: 29,
    priceId: "price_1Sy4D3P8T6VGDCG5Wz6vUXnA",
    productId: "prod_Tvw58yHZy38IpR",
    description: "Detailed AI call transcripts and analytics export",
  },
  whiteGloveSetup: {
    name: "White-Glove Setup",
    price: 199,
    priceId: "price_1Sy4DEP8T6VGDCG596ExzDYY",
    productId: "prod_Tvw5hTRHFVmJtt",
    description: "Premium onboarding with custom agent training",
  },
} as const;

export type OneTimeProduct = keyof typeof ONE_TIME_PRODUCTS;

// Credit packs for purchasing additional call minutes
export const CREDIT_PACKS = {
  small: {
    name: "100 Minutes Pack",
    minutes: 100,
    price: 9,
    priceId: "price_1Sy56pP8T6VGDCG5PgWl0XH2",
    productId: "prod_Tvx0LqdulX1UF1",
  },
  medium: {
    name: "500 Minutes Pack",
    minutes: 500,
    price: 29,
    priceId: "price_1Sy56zP8T6VGDCG5iZuDogtS",
    productId: "prod_Tvx13E6fFXMaQj",
  },
  large: {
    name: "1000 Minutes Pack",
    minutes: 1000,
    price: 49,
    priceId: "price_1Sy577P8T6VGDCG5OX4LY9sq",
    productId: "prod_Tvx1KpZmFyUCly",
  },
} as const;

export type CreditPack = keyof typeof CREDIT_PACKS;

export const getTierByProductId = (productId: string | null): PricingTier | null => {
  if (!productId) return null;
  
  for (const [key, tier] of Object.entries(PRICING_TIERS)) {
    if (tier.productId === productId) {
      return key as PricingTier;
    }
  }
  return null;
};

export const getCreditPackByProductId = (productId: string): CreditPack | null => {
  for (const [key, pack] of Object.entries(CREDIT_PACKS)) {
    if (pack.productId === productId) {
      return key as CreditPack;
    }
  }
  return null;
};
