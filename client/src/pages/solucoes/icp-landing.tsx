'use client';

import React, { lazy, Suspense, useEffect } from 'react';
import { Navbar } from '@/components/biolanding/sections/navbar';
import { SegmentedHero } from '@/components/solucoes/shared/segmented-hero';
import type { ICPContent } from '@/components/solucoes/content/icp-content';

// Lazy load below-the-fold sections
const SegmentedFeatures = lazy(() =>
  import('@/components/solucoes/shared/segmented-features').then((m) => ({
    default: m.SegmentedFeatures,
  }))
);
const SegmentedTestimonials = lazy(() =>
  import('@/components/solucoes/shared/segmented-testimonials').then((m) => ({
    default: m.SegmentedTestimonials,
  }))
);
const SegmentedCTA = lazy(() =>
  import('@/components/solucoes/shared/segmented-cta').then((m) => ({
    default: m.SegmentedCTA,
  }))
);
const PricingSection = lazy(() =>
  import('@/components/biolanding/sections/pricing').then((m) => ({
    default: m.PricingSection,
  }))
);
const FAQSection = lazy(() =>
  import('@/components/biolanding/sections/faq').then((m) => ({
    default: m.FAQSection,
  }))
);
const Footer = lazy(() =>
  import('@/components/biolanding/sections/footer').then((m) => ({
    default: m.Footer,
  }))
);

interface ICPLandingProps {
  content: ICPContent;
}

// Section loading fallback
const SectionFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export function ICPLanding({ content }: ICPLandingProps) {
  // Update document title and meta for SEO
  useEffect(() => {
    document.title = content.seo.title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', content.seo.description);

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', content.seo.keywords.join(', '));
  }, [content]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <SegmentedHero
          tag={content.heroTag}
          title={content.heroTitle}
          highlight={content.heroHighlight}
          subtitle={content.heroSubtitle}
          description={content.heroDescription}
          ctaText={content.ctaText}
          ctaSubtext={content.ctaSubtext}
        />

        <Suspense fallback={<SectionFallback />}>
          <SegmentedFeatures
            features={content.features}
            title={`Por que ${content.name.toLowerCase()} amam o BioLanding`}
            subtitle="Recursos pensados especialmente para o seu tipo de negocio"
          />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <SegmentedTestimonials
            testimonials={content.testimonials}
            title={`${content.name} ja estao usando`}
          />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <PricingSection />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <SegmentedCTA
            title="Pronto para transformar sua presenca online?"
            subtitle={`Junte-se a centenas de ${content.name.toLowerCase()} que ja usam o BioLanding`}
            ctaText={content.ctaText}
            useCases={content.useCases}
          />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <FAQSection />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
}
