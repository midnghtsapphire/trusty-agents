import { useState, useEffect } from "react";
import { AlertTriangle, X, Zap, Clock } from "lucide-react";
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
} from "@/components/ui/dialog";

interface LowBalanceAlertProps {
  currentTier: PricingTier | null;
}

interface UserCredits {
  included_minutes: number;
  purchased_minutes: number;
  used_minutes: number;
  available_minutes: number;
}

export default function LowBalanceAlert({ currentTier }: LowBalanceAlertProps) {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);

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

  // Calculate thresholds
  const tierMinutes = currentTier ? PRICING_TIERS[currentTier].includedMinutes : 0;
  const availableMinutes = credits?.available_minutes || 0;
  const totalPool = tierMinutes + (credits?.purchased_minutes || 0);
  const usagePercent = totalPool > 0 ? ((totalPool - availableMinutes) / totalPool) * 100 : 0;

  // Check if below 20% threshold
  const isLowBalance = availableMinutes > 0 && usagePercent >= 80;
  const isCritical = availableMinutes <= 10;
  const isZero = availableMinutes === 0;

  // Don't show if dismissed or no alert needed
  if (dismissed || (!isLowBalance && !isCritical && !isZero)) {
    return null;
  }

  const alertStyle = isZero 
    ? "bg-destructive/10 border-destructive/30 text-destructive"
    : isCritical 
      ? "bg-destructive/10 border-destructive/30 text-destructive"
      : "bg-[hsl(45_93%_47%)/0.1] border-[hsl(45_93%_47%)/0.3] text-[hsl(45_93%_47%)]";

  const alertMessage = isZero
    ? "You've run out of call minutes! Your agents won't be able to handle calls."
    : isCritical
      ? `Only ${availableMinutes} minutes remaining! Top up now to avoid service interruption.`
      : `Running low! Only ${availableMinutes} minutes (${Math.round(100 - usagePercent)}%) remaining this period.`;

  return (
    <>
      <div className={`fixed bottom-4 right-4 z-50 max-w-sm p-4 rounded-xl border shadow-lg backdrop-blur-xl ${alertStyle}`}>
        <button 
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
        
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-medium text-sm pr-4">{alertMessage}</p>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="magic" 
                className="h-7 text-xs"
                onClick={() => setDialogOpen(true)}
              >
                <Zap size={12} className="mr-1" />
                Buy Minutes
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 text-xs"
                onClick={() => setDismissed(true)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-card border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Top Up Your Minutes</DialogTitle>
            <DialogDescription>
              Purchase additional call minutes to keep your agents running. Minutes never expire.
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
                    <Clock size={20} className="text-magic" />
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
        </DialogContent>
      </Dialog>
    </>
  );
}
