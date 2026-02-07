import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PRICING_TIERS } from "@/lib/stripe";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: readonly string[];
  cta: string;
  popular?: boolean;
  icon: React.ReactNode;
  tierKey: string;
}

const tiers: PricingTier[] = [
  {
    name: PRICING_TIERS.starter.name,
    price: `$${PRICING_TIERS.starter.price}`,
    period: "/month",
    description: "Perfect for small businesses getting started with AI automation.",
    features: PRICING_TIERS.starter.features,
    cta: "Start Free Trial",
    icon: <Sparkles size={24} />,
    tierKey: "starter",
  },
  {
    name: PRICING_TIERS.pro.name,
    price: `$${PRICING_TIERS.pro.price}`,
    period: "/month",
    description: "For growing businesses that need 24/7 coverage and advanced features.",
    features: PRICING_TIERS.pro.features,
    cta: "Start Free Trial",
    popular: true,
    icon: <Zap size={24} />,
    tierKey: "pro",
  },
  {
    name: PRICING_TIERS.business.name,
    price: `$${PRICING_TIERS.business.price}`,
    period: "/month",
    description: "Unlimited agents and white-glove service for large organizations.",
    features: PRICING_TIERS.business.features,
    cta: "Get Started",
    icon: <Building2 size={24} />,
    tierKey: "business",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full glass-card bg-sparkle/15 px-4 py-1.5 text-sm font-medium text-sparkle border border-sparkle/30">
            ✨ Simple Pricing
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Transparent Pricing, No Hidden Fees
          </h2>
          <p className="text-lg text-muted-foreground">
            Start with a 14-day free trial. No credit card required.
            Cancel anytime—your wishes are protected.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl glass-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover ${
                tier.popular
                  ? "border-2 border-magic/50 shadow-magic scale-105 lg:scale-110"
                  : "border border-white/10"
              }`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-magic to-sparkle px-4 py-1.5 text-sm font-semibold text-white shadow-magic">
                    <Sparkles size={14} />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-magic/20 to-sparkle/20 text-magic">
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
              </div>

              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">{tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </div>

              <p className="mb-6 text-sm text-muted-foreground">{tier.description}</p>

              <ul className="mb-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={18} className="mt-0.5 flex-shrink-0 text-sparkle" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/pricing">
                <Button
                  variant={tier.popular ? "poof" : "glass"}
                  className="w-full"
                  size="lg"
                >
                  {tier.popular && <Sparkles size={16} />}
                  {tier.cta}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ 30-day money-back guarantee • No long-term contracts • Upgrade or downgrade anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
