import { useConfig } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function ProfileHeader() {
  const { config } = useConfig();

  const whatsappLink = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappMessage)}`;

  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      <motion.div
        className="relative overflow-visible"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/20 to-emerald-100 opacity-60 blur-xl animate-pulse" />
        <Avatar className="w-24 h-24 border-4 border-white shadow-xl relative overflow-hidden ring-1 ring-black/5">
          <AvatarImage
            src={config.profileImage}
            alt={config.profileName}
            className="object-cover transition-transform duration-300"
            style={{ transform: `scale(${config.profileImageScale / 100})` }}
          />
          <AvatarFallback>{config.profileName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </motion.div>

      <div className="space-y-1 relative z-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{config.profileName}</h1>
        <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto leading-relaxed whitespace-pre-line">
          {config.profileBio}
        </p>
      </div>

      <div className="pt-2">
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{
            scale: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            },
            default: { duration: 0.2 }
          }}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="fill-white relative z-10">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="text-xs font-bold tracking-wide uppercase relative z-10">Fale comigo no Whats</span>
        </motion.a>
      </div>
    </div>
  );
}
