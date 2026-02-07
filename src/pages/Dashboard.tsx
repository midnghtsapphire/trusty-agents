import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Phone, Calendar, Users, TrendingUp, Clock, CheckCircle2, 
  PhoneIncoming, PhoneOutgoing, PhoneMissed, MessageSquare,
  DollarSign, BarChart3, Settings, Home, Sparkles, Play, Pause
} from "lucide-react";
import { Link } from "react-router-dom";
import BackgroundParticles from "@/components/BackgroundParticles";

// Mock data
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

const stats = [
  { label: "Total Calls Today", value: "47", change: "+12%", icon: Phone, color: "text-magic" },
  { label: "Appointments Booked", value: "12", change: "+8%", icon: Calendar, color: "text-sparkle" },
  { label: "Leads Captured", value: "23", change: "+15%", icon: Users, color: "text-magic" },
  { label: "Revenue Recovered", value: "$4,850", change: "+22%", icon: DollarSign, color: "text-sparkle" },
];

const Dashboard = () => {
  const [agentActive, setAgentActive] = useState(true);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-magic/20 text-magic border-magic/30",
      booked: "bg-sparkle/20 text-sparkle border-sparkle/30",
      emergency: "bg-destructive/20 text-destructive border-destructive/30",
      callback: "bg-muted text-muted-foreground border-border",
    };
    return styles[status] || styles.completed;
  };

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
            <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full ${agentActive ? "bg-sparkle animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-sm text-foreground/80">{agentActive ? "Agent Active" : "Agent Paused"}</span>
            </div>
            <Button
              variant={agentActive ? "ghost" : "magic"}
              size="sm"
              onClick={() => setAgentActive(!agentActive)}
            >
              {agentActive ? <Pause size={16} /> : <Play size={16} />}
              {agentActive ? "Pause" : "Resume"}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-12 container mx-auto px-4">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Agent Dashboard</h1>
          <p className="text-muted-foreground">Home Services Receptionist • Active 24/7</p>
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
            <Card className="glass-card border-sparkle/30 bg-sparkle/5">
              <CardContent className="p-4 text-center">
                <Phone className="mx-auto text-sparkle mb-2" size={24} />
                <p className="text-sm text-muted-foreground mb-1">Your AI Number</p>
                <p className="text-lg font-bold text-sparkle">+1 (555) 987-6543</p>
                <p className="text-xs text-muted-foreground mt-2">Forward calls or share with customers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
