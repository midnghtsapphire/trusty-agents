import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
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
        <StatsSection />
        <GlowingDivider variant="magic" />
        <AgentsSection />
        <GlowingDivider variant="sparkle" />
        <HowItWorksSection />
        <GlowingDivider variant="dual" />
        <HowItWorksDetailedSection />
        <GlowingDivider variant="magic" />
        <PricingSection />
        <GlowingDivider variant="sparkle" />
        <TestimonialsSection />
        <GlowingDivider variant="dual" />
        <FAQSection />
        <GlowingDivider variant="magic" />
        <AboutSection />
        <GlowingDivider variant="sparkle" />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
