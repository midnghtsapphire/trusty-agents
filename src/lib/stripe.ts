// Stripe pricing tiers configuration
export const PRICING_TIERS = {
  starter: {
    name: "Starter",
    price: 49,
    priceId: "price_1Sy45oP8T6VGDCG5yK0i2Lyo",
    productId: "prod_TvvxSivy0EF7fs",
    features: [
      "1 AI agent",
      "200 minutes/month",
      "Basic call handling",
      "Email support",
    ],
    agentLimit: 1,
  },
  pro: {
    name: "Pro",
    price: 149,
    priceId: "price_1Sy460P8T6VGDCG5UcreXIDq",
    productId: "prod_Tvvx1GHB9RtMy9",
    features: [
      "3 AI agents",
      "Unlimited calls",
      "CRM integration",
      "Priority support",
      "Custom greetings",
    ],
    agentLimit: 3,
  },
  business: {
    name: "Business",
    price: 299,
    priceId: "price_1Sy468P8T6VGDCG5b6JnA3SO",
    productId: "prod_Tvvy3v1We4yRlz",
    features: [
      "10 AI agents",
      "Unlimited calls",
      "Advanced CRM sync",
      "Dedicated support",
      "Custom integrations",
      "White-label options",
    ],
    agentLimit: 10,
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

export const getTierByProductId = (productId: string | null): PricingTier | null => {
  if (!productId) return null;
  
  for (const [key, tier] of Object.entries(PRICING_TIERS)) {
    if (tier.productId === productId) {
      return key as PricingTier;
    }
  }
  return null;
};
