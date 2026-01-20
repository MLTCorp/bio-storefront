'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface SegmentedHeroProps {
  tag: string;
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaSubtext: string;
}

export function SegmentedHero({
  tag,
  title,
  highlight,
  subtitle,
  description,
  ctaText,
  ctaSubtext,
}: SegmentedHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50/50" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:py-32">
        <div className="max-w-3xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              {tag}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4"
          >
            {title}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
              }}
            >
              {highlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-600 font-medium mb-4"
          >
            {subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-gray-500 mb-8 max-w-2xl"
          >
            {description}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="rounded-xl text-white text-lg px-8 py-6 group"
                style={{
                  background:
                    'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                }}
              >
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <span className="text-sm text-gray-500">{ctaSubtext}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
