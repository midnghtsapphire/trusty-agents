import StatsCard from "./StatsCard";

const StatsSection = () => {
  return (
    <section className="border-y border-border/50 bg-secondary/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <StatsCard
            value="98%"
            label="Accuracy Rate"
            sublabel="Human-verified performance"
          />
          <StatsCard
            value="$2.4M"
            label="Revenue Recovered"
            sublabel="For our clients this month"
          />
          <StatsCard
            value="847"
            label="Active Agents"
            sublabel="Deployed across industries"
          />
          <StatsCard
            value="<3s"
            label="Response Time"
            sublabel="Average call pickup"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
