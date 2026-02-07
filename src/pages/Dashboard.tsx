import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Phone, Calendar, Users, TrendingUp, Clock, CheckCircle2, 
  PhoneIncoming, PhoneOutgoing, PhoneMissed, MessageSquare,
  DollarSign, BarChart3, Settings, Home, Sparkles, Play, Pause, Plus, LogOut, User,
  Edit, Trash2, CreditCard, Crown
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundParticles from "@/components/BackgroundParticles";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AgentEditDialog from "@/components/AgentEditDialog";
import AgentDeleteDialog from "@/components/AgentDeleteDialog";
import CallMinutesDisplay from "@/components/CallMinutesDisplay";
import { PRICING_TIERS, getTierByProductId, PricingTier } from "@/lib/stripe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
}

// Mock data for calls
const recentCalls = [
  { id: 1, caller: "Mike Johnson", phone: "+1 (555) 234-5678", time: "2 mins ago", duration: "4:32", type: "inbound", status: "completed", summary: "Requested plumbing quote for bathroom renovation" },
  { id: 2, caller: "Sarah Williams", phone: "+1 (555) 345-6789", time: "15 mins ago", duration: "2:15", type: "inbound", status: "booked", summary: "Scheduled appointment for Thursday 2PM - leaky faucet" },
  { id: 3, caller: "Tom Davis", phone: "+1 (555) 456-7890", time: "1 hour ago", duration: "6:45", type: "inbound", status: "emergency", summary: "URGENT: Burst pipe in basement, dispatched technician" },
  { id: 4, caller: "Lisa Chen", phone: "+1 (555) 567-8901", time: "2 hours ago", duration: "3:20", type: "inbound", status: "completed", summary: "General inquiry about water heater installation" },
  { id: 5, caller: "James Brown", phone: "+1 (555) 678-9012", time: "3 hours ago", duration: "1:45", type: "inbound", status: "callback", summary: "Requested callback tomorrow morning for estimate" },
];

const upcomingAppointments = [
  { id: 1, customer: "Sarah Williams", service: "Faucet Repair", date: "Thu, Feb 8", time: "2:00 PM", phone: "+1 (555) 345-6789" },
  { id: 2, customer: "Robert Miller", service: "Water Heater Install", date: "Fri, Feb 9", time: "10:00 AM", phone: "+1 (555) 789-0123" },
  { id: 3, customer: "Emma Wilson", service: "Drain Cleaning", date: "Fri, Feb 9", time: "3:00 PM", phone: "+1 (555) 890-1234" },
];

const Dashboard = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [currentTier, setCurrentTier] = useState<PricingTier | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) return;

        const { data, error } = await supabase.functions.invoke("check-subscription", {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        });

        if (error) throw error;

        if (data?.subscribed && data?.product_id) {
          const tier = getTierByProductId(data.product_id);
          setCurrentTier(tier);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    checkSubscription();
  }, []);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setAgents(data || []);
      if (data && data.length > 0) {
        setSelectedAgent(data[0]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentStatus = async (agent: Agent) => {
    const newStatus = agent.status === "active" ? "paused" : "active";
    try {
      const { error } = await supabase
        .from("agents")
        .update({ status: newStatus })
        .eq("id", agent.id);

      if (error) throw error;
      
      setAgents(agents.map(a => a.id === agent.id ? { ...a, status: newStatus } : a));
      if (selectedAgent?.id === agent.id) {
        setSelectedAgent({ ...selectedAgent, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating agent status:", error);
    }
  };

  const stats = [
    { label: "Total Calls Today", value: "47", change: "+12%", icon: Phone, color: "text-magic" },
    { label: "Appointments Booked", value: "12", change: "+8%", icon: Calendar, color: "text-sparkle" },
    { label: "Leads Captured", value: "23", change: "+15%", icon: Users, color: "text-magic" },
    { label: "Revenue Recovered", value: "$4,850", change: "+22%", icon: DollarSign, color: "text-sparkle" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-magic/20 text-magic border-magic/30",
      booked: "bg-sparkle/20 text-sparkle border-sparkle/30",
      emergency: "bg-destructive/20 text-destructive border-destructive/30",
      callback: "bg-muted text-muted-foreground border-border",
    };
    return styles[status] || styles.completed;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundParticles />
        <div className="text-center">
          <Sparkles className="mx-auto text-magic animate-pulse mb-4" size={48} />
          <p className="text-muted-foreground">Loading your agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <BackgroundParticles />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-magic to-sparkle shadow-magic">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Poof<span className="text-gradient">Agent</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Subscription Badge */}
            <Link to="/pricing">
              {currentTier ? (
                <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border border-sparkle/30 bg-sparkle/10 hover:bg-sparkle/20 transition-colors cursor-pointer">
                  <Crown size={14} className="text-sparkle" />
                  <span className="text-sm font-medium text-sparkle">{PRICING_TIERS[currentTier].name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border border-white/10 hover:border-magic/30 transition-colors cursor-pointer">
                  <Sparkles size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Free Plan</span>
                </div>
              )}
            </Link>

            {selectedAgent && (
              <>
                <div className="hidden md:flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border border-white/10">
                  <div className={`w-2 h-2 rounded-full ${selectedAgent.status === "active" ? "bg-sparkle animate-pulse" : "bg-muted-foreground"}`} />
                  <span className="text-sm text-foreground/80">{selectedAgent.status === "active" ? "Agent Active" : "Agent Paused"}</span>
                </div>
                <Button
                  variant={selectedAgent.status === "active" ? "ghost" : "magic"}
                  size="sm"
                  onClick={() => toggleAgentStatus(selectedAgent)}
                >
                  {selectedAgent.status === "active" ? <Pause size={16} /> : <Play size={16} />}
                  <span className="hidden sm:inline ml-1">{selectedAgent.status === "active" ? "Pause" : "Resume"}</span>
                </Button>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-magic/20 text-magic text-sm">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card border-white/20">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {user?.user_metadata?.full_name || "Account"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings size={16} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-12 container mx-auto px-4">
        {/* Agents List */}
        {agents.length > 0 ? (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Agent Dashboard</h1>
                <p className="text-muted-foreground">
                  {selectedAgent?.industry} {selectedAgent?.agent_type} • {selectedAgent?.status === "active" ? "Active 24/7" : "Paused"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Call Minutes Display */}
                <CallMinutesDisplay currentTier={currentTier} />
                
                {/* Agent Slots Progress Display */}
                <div className="glass-card px-4 py-3 rounded-xl border border-white/10 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-magic" />
                      <span className="text-sm text-muted-foreground">Agent Slots</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {agents.length} / {currentTier ? PRICING_TIERS[currentTier].agentLimit : 1}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  {(() => {
                    const limit = currentTier ? PRICING_TIERS[currentTier].agentLimit : 1;
                    const usage = agents.length / limit;
                    const getColorClass = () => {
                      if (usage >= 1) return "bg-destructive";
                      if (usage >= 0.75) return "bg-[hsl(45_93%_47%)]";
                      return "bg-sparkle";
                    };
                    const getGlowClass = () => {
                      if (usage >= 1) return "shadow-[0_0_10px_hsl(0_62%_50%/0.5)]";
                      if (usage >= 0.75) return "shadow-[0_0_10px_hsl(45_93%_47%/0.5)]";
                      return "shadow-[0_0_10px_hsl(40_95%_55%/0.5)]";
                    };
                    return (
                      <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${getColorClass()} ${getGlowClass()}`}
                          style={{ width: `${Math.min(usage * 100, 100)}%` }}
                        />
                      </div>
                    );
                  })()}
                  {/* Status Message */}
                  {(() => {
                    const limit = currentTier ? PRICING_TIERS[currentTier].agentLimit : 1;
                    const remaining = limit - agents.length;
                    if (remaining <= 0) {
                      return (
                        <Link to="/pricing" className="block">
                          <p className="text-xs text-destructive mt-2 hover:underline cursor-pointer">
                            ⚠️ Limit reached — Upgrade for more
                          </p>
                        </Link>
                      );
                    }
                    if (remaining === 1) {
                      return <p className="text-xs text-[hsl(45_93%_47%)] mt-2">⚡ 1 slot remaining</p>;
                    }
                    return <p className="text-xs text-sparkle/70 mt-2">✨ {remaining} slots available</p>;
                  })()}
                </div>
                <Link to="/#agents">
                  <Button 
                    variant="magic" 
                    className="gap-2"
                    disabled={currentTier ? agents.length >= PRICING_TIERS[currentTier].agentLimit : agents.length >= 1}
                  >
                    <Plus size={16} />
                    Deploy New Agent
                  </Button>
                </Link>
              </div>
              </div>

              {/* Agent Tabs */}
              {agents.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl glass-card border transition-all whitespace-nowrap ${
                        selectedAgent?.id === agent.id 
                          ? "border-magic/50 shadow-[0_0_20px_hsl(280_60%_55%/0.3)]" 
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${agent.status === "active" ? "bg-sparkle" : "bg-muted-foreground"}`} />
                      <span className="text-sm font-medium text-foreground">{agent.business_name}</span>
                      <span className="text-xs text-muted-foreground">({agent.industry})</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Agent Actions Bar */}
              {selectedAgent && (
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      setAgentToEdit(selectedAgent);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit size={14} />
                    Edit Agent
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      setAgentToDelete(selectedAgent);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                  <Link to="/pricing">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <CreditCard size={14} />
                      Manage Subscription
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat) => (
                <Card key={stat.label} className="glass-card border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`${stat.color}`} size={20} />
                      <span className="text-xs text-sparkle font-medium">{stat.change}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Calls */}
              <div className="lg:col-span-2">
                <Card className="glass-card border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <PhoneIncoming size={18} className="text-magic" />
                      Recent Calls
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-3">
                        {recentCalls.map((call) => (
                          <div 
                            key={call.id} 
                            className="glass-card border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-foreground">{call.caller}</p>
                                <p className="text-sm text-muted-foreground">{call.phone}</p>
                              </div>
                              <div className="text-right">
                                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(call.status)}`}>
                                  {call.status}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-foreground/80 mb-2">{call.summary}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {call.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={12} />
                                {call.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Appointments */}
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Calendar size={18} className="text-sparkle" />
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingAppointments.map((apt) => (
                        <div 
                          key={apt.id} 
                          className="glass-card border border-white/5 rounded-xl p-3"
                        >
                          <p className="font-medium text-foreground text-sm">{apt.customer}</p>
                          <p className="text-xs text-muted-foreground mb-2">{apt.service}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-sparkle font-medium">{apt.date}</span>
                            <span className="text-muted-foreground">{apt.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <BarChart3 size={18} className="text-magic" />
                      This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PhoneIncoming size={16} className="text-magic" />
                        <span className="text-sm text-muted-foreground">Calls Answered</span>
                      </div>
                      <span className="font-semibold text-foreground">234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PhoneMissed size={16} className="text-destructive" />
                        <span className="text-sm text-muted-foreground">Missed (Before AI)</span>
                      </div>
                      <span className="font-semibold text-foreground line-through text-muted-foreground">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-sparkle" />
                        <span className="text-sm text-muted-foreground">Appointments Set</span>
                      </div>
                      <span className="font-semibold text-foreground">56</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-sparkle" />
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      </div>
                      <span className="font-semibold text-sparkle">24%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Number */}
                {selectedAgent?.ai_phone_number && (
                  <Card className="glass-card border-sparkle/30 bg-sparkle/5">
                    <CardContent className="p-4 text-center">
                      <Phone className="mx-auto text-sparkle mb-2" size={24} />
                      <p className="text-sm text-muted-foreground mb-1">Your AI Number</p>
                      <p className="text-lg font-bold text-sparkle">{selectedAgent.ai_phone_number}</p>
                      <p className="text-xs text-muted-foreground mt-2">Forward calls or share with customers</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-magic/30 to-sparkle/30 mb-6">
              <Sparkles className="text-sparkle" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Agents Deployed Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Deploy your first AI agent to start handling calls 24/7, capturing leads, and never missing a customer again.
            </p>
            <Link to="/#agents">
              <Button variant="magic" size="lg" className="gap-2">
                <Plus size={18} />
                Deploy Your First Agent
              </Button>
            </Link>
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      <AgentEditDialog
        agent={agentToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onAgentUpdated={fetchAgents}
      />

      {/* Delete Dialog */}
      <AgentDeleteDialog
        agent={agentToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onAgentDeleted={fetchAgents}
      />
    </div>
  );
};

export default Dashboard;