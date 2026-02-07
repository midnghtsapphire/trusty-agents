import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import TrustBadge from "./TrustBadge";
import DemoVideo from "./DemoVideo";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background Effects - Warm purple/gold gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(280_60%_55%/0.1)_0%,transparent_50%)]" />
      <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-magic/10 blur-3xl" />
      <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-sparkle/10 blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          {/* Trust Badges */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 animate-fade-gentle">
            <TrustBadge variant="verified" />
            <TrustBadge variant="neurodivergent" />
            <TrustBadge variant="nobluelight" />
            <TrustBadge variant="green" />
            <TrustBadge variant="projectmgt" />
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground animate-fade-gentle md:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
            Stop Losing{" "}
            <span className="text-gradient">$126,000/Year</span>
            <br />
            to Missed Calls
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground animate-fade-gentle md:text-xl" style={{ animationDelay: "0.15s" }}>
            ✨ <strong className="text-foreground">Poof!</strong> Deploy verified AI agents that answer, qualify, and book appointments 24/7.
            No AI slop. No scams. Just{" "}
            <span className="font-semibold text-foreground">human-reviewed, magic-verified</span>{" "}
            automation that actually works.
          </p>

          {/* Demo Video */}
          <div className="mx-auto mb-10 max-w-3xl animate-fade-gentle" style={{ animationDelay: "0.2s" }}>
            <DemoVideo />
          </div>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 animate-fade-gentle sm:flex-row" style={{ animationDelay: "0.25s" }}>
            <Button variant="poof" size="xl" className="group w-full sm:w-auto">
              <Phone size={20} />
              Try a Live Demo
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Interactive Demo Card */}
          <div className="mx-auto max-w-md animate-fade-gentle" style={{ animationDelay: "0.3s" }}>
            <div className="rounded-2xl glass-card p-6 shadow-magic border border-white/10">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Sparkles size={20} className="text-sparkle" />
                <span className="text-sm font-medium text-muted-foreground">
                  Experience the magic yourself
                </span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Enter your phone number to receive a demo call from our AI agent
              </p>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-magic"
                />
                <Button variant="sparkle">
                  <Sparkles size={16} />
                  Call Me
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                ✨ We'll call you within 10 seconds. Standard rates apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
