import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Bot, User, RotateCcw, AlertCircle } from "lucide-react";
import { useAgentChat } from "@/hooks/useAgentChat";
import ReactMarkdown from "react-markdown";

interface AgentChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  industry: string;
  agentType: string;
  icon: React.ReactNode;
}

const AgentChatDialog = ({ open, onOpenChange, industry, agentType, icon }: AgentChatDialogProps) => {
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage, resetChat } = useAgentChat(industry);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
            <div>
              <span className="text-lg font-bold">{industry} {agentType}</span>
              <p className="text-sm text-muted-foreground font-normal">AI Agent Demo</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={resetChat}
              title="Reset conversation"
            >
              <RotateCcw size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-magic/20 to-sparkle/20 mx-auto mb-4">
                  <Sparkles className="text-magic" size={28} />
                </div>
                <p className="text-muted-foreground mb-2">
                  Start a conversation with your {industry} {agentType}
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Try: "Hi, I need help with..."
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-magic/30 to-sparkle/30 text-magic">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-magic text-magic-foreground"
                      : "glass-card border border-white/10"
                  }`}
                >
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-magic/30 text-magic">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-magic/30 to-sparkle/30 text-magic">
                  <Bot size={16} />
                </div>
                <div className="glass-card border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-magic rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-magic rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-magic rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg p-3">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="glass-card border-white/10 focus:border-magic/50"
              disabled={isLoading}
            />
            <Button
              variant="magic"
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentChatDialog;
