'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Platform/brand logos (using simple text for now - can be replaced with SVGs)
const logos = [
  { name: 'Instagram', icon: 'IG' },
  { name: 'TikTok', icon: 'TT' },
  { name: 'YouTube', icon: 'YT' },
  { name: 'Stripe', icon: 'ST' },
  { name: 'WhatsApp', icon: 'WA' },
  { name: 'PIX', icon: 'PX' },
  { name: 'Hotmart', icon: 'HM' },
  { name: 'Mercado Pago', icon: 'MP' },
];

export function LogoCloud() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="group relative m-auto max-w-5xl px-6">
        {/* Hover overlay */}
        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
          <a href="#" className="block text-sm duration-150 hover:opacity-75 text-[#7F4AFF] font-medium">
            <span>Conhega nossas integragoes</span>
            <ChevronRight className="ml-1 inline-block size-4" />
          </a>
        </div>

        {/* Logos grid */}
        <motion.div
          className="mx-auto grid max-w-3xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:blur-sm group-hover:opacity-40 sm:gap-x-16 sm:gap-y-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 font-bold text-sm border border-gray-200"
                  style={{ filter: 'grayscale(100%)' }}
                >
                  {logo.icon}
                </div>
                <span className="text-xs text-gray-400 font-medium">{logo.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
