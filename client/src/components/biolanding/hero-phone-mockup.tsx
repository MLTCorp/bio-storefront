'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  GraduationCap,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Star,
  ArrowRight,
  FileText,
  CreditCard,
} from 'lucide-react';

// Circular floating element (like Stan.store)
interface CircleFloatingProps {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  iconBg?: string;
  position: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
}

function CircleFloating({
  icon,
  label,
  bgColor,
  iconBg,
  position,
  delay = 0,
  size = 'md',
}: CircleFloatingProps) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-28 h-28',
  };

  const iconContainerSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  return (
    <motion.div
      className={`absolute ${position} hidden lg:flex flex-col items-center gap-2 z-20`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.8, duration: 0.5, type: 'spring' }}
    >
      <motion.div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-2xl`}
        style={{ background: bgColor }}
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <div
          className={`${iconContainerSizes[size]} rounded-xl flex items-center justify-center`}
          style={{ background: iconBg || 'white' }}
        >
          {icon}
        </div>
      </motion.div>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}

// Payment card floating element
function PaymentCardFloat({ position, delay = 0 }: { position: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute ${position} z-20 hidden lg:block`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.8, duration: 0.5, type: 'spring' }}
    >
      <motion.div
        className="bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3"
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">R$ 297</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded" />
          <CreditCard className="w-5 h-5 text-gray-400" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Secondary phone (checkout) with 3D perspective
function SecondaryPhone() {
  return (
    <motion.div
      className="absolute -right-8 top-8 z-0 hidden xl:block"
      initial={{ opacity: 0, x: 100, rotateY: -25 }}
      animate={{ opacity: 1, x: 0, rotateY: -25 }}
      transition={{ delay: 0.8, duration: 1 }}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px) rotateY(-25deg) rotateX(5deg)',
      }}
    >
      <div className="w-[220px] h-[450px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-1.5 shadow-xl">
        <div className="w-full h-full bg-gray-900 rounded-[2.2rem] overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-20" />

          {/* Screen with blue/cyan theme */}
          <div className="w-full h-full bg-gradient-to-b from-sky-100 to-cyan-50 overflow-hidden">
            {/* Abstract blue image at top */}
            <div className="h-32 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
              <div className="absolute inset-0 opacity-50">
                <div className="absolute top-4 left-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
                <div className="absolute bottom-2 right-4 w-16 h-16 bg-white/30 rounded-full blur-lg" />
              </div>
            </div>

            <div className="p-3 pt-4">
              {/* Price display */}
              <div className="bg-white rounded-xl p-3 shadow-sm mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Total</span>
                  <span className="text-lg font-bold text-gray-800">R$ 297</span>
                </div>
              </div>

              {/* Payment options */}
              <div className="space-y-2">
                <div className="bg-white rounded-xl p-2 shadow-sm flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">PIX</span>
                  </div>
                  <span className="text-xs text-gray-700">Pix</span>
                </div>
                <div className="bg-white rounded-xl p-2 shadow-sm flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-700">Cartao</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroPhoneMockup() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{ perspective: '1500px' }}
    >
      {/* Circular Floating Elements - Left side */}
      <CircleFloating
        icon={<Calendar className="w-6 h-6 text-blue-600" />}
        label="Calendar"
        bgColor="linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)"
        iconBg="white"
        position="-left-28 top-8"
        delay={0}
        size="md"
      />

      <CircleFloating
        icon={<Download className="w-6 h-6 text-amber-600" />}
        label="Downloads"
        bgColor="linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)"
        iconBg="white"
        position="-left-24 bottom-48"
        delay={0.2}
        size="sm"
      />

      {/* Circular Floating Elements - Right side */}
      <CircleFloating
        icon={<GraduationCap className="w-6 h-6 text-indigo-600" />}
        label="Courses"
        bgColor="linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)"
        iconBg="white"
        position="-right-20 top-16"
        delay={0.1}
        size="lg"
      />

      <PaymentCardFloat position="-right-32 bottom-56" delay={0.3} />

      {/* Secondary Phone removed for cleaner look */}

      {/* Main Phone with 3D perspective */}
      <motion.div
        className="relative z-10"
        initial={{ rotateY: 0, rotateX: 0, y: 0 }}
        animate={{
          rotateY: -8,
          rotateX: 3,
          y: [0, -10, 0],
        }}
        whileHover={{ rotateY: -5, rotateX: 2, scale: 1.02 }}
        transition={{
          rotateY: { type: 'spring', stiffness: 100, damping: 15 },
          rotateX: { type: 'spring', stiffness: 100, damping: 15 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Phone Frame */}
        <div className="relative w-[280px] h-[580px] md:w-[320px] md:h-[660px] bg-gradient-to-b from-gray-100 to-gray-200 rounded-[2.5rem] md:rounded-[3rem] p-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
          {/* Inner bezel */}
          <div className="w-full h-full bg-white rounded-[2.2rem] md:rounded-[2.5rem] overflow-hidden relative shadow-inner">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />

            {/* Screen Content */}
            <div className="w-full h-full bg-gradient-to-b from-[#FDF8F3] to-white overflow-hidden">
              {/* Header with name and social icons */}
              <div className="pt-10 pb-2 text-center bg-gradient-to-b from-[#FDF8F3] to-transparent">
                <motion.h2
                  className="text-xl md:text-2xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Alexandra Silva
                </motion.h2>

                {/* Social Icons */}
                <motion.div
                  className="flex justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {[Youtube, Instagram, Twitter, Linkedin, Instagram].map((Icon, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center"
                    >
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Large Profile Photo */}
              <motion.div
                className="relative mx-4 mb-3 rounded-2xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face"
                  alt="Alexandra Silva"
                  className="w-full h-[180px] md:h-[200px] object-cover object-top"
                />
              </motion.div>

              {/* Product Card - Stan.store style */}
              <motion.div
                className="mx-3 bg-[#FDF8F3] rounded-2xl p-3 shadow-sm mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">My Creator Course</p>
                    <p className="text-[10px] text-gray-500 line-clamp-1">
                      Everything you need to know about making money online!
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-gray-800">R$ 129</span>
                      <span className="text-xs text-gray-400 line-through">R$ 249</span>
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        4.7
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                        50% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Get Started button */}
                <motion.button
                  className="w-full mt-3 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-between px-4"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Service items */}
              <motion.div
                className="mx-3 space-y-2 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="bg-[#FDF8F3] rounded-xl p-2.5 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">1:1 Coaching Session</p>
                  </div>
                  <span className="text-xs font-bold text-gray-600">R$ 149</span>
                </div>

                <div className="bg-[#FDF8F3] rounded-xl p-2.5 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">Download My Guide</p>
                  </div>
                  <span className="text-xs font-bold text-gray-600">R$ 29</span>
                </div>
              </motion.div>

              {/* Book a Time button */}
              <motion.div
                className="mx-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <button className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-between px-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                  <span>Book a Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 3D shadow effect */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-8 rounded-full blur-2xl opacity-30 bg-black"
          style={{ transform: 'translateX(-50%) rotateX(80deg)' }}
        />
      </motion.div>
    </motion.div>
  );
}
