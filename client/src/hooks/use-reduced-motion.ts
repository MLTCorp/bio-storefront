import { useState, useEffect } from 'react';

/**
 * Debounce function to reduce event handler calls
 */
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

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

    // Debounce resize listener to reduce main thread work
    const handleResize = debounce(() => {
      setShouldReduceMotion(mediaQuery.matches || window.innerWidth < 768);
    }, 150);

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
