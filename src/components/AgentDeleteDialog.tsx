import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Agent {
  id: string;
  business_name: string;
}

interface AgentDeleteDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentDeleted: () => void;
}

const AgentDeleteDialog = ({ agent, open, onOpenChange, onAgentDeleted }: AgentDeleteDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!agent) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("agents")
        .delete()
        .eq("id", agent.id);

      if (error) throw error;

      toast({
        title: "Agent Deleted",
        description: `${agent.business_name} has been removed.`,
      });
      
      onAgentDeleted();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card border-white/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Delete Agent</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{agent?.business_name}</strong>? 
            This action cannot be undone. All call history and settings will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="glass-card border-white/10">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            Delete Agent
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AgentDeleteDialog;
