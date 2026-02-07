import { 
  Phone, PhoneIncoming, PhoneOff, Calendar, MessageSquare, 
  Clock, Shield, Zap, BarChart3, Bell, Users, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GlowingDivider from "./GlowingDivider";

const features = [
  {
    icon: PhoneIncoming,
    title: "Instant Answer on Ring 1",
    description: "Your AI agent picks up every call immediately—no voicemail, no hold music, no missed opportunities.",
    stat: "0 sec",
    statLabel: "Average wait time",
  },
  {
    icon: Clock,
    title: "24/7/365 Coverage",
    description: "Nights, weekends, holidays—your agent never sleeps. Capture leads while competitors send calls to voicemail.",
    stat: "100%",
    statLabel: "Uptime guarantee",
  },
  {
    icon: Users,
    title: "Unlimited Simultaneous Calls",
    description: "No busy signals ever. Handle 10 calls at once during peak hours without missing a single customer.",
    stat: "∞",
    statLabel: "Concurrent calls",
  },
  {
    icon: Calendar,
    title: "Automatic Scheduling",
    description: "Agent books directly into your calendar, sends confirmations, and handles rescheduling—all hands-free.",
    stat: "3 min",
    statLabel: "Avg booking time",
  },
  {
    icon: Shield,
    title: "Smart Escalation",
    description: "Emergencies get flagged and forwarded to you instantly. Set custom rules for priority situations.",
    stat: "<30s",
    statLabel: "Emergency transfer",
  },
  {
    icon: BarChart3,
    title: "Full Visibility",
    description: "Every call recorded, transcribed, and analyzed. See exactly what customers are asking for.",
    stat: "100%",
    statLabel: "Calls documented",
  },
];

const steps = [
  {
    step: "01",
    title: "Get Your AI Number",
    description: "We assign you a local or toll-free number, or you forward your existing line to our AI.",
    icon: Phone,
  },
  {
    step: "02",
    title: "Configure Your Agent",
    description: "Set your business hours, services, pricing, and custom greeting. Takes 5 minutes.",
    icon: MessageSquare,
  },
  {
    step: "03",
    title: "Connect Your Calendar",
    description: "Link Google Calendar, Outlook, or Calendly. Agent books appointments automatically.",
    icon: Calendar,
  },
  {
    step: "04",
    title: "Go Live",
    description: "Start receiving calls immediately. Monitor everything from your dashboard.",
    icon: Zap,
  },
];

const HowItWorksDetailedSection = () => {
  return (
    <section id="how-it-works-detailed" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full glass-card bg-magic/15 px-4 py-1.5 text-sm font-medium text-magic border border-magic/30">
            📞 Never Miss Another Call
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            How We Eliminate <span className="text-gradient">Missed Calls</span> Forever
          </h2>
          <p className="text-lg text-muted-foreground">
            The average service business loses $126,000/year to unanswered calls. 
            Our AI agents ensure every call is answered, every lead is captured, 
            and every appointment is booked—automatically.
          </p>
        </div>

        {/* The Problem */}
        <div className="glass-card border border-white/10 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PhoneOff className="text-destructive" size={24} />
                <span className="text-sm font-semibold text-destructive uppercase tracking-wide">The Problem</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Every Missed Call = Lost Revenue
              </h3>
              <ul className="space-y-3">
                {[
                  "85% of callers who reach voicemail don't leave a message",
                  "62% of missed calls go to your competitor",
                  "Average service call = $250-500 in revenue",
                  "Just 3 missed calls/day = $2,000+/week lost",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-destructive mt-1">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-dark rounded-xl p-6 border border-destructive/20">
              <div className="text-center">
                <p className="text-5xl font-bold text-destructive mb-2">$126K</p>
                <p className="text-muted-foreground">Average annual revenue lost to missed calls</p>
                <GlowingDivider variant="magic" className="my-4" />
                <p className="text-sm text-muted-foreground">
                  Based on industry data from 5,000+ service businesses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Solution - Feature Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle2 className="text-sparkle" size={24} />
              <span className="text-sm font-semibold text-sparkle uppercase tracking-wide">The Solution</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              AI-Powered Call Handling That Never Fails
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-card border border-white/10 rounded-2xl p-6 hover:border-magic/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-magic/20 to-sparkle/20 text-magic group-hover:shadow-[0_0_20px_hsl(280_60%_55%/0.3)] transition-shadow">
                    <feature.icon size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-sparkle">{feature.stat}</p>
                    <p className="text-xs text-muted-foreground">{feature.statLabel}</p>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Setup Steps */}
        <div className="glass-dark border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Go Live in Under 10 Minutes
            </h3>
            <p className="text-muted-foreground">No technical skills required. No contracts. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-magic/50 to-transparent" />
                )}
                
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass-card border border-white/10 bg-gradient-to-br from-magic/10 to-sparkle/10">
                      <step.icon className="text-magic" size={28} />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-magic to-sparkle text-xs font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="poof" size="xl" className="gap-2">
              <Phone size={20} />
              Start Your Free Trial
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              ✨ No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksDetailedSection;
