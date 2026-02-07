import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
  console.log(`[GET-USER-CREDITS] ${step}${detailsStr}`);
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
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Get or create user credits record
    let { data: credits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError && creditsError.code === "PGRST116") {
      // No record exists, create one with default values
      const { data: newCredits, error: insertError } = await supabaseClient
        .from("user_credits")
        .insert({ user_id: user.id, included_minutes: 0, purchased_minutes: 0, used_minutes: 0 })
        .select()
        .single();
      
      if (insertError) throw new Error(`Failed to create credits record: ${insertError.message}`);
      credits = newCredits;
      logStep("Created new credits record", { credits });
    } else if (creditsError) {
      throw new Error(`Failed to fetch credits: ${creditsError.message}`);
    }

    // Check if monthly reset is needed (based on last_reset_at)
    const lastReset = new Date(credits.last_reset_at);
    const now = new Date();
    const monthsSinceReset = (now.getFullYear() - lastReset.getFullYear()) * 12 + (now.getMonth() - lastReset.getMonth());
    
    logStep("Credits fetched", { 
      includedMinutes: credits.included_minutes,
      purchasedMinutes: credits.purchased_minutes,
      usedMinutes: credits.used_minutes,
      monthsSinceReset,
    });

    // Calculate available minutes
    const availableIncluded = Math.max(0, credits.included_minutes - credits.used_minutes);
    const totalAvailable = availableIncluded + credits.purchased_minutes;

    return new Response(JSON.stringify({
      included_minutes: credits.included_minutes,
      purchased_minutes: credits.purchased_minutes,
      used_minutes: credits.used_minutes,
      available_minutes: totalAvailable,
      last_reset_at: credits.last_reset_at,
      needs_reset: monthsSinceReset >= 1,
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
