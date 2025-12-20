import { Navbar } from '@/components/biolanding/sections/navbar';
import { HeroSection } from '@/components/biolanding/sections/hero';
import { LogoCloud } from '@/components/biolanding/sections/logo-cloud';
import { FeaturesSection } from '@/components/biolanding/sections/features';
import { TestimonialsSection } from '@/components/biolanding/sections/testimonials';
import { HowItWorksSection } from '@/components/biolanding/sections/how-it-works';
import { PricingSection } from '@/components/biolanding/sections/pricing';
import { FAQSection } from '@/components/biolanding/sections/faq';
import { CTAFinalSection } from '@/components/biolanding/sections/cta-final';
import { Footer } from '@/components/biolanding/sections/footer';

export default function BioLandingPreview() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main>
        {/* Hero Section - Award-winning design */}
        <HeroSection />

        {/* Logo Cloud - Social proof */}
        <LogoCloud />

        {/* Features with mockups */}
        <FeaturesSection />

        {/* Testimonials - Bento grid */}
        <TestimonialsSection />

        {/* How it works - Timeline */}
        <HowItWorksSection />

        {/* Pricing */}
        <PricingSection />

        {/* FAQ */}
        <FAQSection />

        {/* CTA Final */}
        <CTAFinalSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
