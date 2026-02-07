import { ArrowRight, Zap, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrustBadge from "./TrustBadge";

interface AgentCardProps {
  industry: string;
  agentType: string;
  description: string;
  roiStats: string;
  timeSaved: string;
  icon: React.ReactNode;
  popular?: boolean;
}

const AgentCard = ({
  industry,
  agentType,
  description,
  roiStats,
  timeSaved,
  icon,
  popular = false,
}: AgentCardProps) => {
  return (
    <div
      className={`group relative rounded-2xl bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${
        popular ? "border-2 border-trust/30" : "border border-border"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-trust px-3 py-1 text-xs font-semibold text-trust-foreground">
            <Zap size={12} />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
          {icon}
        </div>
        <TrustBadge variant="verified" size="sm" />
      </div>

      <h3 className="mb-1 text-lg font-bold text-foreground">
        {industry} {agentType}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm">
          <DollarSign size={16} className="text-verified" />
          <span className="font-semibold text-verified">{roiStats}</span>
          <span className="text-muted-foreground">recovered</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Clock size={16} className="text-trust" />
          <span className="text-muted-foreground">{timeSaved}</span>
        </div>
      </div>

      <Button className="w-full group-hover:bg-trust group-hover:text-trust-foreground transition-colors" variant="glass">
        Deploy Agent
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        No credit card required • 14-day free trial
      </p>
    </div>
  );
};

export default AgentCard;
