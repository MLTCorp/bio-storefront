'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Sparkles, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';
import { BlurFade } from '../ui/blur-fade';
import { FeaturePhoneMockup } from '../feature-phone-mockup';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Avatares para cada seção (UI Avatars API - SVG, muito mais leve que randomuser.me)
const avatarsByFeature = {
  pages: [
    'https://ui-avatars.com/api/?name=Maria+Silva&size=64&background=7F4AFF&color=fff&font-size=0.4&bold=true',
    'https://ui-avatars.com/api/?name=Carlos+Santos&size=64&background=7F4AFF&color=fff&font-size=0.4&bold=true',
    'https://ui-avatars.com/api/?name=Ana+Costa&size=64&background=7F4AFF&color=fff&font-size=0.4&bold=true',
    'https://ui-avatars.com/api/?name=Pedro+Gomes&size=64&background=7F4AFF&color=fff&font-size=0.4&bold=true',
  ],
  views: [
    'https://ui-avatars.com/api/?name=Julia+Ferreira&size=64&background=10B981&color=fff&font-size=0.4&bold=true',
    'https://ui-avatars.com/api/?name=Lucas+Oliveira&size=64&background=10B981&color=fff&font-size=0.4&bold=true',
    'https://ui-avatars.com/api/?name=Sofia+Martins&size=64&background=10B981&color=fff&font-size=0.4&bold=true',
    'https://ui-avatars.com/api/?name=Felipe+Rocha&size=64&background=10B981&color=fff&font-size=0.4&bold=true',
  ],
  clicks: [
    'https://ui-avatars.com/api/?name=Isabella+Lima&size=64&background=F59E0B&color=fff&font-size=0.4&bold=true',
    'https://ui-avatars.com/api/?name=Gabriel+Silva&size=64&background=F59E0B&color=fff&font-size=0.4&bold=true',
    'https://ui-avatars.com/api/?name=Beatriz+Tavares&size=64&background=F59E0B&color=fff&font-size=0.4&bold=true',
    'https://ui-avatars.com/api/?name=Rafael+Mendes&size=64&background=F59E0B&color=fff&font-size=0.4&bold=true',
  ],
};

const features = [
  {
    title: 'Vitrine de Produtos',
    description:
      'Mostre seus produtos de forma profissional. Fotos, precos e descricoes organizadas para seus seguidores.',
    icon: ShoppingBag,
    color: '#F59E0B',
    gradient: 'from-amber-500/20 to-orange-500/20',
    ugcImage: '/images/features/elegant-influencer.webp',
    variant: 'store' as const,
    mockupLeft: true,
    statKey: 'pages' as const,
    statLabel: 'paginas criadas',
  },
  {
    title: 'Agendamento Integrado',
    description:
      'Seus clientes agendam direto pelo seu perfil. Calendario integrado com horarios disponiveis.',
    icon: Calendar,
    color: '#10B981',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    ugcImage: '/images/features/fitness-influencer.webp',
    variant: 'video' as const,
    mockupLeft: false,
    statKey: 'views' as const,
    statLabel: 'visitas rastreadas',
  },
  {
    title: 'Sem Codigo Necessario',
    description:
      'Crie sua loja em minutos sem conhecimento tecnico. Interface intuitiva de arrastar e soltar.',
    icon: Sparkles,
    color: '#7F4AFF',
    gradient: 'from-purple-500/20 to-violet-500/20',
    ugcImage: '/images/features/nail-designer.webp',
    variant: 'links' as const,
    mockupLeft: true,
    statKey: 'clicks' as const,
    statLabel: 'cliques em produtos',
  },
];

interface Stats {
  pages: number;
  views: number;
  clicks: number;
}

interface FeatureShowcaseProps {
  feature: (typeof features)[0];
  index: number;
  stats: Stats;
  reduceMotion: boolean;
}

function FeatureShowcase({ feature, index, stats, reduceMotion }: FeatureShowcaseProps) {
  const mockupLeft = feature.mockupLeft;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Use IntersectionObserver instead of scroll listener (no forced reflows)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 sm:py-16 lg:py-24 ${
        index !== 0 ? 'border-t border-gray-100' : ''
      }`}
      initial={{ opacity: reduceMotion ? 1 : 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: reduceMotion ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Visual showcase - Phone Mockup + UGC Image */}
      {/* On mobile: show only phone mockup centered */}
      {/* On desktop: show both with overlap */}
      <motion.div
        className={`relative flex items-center justify-center ${mockupLeft ? 'lg:order-1' : 'lg:order-2'}`}
      >
        {/* Mobile: Only show phone mockup */}
        <div className="lg:hidden">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
            }}
          >
            <FeaturePhoneMockup variant={feature.variant} color={feature.color} />
          </motion.div>
        </div>

        {/* Desktop: Show mockup + UGC with overlap */}
        <div className="hidden lg:flex items-center justify-center gap-8">
          {/* Phone Mockup - appears first when mockupLeft is true */}
          {mockupLeft && (
            <motion.div
              className="relative flex-shrink-0 -mr-16 z-10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
              }}
            >
              <FeaturePhoneMockup variant={feature.variant} color={feature.color} />
            </motion.div>
          )}

          {/* UGC Image - Desktop only */}
          <motion.div
            className="relative flex-shrink-0"
            initial={{ opacity: 0, x: mockupLeft ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: mockupLeft ? 0.2 : 0 }}
          >
            {/* Glow behind image */}
            <div
              className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${feature.gradient} blur-2xl opacity-40`}
            />

            {/* UGC Photo */}
            <div className="relative w-[300px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={feature.ugcImage}
                alt={feature.title}
                width={300}
                height={400}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              {/* Subtle gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 60%, ${feature.color}20 100%)`,
                }}
              />
            </div>

            {/* Connection line */}
            <div
              className="absolute top-1/2 -right-4 w-8 h-0.5"
              style={{ background: `linear-gradient(90deg, ${feature.color}40, ${feature.color})` }}
            />
          </motion.div>

          {/* Phone Mockup - appears after image when mockupLeft is false */}
          {!mockupLeft && (
            <motion.div
              className="relative flex-shrink-0 -ml-16 z-10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
              }}
            >
              <FeaturePhoneMockup variant={feature.variant} color={feature.color} />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Text content */}
      <div className={`text-center lg:text-left ${mockupLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <BlurFade delay={0.1} inView>
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-4 sm:mb-6 relative"
            style={{ background: `${feature.color}15` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <feature.icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: feature.color }} />
          </motion.div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-4 leading-tight">
            {feature.title}
          </h3>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8">
            {feature.description}
          </p>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {avatarsByFeature[feature.statKey].map((photo, i) => (
                  <motion.img
                    key={i}
                    src={photo}
                    alt={`Usuario ${i + 1}`}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-lg object-cover"
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                +{stats[feature.statKey].toLocaleString('pt-BR')} {feature.statLabel}
              </span>
            </div>

            <motion.button
              className="flex items-center gap-2 text-sm font-semibold group"
              style={{ color: feature.color }}
              whileHover={{ x: 5 }}
            >
              Saiba mais
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </BlurFade>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const [stats, setStats] = useState<Stats>({ pages: 0, views: 0, clicks: 0 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Fetch real stats from API
    fetch('/api/public/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.pages !== undefined) {
          setStats({
            pages: data.pages || 0,
            views: data.views || 0,
            clicks: data.clicks || 0,
          });
        }
      })
      .catch(() => {
        // Keep default values on error
      });
  }, []);

  return (
    <section id="recursos" className="py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <BlurFade inView className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.span
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(127, 74, 255, 0.1) 0%, rgba(176, 144, 255, 0.1) 100%)',
              color: '#7F4AFF',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Recursos
          </motion.span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 leading-tight px-2">
            Tudo que voce precisa para{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #7F4AFF 0%, #B090FF 50%, #7F4AFF 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-shift 3s ease infinite',
              }}
            >
              vender mais
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Ferramentas profissionais para transformar seu link da bio em uma maquina de vendas.
          </p>
        </BlurFade>

        {/* Features */}
        {features.map((feature, index) => (
          <FeatureShowcase key={index} feature={feature} index={index} stats={stats} reduceMotion={reduceMotion} />
        ))}
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
