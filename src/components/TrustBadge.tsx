import { Shield, CheckCircle2, BadgeCheck } from "lucide-react";

interface TrustBadgeProps {
  variant?: "verified" | "reviewed" | "secure";
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
      icon: BadgeCheck,
      label: "Verified Agent",
      className: "bg-verified/10 text-verified border-verified/20",
    },
    reviewed: {
      icon: CheckCircle2,
      label: "Human Reviewed",
      className: "bg-trust/10 text-trust border-trust/20",
    },
    secure: {
      icon: Shield,
      label: "Enterprise Secure",
      className: "bg-primary/10 text-primary border-primary/20",
    },
  };

  const { icon: Icon, label, className } = variants[variant];

  return (
    <div
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} ${className}`}
    >
      <Icon size={iconSizes[size]} className="flex-shrink-0" />
      <span>{label}</span>
    </div>
  );
};

export default TrustBadge;
