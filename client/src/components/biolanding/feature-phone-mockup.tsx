'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle,
  Instagram,
  Youtube,
  Linkedin,
  ShoppingBag,
  Star,
  Heart,
  Play,
  Calendar,
  Link2,
  CreditCard,
  Download,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

type Variant = 'links' | 'video' | 'store';

interface FeaturePhoneMockupProps {
  variant: Variant;
  color: string;
  className?: string;
}

// Variant 1: Links style (simple bio links with image carousel)
function LinksVariant({ color }: { color: string }) {
  const nailImages = [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=150&h=150&fit=crop',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=150&h=150&fit=crop',
  ];

  return (
    <div className="p-3 pt-8">
      {/* Profile */}
      <div className="text-center mb-3">
        <div
          className="w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg text-white text-lg font-bold"
          style={{ background: color }}
        >
          MN
        </div>
        <h3 className="text-xs font-bold text-gray-800">Marina Nails</h3>
        <p className="text-[9px] text-gray-500">Nail Designer | Unhas em Gel</p>
      </div>

      {/* Image Carousel */}
      <div className="mb-3 -mx-1">
        <motion.div
          className="flex gap-1.5 px-1"
          animate={{ x: [0, -60, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {nailImages.map((img, i) => (
            <motion.div
              key={i}
              className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              <img src={img} alt={`Nail ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <div
                  className="absolute bottom-0 left-0 right-0 py-0.5 text-center text-[7px] font-semibold text-white"
                  style={{ background: color }}
                >
                  NOVO
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Links */}
      <div className="space-y-1.5 mb-3">
        {[
          { icon: Link2, text: 'Meu Portfolio', highlight: false },
          { icon: Calendar, text: 'Agendar Horario', highlight: true },
          { icon: Instagram, text: '@marina.nails', highlight: false },
        ].map((link, i) => (
          <motion.div
            key={i}
            className={`rounded-xl p-2 flex items-center gap-2 ${
              link.highlight
                ? 'text-white shadow-lg'
                : 'bg-white border border-gray-100 text-gray-700'
            }`}
            style={link.highlight ? { background: color } : {}}
            whileHover={{ scale: 1.02 }}
          >
            <link.icon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium flex-1">{link.text}</span>
            <ArrowRight className="w-3 h-3 opacity-50" />
          </motion.div>
        ))}
      </div>

      {/* Social row */}
      <div className="flex justify-center gap-2">
        {[Instagram, MessageCircle].map((Icon, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: i === 1 ? '#25D366' : `${color}20` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: i === 1 ? 'white' : color }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Variant 2: Video style (with video embed and schedule)
function VideoVariant({ color }: { color: string }) {
  return (
    <div className="p-3 pt-8">
      {/* Profile */}
      <div className="text-center mb-3">
        <div
          className="w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg text-white text-lg font-bold"
          style={{ background: color }}
        >
          FC
        </div>
        <h3 className="text-xs font-bold text-gray-800">Fit com Carol</h3>
        <p className="text-[9px] text-gray-500">Personal Trainer | Transformacao</p>
      </div>

      {/* Video Thumbnail */}
      <motion.div
        className="relative rounded-xl overflow-hidden mb-3 shadow-lg"
        whileHover={{ scale: 1.02 }}
      >
        <img
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=150&fit=crop"
          alt="Video"
          className="w-full h-24 object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: color }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Play className="w-5 h-5 ml-0.5" fill="white" />
          </motion.div>
        </div>
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded">
          12:34
        </div>
      </motion.div>

      {/* Schedule slots */}
      <div className="bg-gray-50 rounded-xl p-2 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-[10px] font-semibold text-gray-700">Proximos Horarios</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {['09:00', '10:30', '14:00'].map((time, i) => (
            <div
              key={i}
              className={`text-center py-1.5 rounded-lg text-[9px] font-medium ${
                i === 0 ? 'text-white' : 'bg-white text-gray-600 border border-gray-100'
              }`}
              style={i === 0 ? { background: color } : {}}
            >
              {time}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-around mb-3">
        {[
          { icon: Users, value: '2.4k', label: 'Alunos' },
          { icon: Star, value: '4.9', label: 'Rating' },
          { icon: Clock, value: '500+', label: 'Treinos' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <stat.icon className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color }} />
            <p className="text-[10px] font-bold text-gray-800">{stat.value}</p>
            <p className="text-[8px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        className="rounded-xl p-2.5 text-center text-white shadow-lg"
        style={{ background: color }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-[10px] font-semibold">Agendar Avaliacao Gratuita</p>
      </motion.div>
    </div>
  );
}

// Variant 3: Store style (products with checkout)
function StoreVariant({ color }: { color: string }) {
  return (
    <div className="p-3 pt-8">
      {/* Profile */}
      <div className="text-center mb-3">
        <div
          className="w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center shadow-lg text-white text-lg font-bold"
          style={{ background: color }}
        >
          BM
        </div>
        <h3 className="text-xs font-bold text-gray-800">Bia Marketing</h3>
        <p className="text-[9px] text-gray-500">Mentora de Negocios Digitais</p>
      </div>

      {/* Featured Product */}
      <motion.div
        className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 mb-2"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex gap-2">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop"
            alt="Product"
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-800">Mentoria VIP 1:1</p>
            <div className="flex items-center gap-1 my-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-[8px] text-gray-500">(127)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold" style={{ color }}>
                R$ 997
              </span>
              <span className="text-[9px] text-gray-400 line-through">R$ 1.997</span>
            </div>
          </div>
        </div>
        <button
          className="w-full mt-2 py-1.5 rounded-lg text-white text-[9px] font-semibold flex items-center justify-center gap-1"
          style={{ background: color }}
        >
          <ShoppingBag className="w-3 h-3" />
          Comprar Agora
        </button>
      </motion.div>

      {/* Quick buy items */}
      <div className="space-y-1.5 mb-3">
        {[
          { name: 'E-book: Instagram Pro', price: 'R$ 47', sold: '1.2k vendidos' },
          { name: 'Planilha de Conteudo', price: 'R$ 27', sold: '890 vendidos' },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-2 flex items-center gap-2 border border-gray-100"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${color}20` }}
            >
              <Download className="w-4 h-4" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-medium text-gray-800 truncate">{item.name}</p>
              <p className="text-[8px] text-gray-500">{item.sold}</p>
            </div>
            <span className="text-[10px] font-bold" style={{ color }}>
              {item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Payment methods */}
      <div className="bg-gray-50 rounded-xl p-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span className="text-[8px] text-gray-600">Pagamento Seguro</span>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-4 bg-green-500 rounded text-[6px] text-white flex items-center justify-center font-bold">
              PIX
            </div>
            <CreditCard className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="flex justify-center gap-2">
        {[Instagram, Linkedin, MessageCircle].map((Icon, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: i === 2 ? '#25D366' : `${color}20` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: i === 2 ? 'white' : color }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturePhoneMockup({ variant, color, className = '' }: FeaturePhoneMockupProps) {
  const floatingElements = {
    links: { icon: Link2, color: color },
    video: { icon: Play, color: color },
    store: { icon: ShoppingBag, color: color },
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Phone Frame */}
      <div className="relative w-[240px] h-[490px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-1.5 shadow-2xl">
        {/* Inner bezel */}
        <div className="w-full h-full bg-gray-900 rounded-[2.2rem] overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl z-20" />

          {/* Screen Content */}
          <div className="w-full h-full bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            {variant === 'links' && <LinksVariant color={color} />}
            {variant === 'video' && <VideoVariant color={color} />}
            {variant === 'store' && <StoreVariant color={color} />}
          </div>
        </div>
      </div>

      {/* Floating element */}
      <motion.div
        className="absolute -top-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
        style={{ background: color }}
        animate={{ y: [-3, 3, -3], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {variant === 'links' && <Star className="w-5 h-5 text-white fill-white" />}
        {variant === 'video' && <Play className="w-5 h-5 text-white" fill="white" />}
        {variant === 'store' && <Heart className="w-5 h-5 text-white fill-white" />}
      </motion.div>

      {/* Floating WhatsApp */}
      <motion.div
        className="absolute -bottom-2 -left-4 w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg"
        animate={{ y: [3, -3, 3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MessageCircle className="w-4 h-4 text-white" />
      </motion.div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 -z-10 rounded-[2.5rem] blur-2xl opacity-25"
        style={{ background: color }}
      />
    </motion.div>
  );
}
