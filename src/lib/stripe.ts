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

export const getTierByProductId = (productId: string | null): PricingTier | null => {
  if (!productId) return null;
  
  for (const [key, tier] of Object.entries(PRICING_TIERS)) {
    if (tier.productId === productId) {
      return key as PricingTier;
    }
  }
  return null;
};
