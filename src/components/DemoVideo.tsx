import { useMemo, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import demoVideo from "@/assets/demo-video.mp4";

type NarrationStatus = "idle" | "loading" | "ready" | "error";

const DemoVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [narrationStatus, setNarrationStatus] = useState<NarrationStatus>("idle");

  const narrationText = useMemo(
    () =>
      [
        "Here’s how Poof works in four steps.",
        "One: a customer calls your business.",
        "Two: your verified AI agent answers instantly and qualifies the lead.",
        "Three: the agent books the appointment directly on your calendar.",
        "Four: you review outcomes in your dashboard and keep improving.",
      ].join(" "),
    []
  );

  const ensureNarrationReady = async () => {
    if (narrationRef.current) return;

    setNarrationStatus("loading");
    const { data, error } = await supabase.functions.invoke("generate-audio", {
      body: {
        type: "tts",
        text: narrationText,
      },
    });

    if (error || !data?.audioContent) {
      console.error("Voiceover generation failed", error);
      setNarrationStatus("error");
      return;
    }

    const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
    audio.preload = "auto";

    // Keep audio reasonably loud but not clipped.
    audio.volume = 0.9;

    narrationRef.current = audio;
    setNarrationStatus("ready");
  };

  const playBoth = async () => {
    const video = videoRef.current;
    if (!video) return;

    // The generated demo video may not contain an audio track, so we keep the video muted
    // and play a separate voiceover track for reliable audio on all browsers.
    video.muted = true;

    if (!isMuted) {
      await ensureNarrationReady();
    }

    try {
      await video.play();
      setIsPlaying(true);

      const narration = narrationRef.current;
      if (narration && !isMuted) {
        narration.currentTime = 0;
        await narration.play();
      }
    } catch (e) {
      console.error("Playback failed", e);
    }
  };

  const pauseBoth = () => {
    const video = videoRef.current;
    if (video) video.pause();

    const narration = narrationRef.current;
    if (narration) narration.pause();

    setIsPlaying(false);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      pauseBoth();
    } else {
      await playBoth();
    }
  };

  const toggleMute = async () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    const narration = narrationRef.current;
    if (!narration) {
      if (!nextMuted) {
        // If unmuting before narration exists, generate it.
        await ensureNarrationReady();
      }
      return;
    }

    if (nextMuted) {
      narration.pause();
    } else if (isPlaying) {
      narration.currentTime = 0;
      try {
        await narration.play();
      } catch (e) {
        console.error("Unmute play failed", e);
      }
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border shadow-magic group">
      <video
        ref={videoRef}
        src={demoVideo}
        className="w-full aspect-video object-cover"
        loop
        playsInline
        preload="auto"
        muted
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />

      {/* Center Play/Pause */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center"
        aria-label={isPlaying ? "Pause demo" : "Play demo"}
      >
        <div
          className={
            "w-20 h-20 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center " +
            "shadow-magic transition-all duration-300 hover:scale-110"
          }
        >
          {isPlaying ? (
            <Pause size={32} className="text-primary-foreground" />
          ) : (
            <Play size={32} className="text-primary-foreground ml-1" />
          )}
        </div>
      </button>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
          title={isMuted ? "Unmute voiceover" : "Mute voiceover"}
          aria-label={isMuted ? "Unmute voiceover" : "Mute voiceover"}
        >
          {isMuted ? (
            <VolumeX size={18} className="text-muted-foreground" />
          ) : (
            <Volume2 size={18} className="text-foreground" />
          )}
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
          title="Fullscreen"
          aria-label="Fullscreen"
        >
          <Maximize2 size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* Step captions (readable, not baked into the video) */}
      <div className="absolute bottom-4 left-4 right-20 md:right-28">
        <div className="glass-card border border-border rounded-xl px-4 py-3 text-left">
          <p className="text-xs font-medium text-muted-foreground">Step-by-step</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            1) Answer instantly • 2) Qualify lead • 3) Book appointment • 4) Review dashboard
          </p>
          {!isMuted && narrationStatus === "loading" && (
            <p className="mt-1 text-xs text-muted-foreground">Generating voiceover…</p>
          )}
          {!isMuted && narrationStatus === "error" && (
            <p className="mt-1 text-xs text-destructive">Voiceover failed to load—try again.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoVideo;

