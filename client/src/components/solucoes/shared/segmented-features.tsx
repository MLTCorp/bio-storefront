'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Smartphone,
  Zap,
  Palette,
  Link as LinkIcon,
  Shield,
  ShoppingBag,
  CreditCard,
  MessageCircle,
  Package,
  Percent,
  TrendingUp,
  Calendar,
  Star,
  Award,
  Video,
  FileText,
  MapPin,
  Image,
  Briefcase,
  Send,
  Instagram,
  Clock,
  Globe,
} from 'lucide-react';
import type { ICPFeature } from '../content/icp-content';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  BarChart3,
  Smartphone,
  Zap,
  Palette,
  Link: LinkIcon,
  Shield,
  ShoppingBag,
  CreditCard,
  MessageCircle,
  Package,
  Percent,
  TrendingUp,
  Calendar,
  Star,
  Award,
  Video,
  FileText,
  MapPin,
  Image,
  Briefcase,
  Send,
  Instagram,
  Clock,
  Globe,
};

interface SegmentedFeaturesProps {
  features: ICPFeature[];
  title?: string;
  subtitle?: string;
}

export function SegmentedFeatures({
  features,
  title = 'Tudo que voce precisa',
  subtitle = 'Recursos pensados especialmente para o seu tipo de negocio',
}: SegmentedFeaturesProps) {
  return (
    <section id="recursos" className="py-20 lg:py-32 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Zap;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                  style={{
                    background:
                      'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                  }}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
