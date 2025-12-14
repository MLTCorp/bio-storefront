import { useUser } from "@clerk/clerk-react";
import { Redirect } from "wouter";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { CTASection } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect logged-in users to dashboard
  if (isSignedIn) {
    return <Redirect to="/dashboard" />;
  }

  // Landing page for non-logged-in users
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
