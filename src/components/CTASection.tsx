import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock, Headphones } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--trust)/0.2)_0%,transparent_60%)]" />
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-trust/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-verified/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-5xl">
              Ready to Stop Losing Revenue?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              Join 500+ businesses that trust AgentVerified to handle their calls.
              No contracts. No setup fees. Just results.
            </p>

            {/* Benefits */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <ShieldCheck size={20} className="text-verified" />
                <span className="text-sm font-medium">Verified Agents</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Clock size={20} className="text-trust" />
                <span className="text-sm font-medium">24/7 Availability</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Headphones size={20} className="text-verified" />
                <span className="text-sm font-medium">Human Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="verified"
                size="xl"
                className="group w-full sm:w-auto"
              >
                Deploy Your First Agent
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
              <Button
                variant="glass"
                size="xl"
                className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Schedule a Demo
              </Button>
            </div>

            <p className="mt-6 text-sm text-primary-foreground/60">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
