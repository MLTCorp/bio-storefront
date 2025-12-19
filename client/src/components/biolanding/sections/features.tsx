'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { Sparkles, Zap, CreditCard, MousePointer2, ShoppingCart, Heart, Star, Bell, Share2, Check, ArrowRight } from 'lucide-react';
import { BlurFade } from '../ui/blur-fade';

const features = [
  {
    title: 'Sem Codigo Necessario',
    description:
      'Crie sua loja em minutos sem conhecimento tecnico. Interface intuitiva de arrastar e soltar.',
    icon: Sparkles,
    color: '#7F4AFF',
    gradient: 'from-purple-500/20 to-violet-500/20',
    screenshot: '/images/features/nail-designer.png',
    floatingElements: [
      { icon: MousePointer2, label: 'Arraste aqui', x: '8%', y: '15%', delay: 0, color: '#7F4AFF' },
      { icon: Sparkles, label: 'Gerar com IA', x: '70%', y: '12%', delay: 0.2, color: '#10B981' },
      { icon: Check, label: 'Salvo!', x: '75%', y: '70%', delay: 0.4, color: '#22C55E' },
    ],
  },
  {
    title: 'Checkout Simplificado',
    description:
      'Seus seguidores compram com 1 toque. PIX, cartao e boleto integrados. Conversao maxima.',
    icon: CreditCard,
    color: '#10B981',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    screenshot: '/images/features/fitness-influencer.png',
    floatingElements: [
      { icon: ShoppingCart, label: 'Adicionar', x: '10%', y: '20%', delay: 0, color: '#10B981' },
      { icon: CreditCard, label: 'PIX Instant', x: '72%', y: '15%', delay: 0.3, color: '#7F4AFF' },
      { icon: Check, label: 'Pago!', x: '78%', y: '68%', delay: 0.5, color: '#22C55E' },
    ],
  },
  {
    title: 'Integracoes Poderosas',
    description:
      'Conecte Instagram, WhatsApp, Stripe, Hotmart e mais. Tudo sincronizado automaticamente.',
    icon: Zap,
    color: '#F59E0B',
    gradient: 'from-amber-500/20 to-orange-500/20',
    screenshot: '/images/features/elegant-influencer.png',
    floatingElements: [
      { icon: Bell, label: 'Nova venda!', x: '10%', y: '25%', delay: 0, color: '#EF4444' },
      { icon: Heart, label: '+1 seguidor', x: '70%', y: '15%', delay: 0.2, color: '#EC4899' },
      { icon: Star, label: '5 estrelas', x: '15%', y: '72%', delay: 0.4, color: '#F59E0B' },
      { icon: Share2, label: 'Compartilhado', x: '75%', y: '60%', delay: 0.6, color: '#3B82F6' },
    ],
  },
];

interface FloatingElementProps {
  icon: React.ElementType;
  label: string;
  x: string;
  y: string;
  delay: number;
  color: string;
  isHovered: boolean;
}

function FloatingElement({ icon: Icon, label, x, y, delay, color, isHovered }: FloatingElementProps) {
  return (
    <motion.div
      className="absolute z-20"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{
        opacity: isHovered ? 1 : 0.7,
        scale: isHovered ? 1.1 : 1,
        y: 0
      }}
      transition={{
        delay: delay,
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
      }}
    >
      <motion.div
        className="relative group cursor-pointer"
        animate={{
          y: isHovered ? [-2, 2, -2] : [-4, 4, -4],
        }}
        transition={{
          duration: isHovered ? 1.5 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl blur-xl opacity-50"
          style={{ background: color }}
          animate={{
            scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: isHovered ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Card */}
        <div
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-xl border border-white/30 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
            boxShadow: `0 8px 32px -4px ${color}40, 0 4px 16px -2px rgba(0,0,0,0.1)`,
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: `${color}20` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{label}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface FeatureShowcaseProps {
  feature: (typeof features)[0];
  index: number;
  isReversed: boolean;
}

function FeatureShowcase({ feature, index, isReversed }: FeatureShowcaseProps) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 lg:py-28 ${
        index !== 0 ? 'border-t border-gray-100' : ''
      }`}
      style={{ opacity }}
    >
      {/* Image showcase */}
      <motion.div
        className={`relative ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
        style={{ scale, y: isReversed ? undefined : y }}
      >
        <div
          className="relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer perspective-1000"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background gradient glow */}
          <motion.div
            className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${feature.gradient} blur-3xl`}
            animate={{
              opacity: isHovered ? 0.8 : 0.4,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Main container with 3D effect */}
          <motion.div
            className="relative h-full rounded-3xl overflow-hidden border border-white/50 shadow-2xl"
            style={{
              rotateX: isHovered ? rotateX : 0,
              rotateY: isHovered ? rotateY : 0,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Screenshot background */}
            <div className="absolute inset-0">
              <img
                src={feature.screenshot}
                alt={feature.title}
                className="w-full h-full object-cover object-center transition-transform duration-700"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}10 0%, transparent 50%, ${feature.color}05 100%)`,
                  opacity: isHovered ? 1 : 0.5,
                }}
              />
            </div>

            {/* Floating UI elements */}
            {feature.floatingElements.map((element, i) => (
              <FloatingElement
                key={i}
                {...element}
                isHovered={isHovered}
              />
            ))}

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, transparent 50%)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: isHovered ? '200%' : '-100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Floating particles */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: feature.color,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Text content */}
      <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <BlurFade delay={0.1} inView>
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative"
            style={{ background: `${feature.color}15` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: feature.color }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.1 }}
            />
          </motion.div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
            {feature.title}
          </h3>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-lg mb-8">
            {feature.description}
          </p>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}40 0%, ${feature.color}20 100%)`,
                    }}
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">+2.000 usuarios</span>
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
  return (
    <section id="recursos" className="py-20 lg:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <BlurFade inView className="text-center mb-20">
          <motion.span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(127, 74, 255, 0.1) 0%, rgba(176, 144, 255, 0.1) 100%)',
              color: '#7F4AFF',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            Recursos
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
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

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Ferramentas profissionais para transformar seu link da bio em uma maquina de vendas.
          </p>
        </BlurFade>

        {/* Features */}
        {features.map((feature, index) => (
          <FeatureShowcase
            key={index}
            feature={feature}
            index={index}
            isReversed={index % 2 === 1}
          />
        ))}
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
