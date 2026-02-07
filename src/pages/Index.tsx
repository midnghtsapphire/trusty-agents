import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BadgeExplainerSection from "@/components/BadgeExplainerSection";
import StatsSection from "@/components/StatsSection";
import AgentsSection from "@/components/AgentsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import HowItWorksDetailedSection from "@/components/HowItWorksDetailedSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import BackgroundParticles from "@/components/BackgroundParticles";
import GlowingDivider from "@/components/GlowingDivider";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <BackgroundParticles />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <GlowingDivider variant="dual" />
        <BadgeExplainerSection />
        <GlowingDivider variant="magic" />
        <StatsSection />
        <GlowingDivider variant="sparkle" />
        <AgentsSection />
        <GlowingDivider variant="dual" />
        <HowItWorksSection />
        <GlowingDivider variant="magic" />
        <HowItWorksDetailedSection />
        <GlowingDivider variant="sparkle" />
        <PricingSection />
        <GlowingDivider variant="dual" />
        <TestimonialsSection />
        <GlowingDivider variant="magic" />
        <FAQSection />
        <GlowingDivider variant="sparkle" />
        <AboutSection />
        <GlowingDivider variant="dual" />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
