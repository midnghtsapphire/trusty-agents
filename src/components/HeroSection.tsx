import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Play, ShieldCheck } from "lucide-react";
import TrustBadge from "./TrustBadge";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--trust)/0.08)_0%,transparent_50%)]" />
      <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-trust/5 blur-3xl" />
      <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-verified/5 blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Trust Badges */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <TrustBadge variant="verified" />
            <TrustBadge variant="reviewed" />
            <TrustBadge variant="secure" />
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground opacity-0 animate-fade-in-up md:text-6xl lg:text-7xl" style={{ animationDelay: "0.2s" }}>
            Stop Losing{" "}
            <span className="text-gradient">$126,000/Year</span>
            <br />
            to Missed Calls
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground opacity-0 animate-fade-in-up md:text-xl" style={{ animationDelay: "0.3s" }}>
            Deploy verified AI agents that answer, qualify, and book appointments 24/7.
            No AI slop. No scams. Just{" "}
            <span className="font-semibold text-foreground">human-reviewed, trust-verified</span>{" "}
            automation that actually works.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 opacity-0 animate-fade-in-up sm:flex-row" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" className="group w-full sm:w-auto">
              <Phone size={20} />
              Try a Live Demo
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
              <Play size={18} />
              Watch How It Works
            </Button>
          </div>

          {/* Interactive Demo Card */}
          <div className="mx-auto max-w-md opacity-0 animate-scale-in" style={{ animationDelay: "0.5s" }}>
            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-lg backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-center gap-2">
                <ShieldCheck size={20} className="text-verified" />
                <span className="text-sm font-medium text-muted-foreground">
                  Experience it yourself
                </span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Enter your phone number to receive a demo call from our AI agent
              </p>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-trust"
                />
                <Button variant="verified">
                  Call Me
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                We'll call you within 10 seconds. Standard rates apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
