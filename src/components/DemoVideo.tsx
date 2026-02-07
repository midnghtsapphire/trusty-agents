import { useMemo, useRef, useState, useEffect } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX, Captions, CaptionsOff, Gauge, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import demoVideo from "@/assets/demo-video.mp4";

type NarrationStatus = "idle" | "loading" | "ready" | "error";
type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5;

// Timed captions for hearing impaired/deaf users
const CAPTIONS = [
  { start: 0, end: 2, text: "Here's how Poof works in four simple steps." },
  { start: 2, end: 4, text: "Step 1: A customer calls your business." },
  { start: 4, end: 6, text: "Step 2: Your AI agent answers instantly and qualifies the lead." },
  { start: 6, end: 8, text: "Step 3: The agent books the appointment on your calendar." },
  { start: 8, end: 10, text: "Step 4: Review outcomes in your dashboard." },
];

const SPEED_OPTIONS: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5];

const DemoVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [narrationStatus, setNarrationStatus] = useState<NarrationStatus>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [highContrast, setHighContrast] = useState(false);

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

  // Keyboard shortcuts: Space = play/pause, C = toggle captions, M = mute, H = high contrast
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
        case "h":
          e.preventDefault();
          toggleHighContrast();
          break;
        case ",":
          e.preventDefault();
          cycleSpeed(-1);
          break;
        case ".":
          e.preventDefault();
          cycleSpeed(1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isMuted, showCaptions, playbackSpeed, highContrast]);

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

  // Browser TTS fallback when ElevenLabs is unavailable
  const playBrowserTTS = (text: string): HTMLAudioElement | null => {
    if (!window.speechSynthesis) return null;
    
    // Create a fake audio element interface for consistency
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.9;
    
    // Try to use a natural voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes("Samantha") || 
      v.name.includes("Google") || 
      v.name.includes("Microsoft") ||
      v.lang.startsWith("en")
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    
    // Create a pseudo-audio object with play/pause/currentTime
    const pseudoAudio = {
      play: () => {
        speechSynthesis.speak(utterance);
        return Promise.resolve();
      },
      pause: () => speechSynthesis.cancel(),
      get currentTime() { return 0; },
      set currentTime(_: number) { /* no-op */ },
      volume: 0.9,
      preload: "auto",
      playbackRate: 1,
    } as unknown as HTMLAudioElement;
    
    return pseudoAudio;
  };

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
        console.warn("ElevenLabs unavailable, falling back to browser TTS");
        const browserAudio = playBrowserTTS(narrationText);
        if (browserAudio) {
          narrationRef.current = browserAudio;
          setNarrationStatus("ready");
          return true;
        }
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
      console.warn("TTS failed, trying browser fallback", err);
      const browserAudio = playBrowserTTS(narrationText);
      if (browserAudio) {
        narrationRef.current = browserAudio;
        setNarrationStatus("ready");
        return true;
      }
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
  const toggleHighContrast = () => setHighContrast(prev => !prev);

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  // Cycle playback speed
  const cycleSpeed = (direction: 1 | -1) => {
    const currentIndex = SPEED_OPTIONS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + direction + SPEED_OPTIONS.length) % SPEED_OPTIONS.length;
    const newSpeed = SPEED_OPTIONS[nextIndex];
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    if (narrationRef.current) {
      narrationRef.current.playbackRate = newSpeed;
    }
  };

  const setSpeed = (speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    if (narrationRef.current) {
      narrationRef.current.playbackRate = speed;
    }
  };

  // Full transcript text for reading
  const fullTranscript = CAPTIONS.map(c => c.text).join(" ");

  // High contrast styles - warm amber/gold tones, NO blue light
  const hcStyles = highContrast ? {
    container: "ring-4 ring-amber-500",
    overlay: "bg-amber-950/95",
    caption: "bg-amber-950 border-amber-400 text-amber-50",
    button: "bg-amber-950 border-amber-400 text-amber-50 hover:bg-amber-900",
    transcript: "bg-amber-950/95 border-amber-500 text-amber-50",
    kbd: "bg-amber-900 border-amber-600 text-amber-100",
  } : {
    container: "",
    overlay: "",
    caption: "bg-background/95 border-primary/50 text-foreground",
    button: "bg-background/90 border-border hover:bg-background hover:border-primary/50",
    transcript: "bg-muted/30 border-border",
    kbd: "bg-background border-border",
  };

  return (
    <>
    <div 
      className={`relative rounded-2xl overflow-hidden border border-border shadow-magic group ${hcStyles.container}`}
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
          <div className={`border-2 rounded-xl px-6 py-4 max-w-xl shadow-lg ${hcStyles.caption}`}>
            <p className="text-lg md:text-xl font-bold text-center leading-relaxed">
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
      <div className="absolute bottom-4 right-4 flex gap-2 flex-wrap justify-end" role="toolbar" aria-label="Video controls">
        {/* Speed control */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => cycleSpeed(-1)}
            className={`p-2 rounded-l-full backdrop-blur-sm border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${hcStyles.button}`}
            title="Decrease speed"
            aria-label="Decrease playback speed"
          >
            <span className="text-xs font-bold px-1" aria-hidden="true">−</span>
          </button>
          <span 
            className={`px-3 py-2 backdrop-blur-sm border-y-2 text-sm font-bold min-w-[3.5rem] text-center ${hcStyles.button}`}
            role="status"
            aria-label={`Playback speed: ${playbackSpeed}x`}
          >
            {playbackSpeed}x
          </span>
          <button
            onClick={() => cycleSpeed(1)}
            className={`p-2 rounded-r-full backdrop-blur-sm border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${hcStyles.button}`}
            title="Increase speed"
            aria-label="Increase playback speed"
          >
            <span className="text-xs font-bold px-1" aria-hidden="true">+</span>
          </button>
        </div>

        {/* High contrast toggle */}
        <button
          onClick={toggleHighContrast}
          className={`p-3 rounded-full backdrop-blur-sm border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${hcStyles.button}`}
          title={highContrast ? "Disable high contrast mode" : "Enable high contrast mode (no blue light)"}
          aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode for better visibility"}
          aria-pressed={highContrast}
        >
          <Eye size={22} className={highContrast ? "text-amber-400" : "text-muted-foreground"} aria-hidden="true" />
        </button>

        {/* Captions toggle */}
        <button
          onClick={toggleCaptions}
          className={`p-3 rounded-full backdrop-blur-sm border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${hcStyles.button}`}
          title={showCaptions ? "Hide captions" : "Show captions"}
          aria-label={showCaptions ? "Hide captions" : "Show captions"}
          aria-pressed={showCaptions}
        >
          {showCaptions ? (
            <Captions size={22} className={highContrast ? "text-amber-400" : "text-primary"} aria-hidden="true" />
          ) : (
            <CaptionsOff size={22} className="text-muted-foreground" aria-hidden="true" />
          )}
        </button>

        {/* Volume toggle */}
        {narrationStatus !== "error" && (
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full backdrop-blur-sm border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${hcStyles.button}`}
            title={isMuted ? "Enable audio narration" : "Mute audio narration"}
            aria-label={isMuted ? "Enable audio narration" : "Mute audio narration"}
            aria-pressed={!isMuted}
          >
            {isMuted ? (
              <VolumeX size={22} className="text-muted-foreground" aria-hidden="true" />
            ) : (
              <Volume2 size={22} className={highContrast ? "text-amber-400" : "text-foreground"} aria-hidden="true" />
            )}
          </button>
        )}

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className={`p-3 rounded-full backdrop-blur-sm border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${hcStyles.button}`}
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
    <div className={`mt-6 border rounded-xl p-6 ${hcStyles.transcript}`}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className={`text-lg font-bold ${highContrast ? "text-amber-100" : "text-foreground"}`}>
          📄 Full Transcript
        </h3>
        <div className="flex items-center gap-4">
          <p className={`text-sm ${highContrast ? "text-amber-300" : "text-muted-foreground"}`}>
            For users who prefer reading
          </p>
          {/* Speed presets */}
          <div className="flex gap-1" role="group" aria-label="Playback speed presets">
            {SPEED_OPTIONS.map(speed => (
              <button
                key={speed}
                onClick={() => setSpeed(speed)}
                className={`px-2 py-1 text-xs font-bold rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  playbackSpeed === speed 
                    ? highContrast 
                      ? "bg-amber-600 text-amber-50" 
                      : "bg-primary text-primary-foreground"
                    : highContrast
                      ? "bg-amber-900 text-amber-200 hover:bg-amber-800"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                aria-pressed={playbackSpeed === speed}
                aria-label={`Set playback speed to ${speed}x`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {CAPTIONS.map((caption, index) => (
          <div 
            key={index}
            className={`flex gap-4 p-3 rounded-lg transition-colors ${
              isPlaying && currentTime >= caption.start && currentTime < caption.end
                ? highContrast 
                  ? "bg-amber-800/50 border border-amber-500"
                  : "bg-primary/10 border border-primary/30"
                : highContrast
                  ? "bg-amber-900/30"
                  : "bg-background/50"
            }`}
          >
            <span className={`flex-shrink-0 w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center ${
              highContrast ? "bg-amber-700 text-amber-100" : "bg-primary/20 text-primary"
            }`}>
              {index + 1}
            </span>
            <p className={`text-base md:text-lg leading-relaxed ${highContrast ? "text-amber-50" : "text-foreground"}`}>
              {caption.text}
            </p>
          </div>
        ))}
      </div>

      {/* Keyboard shortcuts help */}
      <div className={`mt-6 pt-4 border-t ${highContrast ? "border-amber-700" : "border-border"}`}>
        <p className={`text-sm font-medium mb-2 ${highContrast ? "text-amber-300" : "text-muted-foreground"}`}>
          ⌨️ Keyboard Shortcuts
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className={`px-2 py-1 rounded border ${hcStyles.kbd}`}>
            <kbd className="font-mono font-bold">Space</kbd> Play/Pause
          </span>
          <span className={`px-2 py-1 rounded border ${hcStyles.kbd}`}>
            <kbd className="font-mono font-bold">C</kbd> Captions
          </span>
          <span className={`px-2 py-1 rounded border ${hcStyles.kbd}`}>
            <kbd className="font-mono font-bold">M</kbd> Mute
          </span>
          <span className={`px-2 py-1 rounded border ${hcStyles.kbd}`}>
            <kbd className="font-mono font-bold">F</kbd> Fullscreen
          </span>
          <span className={`px-2 py-1 rounded border ${hcStyles.kbd}`}>
            <kbd className="font-mono font-bold">H</kbd> High Contrast
          </span>
          <span className={`px-2 py-1 rounded border ${hcStyles.kbd}`}>
            <kbd className="font-mono font-bold">,</kbd> / <kbd className="font-mono font-bold">.</kbd> Speed
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

export default DemoVideo;
