import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Agent {
  id: string;
  business_name: string;
  industry: string;
  agent_type: string;
  ai_phone_number: string | null;
  status: string;
  total_calls: number;
  revenue_recovered: number;
  created_at: string;
  greeting?: string | null;
  services?: string | null;
  business_hours?: string | null;
}

interface AgentEditDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentUpdated: () => void;
}

const industries = [
  "Plumbing", "HVAC", "Electrical", "Roofing", "Landscaping",
  "Cleaning", "Pest Control", "Auto Repair", "Real Estate", "Legal",
  "Medical", "Dental", "Veterinary", "Restaurant", "Retail", "Other"
];

const agentTypes = [
  "Receptionist", "Sales", "Support", "Booking", "Lead Qualifier"
];

const AgentEditDialog = ({ agent, open, onOpenChange, onAgentUpdated }: AgentEditDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    business_name: "",
    industry: "",
    agent_type: "",
    greeting: "",
    services: "",
    business_hours: "24/7",
  });

  // Update form when agent changes
  useEffect(() => {
    if (agent) {
      setFormData({
        business_name: agent.business_name,
        industry: agent.industry,
        agent_type: agent.agent_type,
        greeting: agent.greeting || "",
        services: agent.services || "",
        business_hours: agent.business_hours || "24/7",
      });
    }
  }, [agent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("agents")
        .update(formData)
        .eq("id", agent.id);

      if (error) throw error;

      toast({
        title: "Agent Updated",
        description: "Your agent settings have been saved.",
      });
      
      onAgentUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Agent</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="glass-card border-white/10"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger className="glass-card border-white/10">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent_type">Agent Type</Label>
              <Select
                value={formData.agent_type}
                onValueChange={(value) => setFormData({ ...formData, agent_type: value })}
              >
                <SelectTrigger className="glass-card border-white/10">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="greeting">Greeting Message</Label>
            <Textarea
              id="greeting"
              value={formData.greeting}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              placeholder="Hello! Thank you for calling..."
              className="glass-card border-white/10 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="services">Services Offered</Label>
            <Textarea
              id="services"
              value={formData.services}
              onChange={(e) => setFormData({ ...formData, services: e.target.value })}
              placeholder="List your main services..."
              className="glass-card border-white/10 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_hours">Business Hours</Label>
            <Input
              id="business_hours"
              value={formData.business_hours}
              onChange={(e) => setFormData({ ...formData, business_hours: e.target.value })}
              placeholder="e.g., Mon-Fri 9AM-5PM or 24/7"
              className="glass-card border-white/10"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="magic" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgentEditDialog;
