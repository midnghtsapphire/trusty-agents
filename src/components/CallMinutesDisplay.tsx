import { useState, useEffect } from "react";
import { Clock, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PRICING_TIERS, CREDIT_PACKS, PricingTier } from "@/lib/stripe";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CallMinutesDisplayProps {
  currentTier: PricingTier | null;
}

interface UserCredits {
  included_minutes: number;
  purchased_minutes: number;
  used_minutes: number;
  available_minutes: number;
  last_reset_at: string;
}

export default function CallMinutesDisplay({ currentTier }: CallMinutesDisplayProps) {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase.functions.invoke("get-user-credits", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      setCredits(data);
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packKey: keyof typeof CREDIT_PACKS) => {
    const pack = CREDIT_PACKS[packKey];
    setPurchasing(packKey);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Please sign in to purchase credits");
        return;
      }

      const { data, error } = await supabase.functions.invoke("purchase-credits", {
        body: { priceId: pack.priceId, productId: pack.productId },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast.error("Failed to start purchase. Please try again.");
    } finally {
      setPurchasing(null);
    }
  };

  // Calculate usage for progress bar
  const tierMinutes = currentTier ? PRICING_TIERS[currentTier].includedMinutes : 0;
  const totalAvailable = credits?.available_minutes || 0;
  const usedMinutes = credits?.used_minutes || 0;
  const purchasedMinutes = credits?.purchased_minutes || 0;
  
  // Usage is based on included minutes only
  const includedRemaining = Math.max(0, tierMinutes - usedMinutes);
  const usagePercent = tierMinutes > 0 ? Math.min(100, (usedMinutes / tierMinutes) * 100) : 0;

  const getColorClass = () => {
    if (usagePercent >= 100) return "bg-destructive";
    if (usagePercent >= 75) return "bg-[hsl(45_93%_47%)]";
    return "bg-magic";
  };

  const getGlowClass = () => {
    if (usagePercent >= 100) return "shadow-[0_0_10px_hsl(0_62%_50%/0.5)]";
    if (usagePercent >= 75) return "shadow-[0_0_10px_hsl(45_93%_47%/0.5)]";
    return "shadow-[0_0_10px_hsl(280_60%_55%/0.5)]";
  };

  if (loading) {
    return (
      <div className="glass-card px-4 py-3 rounded-xl border border-white/10 min-w-[220px] animate-pulse">
        <div className="h-4 bg-white/10 rounded w-24 mb-2" />
        <div className="h-2 bg-white/10 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="glass-card px-4 py-3 rounded-xl border border-white/10 min-w-[220px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-magic" />
          <span className="text-sm text-muted-foreground">Call Minutes</span>
        </div>
        <span className="text-sm font-semibold text-foreground">
          {totalAvailable} min
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden mb-2">
        <div 
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${getColorClass()} ${getGlowClass()}`}
          style={{ width: `${usagePercent}%` }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {usedMinutes}/{tierMinutes} included
          {purchasedMinutes > 0 && (
            <span className="text-magic ml-1">+{purchasedMinutes} bonus</span>
          )}
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
              <Plus size={12} />
              Buy More
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Buy Call Minutes</DialogTitle>
              <DialogDescription>
                Purchase additional call minutes for your AI agents. Minutes never expire.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 mt-4">
              {Object.entries(CREDIT_PACKS).map(([key, pack]) => (
                <button
                  key={key}
                  onClick={() => handlePurchase(key as keyof typeof CREDIT_PACKS)}
                  disabled={purchasing !== null}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-magic/30 transition-all disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-magic/20">
                      <Zap size={20} className="text-magic" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{pack.minutes} Minutes</p>
                      <p className="text-xs text-muted-foreground">
                        ${(pack.price / pack.minutes * 100).toFixed(1)}¢/min
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${pack.price}</p>
                    {purchasing === key && (
                      <p className="text-xs text-magic animate-pulse">Processing...</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              ✨ Purchased minutes are used after your monthly included minutes
            </p>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low balance warning */}
      {totalAvailable <= 10 && totalAvailable > 0 && (
        <p className="text-xs text-[hsl(45_93%_47%)] mt-1">⚡ Low balance — buy more minutes</p>
      )}
      {totalAvailable === 0 && (
        <p className="text-xs text-destructive mt-1">⚠️ No minutes left — buy more to continue</p>
      )}
    </div>
  );
}
