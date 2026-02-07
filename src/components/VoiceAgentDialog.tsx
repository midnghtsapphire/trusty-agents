import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Phone, PhoneOff, Volume2, Bot, User, Loader2 } from "lucide-react";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { cn } from "@/lib/utils";

interface VoiceAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industry: string;
  agentType: string;
  icon: React.ReactNode;
}

const VoiceAgentDialog = ({ open, onOpenChange, industry, agentType, icon }: VoiceAgentDialogProps) => {
  const {
    status,
    error,
    transcripts,
    isSpeaking,
    startConversation,
    endConversation,
  } = useVoiceAgent();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcripts arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  // End conversation when dialog closes
  useEffect(() => {
    if (!open && status === "connected") {
      endConversation();
    }
  }, [open, status, endConversation]);

  const handleToggleCall = () => {
    if (status === "connected") {
      endConversation();
    } else if (status !== "connecting") {
      startConversation();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-intense border-white/20 max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <DialogTitle className="flex items-center gap-3 text-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-magic/30 to-sparkle/30 text-magic">
              {icon}
            </div>
            <div className="flex-1">
              <span className="text-lg font-bold">{industry} {agentType}</span>
              <p className="text-sm text-muted-foreground font-normal">Voice Agent Demo</p>
            </div>
            
            {/* Status indicator */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
              status === "connected" && "bg-green-500/20 text-green-400",
              status === "connecting" && "bg-yellow-500/20 text-yellow-400",
              status === "disconnected" && "bg-muted text-muted-foreground",
              status === "error" && "bg-destructive/20 text-destructive",
            )}>
              <span className={cn(
                "w-2 h-2 rounded-full",
                status === "connected" && "bg-green-400 animate-pulse",
                status === "connecting" && "bg-yellow-400 animate-pulse",
                status === "disconnected" && "bg-muted-foreground",
                status === "error" && "bg-destructive",
              )} />
              {status === "connected" && "Live"}
              {status === "connecting" && "Connecting..."}
              {status === "disconnected" && "Ready"}
              {status === "error" && "Error"}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Transcript area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {status === "disconnected" && transcripts.length === 0 && (
              <div className="text-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-magic/20 to-sparkle/20 mx-auto mb-4">
                  <Mic className="text-magic" size={36} />
                </div>
                <p className="text-muted-foreground mb-2 text-lg">
                  Ready to talk with your {industry} agent
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Click the call button below to start a voice conversation
                </p>
              </div>
            )}

            {transcripts.map((transcript, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3",
                  transcript.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {transcript.role === "agent" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-magic/30 to-sparkle/30 text-magic">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    transcript.role === "user"
                      ? "bg-magic text-magic-foreground"
                      : "glass-card border border-white/10"
                  )}
                >
                  <p className="text-sm">{transcript.text}</p>
                </div>
                {transcript.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-magic/30 text-magic">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {/* Speaking indicator */}
            {status === "connected" && isSpeaking && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-magic/30 to-sparkle/30 text-magic">
                  <Volume2 size={16} className="animate-pulse" />
                </div>
                <div className="glass-card border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Agent is speaking</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-magic rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-magic rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-magic rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-4">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Call controls */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              className={cn(
                "w-16 h-16 rounded-full transition-all duration-300",
                status === "connected" 
                  ? "bg-destructive hover:bg-destructive/90" 
                  : "bg-green-500 hover:bg-green-600",
                status === "connecting" && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleToggleCall}
              disabled={status === "connecting"}
            >
              {status === "connecting" ? (
                <Loader2 size={28} className="animate-spin" />
              ) : status === "connected" ? (
                <PhoneOff size={28} />
              ) : (
                <Phone size={28} />
              )}
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            {status === "connected" 
              ? "Speak clearly into your microphone" 
              : status === "connecting"
              ? "Establishing connection..."
              : "Microphone access required"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceAgentDialog;
