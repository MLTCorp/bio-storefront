'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/clerk-react';
import { AnimatedGroup } from '../ui/animated-group';
import { GradientOrbsBackground } from '../ui/gradient-orb';
import { HeroPhoneMockup } from '../hero-phone-mockup';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const stats = [
  { value: '500+', label: 'Usuarios Ativos' },
  { value: '99.9%', label: 'Uptime' },
  { value: '10+', label: 'Integracoes' },
  { value: '4.9', label: 'Avaliacao' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background with gradient orbs */}
      <div className="absolute inset-0 bg-[#F9FAFB]">
        <GradientOrbsBackground />
        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Accent Line Top */}
      <motion.div
        className="absolute top-0 left-0 h-1 z-10"
        style={{
          background: 'linear-gradient(90deg, #7F4AFF, transparent)',
        }}
        initial={{ width: '0%' }}
        animate={{ width: '50%' }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Content */}
      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="lg:pr-8">
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.3,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                  style={{
                    background: 'rgba(127, 74, 255, 0.1)',
                    border: '1px solid rgba(127, 74, 255, 0.3)',
                  }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#7F4AFF]"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-[#7F4AFF]">
                    Crie seu link na bio em minutos
                  </span>
                </motion.div>

                {/* Title */}
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.04em',
                  }}
                >
                  <span className="text-black">Crie Seu </span>
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #7F4AFF 0%, #B090FF 50%, #7F4AFF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Site Pessoal
                  </span>
                  <span className="text-black"> de Links</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-500 mb-10 leading-relaxed max-w-xl">
                  Transforme seu perfil em uma vitrine profissional. Mostre produtos, receba
                  pagamentos e conecte com seus seguidores.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4 mb-10 sm:mb-12">
                  <SignInButton mode="modal">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-2xl text-white shadow-xl gap-2 w-full sm:w-auto"
                        style={{
                          background:
                            'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                          boxShadow: '0 20px 50px rgba(127, 74, 255, 0.3)',
                        }}
                      >
                        <span className="sm:hidden">Comecar Agora</span>
                        <span className="hidden sm:inline">Criar meu site de links</span>
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </SignInButton>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:bg-gray-50 w-full sm:w-auto"
                      onClick={() => {
                        document
                          .getElementById('como-funciona')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Ver Demo
                    </Button>
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -3 }}
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div
                        className="absolute top-0 left-0 w-6 sm:w-8 h-1 rounded-full"
                        style={{ background: '#7F4AFF' }}
                      />
                      <div className="pt-3 sm:pt-4">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">{stat.value}</div>
                        <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedGroup>
            </div>

            {/* Right side - Phone mockup - Hidden on mobile for cleaner layout */}
            <div className="hidden lg:flex justify-end relative">
              <HeroPhoneMockup />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 right-0 h-1"
        style={{
          background: 'linear-gradient(270deg, #7F4AFF, transparent)',
        }}
        initial={{ width: '0%' }}
        animate={{ width: '40%' }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
      />
    </section>
  );
}
