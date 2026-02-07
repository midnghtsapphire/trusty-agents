import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Phone, Clock, Calendar, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PRICING_TIERS, PricingTier } from "@/lib/stripe";

interface UsageAnalyticsProps {
  currentTier: PricingTier | null;
}

interface UsageData {
  included_minutes: number;
  purchased_minutes: number;
  used_minutes: number;
  available_minutes: number;
  last_reset_at: string;
}

export default function UsageAnalytics({ currentTier }: UsageAnalyticsProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase.functions.invoke("get-user-credits", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      setUsage(data);
    } catch (error) {
      console.error("Error fetching usage:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 size={20} className="text-magic" />
            Usage Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-32 bg-white/5 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const tierMinutes = currentTier ? PRICING_TIERS[currentTier].includedMinutes : 0;
  const usedMinutes = usage?.used_minutes || 0;
  const purchasedMinutes = usage?.purchased_minutes || 0;
  const availableMinutes = usage?.available_minutes || 0;
  const includedRemaining = Math.max(0, tierMinutes - usedMinutes);
  
  // Calculate percentage breakdown for visualization
  const totalPool = tierMinutes + purchasedMinutes;
  const usedPercent = totalPool > 0 ? (usedMinutes / totalPool) * 100 : 0;
  const includedPercent = totalPool > 0 ? (includedRemaining / totalPool) * 100 : 0;
  const purchasedPercent = totalPool > 0 ? (purchasedMinutes / totalPool) * 100 : 0;

  // Calculate days until reset
  const lastReset = usage?.last_reset_at ? new Date(usage.last_reset_at) : null;
  const nextReset = lastReset ? new Date(lastReset.getFullYear(), lastReset.getMonth() + 1, lastReset.getDate()) : null;
  const daysUntilReset = nextReset ? Math.ceil((nextReset.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  // Average daily usage (if we have reset date)
  const daysSinceReset = lastReset ? Math.max(1, Math.ceil((Date.now() - lastReset.getTime()) / (1000 * 60 * 60 * 24))) : 1;
  const avgDailyUsage = usedMinutes / daysSinceReset;

  // Projected usage by end of period
  const daysInPeriod = 30; // Assume 30-day billing cycle
  const projectedUsage = Math.round(avgDailyUsage * daysInPeriod);

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BarChart3 size={20} className="text-magic" />
          Usage Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Minutes Breakdown</span>
            <span className="text-foreground font-semibold">{availableMinutes} available</span>
          </div>
          
          {/* Stacked bar */}
          <div className="relative h-4 w-full rounded-full bg-white/10 overflow-hidden flex">
            {usedPercent > 0 && (
              <div 
                className="h-full bg-magic/70"
                style={{ width: `${usedPercent}%` }}
                title={`Used: ${usedMinutes} min`}
              />
            )}
            {includedPercent > 0 && (
              <div 
                className="h-full bg-sparkle"
                style={{ width: `${includedPercent}%` }}
                title={`Included remaining: ${includedRemaining} min`}
              />
            )}
            {purchasedPercent > 0 && (
              <div 
                className="h-full bg-[hsl(280_60%_55%)]"
                style={{ width: `${purchasedPercent}%` }}
                title={`Purchased: ${purchasedMinutes} min`}
              />
            )}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-magic/70" />
              <span className="text-muted-foreground">Used ({usedMinutes})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-sparkle" />
              <span className="text-muted-foreground">Included ({includedRemaining})</span>
            </div>
            {purchasedMinutes > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[hsl(280_60%_55%)]" />
                <span className="text-muted-foreground">Purchased ({purchasedMinutes})</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-sparkle" />
              <span className="text-xs text-muted-foreground">Avg Daily</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {avgDailyUsage.toFixed(1)} min
            </p>
          </div>
          
          <div className="glass-card p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-magic" />
              <span className="text-xs text-muted-foreground">Projected</span>
            </div>
            <p className={`text-lg font-semibold ${projectedUsage > tierMinutes ? 'text-[hsl(45_93%_47%)]' : 'text-foreground'}`}>
              {projectedUsage} min
            </p>
          </div>
          
          <div className="glass-card p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-sparkle" />
              <span className="text-xs text-muted-foreground">Reset In</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {daysUntilReset ?? "—"} days
            </p>
          </div>
          
          <div className="glass-card p-3 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-magic" />
              <span className="text-xs text-muted-foreground">Plan Limit</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {tierMinutes} min
            </p>
          </div>
        </div>

        {/* Warnings */}
        {projectedUsage > tierMinutes && (
          <div className="p-3 rounded-lg bg-[hsl(45_93%_47%)/0.1] border border-[hsl(45_93%_47%)/0.3]">
            <p className="text-sm text-[hsl(45_93%_47%)]">
              ⚡ At current usage, you'll exceed your {tierMinutes} included minutes. Consider buying a top-up pack!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
