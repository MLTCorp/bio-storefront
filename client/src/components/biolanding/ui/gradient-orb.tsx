'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientOrbProps {
  className?: string;
  color?: string;
  size?: number;
  blur?: number;
  animate?: boolean;
  animationDuration?: number;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animationType?: 'float' | 'pulse' | 'u-shape' | 'rotate';
}

const GradientOrb = ({
  className,
  color = '#D7C9FF',
  size = 400,
  blur = 150,
  animate = true,
  animationDuration = 20,
  position = {},
  animationType = 'float',
}: GradientOrbProps) => {
  const getAnimation = () => {
    switch (animationType) {
      case 'float':
        return {
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        };
      case 'pulse':
        return {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        };
      case 'u-shape':
        return {
          x: [0, 60, 120, 60, 0],
          y: [0, -80, 0, 80, 0],
          scale: [1, 1.2, 1.4, 1.2, 1],
        };
      case 'rotate':
        return {
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={cn('absolute rounded-full pointer-events-none', className)}
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${blur}px)`,
        ...position,
      }}
      animate={animate ? getAnimation() : undefined}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Multiple orbs background
interface GradientOrbsBackgroundProps {
  className?: string;
}

const GradientOrbsBackground = ({ className }: GradientOrbsBackgroundProps) => {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Top left orb */}
      <GradientOrb
        position={{ top: '-250px', left: '-250px' }}
        size={500}
        animationType="u-shape"
        animationDuration={30}
      />

      {/* Top right orb */}
      <GradientOrb
        position={{ top: '-250px', right: '-250px' }}
        size={500}
        animationType="u-shape"
        animationDuration={32}
        animate={true}
      />

      {/* Bottom center orb */}
      <GradientOrb
        position={{ bottom: '-100px', left: '30%' }}
        size={600}
        blur={200}
        animationType="float"
        animationDuration={25}
      />
    </div>
  );
};

export { GradientOrb, GradientOrbsBackground };
