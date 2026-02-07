import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateAudioRequest {
  type: "tts" | "sfx";
  text?: string;
  prompt?: string;
  voiceId?: string;
  duration?: number;
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

    const { type, text, prompt, voiceId, duration }: GenerateAudioRequest = await req.json();

    let audioBuffer: ArrayBuffer;

    if (type === "tts") {
      // Text-to-speech
      if (!text) {
        throw new Error("Text is required for TTS");
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
        const error = await response.text();
        throw new Error(`ElevenLabs TTS failed: ${response.status} - ${error}`);
      }

      audioBuffer = await response.arrayBuffer();
    } else if (type === "sfx") {
      // Sound effects
      if (!prompt) {
        throw new Error("Prompt is required for SFX");
      }

      const response = await fetch(
        "https://api.elevenlabs.io/v1/sound-generation",
        {
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
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ElevenLabs SFX failed: ${response.status} - ${error}`);
      }

      audioBuffer = await response.arrayBuffer();
    } else {
      throw new Error("Invalid type. Use 'tts' or 'sfx'");
    }

    // Return as base64
    const base64Audio = base64Encode(audioBuffer);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating audio:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
