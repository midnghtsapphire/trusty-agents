import { Sparkles, CheckCircle2, Shield, Brain, Sun, Leaf, FolderKanban, Lock, Code2, TestTube2 } from "lucide-react";

interface TrustBadgeProps {
  variant?: "verified" | "reviewed" | "secure" | "neurodivergent" | "nobluelight" | "green" | "projectmgt" | "security" | "codereview" | "qa";
  size?: "sm" | "md" | "lg";
}

const TrustBadge = ({ variant = "verified", size = "md" }: TrustBadgeProps) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-1.5",
    lg: "text-base px-4 py-2 gap-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const variants = {
    verified: {
      icon: Sparkles,
      label: "✨ Verified Agent",
      className: "bg-sparkle/20 text-sparkle border-sparkle/40 hover:bg-sparkle/30 hover:shadow-[0_0_20px_hsl(40_95%_55%/0.4)] hover:border-sparkle/60",
    },
    reviewed: {
      icon: CheckCircle2,
      label: "Human Reviewed",
      className: "bg-magic/20 text-magic border-magic/40 hover:bg-magic/30 hover:shadow-[0_0_20px_hsl(280_60%_55%/0.4)] hover:border-magic/60",
    },
    secure: {
      icon: Shield,
      label: "Wish Protected",
      className: "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25 hover:shadow-[0_0_20px_hsl(45_100%_96%/0.3)] hover:border-primary/50",
    },
    neurodivergent: {
      icon: Brain,
      label: "🧠 Neurodivergent Friendly",
      className: "bg-magic/20 text-magic border-magic/40 hover:bg-magic/30 hover:shadow-[0_0_20px_hsl(280_60%_55%/0.4)] hover:border-magic/60",
    },
    nobluelight: {
      icon: Sun,
      label: "☀️ No Blue Light",
      className: "bg-sparkle/20 text-sparkle border-sparkle/40 hover:bg-sparkle/30 hover:shadow-[0_0_20px_hsl(40_95%_55%/0.4)] hover:border-sparkle/60",
    },
    green: {
      icon: Leaf,
      label: "🌿 Green Coding",
      className: "bg-[hsl(120_50%_35%/0.25)] text-[hsl(120_50%_65%)] border-[hsl(120_50%_45%/0.5)] hover:bg-[hsl(120_50%_35%/0.35)] hover:shadow-[0_0_20px_hsl(120_50%_45%/0.4)] hover:border-[hsl(120_50%_55%/0.7)]",
    },
    projectmgt: {
      icon: FolderKanban,
      label: "📋 Project Management",
      className: "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25 hover:shadow-[0_0_20px_hsl(45_100%_96%/0.3)] hover:border-primary/50",
    },
    security: {
      icon: Lock,
      label: "🔒 Security First",
      className: "bg-sparkle/20 text-sparkle border-sparkle/40 hover:bg-sparkle/30 hover:shadow-[0_0_20px_hsl(40_95%_55%/0.4)] hover:border-sparkle/60",
    },
    codereview: {
      icon: Code2,
      label: "👀 Code Reviewed",
      className: "bg-magic/20 text-magic border-magic/40 hover:bg-magic/30 hover:shadow-[0_0_20px_hsl(280_60%_55%/0.4)] hover:border-magic/60",
    },
    qa: {
      icon: TestTube2,
      label: "✅ QA Tested",
      className: "bg-[hsl(120_50%_35%/0.25)] text-[hsl(120_50%_65%)] border-[hsl(120_50%_45%/0.5)] hover:bg-[hsl(120_50%_35%/0.35)] hover:shadow-[0_0_20px_hsl(120_50%_45%/0.4)] hover:border-[hsl(120_50%_55%/0.7)]",
    },
  };

  const { icon: Icon, label, className } = variants[variant];

  return (
    <div
      className={`inline-flex items-center rounded-full border font-medium backdrop-blur-md transition-all duration-300 cursor-default ${sizeClasses[size]} ${className}`}
    >
      <Icon size={iconSizes[size]} className="flex-shrink-0" />
      <span>{label}</span>
    </div>
  );
};

export default TrustBadge;
