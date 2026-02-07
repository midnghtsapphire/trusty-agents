import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Industry-specific comfort sounds and prompts
const INDUSTRY_SOUNDS: Record<string, { sfx: string; ttsMessage: string }> = {
  Plumbing: {
    sfx: "Toilet flushing followed by water rushing through pipes, plumbing sounds, professional work environment",
    ttsMessage: "Ugh, I've been trying to reach a plumber all day. Nobody picks up anymore!",
  },
  HVAC: {
    sfx: "Air conditioning unit humming, industrial fan spinning, comfortable cooling system ambient noise",
    ttsMessage: "Please, my air conditioning is broken and it's so hot! I can't get anyone on the phone!",
  },
  Dental: {
    sfx: "Dental drill whirring, suction device, professional dental office ambient sounds",
    ttsMessage: "Hello? I need to schedule an appointment urgently. My tooth really hurts!",
  },
  "Real Estate": {
    sfx: "Keys jingling, door opening, footsteps on hardwood floor, house tour ambient sounds",
    ttsMessage: "I've been calling about this property for days. Is anyone going to help me?",
  },
  "Home Services": {
    sfx: "Power tools, hammering, construction work, professional home improvement sounds",
    ttsMessage: "We need someone to fix our kitchen urgently. Please help!",
  },
  Legal: {
    sfx: "Papers shuffling, typewriter keys, professional office ambient, gavel sound",
    ttsMessage: "I really need legal advice. I hope someone can answer my call!",
  },
  Automotive: {
    sfx: "Car engine revving, mechanic tools, auto shop ambient sounds, wrench turning",
    ttsMessage: "My car broke down! I need a mechanic right away!",
  },
  Medical: {
    sfx: "Heart monitor beeping softly, hospital ambient sounds, professional medical environment",
    ttsMessage: "I've been waiting forever to speak to someone about my appointment!",
  },
};

// Happy customer messages for post-purchase
const HAPPY_MESSAGES = [
  "Oh my gosh, I finally got through! Thank you so much, you've been so helpful!",
  "Wow, that was so easy! I can't believe how quickly you answered!",
  "This is amazing! Best customer service I've ever experienced!",
  "Thank you! I'm so glad I can finally get the help I needed!",
  "You guys are incredible! I'm definitely recommending you to everyone!",
];

export function useIndustryAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (utteranceRef.current) {
      window.speechSynthesis?.cancel();
      utteranceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Browser TTS fallback
  const playBrowserTTS = useCallback((text: string) => {
    if (!window.speechSynthesis) return false;
    
    stopAudio();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.9;
    
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes("Samantha") || 
      v.name.includes("Google") || 
      v.name.includes("Microsoft") ||
      v.lang.startsWith("en")
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onend = () => {
      setIsPlaying(false);
      utteranceRef.current = null;
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      utteranceRef.current = null;
    };
    
    utteranceRef.current = utterance;
    setIsPlaying(true);
    speechSynthesis.speak(utterance);
    return true;
  }, [stopAudio]);

  const playAudio = useCallback(async (base64Audio: string) => {
    stopAudio();
    
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };
    
    audio.onerror = () => {
      console.error("Audio playback error");
      setIsPlaying(false);
      audioRef.current = null;
    };
    
    setIsPlaying(true);
    await audio.play();
  }, [stopAudio]);

  const generateAndPlaySFX = useCallback(async (industry: string) => {
    const soundConfig = INDUSTRY_SOUNDS[industry];
    if (!soundConfig) {
      console.warn(`No sound config for industry: ${industry}`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            type: "sfx",
            prompt: soundConfig.sfx,
            duration: 4,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`SFX request failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.audioContent) {
        await playAudio(data.audioContent);
      }
    } catch (error) {
      console.error("Error generating SFX:", error);
    } finally {
      setIsLoading(false);
    }
  }, [playAudio]);

  const generateAndPlayFrustrated = useCallback(async (industry: string) => {
    const soundConfig = INDUSTRY_SOUNDS[industry];
    if (!soundConfig) {
      console.warn(`No sound config for industry: ${industry}`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            type: "tts",
            text: soundConfig.ttsMessage,
            voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah voice
          }),
        }
      );

      if (!response.ok) {
        console.warn("ElevenLabs TTS failed, using browser fallback");
        playBrowserTTS(soundConfig.ttsMessage);
        return;
      }

      const data = await response.json();
      if (data.audioContent) {
        await playAudio(data.audioContent);
      } else {
        playBrowserTTS(soundConfig.ttsMessage);
      }
    } catch (error) {
      console.warn("TTS error, using browser fallback:", error);
      playBrowserTTS(soundConfig.ttsMessage);
    } finally {
      setIsLoading(false);
    }
  }, [playAudio, playBrowserTTS]);

  const playHappyCustomer = useCallback(async () => {
    const message = HAPPY_MESSAGES[Math.floor(Math.random() * HAPPY_MESSAGES.length)];
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-audio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            type: "tts",
            text: message,
            voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah voice
          }),
        }
      );

      if (!response.ok) {
        console.warn("ElevenLabs TTS failed, using browser fallback");
        playBrowserTTS(message);
        return;
      }

      const data = await response.json();
      if (data.audioContent) {
        await playAudio(data.audioContent);
      } else {
        playBrowserTTS(message);
      }
    } catch (error) {
      console.warn("Happy audio error, using browser fallback:", error);
      playBrowserTTS(message);
    } finally {
      setIsLoading(false);
    }
  }, [playAudio, playBrowserTTS]);

  return {
    isPlaying,
    isLoading,
    stopAudio,
    generateAndPlaySFX,
    generateAndPlayFrustrated,
    playHappyCustomer,
  };
}
