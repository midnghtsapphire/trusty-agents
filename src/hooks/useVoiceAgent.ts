import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { toast } from "@/hooks/use-toast";

export type VoiceAgentStatus = "disconnected" | "connecting" | "connected" | "error";

export function useVoiceAgent() {
  const [status, setStatus] = useState<VoiceAgentStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Array<{ role: "user" | "agent"; text: string }>>([]);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      setStatus("connected");
      setError(null);
      toast({
        title: "Voice connected",
        description: "You can now speak with the agent",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
      setStatus("disconnected");
    },
    onMessage: (message) => {
      console.log("Agent message:", message);
      
      // Handle different message types - cast through unknown for flexible message handling
      const msg = message as unknown as Record<string, unknown>;
      
      if (msg.type === "user_transcript") {
        const userEvent = msg.user_transcription_event as Record<string, unknown> | undefined;
        const userText = userEvent?.user_transcript as string | undefined;
        if (userText) {
          setTranscripts(prev => [...prev, { role: "user", text: userText }]);
        }
      } else if (msg.type === "agent_response") {
        const agentEvent = msg.agent_response_event as Record<string, unknown> | undefined;
        const agentText = agentEvent?.agent_response as string | undefined;
        if (agentText) {
          setTranscripts(prev => [...prev, { role: "agent", text: agentText }]);
        }
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      setError(error.message || "Connection error");
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Voice connection error",
        description: error.message || "Failed to connect to voice agent",
      });
    },
  });

  const startConversation = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    setTranscripts([]);

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to get token: ${response.status}`);
      }

      const data = await response.json();

      if (!data.token) {
        throw new Error("No token received from server");
      }

      // Start the conversation with WebRTC
      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (err) {
      console.error("Failed to start conversation:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to start voice chat";
      setError(errorMessage);
      setStatus("error");
      
      if (errorMessage.includes("Permission denied") || errorMessage.includes("NotAllowedError")) {
        toast({
          variant: "destructive",
          title: "Microphone access required",
          description: "Please enable microphone access to use voice chat",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: errorMessage,
        });
      }
    }
  }, [conversation]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
    setStatus("disconnected");
  }, [conversation]);

  return {
    status,
    error,
    transcripts,
    isSpeaking: conversation.isSpeaking,
    startConversation,
    endConversation,
    setVolume: conversation.setVolume,
    getInputVolume: conversation.getInputVolume,
    getOutputVolume: conversation.getOutputVolume,
  };
}
