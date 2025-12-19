import { useUser } from "@clerk/clerk-react";
import { Redirect } from "wouter";
import { Navbar } from "@/components/biolanding/sections/navbar";
import { HeroSection } from "@/components/biolanding/sections/hero";
import { LogoCloud } from "@/components/biolanding/sections/logo-cloud";
import { FeaturesSection } from "@/components/biolanding/sections/features";
import { TestimonialsSection } from "@/components/biolanding/sections/testimonials";
import { HowItWorksSection } from "@/components/biolanding/sections/how-it-works";
import { PricingSection } from "@/components/biolanding/sections/pricing";
import { FAQSection } from "@/components/biolanding/sections/faq";
import { CTAFinalSection } from "@/components/biolanding/sections/cta-final";
import { Footer } from "@/components/biolanding/sections/footer";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect logged-in users to dashboard
  if (isSignedIn) {
    return <Redirect to="/dashboard" />;
  }

  // BioLanding page for non-logged-in users
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <LogoCloud />
        <FeaturesSection />
        <TestimonialsSection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
        <CTAFinalSection />
      </main>
      <Footer />
    </div>
  );
}
