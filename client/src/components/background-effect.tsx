import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BackgroundEffect() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    // Create a fixed number of sparkles for performance
    const sparkles = Array.from({ length: 25 });

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base Gradient - Pink/Rose to subtle Gold */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50/50" />

            {/* Secondary colored orbs for depth */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            {/* Sparkles */}
            {sparkles.map((_, i) => (
                <Sparkle key={i} />
            ))}

            {/* Overlay texture for grain (optional, keeps it subtle) */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')] pointer-events-none" />
        </div>
    );
}

function Sparkle() {
    // Randomize sparkle properties
    const randomTop = Math.random() * 100;
    const randomLeft = Math.random() * 100;
    const randomDelay = Math.random() * 5;
    const randomDuration = 2 + Math.random() * 3;
    const randomScale = 0.5 + Math.random();

    return (
        <motion.div
            className="absolute rounded-full bg-amber-300 shadow-[0_0_8px_2px_rgba(251,191,36,0.3)]"
            style={{
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                width: 3,
                height: 3,
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
