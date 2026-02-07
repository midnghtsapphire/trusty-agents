import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateAudioRequest {
  type: "tts" | "sfx";
  text?: string;
  prompt?: string;
  voiceId?: string;
  duration?: number;
}

type ElevenLabsErrorDetail = {
  detail?: {
    status?: string;
    message?: string;
  };
};

async function readUpstreamErrorBody(response: Response): Promise<{
  rawText: string;
  parsed?: ElevenLabsErrorDetail | unknown;
  detailStatus?: string;
  detailMessage?: string;
}> {
  const rawText = await response.text();
  try {
    const parsed = JSON.parse(rawText) as ElevenLabsErrorDetail;
    return {
      rawText,
      parsed,
      detailStatus: parsed?.detail?.status,
      detailMessage: parsed?.detail?.message,
    };
  } catch {
    return { rawText };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    let body: GenerateAudioRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, text, prompt, voiceId, duration } = body;

    let audioBuffer: ArrayBuffer | null = null;

    if (type === "tts") {
      if (!text) {
        return new Response(JSON.stringify({ error: "Text is required for TTS" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const voice = voiceId || "EXAVITQu4vr4xnSDxMaL"; // Sarah voice as default
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_turbo_v2_5",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.3,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        const upstream = await readUpstreamErrorBody(response);

        // ElevenLabs sometimes disables Free Tier (401) with detail.status = "detected_unusual_activity".
        // Returning 200 + {audioContent:null} prevents client hard-failures and enables browser TTS fallback.
        const isUnusualActivity =
          response.status === 401 && upstream.detailStatus === "detected_unusual_activity";

        const safeMessage =
          upstream.detailMessage ||
          (isUnusualActivity
            ? "ElevenLabs temporarily disabled Free Tier for this key."
            : "ElevenLabs request failed.");

        return new Response(
          JSON.stringify({
            audioContent: null,
            fallback: "browser_tts",
            error: safeMessage,
            upstream_status: response.status,
            upstream_detail_status: upstream.detailStatus,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      audioBuffer = await response.arrayBuffer();
    } else if (type === "sfx") {
      if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt is required for SFX" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const response = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: prompt,
          duration_seconds: duration || 5,
          prompt_influence: 0.3,
        }),
      });

      if (!response.ok) {
        const upstream = await readUpstreamErrorBody(response);

        const safeMessage =
          upstream.detailMessage || "ElevenLabs sound generation failed.";

        return new Response(
          JSON.stringify({
            audioContent: null,
            fallback: "none",
            error: safeMessage,
            upstream_status: response.status,
            upstream_detail_status: upstream.detailStatus,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      audioBuffer = await response.arrayBuffer();
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid type. Use 'tts' or 'sfx'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!audioBuffer) {
      return new Response(
        JSON.stringify({ audioContent: null, error: "No audio generated" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const base64Audio = base64Encode(audioBuffer);

    return new Response(JSON.stringify({ audioContent: base64Audio }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating audio:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
