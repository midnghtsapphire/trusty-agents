import { Sparkles, Lock, Code2, TestTube2, Brain, Sun, Leaf, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const badges = [
  {
    icon: Sparkles,
    title: "Verified Agent",
    emoji: "✨",
    description: "Every AI agent is manually verified by our team before deployment. We test real-world scenarios to ensure your agent handles calls professionally.",
    expandedDetails: [
      "Multi-step verification process with human oversight",
      "Real-world call scenario testing before going live",
      "Continuous monitoring after deployment",
      "Regular re-verification to maintain quality standards",
    ],
    color: "text-sparkle",
    bgColor: "bg-sparkle/10",
    borderColor: "border-sparkle/30",
  },
  {
    icon: Lock,
    title: "Security First",
    emoji: "🔒",
    description: "Enterprise-grade security with encrypted communications, secure data handling, and regular security audits. Your customer data stays protected.",
    expandedDetails: [
      "End-to-end encryption for all voice communications",
      "SOC 2 Type II compliant infrastructure",
      "GDPR and CCPA data privacy compliance",
      "Regular third-party penetration testing",
    ],
    color: "text-sparkle",
    bgColor: "bg-sparkle/10",
    borderColor: "border-sparkle/30",
  },
  {
    icon: Code2,
    title: "Code Reviewed",
    emoji: "👀",
    description: "All code undergoes thorough peer review before release. Multiple engineers inspect every change for quality, performance, and security.",
    expandedDetails: [
      "Minimum two-engineer approval for all changes",
      "Automated static analysis and linting",
      "Performance benchmarking on every commit",
      "Security-focused code review checklist",
    ],
    color: "text-magic",
    bgColor: "bg-magic/10",
    borderColor: "border-magic/30",
  },
  {
    icon: TestTube2,
    title: "QA Tested",
    emoji: "✅",
    description: "Rigorous quality assurance testing including unit tests, integration tests, and end-to-end testing. We catch bugs before they reach you.",
    expandedDetails: [
      "95%+ code coverage with automated tests",
      "End-to-end testing in staging environments",
      "Load testing to ensure reliability at scale",
      "Regression testing before every release",
    ],
    color: "text-[hsl(120_50%_65%)]",
    bgColor: "bg-[hsl(120_50%_35%/0.15)]",
    borderColor: "border-[hsl(120_50%_45%/0.4)]",
  },
  {
    icon: Brain,
    title: "Neurodivergent Friendly",
    emoji: "🧠",
    description: "Designed with ADHD, autism, and sensory sensitivities in mind. Reduced animations, clear layouts, and customizable interface options.",
    expandedDetails: [
      "Optional reduced motion mode",
      "High contrast and dyslexia-friendly fonts",
      "Clear visual hierarchy and predictable navigation",
      "No sudden audio or visual interruptions",
    ],
    color: "text-magic",
    bgColor: "bg-magic/10",
    borderColor: "border-magic/30",
  },
  {
    icon: Sun,
    title: "No Blue Light",
    emoji: "☀️",
    description: "Warm amber and gold color palette eliminates harsh blue light. Easier on your eyes during late-night work sessions — no blue blockers needed.",
    expandedDetails: [
      "Color temperature optimized for eye comfort",
      "Dark mode with warm undertones",
      "Reduced eye strain during extended use",
      "Scientifically-informed color choices",
    ],
    color: "text-sparkle",
    bgColor: "bg-sparkle/10",
    borderColor: "border-sparkle/30",
  },
  {
    icon: Leaf,
    title: "Green Coding",
    emoji: "🌿",
    description: "Optimized for energy efficiency with minimal server calls, efficient algorithms, and sustainable cloud infrastructure. Better for the planet.",
    expandedDetails: [
      "Carbon-neutral cloud hosting partners",
      "Optimized code to reduce compute cycles",
      "Efficient caching to minimize data transfer",
      "Sustainable development practices",
    ],
    color: "text-[hsl(120_50%_65%)]",
    bgColor: "bg-[hsl(120_50%_35%/0.15)]",
    borderColor: "border-[hsl(120_50%_45%/0.4)]",
  },
];

const BadgeExplainerSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
            These aren't just labels — they're promises. Click any badge to learn more.
          </p>
        </div>

        {/* Badge Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {badges.map((badge, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={badge.title}
                onClick={() => toggleExpand(index)}
                className={cn(
                  "glass-card rounded-2xl border border-white/10 p-6 transition-all duration-300 cursor-pointer opacity-0 animate-fade-in-up",
                  isExpanded 
                    ? "border-white/30 shadow-lg ring-1 ring-white/10" 
                    : "hover:border-white/20 hover:shadow-lg"
                )}
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                {/* Icon & Title */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
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
                  <ChevronDown 
                    size={20} 
                    className={cn(
                      "text-muted-foreground transition-transform duration-300 flex-shrink-0",
                      isExpanded && "rotate-180"
                    )} 
                  />
                </div>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {badge.description}
                </p>

                {/* Expanded Details */}
                <div 
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className={`border-t ${badge.borderColor} pt-4`}>
                      <ul className="space-y-2">
                        {badge.expandedDetails.map((detail, detailIndex) => (
                          <li 
                            key={detailIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className={`${badge.color} mt-1`}>•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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