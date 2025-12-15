import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Theme } from "@/lib/themes";

interface BackgroundEffectProps {
  theme?: Theme;
}

export function BackgroundEffect({ theme }: BackgroundEffectProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Don't render any effect for light theme - it's clean
  if (!theme || theme.id === 'light') {
    return null;
  }

  // Theme-specific effects
  const getThemeEffects = () => {
    switch (theme.id) {
      case 'dark':
        return (
          <>
            {/* Subtle blue/purple glow for dark theme */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
          </>
        );

      case 'cyber':
        return (
          <>
            {/* Cyan glows for cyber theme */}
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2" />
            {/* Grid lines effect */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            />
          </>
        );

      case 'rosa':
        return (
          <>
            {/* Pink/rose orbs for rosa theme */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            {/* Sparkles for rosa theme */}
            {Array.from({ length: 15 }).map((_, i) => (
              <Sparkle key={i} color="rgba(236, 72, 153, 0.6)" />
            ))}
          </>
        );

      case 'saude':
        return (
          <>
            {/* Green orbs for saude theme */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-300/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/15 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {getThemeEffects()}
    </div>
  );
}

function Sparkle({ color = "rgba(251, 191, 36, 0.6)" }: { color?: string }) {
  const randomTop = Math.random() * 100;
  const randomLeft = Math.random() * 100;
  const randomDelay = Math.random() * 5;
  const randomDuration = 2 + Math.random() * 3;
  const randomScale = 0.5 + Math.random();

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        top: `${randomTop}%`,
        left: `${randomLeft}%`,
        width: 3,
        height: 3,
        backgroundColor: color,
        boxShadow: `0 0 8px 2px ${color}`,
      }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, randomScale, 0],
      }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        delay: randomDelay,
        ease: "easeInOut",
      }}
    />
  );
}
