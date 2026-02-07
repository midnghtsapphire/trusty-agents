import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Loader2, Crown, CreditCard, FileText, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundParticles from "@/components/BackgroundParticles";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PRICING_TIERS, ONE_TIME_PRODUCTS, getTierByProductId, PricingTier, OneTimeProduct } from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<PricingTier | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setCheckingSubscription(false);
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.subscribed && data?.product_id) {
        const tier = getTierByProductId(data.product_id);
        setCurrentTier(tier);
        setSubscriptionEnd(data.subscription_end);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleSubscribe = async (tierKey: PricingTier) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(tierKey);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate("/auth");
        return;
      }

      const tier = PRICING_TIERS[tierKey];
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: { priceId: tier.priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleOneTimePurchase = async (productKey: OneTimeProduct) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(productKey);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate("/auth");
        return;
      }

      const product = ONE_TIME_PRODUCTS[productKey];
      const { data, error } = await supabase.functions.invoke("create-payment", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: { priceId: product.priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoading("manage");
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open subscription management",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const tiers = Object.entries(PRICING_TIERS).map(([key, tier]) => ({
    key: key as PricingTier,
    ...tier,
    popular: key === "pro",
  }));

  const oneTimeProducts = Object.entries(ONE_TIME_PRODUCTS).map(([key, product]) => ({
    key: key as OneTimeProduct,
    ...product,
    icon: key === "callReports" ? <FileText size={20} /> : <Star size={20} />,
  }));

  return (
    <div className="min-h-screen relative">
      <BackgroundParticles />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-magic to-sparkle shadow-magic">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Poof<span className="text-gradient">Agent</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="magic">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="magic">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-12 container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business. All plans include 24/7 AI call handling.
          </p>
        </div>

        {/* Current Subscription Banner */}
        {currentTier && (
          <div className="max-w-3xl mx-auto mb-8">
            <Card className="glass-card border-sparkle/30 bg-sparkle/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="text-sparkle" size={24} />
                  <div>
                    <p className="font-semibold text-foreground">
                      Current Plan: {PRICING_TIERS[currentTier].name}
                    </p>
                    {subscriptionEnd && (
                      <p className="text-sm text-muted-foreground">
                        Renews on {new Date(subscriptionEnd).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="sparkle"
                  onClick={handleManageSubscription}
                  disabled={loading === "manage"}
                >
                  {loading === "manage" ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    <CreditCard className="mr-2" size={16} />
                  )}
                  Manage Subscription
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const isCurrentPlan = currentTier === tier.key;
            
            return (
              <Card 
                key={tier.key}
                className={`glass-card relative ${
                  tier.popular 
                    ? "border-magic/50 shadow-[0_0_30px_hsl(280_60%_55%/0.3)]" 
                    : "border-white/10"
                } ${isCurrentPlan ? "ring-2 ring-sparkle" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-magic text-magic-foreground text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-sparkle text-sparkle-foreground text-xs font-bold px-3 py-1 rounded-full">
                      YOUR PLAN
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-foreground">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="text-sparkle shrink-0" size={16} />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={tier.popular ? "magic" : "magicOutline"}
                    className="w-full"
                    onClick={() => handleSubscribe(tier.key)}
                    disabled={loading !== null || checkingSubscription || isCurrentPlan}
                  >
                    {loading === tier.key ? (
                      <Loader2 className="animate-spin mr-2" size={16} />
                    ) : null}
                    {isCurrentPlan ? "Current Plan" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* One-Time Add-Ons Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Premium Add-Ons
            </h2>
            <p className="text-muted-foreground">
              One-time purchases to enhance your AI agent experience
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {oneTimeProducts.map((product) => (
              <Card key={product.key} className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-magic/20 to-sparkle/20 flex items-center justify-center text-magic">
                      {product.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">${product.price}</span>
                        <Button
                          variant="sparkle"
                          size="sm"
                          onClick={() => handleOneTimePurchase(product.key)}
                          disabled={loading !== null}
                        >
                          {loading === product.key ? (
                            <Loader2 className="animate-spin mr-2" size={14} />
                          ) : null}
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Have questions? <Link to="/#faq" className="text-magic hover:underline">Check our FAQ</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
