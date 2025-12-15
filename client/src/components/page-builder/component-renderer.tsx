import { MessageCircle, ExternalLink, Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import { ShirtParallaxCard } from "@/components/ui/shirt-parallax-card";
import { VideoPlayer } from "@/components/video-player";
import { type Theme, themes } from "@/lib/themes";
import type { PageComponent, ButtonConfig, TextConfig, ProductConfig, VideoConfig, SocialConfig, LinkConfig } from "@/types/database";

interface ComponentRendererProps {
  component: PageComponent;
  theme?: Theme;
}

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  tiktok: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  ),
};

const platformColors: Record<string, string> = {
  instagram: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
  youtube: "bg-red-600",
  facebook: "bg-blue-600",
  twitter: "bg-black",
  tiktok: "bg-black",
  custom: "bg-gray-600",
};

export function ComponentRenderer({ component, theme }: ComponentRendererProps) {
  const currentTheme = theme || themes.light;

  switch (component.type) {
    case "button":
      return <ButtonRenderer config={component.config as ButtonConfig} theme={currentTheme} />;
    case "text":
      return <TextRenderer config={component.config as TextConfig} theme={currentTheme} />;
    case "product":
      return <ProductRenderer config={component.config as ProductConfig} theme={currentTheme} />;
    case "video":
      return <VideoRenderer config={component.config as VideoConfig} />;
    case "social":
      return <SocialRenderer config={component.config as SocialConfig} theme={currentTheme} />;
    case "link":
      return <LinkRenderer config={component.config as LinkConfig} theme={currentTheme} />;
    default:
      return null;
  }
}

function ButtonRenderer({ config, theme }: { config: ButtonConfig; theme: Theme }) {
  const isWhatsApp = config.type === "whatsapp";

  const handleClick = () => {
    if (isWhatsApp && config.whatsappNumber) {
      const message = encodeURIComponent(config.whatsappMessage || "");
      window.open(`https://wa.me/${config.whatsappNumber}?text=${message}`, "_blank");
    } else if (config.url) {
      window.open(config.url, "_blank");
    }
  };

  const buttonStyle = isWhatsApp
    ? {}
    : {
        background: theme.button.primary,
        color: theme.button.primaryText,
      };

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 ${
        isWhatsApp ? "bg-green-500 text-white hover:bg-green-600" : ""
      }`}
      style={buttonStyle}
    >
      {isWhatsApp ? (
        <MessageCircle className="h-5 w-5" />
      ) : (
        <ExternalLink className="h-4 w-4" />
      )}
      {config.text}
    </button>
  );
}

function TextRenderer({ config, theme }: { config: TextConfig; theme: Theme }) {
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <p
      className={`${alignClasses[config.alignment]} ${sizeClasses[config.size]} ${
        config.bold ? "font-bold" : ""
      } ${config.italic ? "italic" : ""}`}
      style={{ color: theme.text.primary }}
    >
      {config.content}
    </p>
  );
}

function ProductRenderer({ config, theme }: { config: ProductConfig; theme: Theme }) {
  return (
    <ShirtParallaxCard
      productId={config.id || crypto.randomUUID()}
      title={config.title}
      description={config.description}
      imageUrl={config.image}
      imageScale={config.imageScale || 100}
      imagePositionX={config.imagePositionX ?? 50}
      imagePositionY={config.imagePositionY ?? 50}
      kits={config.kits}
      discountPercent={config.discountPercent || 0}
      theme={theme}
    />
  );
}

function VideoRenderer({ config }: { config: VideoConfig }) {
  return (
    <VideoPlayer
      videoUrl={config.url}
      thumbnail={config.thumbnail}
      thumbnailScale={config.thumbnailScale || 100}
      thumbnailPositionX={config.thumbnailPositionX ?? 50}
      thumbnailPositionY={config.thumbnailPositionY ?? 50}
    />
  );
}

function SocialRenderer({ config, theme }: { config: SocialConfig; theme: Theme }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {config.links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
            platformColors[link.platform]
          } hover:opacity-80 transition-opacity`}
        >
          {platformIcons[link.platform]}
        </a>
      ))}
    </div>
  );
}

function LinkRenderer({ config, theme }: { config: LinkConfig; theme: Theme }) {
  return (
    <a
      href={config.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full py-3 px-4 rounded-xl font-medium text-center transition-all hover:opacity-80"
      style={{
        background: theme.button.secondary,
        color: theme.button.secondaryText,
      }}
    >
      {config.text}
    </a>
  );
}
