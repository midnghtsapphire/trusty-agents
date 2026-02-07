import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Tier configuration (must match frontend PRICING_TIERS)
const TIER_MINUTES: Record<string, number> = {
  "prod_TvvxSivy0EF7fs": 100,  // Starter
  "prod_Tvvx1GHB9RtMy9": 500,  // Pro
  "prod_Tvvy3v1We4yRlz": 2000, // Business
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RESET-MONTHLY-MINUTES] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started - checking for users needing monthly reset");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Get all user credits that might need reset (last reset > 28 days ago to be safe)
    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);

    const { data: creditsToCheck, error: fetchError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .lt("last_reset_at", twentyEightDaysAgo.toISOString());

    if (fetchError) throw new Error(`Failed to fetch credits: ${fetchError.message}`);

    logStep("Found users to check", { count: creditsToCheck?.length || 0 });

    if (!creditsToCheck || creditsToCheck.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No users need reset",
        processed: 0,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let resetCount = 0;
    const errors: string[] = [];

    for (const credit of creditsToCheck) {
      try {
        // Get user email from auth
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(credit.user_id);
        
        if (userError || !userData.user?.email) {
          logStep("Could not find user", { userId: credit.user_id });
          continue;
        }

        const userEmail = userData.user.email;

        // Check Stripe for active subscription
        const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
        
        if (customers.data.length === 0) {
          logStep("No Stripe customer found", { email: userEmail });
          continue;
        }

        const customerId = customers.data[0].id;
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          // No active subscription, reset to 0 included minutes
          logStep("No active subscription, resetting to 0", { userId: credit.user_id });
          
          const { error: updateError } = await supabaseClient
            .from("user_credits")
            .update({
              included_minutes: 0,
              used_minutes: 0,
              last_reset_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", credit.user_id);

          if (updateError) throw updateError;
          resetCount++;
          continue;
        }

        // Get subscription billing cycle
        const subscription = subscriptions.data[0];
        const periodStart = new Date(subscription.current_period_start * 1000);
        const lastReset = new Date(credit.last_reset_at);

        // Check if we've entered a new billing period since last reset
        if (periodStart > lastReset) {
          const productId = subscription.items.data[0].price.product as string;
          const tierMinutes = TIER_MINUTES[productId] || 0;

          logStep("Resetting user minutes", { 
            userId: credit.user_id, 
            tierMinutes,
            periodStart: periodStart.toISOString(),
          });

          const { error: updateError } = await supabaseClient
            .from("user_credits")
            .update({
              included_minutes: tierMinutes,
              used_minutes: 0,
              last_reset_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", credit.user_id);

          if (updateError) throw updateError;
          resetCount++;
        } else {
          logStep("User not due for reset yet", { 
            userId: credit.user_id,
            periodStart: periodStart.toISOString(),
            lastReset: lastReset.toISOString(),
          });
        }
      } catch (userError) {
        const errorMsg = userError instanceof Error ? userError.message : String(userError);
        errors.push(`User ${credit.user_id}: ${errorMsg}`);
        logStep("Error processing user", { userId: credit.user_id, error: errorMsg });
      }
    }

    logStep("Reset complete", { resetCount, errors: errors.length });

    return new Response(JSON.stringify({ 
      message: "Monthly reset check complete",
      processed: creditsToCheck.length,
      reset: resetCount,
      errors: errors.length > 0 ? errors : undefined,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
