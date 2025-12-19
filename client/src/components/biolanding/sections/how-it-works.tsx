'use client';

import { motion } from 'framer-motion';
import { UserPlus, Paintbrush, Share2, ArrowRight } from 'lucide-react';
import { BlurFade } from '../ui/blur-fade';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Crie sua conta',
    description: 'Cadastre-se gratuitamente em segundos usando seu Google ou email.',
    color: '#7F4AFF',
  },
  {
    number: '02',
    icon: Paintbrush,
    title: 'Personalize sua loja',
    description: 'Adicione seus produtos, links sociais e customize as cores da sua marca.',
    color: '#3B82F6',
  },
  {
    number: '03',
    icon: Share2,
    title: 'Compartilhe seu link',
    description: 'Cole seu link na bio do Instagram e comece a vender para seus seguidores.',
    color: '#10B981',
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <BlurFade inView className="text-center mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(127, 74, 255, 0.1)',
              color: '#7F4AFF',
            }}
          >
            Como Funciona
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Tres passos para sua{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #7F4AFF 0%, #B090FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              loja online
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            De zero a vendendo em menos de 5 minutos. Sem conhecimento tecnico necessario.
          </p>
        </BlurFade>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 z-0">
            <div
              className="h-full"
              style={{
                background: 'linear-gradient(90deg, #7F4AFF20, #3B82F620, #10B98120)',
              }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full relative group"
                  whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step Number Badge */}
                  <div
                    className="absolute -top-4 left-8 px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-lg"
                    style={{ background: step.color }}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                    style={{ background: `${step.color}15` }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.description}</p>

                  {/* Arrow for non-last items on large screens */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md items-center justify-center z-20 border border-gray-100"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" style={{ color: step.color }} />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
