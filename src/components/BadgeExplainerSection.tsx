import { Sparkles, Lock, Code2, TestTube2, Brain, Sun, Leaf } from "lucide-react";

const badges = [
  {
    icon: Sparkles,
    title: "Verified Agent",
    emoji: "✨",
    description: "Every AI agent is manually verified by our team before deployment. We test real-world scenarios to ensure your agent handles calls professionally.",
    color: "text-sparkle",
    bgColor: "bg-sparkle/10",
    borderColor: "border-sparkle/30",
  },
  {
    icon: Lock,
    title: "Security First",
    emoji: "🔒",
    description: "Enterprise-grade security with encrypted communications, secure data handling, and regular security audits. Your customer data stays protected.",
    color: "text-sparkle",
    bgColor: "bg-sparkle/10",
    borderColor: "border-sparkle/30",
  },
  {
    icon: Code2,
    title: "Code Reviewed",
    emoji: "👀",
    description: "All code undergoes thorough peer review before release. Multiple engineers inspect every change for quality, performance, and security.",
    color: "text-magic",
    bgColor: "bg-magic/10",
    borderColor: "border-magic/30",
  },
  {
    icon: TestTube2,
    title: "QA Tested",
    emoji: "✅",
    description: "Rigorous quality assurance testing including unit tests, integration tests, and end-to-end testing. We catch bugs before they reach you.",
    color: "text-[hsl(120_50%_65%)]",
    bgColor: "bg-[hsl(120_50%_35%/0.15)]",
    borderColor: "border-[hsl(120_50%_45%/0.4)]",
  },
  {
    icon: Brain,
    title: "Neurodivergent Friendly",
    emoji: "🧠",
    description: "Designed with ADHD, autism, and sensory sensitivities in mind. Reduced animations, clear layouts, and customizable interface options.",
    color: "text-magic",
    bgColor: "bg-magic/10",
    borderColor: "border-magic/30",
  },
  {
    icon: Sun,
    title: "No Blue Light",
    emoji: "☀️",
    description: "Warm amber and gold color palette eliminates harsh blue light. Easier on your eyes during late-night work sessions — no blue blockers needed.",
    color: "text-sparkle",
    bgColor: "bg-sparkle/10",
    borderColor: "border-sparkle/30",
  },
  {
    icon: Leaf,
    title: "Green Coding",
    emoji: "🌿",
    description: "Optimized for energy efficiency with minimal server calls, efficient algorithms, and sustainable cloud infrastructure. Better for the planet.",
    color: "text-[hsl(120_50%_65%)]",
    bgColor: "bg-[hsl(120_50%_35%/0.15)]",
    borderColor: "border-[hsl(120_50%_45%/0.4)]",
  },
];

const BadgeExplainerSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full glass-card bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
            Our Commitment
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            What Our Badges Mean
          </h2>
          <p className="text-lg text-muted-foreground">
            These aren't just labels — they're promises. Every badge represents real standards we uphold.
          </p>
        </div>

        {/* Badge Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {badges.map((badge, index) => (
            <div
              key={badge.title}
              className="glass-card rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20 hover:shadow-lg opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${badge.bgColor} ${badge.borderColor} border`}>
                  <badge.icon size={24} className={badge.color} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <span>{badge.emoji}</span>
                    <span>{badge.title}</span>
                  </h3>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Questions about our standards?{" "}
            <a href="#contact" className="font-medium text-magic hover:underline">
              Read our full quality policy →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default BadgeExplainerSection;