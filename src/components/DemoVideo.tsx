import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import demoVideo from "@/assets/demo-video.mp4";

const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      await video.play();
      setIsPlaying(true);
      setShowPlayButton(false);
      setIsMuted(false);
    } catch (error) {
      // Autoplay with sound blocked, try muted
      video.muted = true;
      try {
        await video.play();
        setIsPlaying(true);
        setShowPlayButton(false);
        setIsMuted(true);
      } catch {
        setShowPlayButton(true);
      }
    }
  };

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      await handlePlay();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-sparkle/30 shadow-magic group">
      <video
        ref={videoRef}
        src={demoVideo}
        className="w-full aspect-video object-cover"
        loop
        playsInline
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center group/btn"
      >
        <div className={`
          w-20 h-20 rounded-full bg-magic/90 flex items-center justify-center
          shadow-magic transition-all duration-300
          ${isPlaying && !showPlayButton ? 'opacity-0 group-hover/btn:opacity-100' : 'opacity-100'}
          hover:scale-110 hover:bg-magic
        `}>
          {isPlaying ? (
            <Pause size={32} className="text-white" />
          ) : (
            <Play size={32} className="text-white ml-1" />
          )}
        </div>
      </button>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-sparkle/20 
                     hover:bg-background transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX size={18} className="text-muted-foreground" />
          ) : (
            <Volume2 size={18} className="text-sparkle" />
          )}
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-sparkle/20 
                     hover:bg-background transition-colors"
          title="Fullscreen"
        >
          <Maximize2 size={18} className="text-muted-foreground" />
        </button>
      </div>
      
      {/* Badge */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-magic/90 backdrop-blur-sm">
        <span className="text-xs font-medium text-white">See it in action</span>
      </div>
      
      {/* Audio hint when muted */}
      {isPlaying && isMuted && (
        <button 
          onClick={toggleMute}
          className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sparkle/90 backdrop-blur-sm animate-pulse"
        >
          <span className="text-xs font-medium text-white">🔊 Tap for sound</span>
        </button>
      )}
    </div>
  );
};

export default DemoVideo;
