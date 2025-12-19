'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Instagram, ShoppingBag, Star, Heart, Calendar, Link2 } from 'lucide-react';

interface PhoneMockupProps {
  className?: string;
}

export function PhoneMockup({ className = '' }: PhoneMockupProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
    >
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
        {/* Inner bezel */}
        <div className="w-full h-full bg-gray-900 rounded-[2.5rem] overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-20" />

          {/* Screen Content */}
          <div className="w-full h-full bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            {/* Bio Store Preview */}
            <div className="p-4 pt-10">
              {/* Profile Section */}
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg text-white text-xl font-bold"
                  style={{
                    background:
                      'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                  }}
                >
                  JD
                </div>
                <h3 className="text-sm font-bold text-gray-800">Julia Designer</h3>
                <p className="text-[10px] text-gray-500">UX Designer & Coach</p>
              </motion.div>

              {/* Mini Product Cards */}
              <motion.div
                className="space-y-2 mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="bg-white rounded-xl p-2 shadow-sm flex items-center gap-2 border border-gray-100">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                    }}
                  >
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-800 truncate">Curso de UX</p>
                    <p className="text-[9px] text-[#7F4AFF] font-bold">R$ 297,00</p>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-4 h-4 text-pink-400" />
                  </motion.div>
                </div>

                <div className="bg-white rounded-xl p-2 shadow-sm flex items-center gap-2 border border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-800 truncate">Mentoria 1:1</p>
                    <p className="text-[9px] text-[#7F4AFF] font-bold">R$ 497,00</p>
                  </div>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex justify-center gap-2 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-[#7F4AFF] rounded-full flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-white" />
                </div>
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>

              {/* WhatsApp CTA */}
              <motion.div
                className="rounded-xl p-2 text-center shadow-lg text-white"
                style={{
                  background:
                    'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
                }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-[10px] font-semibold">Fale comigo no WhatsApp</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          background: 'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
        }}
        animate={{ y: [-4, 4, -4], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Star className="w-6 h-6 text-white fill-white" />
      </motion.div>

      <motion.div
        className="absolute top-20 -left-8 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100"
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Calendar className="w-7 h-7 text-[#7F4AFF]" />
      </motion.div>

      <motion.div
        className="absolute -bottom-2 -left-6 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg"
        animate={{ y: [4, -4, 4], rotate: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 -right-6 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-100"
        animate={{ y: [-4, 4, -4], x: [0, 3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShoppingBag className="w-6 h-6 text-[#7F4AFF]" />
      </motion.div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 -z-10 rounded-[3rem] blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(41.3% 114.84% at 50% 54.35%, #B090FF 0%, #7F4AFF 100%)',
        }}
      />
    </motion.div>
  );
}
