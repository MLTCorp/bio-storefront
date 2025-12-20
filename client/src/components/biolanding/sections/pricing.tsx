'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/clerk-react';
import { BlurFade } from '../ui/blur-fade';

const plans = [
  {
    name: 'Gratis',
    price: 'R$ 0',
    period: '/mes',
    description: 'Perfeito para comecar',
    features: [
      '1 pagina de links',
      'Ate 5 produtos',
      'Integracao WhatsApp',
      'Temas basicos',
      'Analytics basico',
    ],
    cta: 'Comecar Gratis',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'R$ 29',
    period: '/mes',
    description: 'Para criadores serios',
    features: [
      'Paginas ilimitadas',
      'Produtos ilimitados',
      'Todas as integracoes',
      'Temas premium',
      'Analytics avancado',
      'Dominio personalizado',
      'Suporte prioritario',
      'Remocao da marca',
    ],
    cta: 'Assinar Pro',
    popular: true,
  },
];

export function PricingSection() {
  return (
    <section id="precos" className="py-16 sm:py-20 bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <BlurFade inView className="text-center mb-10 sm:mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4"
            style={{
              background: 'rgba(127, 74, 255, 0.1)',
              color: '#7F4AFF',
            }}
          >
            Precos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Escolha seu{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #7F4AFF 0%, #B090FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              plano
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Comece gratis e evolua conforme seu negocio cresce.
          </p>
        </BlurFade>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 ${
                plan.popular ? 'ring-2 ring-[#7F4AFF] shadow-xl' : 'border border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-white text-xs sm:text-sm font-medium flex items-center gap-1.5"
                  style={{
                    background:
                      'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Mais Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-black mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-xs sm:text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6 sm:mb-8">
                <span className="text-4xl sm:text-5xl font-bold text-black">{plan.price}</span>
                <span className="text-gray-500 text-sm sm:text-base">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: plan.popular ? '#7F4AFF' : '#10B981',
                      }}
                    >
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <SignInButton mode="modal">
                <Button
                  className={`w-full h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-xl ${
                    plan.popular ? 'text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                  style={
                    plan.popular
                      ? {
                          background:
                            'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                        }
                      : {}
                  }
                >
                  {plan.cta}
                </Button>
              </SignInButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
