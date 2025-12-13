import { ProfileHeader } from "@/components/profile-header";
import { VideoPlayer } from "@/components/video-player";
import { ProductList } from "@/components/product-list";
import { Settings } from "lucide-react";
import { Link } from "wouter";
import { useConfig } from "@/lib/store";
import { motion } from "framer-motion";

import { BackgroundEffect } from "@/components/background-effect";

export default function Home() {
  const { isLoading } = useConfig();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Fallback to ensure visibility if something goes wrong with Framer Motion
  const isReducedMotion = false; // Could hook into useReducedMotion() if added later

  return (
    <div className="min-h-screen pb-12 transition-colors duration-500 relative">
      <BackgroundEffect />

      {/* Mobile container constraint */}
      <motion.main
        className="max-w-[480px] mx-auto min-h-screen bg-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] px-4 py-8 md:my-8 md:rounded-[32px] md:min-h-[calc(100vh-4rem)] md:border border-white/50 backdrop-blur-2xl relative overflow-hidden ring-1 ring-white/60"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ opacity: 1 }} // Force opacity 1 via style as fallback
      >
        {/* Decorative background blurs inside the card are removed as we have global background now */}

        <motion.div variants={itemVariants}>
          <ProfileHeader />
        </motion.div>

        <motion.div variants={itemVariants}>
          <VideoPlayer />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <ProductList />
        </motion.div>

        <motion.footer variants={itemVariants} className="mt-12 text-center space-y-4 opacity-60">
          <p className="text-xs text-muted-foreground">© 2025 Tania Vi. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <span>•</span>
            <Link href="/config" className="hover:text-primary transition-colors flex items-center gap-1">
              <Settings className="w-3 h-3" />
              Config
            </Link>
          </div>
        </motion.footer>
      </motion.main>
    </div>
  );
}
