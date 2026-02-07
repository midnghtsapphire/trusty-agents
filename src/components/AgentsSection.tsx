import AgentCard from "./AgentCard";
import { Wrench, ShoppingBag, Stethoscope, Building2, Car, Utensils } from "lucide-react";

const agents = [
  {
    industry: "Home Services",
    agentType: "Receptionist",
    description: "Never miss a plumbing emergency again. Qualify leads, schedule appointments, and dispatch technicians automatically.",
    roiStats: "$18k/mo",
    timeSaved: "40hrs/week",
    icon: <Wrench size={24} />,
    popular: true,
  },
  {
    industry: "Dental Office",
    agentType: "Scheduler",
    description: "Handle appointment bookings, reminders, and rescheduling with HIPAA-compliant AI that patients trust.",
    roiStats: "$12k/mo",
    timeSaved: "32hrs/week",
    icon: <Stethoscope size={24} />,
  },
  {
    industry: "eCommerce",
    agentType: "Support Bot",
    description: "Resolve 80% of customer inquiries instantly. Track orders, process returns, and upsell intelligently.",
    roiStats: "$24k/mo",
    timeSaved: "60hrs/week",
    icon: <ShoppingBag size={24} />,
  },
  {
    industry: "Real Estate",
    agentType: "Lead Qualifier",
    description: "Pre-qualify buyers 24/7, schedule showings, and answer property questions in real-time.",
    roiStats: "$32k/mo",
    timeSaved: "50hrs/week",
    icon: <Building2 size={24} />,
  },
  {
    industry: "Auto Services",
    agentType: "Service Advisor",
    description: "Book service appointments, provide estimates, and follow up on maintenance schedules.",
    roiStats: "$15k/mo",
    timeSaved: "35hrs/week",
    icon: <Car size={24} />,
  },
  {
    industry: "Restaurant",
    agentType: "Reservation Agent",
    description: "Handle reservations, takeout orders, and answer menu questions around the clock.",
    roiStats: "$8k/mo",
    timeSaved: "28hrs/week",
    icon: <Utensils size={24} />,
  },
];

const AgentsSection = () => {
  return (
    <section id="agents" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full glass-card bg-magic/15 px-4 py-1.5 text-sm font-medium text-magic border border-magic/30">
            ✨ Agent Marketplace
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Verified Agents for Every Industry
          </h2>
          <p className="text-lg text-muted-foreground">
            Each agent is human-reviewed, stress-tested, and verified for accuracy.
            No generic bots. No AI slop. Just results.
          </p>
        </div>

        {/* Agent Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, index) => (
            <div
              key={agent.industry}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <AgentCard {...agent} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Don't see your industry?{" "}
            <a href="#contact" className="font-medium text-magic hover:underline">
              Request a custom agent →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
