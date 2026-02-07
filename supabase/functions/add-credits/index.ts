import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADD-CREDITS] ${step}${detailsStr}`);
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

    const { minutes, stripe_payment_id, amount_cents } = await req.json();
    if (!minutes || typeof minutes !== "number") throw new Error("Minutes is required and must be a number");
    logStep("Request received", { minutes, stripe_payment_id, amount_cents });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Upsert user credits - add purchased minutes
    const { data: existingCredits } = await supabaseClient
      .from("user_credits")
      .select("purchased_minutes")
      .eq("user_id", user.id)
      .single();

    const currentPurchased = existingCredits?.purchased_minutes || 0;

    const { error: upsertError } = await supabaseClient
      .from("user_credits")
      .upsert({
        user_id: user.id,
        purchased_minutes: currentPurchased + minutes,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (upsertError) throw new Error(`Failed to update credits: ${upsertError.message}`);
    logStep("Credits updated", { newTotal: currentPurchased + minutes });

    // Log the purchase
    const { error: purchaseError } = await supabaseClient
      .from("credit_purchases")
      .insert({
        user_id: user.id,
        minutes_purchased: minutes,
        amount_cents: amount_cents || 0,
        stripe_payment_id: stripe_payment_id || null,
      });

    if (purchaseError) {
      logStep("Warning: Failed to log purchase", { error: purchaseError.message });
    } else {
      logStep("Purchase logged");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      minutes_added: minutes,
      new_total: currentPurchased + minutes,
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
