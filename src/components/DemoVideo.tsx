import { useMemo, useRef, useState, useEffect } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX, Captions, CaptionsOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import demoVideo from "@/assets/demo-video.mp4";

type NarrationStatus = "idle" | "loading" | "ready" | "error";

// Timed captions for hearing impaired/deaf users
const CAPTIONS = [
  { start: 0, end: 2, text: "Here's how Poof works in four simple steps." },
  { start: 2, end: 4, text: "Step 1: A customer calls your business." },
  { start: 4, end: 6, text: "Step 2: Your AI agent answers instantly and qualifies the lead." },
  { start: 6, end: 8, text: "Step 3: The agent books the appointment on your calendar." },
  { start: 8, end: 10, text: "Step 4: Review outcomes in your dashboard." },
];

const DemoVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [narrationStatus, setNarrationStatus] = useState<NarrationStatus>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [showCaptions, setShowCaptions] = useState(true);

  // Get current caption based on video time
  const currentCaption = useMemo(() => {
    return CAPTIONS.find(c => currentTime >= c.start && currentTime < c.end)?.text || "";
  }, [currentTime]);

  // Update current time for synchronized captions
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Keyboard shortcuts: Space = play/pause, C = toggle captions, M = mute
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "c":
          e.preventDefault();
          toggleCaptions();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isMuted, showCaptions]);

  const narrationText = useMemo(
    () =>
      [
        "Here's how Poof works in four steps.",
        "One: a customer calls your business.",
        "Two: your verified AI agent answers instantly and qualifies the lead.",
        "Three: the agent books the appointment directly on your calendar.",
        "Four: you review outcomes in your dashboard and keep improving.",
      ].join(" "),
    []
  );

  const ensureNarrationReady = async () => {
    if (narrationRef.current) return true;
    if (narrationStatus === "error") return false;

    setNarrationStatus("loading");
    try {
      const { data, error } = await supabase.functions.invoke("generate-audio", {
        body: {
          type: "tts",
          text: narrationText,
        },
      });

      if (error || !data?.audioContent) {
        console.warn("Voiceover unavailable, continuing with captions only");
        setNarrationStatus("error");
        return false;
      }

      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audio.preload = "auto";
      audio.volume = 0.9;

      narrationRef.current = audio;
      setNarrationStatus("ready");
      return true;
    } catch (err) {
      console.warn("Voiceover generation failed, continuing with captions only", err);
      setNarrationStatus("error");
      return false;
    }
  };

  const playBoth = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    let audioAvailable = false;
    if (!isMuted) {
      audioAvailable = await ensureNarrationReady();
    }

    try {
      await video.play();
      setIsPlaying(true);

      const narration = narrationRef.current;
      if (narration && !isMuted && audioAvailable) {
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

  const toggleCaptions = () => setShowCaptions(prev => !prev);

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  // Full transcript text for reading
  const fullTranscript = CAPTIONS.map(c => c.text).join(" ");

  return (
    <>
    <div 
      className="relative rounded-2xl overflow-hidden border border-border shadow-magic group"
      role="region"
      aria-label="Product demonstration video with audio description and captions"
    >
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
        aria-label="Animated demonstration showing how Poof AI answers customer calls, qualifies leads, books appointments, and displays analytics on a dashboard"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

      {/* Live closed captions for deaf/hearing impaired - large, high contrast */}
      {showCaptions && currentCaption && isPlaying && (
        <div 
          className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="bg-background/95 border-2 border-primary/50 rounded-xl px-6 py-4 max-w-xl shadow-lg">
            <p className="text-lg md:text-xl font-bold text-foreground text-center leading-relaxed">
              {currentCaption}
            </p>
          </div>
        </div>
      )}

      {/* Audio playing indicator for deaf users */}
      {isPlaying && !isMuted && narrationStatus === "ready" && (
        <div 
          className="absolute top-4 right-4 flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium"
          role="status"
          aria-label="Audio narration is playing"
        >
          <span className="flex gap-0.5">
            <span className="w-1 h-3 bg-primary-foreground rounded-full animate-pulse" />
            <span className="w-1 h-4 bg-primary-foreground rounded-full animate-pulse delay-75" />
            <span className="w-1 h-2 bg-primary-foreground rounded-full animate-pulse delay-150" />
          </span>
          <span className="sr-only">Audio playing</span>
          <span aria-hidden="true">Audio</span>
        </div>
      )}

      {/* Center Play/Pause - larger touch target for accessibility */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
        aria-label={isPlaying ? "Pause video demonstration" : "Play video demonstration"}
      >
        <div
          className={
            "w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center " +
            "shadow-magic transition-all duration-300 hover:scale-110 focus:scale-110"
          }
        >
          {isPlaying ? (
            <Pause size={40} className="text-primary-foreground" aria-hidden="true" />
          ) : (
            <Play size={40} className="text-primary-foreground ml-1" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Controls - larger buttons for accessibility */}
      <div className="absolute bottom-4 right-4 flex gap-2" role="toolbar" aria-label="Video controls">
        {/* Captions toggle */}
        <button
          onClick={toggleCaptions}
          className="p-3 rounded-full bg-background/90 backdrop-blur-sm border-2 border-border hover:bg-background hover:border-primary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title={showCaptions ? "Hide captions" : "Show captions"}
          aria-label={showCaptions ? "Hide captions" : "Show captions"}
          aria-pressed={showCaptions}
        >
          {showCaptions ? (
            <Captions size={22} className="text-primary" aria-hidden="true" />
          ) : (
            <CaptionsOff size={22} className="text-muted-foreground" aria-hidden="true" />
          )}
        </button>

        {/* Volume toggle */}
        {narrationStatus !== "error" && (
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-background/90 backdrop-blur-sm border-2 border-border hover:bg-background hover:border-primary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={isMuted ? "Enable audio narration" : "Mute audio narration"}
            aria-label={isMuted ? "Enable audio narration" : "Mute audio narration"}
            aria-pressed={!isMuted}
          >
            {isMuted ? (
              <VolumeX size={22} className="text-muted-foreground" aria-hidden="true" />
            ) : (
              <Volume2 size={22} className="text-foreground" aria-hidden="true" />
            )}
          </button>
        )}

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-full bg-background/90 backdrop-blur-sm border-2 border-border hover:bg-background hover:border-primary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="View fullscreen"
          aria-label="View video in fullscreen mode"
        >
          <Maximize2 size={22} className="text-muted-foreground" aria-hidden="true" />
        </button>
      </div>

      {/* Step summary for low vision - always visible, high contrast */}
      <div className="absolute bottom-4 left-4 right-36 md:right-44">
        <div className="bg-background/95 border-2 border-border rounded-xl px-4 py-3 text-left shadow-lg">
          <p className="text-sm font-bold text-primary uppercase tracking-wide">
            4-Step Process
          </p>
          <p className="mt-1.5 text-base md:text-lg font-semibold text-foreground leading-snug">
            Answer → Qualify → Book → Review
          </p>
          {narrationStatus === "loading" && (
            <p className="mt-1 text-sm text-muted-foreground" role="status">
              Loading audio narration…
            </p>
          )}
          {narrationStatus === "error" && (
            <p className="mt-1 text-sm text-muted-foreground" role="status">
              Captions available • Audio unavailable
            </p>
          )}
        </div>
      </div>

      {/* Screen reader only: full description */}
      <div className="sr-only" aria-live="polite">
        {isPlaying 
          ? `Video playing. ${currentCaption}` 
          : "Video paused. Press play to watch a demonstration of how Poof AI handles customer calls."
        }
      </div>
    </div>

    {/* Transcript section below video */}
    <div className="mt-6 bg-muted/30 border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">
          📄 Full Transcript
        </h3>
        <p className="text-sm text-muted-foreground">
          For users who prefer reading
        </p>
      </div>
      
      <div className="space-y-3">
        {CAPTIONS.map((caption, index) => (
          <div 
            key={index}
            className={`flex gap-4 p-3 rounded-lg transition-colors ${
              isPlaying && currentTime >= caption.start && currentTime < caption.end
                ? "bg-primary/10 border border-primary/30"
                : "bg-background/50"
            }`}
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center">
              {index + 1}
            </span>
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {caption.text}
            </p>
          </div>
        ))}
      </div>

      {/* Keyboard shortcuts help */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          ⌨️ Keyboard Shortcuts
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-2 py-1 bg-background rounded border border-border">
            <kbd className="font-mono font-bold">Space</kbd> Play/Pause
          </span>
          <span className="px-2 py-1 bg-background rounded border border-border">
            <kbd className="font-mono font-bold">C</kbd> Captions
          </span>
          <span className="px-2 py-1 bg-background rounded border border-border">
            <kbd className="font-mono font-bold">M</kbd> Mute
          </span>
          <span className="px-2 py-1 bg-background rounded border border-border">
            <kbd className="font-mono font-bold">F</kbd> Fullscreen
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

export default DemoVideo;
