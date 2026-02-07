import { Shield, Heart, Sparkles, Users, Target, Award } from "lucide-react";

const values = [
  {
    icon: <Shield size={28} />,
    title: "Verification First",
    description:
      "We reject more agents than we approve. Every PoofAgent is stress-tested against real scenarios before going live.",
  },
  {
    icon: <Heart size={28} />,
    title: "Human in the Loop",
    description:
      "AI should augment humans, not replace judgment. Our team reviews every agent and provides ongoing oversight.",
  },
  {
    icon: <Target size={28} />,
    title: "Results-Obsessed",
    description:
      "We measure success by your ROI, not our features. If you don't see results, we don't succeed.",
  },
  {
    icon: <Users size={28} />,
    title: "Small Business Champions",
    description:
      "Built by operators for operators. We understand missed calls because we've lived missed opportunities.",
  },
];

const stats = [
  { value: "2021", label: "Founded" },
  { value: "47", label: "Team Members" },
  { value: "$12M", label: "Seed Funding" },
  { value: "500+", label: "Happy Customers" },
];

const AboutSection = () => {
  return (
    <section id="about" className="glass-dark border-y border-white/10 py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full glass-card bg-magic/15 px-4 py-1.5 text-sm font-medium text-magic border border-magic/30">
            <Award size={16} />
            About PoofAgent
          </span>
          <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            We're Building the{" "}
            <span className="text-gradient">Trust Layer</span> for AI Agents
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            PoofAgent was born from frustration. We watched businesses lose thousands to
            missed calls, then get burned by AI solutions that hallucinated, failed, or
            just didn't work. We knew there had to be a better way—verified AI that
            businesses could actually trust.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl glass-card p-6 text-center shadow-card border border-white/10"
            >
              <p className="text-3xl font-extrabold text-gradient-gold md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <h3 className="mb-8 text-center text-2xl font-bold text-foreground">
            Our Core Values
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="rounded-xl glass-card p-6 shadow-card border border-white/10 transition-all duration-300 hover:shadow-card-hover"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-magic/20 to-sparkle/20 text-magic">
                  {value.icon}
                </div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">{value.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="rounded-2xl glass-card border border-magic/30 p-8 shadow-magic md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-magic to-sparkle shadow-magic">
              <Sparkles size={32} className="text-white" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              Our Mission
            </h3>
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              To make verified, trustworthy AI accessible to every business—so no
              entrepreneur ever loses a customer to a missed call or a bad bot again.
              ✨ <span className="font-semibold text-foreground">Poof!</span> Revenue
              recovered.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
