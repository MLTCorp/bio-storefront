'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import { BlurFade } from '../ui/blur-fade';
import { useState } from 'react';

const plans = [
  {
    id: 'free',
    name: 'Gratis',
    price: 'R$ 0',
    period: '/mes',
    description: 'Perfeito para comecar',
    features: [
      { text: '1 pagina de links', included: true },
      { text: 'Ate 3 produtos', included: true },
      { text: '10 componentes por pagina', included: true },
      { text: 'Todos os temas', included: true },
      { text: 'Analytics basico (7 dias)', included: true },
      { text: 'Geracoes IA', included: false },
      { text: 'Remover branding', included: false },
    ],
    cta: 'Comecar Gratis',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 'R$ 29,90',
    period: '/mes',
    description: 'Para criadores em crescimento',
    features: [
      { text: '3 paginas de links', included: true },
      { text: 'Ate 10 produtos', included: true },
      { text: '20 componentes por pagina', included: true },
      { text: 'Todos os temas', included: true },
      { text: 'Analytics 30 dias', included: true },
      { text: '1 geracao IA/dia (HD)', included: true },
      { text: 'Remover branding', included: true },
      { text: 'Historico IA 7 dias', included: true },
    ],
    cta: 'Assinar Starter',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 97',
    period: '/mes',
    description: 'Para profissionais',
    features: [
      { text: '10 paginas de links', included: true },
      { text: 'Produtos ilimitados', included: true },
      { text: 'Componentes ilimitados', included: true },
      { text: 'Todos os temas', included: true },
      { text: 'Analytics avancado 12 meses', included: true },
      { text: '3 geracoes IA/dia (HD)', included: true },
      { text: 'Remover branding', included: true },
      { text: 'Historico IA 30 dias', included: true },
      { text: 'Dominio personalizado', included: true },
      { text: 'Origem do trafego', included: true },
      { text: 'Exportar relatorios', included: true },
      { text: 'Pixel Facebook', included: true },
      { text: 'Google Analytics', included: true },
    ],
    cta: 'Assinar Pro',
    popular: true,
  },
];

export function PricingSection() {
  const { isSignedIn } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Checkout anonimo para planos pagos - vai direto pro Stripe
  const handleAnonymousCheckout = async (planId: string) => {
    setLoadingPlan(planId);
    try {
      const response = await fetch('/api/subscriptions/anonymous-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error('Checkout error:', data.error);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="precos" className="py-16 sm:py-20 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 ${
                plan.popular ? 'ring-2 ring-[#7F4AFF] shadow-xl md:scale-105' : 'border border-gray-200'
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
                <span className="text-3xl sm:text-4xl font-bold text-black">{plan.price}</span>
                <span className="text-gray-500 text-sm sm:text-base">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        feature.included ? '' : 'bg-gray-200'
                      }`}
                      style={
                        feature.included
                          ? { background: plan.popular ? '#7F4AFF' : '#10B981' }
                          : {}
                      }
                    >
                      {feature.included ? (
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      ) : (
                        <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                      )}
                    </div>
                    <span
                      className={`text-xs sm:text-sm ${
                        feature.included ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.id === 'free' ? (
                // Plano gratis: precisa de conta primeiro
                isSignedIn ? (
                  <Button
                    onClick={() => (window.location.href = '/dashboard')}
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-xl bg-gray-100 text-black hover:bg-gray-200"
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <Button className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-xl bg-gray-100 text-black hover:bg-gray-200">
                      {plan.cta}
                    </Button>
                  </SignInButton>
                )
              ) : (
                // Planos pagos: vai direto pro Stripe (checkout anonimo)
                <Button
                  onClick={() => handleAnonymousCheckout(plan.id)}
                  disabled={loadingPlan === plan.id}
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
                  {loadingPlan === plan.id ? 'Carregando...' : plan.cta}
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
