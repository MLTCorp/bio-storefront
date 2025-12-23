import { useState } from "react";
import {
  MessageCircle, ExternalLink, Instagram, Youtube, Facebook, Twitter,
  Calendar, MapPin, Copy, Check, ChevronLeft, ChevronRight,
  Link2, Globe, Linkedin, Github, Mail, Phone, ShoppingBag, Music,
  Podcast, Video, Camera, Heart, Star, Zap, Gift, FileText, Download, Play
} from "lucide-react";
import { ShirtParallaxCard } from "@/components/ui/shirt-parallax-card";
import { CountdownTimer, useDiscountValid } from "@/components/ui/countdown-timer";
import { VideoPlayer } from "@/components/video-player";
import { type Theme, themes } from "@/lib/themes";
import type { PageComponent, ButtonConfig, TextConfig, ProductConfig, VideoConfig, SocialConfig, LinkConfig, CarouselConfig, CalendlyConfig, MapsConfig, PixConfig } from "@/types/database";
import useEmblaCarousel from "embla-carousel-react";

interface ComponentRendererProps {
  component: PageComponent;
  theme?: Theme;
  pageId?: number;
  clerkId?: string; // To exclude owner from analytics
}

// Analytics tracking function
const trackClick = (pageId: number | undefined, componentId: number, componentType: string, componentLabel: string, targetUrl: string, clerkId?: string) => {
  if (!pageId) return;
  fetch('/api/analytics/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageId,
      componentId,
      componentType,
      componentLabel,
      targetUrl,
      clerkId: clerkId || null // Pass clerkId to exclude owner
    })
  }).catch(() => {}); // Silently fail
};

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

// Icon map for link buttons
const linkIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  link: Link2,
  external: ExternalLink,
  globe: Globe,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  github: Github,
  whatsapp: MessageCircle,
  email: Mail,
  phone: Phone,
  shop: ShoppingBag,
  music: Music,
  podcast: Podcast,
  video: Video,
  camera: Camera,
  heart: Heart,
  star: Star,
  zap: Zap,
  gift: Gift,
  calendar: Calendar,
  location: MapPin,
  file: FileText,
  download: Download,
  play: Play,
};

export function ComponentRenderer({ component, theme, pageId, clerkId }: ComponentRendererProps) {
  const currentTheme = theme || themes.light;

  switch (component.type) {
    case "button":
      return <ButtonRenderer config={component.config as ButtonConfig} theme={currentTheme} componentId={component.id} pageId={pageId} clerkId={clerkId} />;
    case "text":
      return <TextRenderer config={component.config as TextConfig} theme={currentTheme} />;
    case "product":
      return <ProductRenderer config={component.config as ProductConfig} theme={currentTheme} componentId={component.id} pageId={pageId} clerkId={clerkId} />;
    case "video":
      return <VideoRenderer config={component.config as VideoConfig} />;
    case "social":
      return <SocialRenderer config={component.config as SocialConfig} theme={currentTheme} componentId={component.id} pageId={pageId} clerkId={clerkId} />;
    case "link":
      return <LinkRenderer config={component.config as LinkConfig} theme={currentTheme} componentId={component.id} pageId={pageId} clerkId={clerkId} />;
    case "carousel":
      return <CarouselRenderer config={component.config as CarouselConfig} theme={currentTheme} componentId={component.id} pageId={pageId} clerkId={clerkId} />;
    case "calendly":
      return <CalendlyRenderer config={component.config as CalendlyConfig} theme={currentTheme} componentId={component.id} pageId={pageId} clerkId={clerkId} />;
    case "maps":
      return <MapsRenderer config={component.config as MapsConfig} theme={currentTheme} componentId={component.id} pageId={pageId} clerkId={clerkId} />;
    case "pix":
      return <PixRenderer config={component.config as PixConfig} theme={currentTheme} componentId={component.id} pageId={pageId} clerkId={clerkId} />;
    default:
      return null;
  }
}

function ButtonRenderer({ config, theme, componentId, pageId, clerkId }: { config: ButtonConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const isWhatsApp = config.type === "whatsapp";

  const handleClick = () => {
    let targetUrl = '';
    if (isWhatsApp && config.whatsappNumber) {
      const message = encodeURIComponent(config.whatsappMessage || "");
      targetUrl = `https://wa.me/${config.whatsappNumber}?text=${message}`;
      window.open(targetUrl, "_blank");
    } else if (config.url) {
      targetUrl = config.url;
      window.open(config.url, "_blank");
    }

    // Track click (exclude owner)
    trackClick(pageId, componentId || 0, isWhatsApp ? 'whatsapp' : 'button', config.text, targetUrl, clerkId);
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

// Product Renderer - Dispatches to different styles
function ProductRenderer({ config, theme, componentId, pageId, clerkId }: { config: ProductConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  switch (config.displayStyle) {
    case 'compact':
      return <ProductCompactRenderer config={config} theme={theme} componentId={componentId} pageId={pageId} clerkId={clerkId} />;
    case 'ecommerce':
      return <ProductEcommerceRenderer config={config} theme={theme} componentId={componentId} pageId={pageId} clerkId={clerkId} />;
    default:
      return <ProductCardRenderer config={config} theme={theme} componentId={componentId} pageId={pageId} clerkId={clerkId} />;
  }
}

// Product Card Renderer - Original 3D parallax style
function ProductCardRenderer({ config, theme, componentId, pageId, clerkId }: { config: ProductConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const handleProductClick = (kitLabel: string, kitUrl: string) => {
    trackClick(pageId, componentId || 0, 'product', `${config.title} - ${kitLabel}`, kitUrl, clerkId);
  };

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
      discountEndDate={config.discountEndDate}
      theme={theme}
      onKitClick={handleProductClick}
    />
  );
}

// Product Compact Renderer - Rating + single CTA button style
function ProductCompactRenderer({ config, theme, componentId, pageId, clerkId }: { config: ProductConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const visibleKits = config.kits.filter(k => k.isVisible !== false);
  const mainKit = visibleKits[0];

  // Check if discount is still valid
  const isDiscountValid = useDiscountValid(config.discountEndDate);
  const effectiveDiscountPercent = isDiscountValid ? config.discountPercent : 0;

  const handleClick = () => {
    const url = config.ctaLink || mainKit?.link || '';
    trackClick(pageId, componentId || 0, 'product', `${config.title} - ${config.ctaText || 'CTA'}`, url, clerkId);
    if (url) window.open(url, '_blank');
  };

  const originalPrice = mainKit?.price || 0;
  const discountedPrice = effectiveDiscountPercent > 0
    ? originalPrice - (originalPrice * effectiveDiscountPercent / 100)
    : originalPrice;

  // Render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400/50 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div
      className="rounded-2xl p-4 shadow-sm border"
      style={{
        background: theme.card.bg,
        borderColor: theme.card.border,
      }}
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {config.image && (
            <img
              src={config.image}
              alt={config.title}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${(config.imageScale || 100) / 100})`,
                objectPosition: `${config.imagePositionX ?? 50}% ${config.imagePositionY ?? 50}%`,
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate" style={{ color: theme.text.primary }}>
            {config.title}
          </h3>
          <p className="text-sm truncate" style={{ color: theme.text.secondary }}>
            {config.description}
          </p>

          {/* Price + Rating Row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Price */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg" style={{ color: theme.text.primary }}>
                R$ {discountedPrice.toFixed(0)}
              </span>
              {effectiveDiscountPercent > 0 && (
                <span className="text-sm line-through" style={{ color: theme.text.secondary }}>
                  R$ {originalPrice.toFixed(0)}
                </span>
              )}
            </div>

            {/* Rating */}
            {config.rating && config.rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex">{renderStars(config.rating)}</div>
                <span className="text-xs font-medium" style={{ color: theme.text.secondary }}>
                  {config.rating.toFixed(1)}
                </span>
                {config.ratingCount && (
                  <span className="text-xs" style={{ color: theme.text.secondary }}>
                    ({config.ratingCount})
                  </span>
                )}
              </div>
            )}

            {/* Discount Badge with Countdown */}
            {effectiveDiscountPercent > 0 && (
              <div className="flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                  {effectiveDiscountPercent}% OFF
                </span>
                {config.discountEndDate && (
                  <CountdownTimer endDate={config.discountEndDate} variant="compact" className="text-orange-600" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleClick}
        className="w-full mt-4 py-3 px-4 rounded-xl font-semibold text-center transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{
          background: theme.button.primary,
          color: theme.button.primaryText,
        }}
      >
        {config.ctaText || 'Comprar Agora'}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// Product E-commerce Renderer - Horizontal with kit selection
function ProductEcommerceRenderer({ config, theme, componentId, pageId, clerkId }: { config: ProductConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const visibleKits = config.kits.filter(k => k.isVisible !== false);

  // Check if discount is still valid
  const isDiscountValid = useDiscountValid(config.discountEndDate);
  const effectiveDiscountPercent = isDiscountValid ? config.discountPercent : 0;

  const handleKitClick = (kit: typeof config.kits[0]) => {
    // Get the appropriate link based on discount
    let url = kit.link;
    if (effectiveDiscountPercent > 0 && kit.discountLinks?.[effectiveDiscountPercent]) {
      url = kit.discountLinks[effectiveDiscountPercent];
    }
    trackClick(pageId, componentId || 0, 'product', `${config.title} - ${kit.label}`, url, clerkId);
    if (url) window.open(url, '_blank');
  };

  const calculatePrice = (price: number, ignoreDiscount?: boolean) => {
    if (ignoreDiscount || !effectiveDiscountPercent) return price;
    return price - (price * effectiveDiscountPercent / 100);
  };

  return (
    <div
      className="rounded-2xl p-4 shadow-sm border relative overflow-hidden"
      style={{
        background: theme.card.bg,
        borderColor: theme.card.border,
      }}
    >
      {/* Discount Badge with Countdown */}
      {effectiveDiscountPercent > 0 && (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-lg">
            {effectiveDiscountPercent}% OFF
          </div>
          {config.discountEndDate && (
            <CountdownTimer endDate={config.discountEndDate} variant="badge" />
          )}
        </div>
      )}

      <div className="flex gap-4">
        {/* Image */}
        <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {config.image && (
            <img
              src={config.image}
              alt={config.title}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${(config.imageScale || 100) / 100})`,
                objectPosition: `${config.imagePositionX ?? 50}% ${config.imagePositionY ?? 50}%`,
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg pr-16" style={{ color: theme.text.primary }}>
            {config.title}
          </h3>
          <p className="text-sm mt-1" style={{ color: theme.text.secondary }}>
            {config.description}
          </p>

          {/* Kits Grid */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {visibleKits.map((kit) => {
              const originalPrice = kit.price;
              const finalPrice = calculatePrice(originalPrice, kit.ignoreDiscount);
              const isHighlighted = kit.isHighlighted;

              return (
                <button
                  key={kit.id}
                  onClick={() => handleKitClick(kit)}
                  className={`flex-1 min-w-[80px] p-2 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                    isHighlighted
                      ? 'border-amber-400 bg-amber-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {isHighlighted && (
                    <div className="text-[10px] font-bold text-amber-600 mb-1">MAIS VENDIDO</div>
                  )}
                  <div className="text-xs font-medium uppercase" style={{ color: theme.text.secondary }}>
                    {kit.label}
                  </div>
                  {effectiveDiscountPercent > 0 && !kit.ignoreDiscount && (
                    <div className="text-[10px] line-through" style={{ color: theme.text.secondary }}>
                      R$ {originalPrice.toFixed(0)}
                    </div>
                  )}
                  <div className={`font-bold ${isHighlighted ? 'text-amber-600' : ''}`} style={isHighlighted ? {} : { color: theme.text.primary }}>
                    R$ {finalPrice.toFixed(0)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
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

function SocialRenderer({ config, theme, componentId, pageId, clerkId }: { config: SocialConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const handleSocialClick = (platform: string, url: string) => {
    trackClick(pageId, componentId || 0, 'social', platform, url, clerkId);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {config.links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleSocialClick(link.platform, link.url)}
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

function LinkRenderer({ config, theme, componentId, pageId, clerkId }: { config: LinkConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const handleLinkClick = () => {
    trackClick(pageId, componentId || 0, 'link', config.text, config.url || '', clerkId);
  };

  // Advanced styling
  const getBackgroundStyle = () => {
    if (config.backgroundColor) return config.backgroundColor;
    if (config.variant === 'outline') return 'transparent';
    if (config.variant === 'soft') return `${theme.button.primary}15`;
    return theme.button.secondary;
  };

  const getBorderStyle = () => {
    if (config.variant === 'outline') return `2px solid ${theme.button.primary}`;
    return 'none';
  };

  const getTextColor = () => {
    if (config.variant === 'outline' || config.variant === 'soft') return theme.button.primary;
    if (config.backgroundColor) return '#fff';
    return theme.button.secondaryText;
  };

  const getBorderRadius = () => {
    if (config.shape === 'pill') return '9999px';
    if (config.shape === 'square') return '8px';
    return '12px'; // rounded default
  };

  const animationClass = config.animation === 'pulse' ? 'animate-pulse' : config.animation === 'shine' ? 'animate-shine' : '';

  // Get icon component
  const IconComponent = config.icon ? linkIcons[config.icon] : null;

  return (
    <a
      href={config.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleLinkClick}
      className={`relative block w-full py-3 px-4 font-medium text-center transition-all hover:opacity-80 overflow-hidden ${animationClass}`}
      style={{
        background: getBackgroundStyle(),
        color: getTextColor(),
        border: getBorderStyle(),
        borderRadius: getBorderRadius(),
      }}
    >
      <div className="flex items-center justify-center gap-2">
        {config.thumbnail && (
          <img
            src={config.thumbnail}
            alt=""
            className="w-8 h-8 rounded-lg object-cover"
            style={{
              transform: `scale(${(config.thumbnailScale || 100) / 100})`,
              objectPosition: `${config.thumbnailPositionX || 50}% ${config.thumbnailPositionY || 50}%`
            }}
          />
        )}
        {IconComponent && <IconComponent className="h-4 w-4" />}
        <span>{config.text}</span>
      </div>
      {config.badge && (
        <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
          {config.badge}
        </span>
      )}
    </a>
  );
}

// Carousel Renderer
function CarouselRenderer({ config, theme, componentId, pageId, clerkId }: { config: CarouselConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const images = config.images || [];
  if (images.length === 0) {
    return (
      <div className="w-full aspect-video rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Nenhuma imagem</span>
      </div>
    );
  }

  const aspectRatioClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[config.aspectRatio || 'landscape'];

  const handleImageClick = (image: typeof images[0]) => {
    if (image.link) {
      trackClick(pageId, componentId || 0, 'carousel', `Image ${image.id}`, image.link, clerkId);
      window.open(image.link, '_blank');
    }
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`flex-[0_0_100%] min-w-0 ${aspectRatioClass} relative cursor-pointer`}
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.url}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${(image.scale || 100) / 100})`,
                  objectPosition: `${image.positionX || 50}% ${image.positionY || 50}%`,
                }}
              />
              {image.badge && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-lg">
                  {image.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {config.showDots !== false && images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex ? 'bg-gray-800 w-4' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Calendly Renderer
function CalendlyRenderer({ config, theme, componentId, pageId, clerkId }: { config: CalendlyConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const handleCalendlyClick = () => {
    trackClick(pageId, componentId || 0, 'calendly', config.buttonText || 'Agendar', config.url, clerkId);
    if (config.embedType === 'button') {
      window.open(config.url, '_blank');
    }
  };

  if (!config.url) {
    return (
      <div className="w-full py-4 rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Configure o URL do Calendly</span>
      </div>
    );
  }

  if (config.embedType === 'inline') {
    return (
      <div
        className="w-full rounded-xl overflow-hidden border"
        style={{ height: config.height || 600, borderColor: theme.card.border }}
      >
        <iframe
          src={config.url}
          width="100%"
          height="100%"
          frameBorder="0"
        />
      </div>
    );
  }

  return (
    <button
      onClick={handleCalendlyClick}
      className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
      style={{
        background: theme.button.primary,
        color: theme.button.primaryText,
      }}
    >
      <Calendar className="h-5 w-5" />
      {config.buttonText || 'Agendar'}
    </button>
  );
}

// Maps Renderer
function MapsRenderer({ config, theme, componentId, pageId, clerkId }: { config: MapsConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const handleOpenMaps = () => {
    const mapsUrl = config.embedUrl
      ? config.embedUrl.replace('/embed?', '/place?')
      : `https://www.google.com/maps/search/${encodeURIComponent(config.address || '')}`;
    trackClick(pageId, componentId || 0, 'maps', config.address || 'Mapa', mapsUrl, clerkId);
    window.open(mapsUrl, '_blank');
  };

  if (!config.embedUrl && !config.address) {
    return (
      <div className="w-full py-4 rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Configure o mapa</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {config.embedUrl && (
        <div
          className="w-full rounded-xl overflow-hidden border"
          style={{ height: config.height || 200, borderColor: theme.card.border }}
        >
          <iframe
            src={config.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {config.address && (
        <p className="text-sm text-center" style={{ color: theme.text.secondary }}>
          {config.address}
        </p>
      )}

      {config.showOpenButton !== false && (
        <button
          onClick={handleOpenMaps}
          className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 text-sm"
          style={{
            background: theme.button.secondary,
            color: theme.button.secondaryText,
          }}
        >
          <MapPin className="h-4 w-4" />
          Abrir no Google Maps
        </button>
      )}
    </div>
  );
}

// PIX Renderer
function PixRenderer({ config, theme, componentId, pageId, clerkId }: { config: PixConfig; theme: Theme; componentId?: number; pageId?: number; clerkId?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (config.pixCode) {
      await navigator.clipboard.writeText(config.pixCode);
      setCopied(true);
      trackClick(pageId, componentId || 0, 'pix', 'Copiar codigo PIX', '', clerkId);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return null;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (config.mode === 'qrcode' && !config.qrcodeImage) {
    return (
      <div className="w-full py-8 rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">QR Code nao configurado</span>
      </div>
    );
  }

  if (config.mode === 'copypaste' && !config.pixCode) {
    return (
      <div className="w-full py-8 rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Codigo PIX nao configurado</span>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-xl space-y-3"
      style={{
        background: theme.card.bg,
        border: theme.card.border,
      }}
    >
      {/* Header info */}
      {(config.recipientName || config.amount) && (
        <div className="text-center space-y-1">
          {config.recipientName && (
            <p className="font-medium" style={{ color: theme.text.primary }}>
              {config.recipientName}
            </p>
          )}
          {config.amount && (
            <p className="text-2xl font-bold text-teal-600">
              {formatCurrency(config.amount)}
            </p>
          )}
          {config.description && (
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              {config.description}
            </p>
          )}
        </div>
      )}

      {/* QR Code */}
      {config.mode === 'qrcode' && config.qrcodeImage && (
        <div className="flex justify-center">
          <img
            src={config.qrcodeImage}
            alt="QR Code PIX"
            className="w-48 h-48 rounded-lg border bg-white p-2"
            style={{ borderColor: theme.card.border }}
          />
        </div>
      )}

      {/* Copy-paste code */}
      {config.mode === 'copypaste' && config.pixCode && (
        <div className="space-y-2">
          <div
            className="p-3 rounded-lg text-xs font-mono break-all max-h-24 overflow-y-auto"
            style={{
              background: theme.button.secondary,
              color: theme.text.secondary,
            }}
          >
            {config.pixCode}
          </div>
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
            style={{
              background: copied ? '#10B981' : '#14B8A6',
              color: 'white',
            }}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar codigo PIX
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
