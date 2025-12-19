'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/clerk-react';
import { GradientOrb } from '../ui/gradient-orb';

const benefits = [
  '100% Gratuito para comecar',
  'Sem taxa de adesao',
  'Suporte via WhatsApp',
  'Setup em 5 minutos',
];

export function CTAFinalSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #7F4AFF 0%, #5B21B6 50%, #4C1D95 100%)',
        }}
      />

      {/* Animated gradient orbs */}
      <GradientOrb
        position={{ top: '10%', left: '5%' }}
        size={300}
        color="rgba(255, 255, 255, 0.1)"
        blur={100}
        animationType="float"
      />
      <GradientOrb
        position={{ bottom: '10%', right: '5%' }}
        size={400}
        color="rgba(176, 144, 255, 0.2)"
        blur={120}
        animationType="pulse"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Comece agora, e gratis!</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Pronto para criar seu{' '}
          <span className="text-white/80">site pessoal</span>?
        </motion.h2>

        <motion.p
          className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Junte-se a milhares de criadores que ja estao vendendo mais com o BioLanding.
        </motion.p>

        {/* Benefits */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Check className="w-4 h-4 text-green-300" />
              <span>{benefit}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <SignInButton mode="modal">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="h-16 px-10 text-lg font-bold gap-3 bg-white text-[#7F4AFF] hover:bg-white/90 shadow-2xl shadow-black/20 rounded-2xl"
              >
                Criar meu site pessoal de links na bio
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </SignInButton>

          <p className="mt-4 text-white/60 text-sm">
            Nenhum cartao de credito necessario
          </p>
        </motion.div>
      </div>
    </section>
  );
}
