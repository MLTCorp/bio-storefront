'use client';

import { motion } from 'framer-motion';
import { BlurFade, BlurFadeText } from '../ui/blur-fade';

const testimonials = [
  {
    quote:
      'Fiz R$5.000 na primeira semana usando o BioLanding. A facilidade de criar a pagina e conectar com o WhatsApp fez toda a diferenca!',
    name: 'Ana Carolina',
    role: 'Coach de Negocios',
    image: 'AC',
    color: '#7F4AFF',
    size: 'large',
  },
  {
    quote: 'Muito mais profissional que o Linktree. Meus clientes elogiam demais.',
    name: 'Pedro Silva',
    role: 'Personal Trainer',
    image: 'PS',
    color: '#3B82F6',
    size: 'small',
  },
  {
    quote:
      'A integracao com PIX e incrivel. Recebo pagamentos instantaneamente e o checkout e super rapido.',
    name: 'Julia Santos',
    role: 'Designer',
    image: 'JS',
    color: '#111111',
    size: 'medium',
  },
  {
    quote: 'Triplicou minhas vendas em 2 meses!',
    name: 'Lucas Oliveira',
    role: 'Marketing Digital',
    image: 'LO',
    color: '#10B981',
    size: 'small',
  },
  {
    quote:
      'A melhor ferramenta para criadores de conteudo. Simples, bonita e funcional. Nao troco por nada.',
    name: 'Mariana Costa',
    role: 'Influenciadora',
    image: 'MC',
    color: '#7F4AFF',
    size: 'medium',
  },
  {
    quote: 'Suporte incrivel e a plataforma e muito estavel. Recomendo!',
    name: 'Rafael Lima',
    role: 'Empreendedor',
    image: 'RL',
    color: '#3B82F6',
    size: 'small',
  },
];

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[0];
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const isLarge = testimonial.size === 'large';
  const isMedium = testimonial.size === 'medium';

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-6 ${
        isLarge ? 'md:col-span-2 md:row-span-2' : isMedium ? 'md:row-span-2' : ''
      }`}
      style={{
        background: testimonial.color === '#111111' ? '#111111' : `${testimonial.color}08`,
        border: `1px solid ${testimonial.color === '#111111' ? '#222' : testimonial.color}20`,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Grid pattern for some cards */}
      {isLarge && (
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `linear-gradient(to right, ${testimonial.color}10 1px, transparent 1px), linear-gradient(to bottom, ${testimonial.color}10 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%)',
          }}
        />
      )}

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Quote */}
        <div className="mb-6">
          <p
            className={`leading-relaxed ${isLarge ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}
            style={{
              color: testimonial.color === '#111111' ? '#fff' : '#333',
            }}
          >
            "{testimonial.quote}"
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: testimonial.color }}
          >
            {testimonial.image}
          </div>
          <div>
            <p
              className="font-semibold"
              style={{ color: testimonial.color === '#111111' ? '#fff' : '#000' }}
            >
              {testimonial.name}
            </p>
            <p
              className="text-sm"
              style={{ color: testimonial.color === '#111111' ? '#888' : '#666' }}
            >
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <BlurFade inView className="text-center mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(127, 74, 255, 0.1)',
              color: '#7F4AFF',
            }}
          >
            Depoimentos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Veja o que estao{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #7F4AFF 0%, #B090FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              dizendo
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Milhares de criadores ja transformaram suas vendas com o BioLanding.
          </p>
        </BlurFade>

        {/* Testimonials bento grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
