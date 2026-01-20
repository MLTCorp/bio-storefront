import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion or is on mobile device.
 * Used to disable heavy animations for better performance.
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Check if device is mobile (simplified animations for performance)
    const isMobile = window.innerWidth < 768;

    setShouldReduceMotion(mediaQuery.matches || isMobile);

    // Listen for changes in motion preference
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches || window.innerWidth < 768);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Also listen for resize to detect mobile
    const handleResize = () => {
      setShouldReduceMotion(mediaQuery.matches || window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return shouldReduceMotion;
}

/**
 * Get animation variants based on reduced motion preference.
 * Returns simplified or full animations.
 */
export function getAnimationVariants(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
    };
  }

  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
  };
}
