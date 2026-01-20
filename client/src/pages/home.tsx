import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "wouter";
import { lazy, Suspense } from "react";

// Above the fold - load immediately
import { Navbar } from "@/components/biolanding/sections/navbar";
import { HeroSection } from "@/components/biolanding/sections/hero";

// Below the fold - lazy load
const FeaturesSection = lazy(() =>
  import("@/components/biolanding/sections/features").then(m => ({ default: m.FeaturesSection }))
);
const HowItWorksSection = lazy(() =>
  import("@/components/biolanding/sections/how-it-works").then(m => ({ default: m.HowItWorksSection }))
);
const PricingSection = lazy(() =>
  import("@/components/biolanding/sections/pricing").then(m => ({ default: m.PricingSection }))
);
const FAQSection = lazy(() =>
  import("@/components/biolanding/sections/faq").then(m => ({ default: m.FAQSection }))
);
const CTAFinalSection = lazy(() =>
  import("@/components/biolanding/sections/cta-final").then(m => ({ default: m.CTAFinalSection }))
);
const Footer = lazy(() =>
  import("@/components/biolanding/sections/footer").then(m => ({ default: m.Footer }))
);

export default function Home() {
  const { session, loading } = useAuth();

  // Show loading while auth loads
  if (loading) {
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
  if (session) {
    return <Redirect to="/dashboard" />;
  }

  // Section loading fallback
  const SectionFallback = () => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // BioLanding page for non-logged-in users
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          <FeaturesSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <HowItWorksSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FAQSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTAFinalSection />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
}
