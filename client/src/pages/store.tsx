import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Loader2, Settings } from "lucide-react";
import { BackgroundEffect } from "@/components/background-effect";
import { ProfileHeader } from "@/components/profile-header";
import { VideoPlayer } from "@/components/video-player";
import { ShirtParallaxCard } from "@/components/ui/shirt-parallax-card";
import { SocialLinks } from "@/components/social-links";

interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

interface StoreData {
  id: number;
  username: string;
  profile_name: string;
  profile_bio: string;
  profile_image: string;
  profile_image_scale: number;
  video_url: string;
  show_video: boolean;
  whatsapp_number: string;
  whatsapp_message: string;
  discount_percent: number;
  products: any[];
  links: SocialLink[];
}

export default function StorePage() {
  const [, params] = useRoute("/:username");
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params?.username) return;

    fetch(`/api/stores/${params.username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setStore(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [params?.username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
          <p className="text-gray-600 mb-4">Página não encontrada</p>
          <Link href="/">
            <button className="px-4 py-2 bg-primary text-white rounded-lg">
              Voltar ao início
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Convert store data to config format for components
  const config = {
    profileName: store.profile_name,
    profileBio: store.profile_bio,
    profileImage: store.profile_image,
    profileImageScale: store.profile_image_scale,
    videoUrl: store.video_url,
    showVideo: store.show_video !== false, // Default to true
    whatsappNumber: store.whatsapp_number,
    whatsappMessage: store.whatsapp_message,
    discountPercent: store.discount_percent,
    products: store.products || [],
    links: store.links || [],
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-500 relative">
      <BackgroundEffect />

      <motion.main
        className="max-w-[480px] mx-auto min-h-screen bg-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] px-4 py-8 md:my-8 md:rounded-[32px] md:min-h-[calc(100vh-4rem)] md:border border-white/50 backdrop-blur-2xl relative overflow-hidden ring-1 ring-white/60"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ opacity: 1 }}
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
            {config.profileImage ? (
              <img
                src={config.profileImage}
                alt={config.profileName}
                className="w-full h-full object-cover"
                style={{ transform: `scale(${config.profileImageScale / 100})` }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl font-bold text-primary">
                {config.profileName.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{config.profileName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{config.profileBio}</p>

          {config.whatsappNumber && (
            <a
              href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Fale comigo no WhatsApp
            </a>
          )}
        </motion.div>

        {/* Social Links */}
        {config.links.length > 0 && (
          <motion.div variants={itemVariants}>
            <SocialLinks links={config.links} />
          </motion.div>
        )}

        {/* Video */}
        {config.videoUrl && config.showVideo && (
          <motion.div variants={itemVariants} className="mb-6">
            <VideoPlayer />
          </motion.div>
        )}

        {/* Products */}
        {config.products && config.products.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <h2 className="text-sm font-bold text-foreground/80 uppercase tracking-wider">
                Ofertas Especiais
              </h2>
              <div className="h-px bg-border flex-1" />
            </div>
            <div className="px-2 space-y-4">
              {config.products.map((product: any) => (
                <ShirtParallaxCard
                  key={product.id}
                  productId={product.id}
                  title={product.title}
                  description={product.description}
                  imageUrl={product.image}
                  imageScale={product.imageScale}
                  kits={product.kits}
                  discountPercent={product.discountPercent ?? config.discountPercent}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer variants={itemVariants} className="mt-12 text-center space-y-4 opacity-60">
          <p className="text-xs text-muted-foreground">
            © 2025 {config.profileName}. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </motion.footer>
      </motion.main>
    </div>
  );
}
