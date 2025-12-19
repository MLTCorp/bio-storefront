'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number; opacity: number; filter: string };
    visible: { y: number; opacity: number; filter: string };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = '-50px',
  blur = '6px',
}: BlurFadeProps) => {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin as any });
  const isInView = !inView || inViewResult;

  const defaultVariants: Variants = {
    hidden: {
      y: yOffset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
  };

  const combinedVariants = variant || defaultVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={combinedVariants}
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: 'easeOut',
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

// Text that reveals word by word with blur
interface BlurFadeTextProps {
  text: string;
  className?: string;
  delay?: number;
  characterDelay?: number;
  separator?: string;
  animateByCharacter?: boolean;
}

const BlurFadeText = ({
  text,
  className,
  delay = 0,
  characterDelay = 0.03,
  separator = ' ',
  animateByCharacter = false,
}: BlurFadeTextProps) => {
  const elements = animateByCharacter ? text.split('') : text.split(separator);

  return (
    <span className={cn('inline-flex flex-wrap', className)}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0,
            filter: 'blur(10px)',
            y: 5,
          }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
          }}
          transition={{
            delay: delay + index * characterDelay,
            duration: 0.3,
            ease: 'easeOut',
          }}
          className="inline-block"
        >
          {element}
          {!animateByCharacter && separator === ' ' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </span>
  );
};

export { BlurFade, BlurFadeText };
