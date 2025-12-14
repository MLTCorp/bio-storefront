import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Globe,
  Link as LinkIcon,
  MessageCircle,
  Send,
  Linkedin,
} from "lucide-react";

interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  globe: Globe,
  link: LinkIcon,
  whatsapp: MessageCircle,
  telegram: Send,
  linkedin: Linkedin,
};

const colorMap: Record<string, string> = {
  instagram: "from-pink-500 to-purple-500",
  facebook: "from-blue-600 to-blue-700",
  youtube: "from-red-500 to-red-600",
  twitter: "from-sky-400 to-sky-500",
  globe: "from-gray-500 to-gray-600",
  link: "from-gray-500 to-gray-600",
  whatsapp: "from-green-500 to-green-600",
  telegram: "from-blue-400 to-blue-500",
  linkedin: "from-blue-700 to-blue-800",
};

export function SocialLinks({ links }: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {links.map((link, index) => {
        const IconComponent = iconMap[link.icon || "link"] || LinkIcon;
        const gradientColor = colorMap[link.icon || "link"] || "from-gray-500 to-gray-600";

        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full
              bg-gradient-to-r ${gradientColor}
              text-white font-medium text-sm
              shadow-lg hover:shadow-xl
              transition-shadow duration-200
            `}
          >
            <IconComponent className="w-4 h-4" />
            <span>{link.label || link.icon || "Link"}</span>
          </motion.a>
        );
      })}
    </div>
  );
}
