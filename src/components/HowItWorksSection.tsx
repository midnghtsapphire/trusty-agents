import HowItWorksStep from "./HowItWorksStep";
import { Search, Settings, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Choose Your Agent",
    description: "Browse our marketplace of verified, industry-specific AI agents designed for your exact use case.",
    icon: <Search size={28} />,
  },
  {
    step: 2,
    title: "Configure & Customize",
    description: "Set your business hours, tone of voice, and workflows. Our team reviews every configuration.",
    icon: <Settings size={28} />,
  },
  {
    step: 3,
    title: "Deploy in Minutes",
    description: "Connect your phone system and go live. Your verified agent starts handling calls immediately.",
    icon: <Rocket size={28} />,
  },
  {
    step: 4,
    title: "Track & Optimize",
    description: "Monitor performance, review transcripts, and let our AI continuously improve based on results.",
    icon: <BarChart3 size={28} />,
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="glass-dark border-y border-white/10 py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full glass-card bg-sparkle/15 px-4 py-1.5 text-sm font-medium text-sparkle-foreground border border-sparkle/30">
            ✨ Simple Process
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Live in Less Than 24 Hours
          </h2>
          <p className="text-lg text-muted-foreground">
            No coding required. No months of setup. Just verified AI agents
            ready to work for your business.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
          
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="animate-fade-gentle"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <HowItWorksStep {...step} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
