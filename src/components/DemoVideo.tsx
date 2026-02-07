import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import demoVideo from "@/assets/demo-video.mp4";

const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-sparkle/30 shadow-magic group">
      <video
        ref={videoRef}
        src={demoVideo}
        className="w-full aspect-video object-cover"
        loop
        muted={isMuted}
        playsInline
        onEnded={() => setIsPlaying(false)}
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
          ${isPlaying ? 'opacity-0 group-hover/btn:opacity-100' : 'opacity-100'}
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
        >
          {isMuted ? (
            <VolumeX size={18} className="text-muted-foreground" />
          ) : (
            <Volume2 size={18} className="text-sparkle" />
          )}
        </button>
      </div>
      
      {/* Badge */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-magic/90 backdrop-blur-sm">
        <span className="text-xs font-medium text-white">See it in action</span>
      </div>
    </div>
  );
};

export default DemoVideo;
