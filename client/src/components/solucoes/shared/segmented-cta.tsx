'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface SegmentedCTAProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  useCases: string[];
}

export function SegmentedCTA({
  title = 'Pronto para comecar?',
  subtitle = 'Junte-se a milhares de profissionais que ja transformaram sua presenca online',
  ctaText = 'Comecar Gratis',
  useCases,
}: SegmentedCTAProps) {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-600 to-purple-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h2>
            <p className="text-lg text-purple-100 mb-8">{subtitle}</p>

            <Link href="/signup">
              <Button
                size="lg"
                className="rounded-xl bg-white text-purple-700 hover:bg-purple-50 text-lg px-8 py-6 group"
              >
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Right - Use cases */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Perfeito para:</h3>
            <ul className="space-y-4">
              {useCases.map((useCase, index) => (
                <motion.li
                  key={useCase}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-white"
                >
                  <CheckCircle2 className="h-5 w-5 text-purple-300 flex-shrink-0" />
                  <span>{useCase}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
