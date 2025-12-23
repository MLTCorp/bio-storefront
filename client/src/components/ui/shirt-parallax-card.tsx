"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Flame, Sparkles } from "lucide-react";
import { ShineBorderOverlay } from "@/components/magicui/shine-border";
import { CountdownTimer, useDiscountValid } from "@/components/ui/countdown-timer";
import type { ProductKit } from "@/lib/store";
import type { Theme } from "@/lib/themes";

interface ShirtParallaxCardProps {
  productId: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageScale?: number;
  imagePositionX?: number;
  imagePositionY?: number;
  kits: ProductKit[];
  discountPercent?: number;
  discountEndDate?: string; // ISO 8601 date string for countdown timer
  className?: string;
  theme?: Theme;
  onKitClick?: (kitLabel: string, kitUrl: string) => void;
}

export function ShirtParallaxCard({
  productId,
  title,
  description,
  imageUrl,
  imageScale = 100,
  imagePositionX = 50,
  imagePositionY = 50,
  kits,
  discountPercent = 0,
  discountEndDate,
  className,
  theme,
  onKitClick,
}: ShirtParallaxCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Check if discount is still valid (not expired)
  const isDiscountValid = useDiscountValid(discountEndDate);
  const effectiveDiscountPercent = isDiscountValid ? discountPercent : 0;

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleKitClick = (kit: ProductKit) => {
    // Use discount-specific link if discount is active and link exists
    // But respect ignoreDiscount flag
    let link = kit.link;
    const kitDiscount = kit.ignoreDiscount ? 0 : effectiveDiscountPercent;
    if (kitDiscount > 0 && kit.discountLinks?.[kitDiscount]) {
      link = kit.discountLinks[kitDiscount];
    }

    if (link && link !== '#') {
      // Track click before opening
      onKitClick?.(kit.label, link);
      window.open(link, '_blank');
    }
  };

  // Build card styles based on theme - use innerCard for product cards
  const cardStyle: React.CSSProperties = theme ? {
    background: theme.innerCard.bg,
    backdropFilter: theme.innerCard.blur > 0 ? `blur(${theme.innerCard.blur}px)` : 'none',
    WebkitBackdropFilter: theme.innerCard.blur > 0 ? `blur(${theme.innerCard.blur}px)` : 'none',
    border: theme.innerCard.border,
    boxShadow: theme.innerCard.shadow,
  } : {};

  // Check if it's a dark theme
  const isDarkTheme = theme?.id === 'dark' || theme?.id === 'cyber';

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn("relative w-full cursor-pointer", className)}
    >
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden",
          !theme && "bg-white border border-gray-100 shadow-sm"
        )}
        style={cardStyle}
      >
        {/* Shine Border for Discount Products - golden gradient for sales */}
        {effectiveDiscountPercent > 0 && (
          <ShineBorderOverlay
            borderRadius={16}
            borderWidth={2}
            duration={8}
            color={["#f59e0b", "#fbbf24", "#d97706"]}
          />
        )}

        {/* Discount Badge with Countdown */}
        {effectiveDiscountPercent > 0 && (
          <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1">
            <Badge
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-2.5 py-1 text-xs shadow-lg animate-pulse"
            >
              <Flame className="w-3 h-3 mr-1" />
              {effectiveDiscountPercent}% OFF
            </Badge>
            {discountEndDate && (
              <CountdownTimer
                endDate={discountEndDate}
                variant="badge"
              />
            )}
          </div>
        )}

        <div className="flex">
          {/* Image Section - smaller on mobile */}
          <div className="relative w-20 sm:w-28 md:w-36 aspect-square flex-shrink-0 overflow-hidden">
            <motion.img
              src={imageUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              className="absolute object-cover"
              style={{
                width: `${imageScale}%`,
                height: `${imageScale}%`,
                left: `${-((imageScale) - 100) * (imagePositionX / 100)}%`,
                top: `${-((imageScale) - 100) * (imagePositionY / 100)}%`,
              }}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col justify-between min-h-[140px]">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-base font-bold leading-tight"
                  style={{ color: theme?.text.primary || '#111827' }}
                >
                  {title}
                </h3>
                {effectiveDiscountPercent > 0 && (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                )}
              </div>
              {description && (
                <p
                  className="text-xs line-clamp-2"
                  style={{ color: theme?.text.secondary || '#6b7280' }}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Kit Buttons - Filter hidden kits */}
            <div className="flex gap-1.5 flex-wrap">
              {kits
                .filter((kit) => kit.isVisible !== false)
                .map((kit) => {
                // Check if this kit should ignore the discount
                const kitDiscount = kit.ignoreDiscount ? 0 : effectiveDiscountPercent;
                const discountedPrice = kit.price * (1 - kitDiscount / 100);
                const hasDiscount = kitDiscount > 0;

                // Button styles based on theme - all buttons equal
                const buttonStyle: React.CSSProperties = {
                  background: theme?.button.secondary || '#ffffff',
                  color: theme?.button.secondaryText || '#111827',
                  border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e5e7eb',
                };

                return (
                  <button
                    key={kit.id}
                    className={cn(
                      "relative flex-1 min-w-[70px] flex flex-col items-center h-auto py-2 px-2 gap-0 rounded-lg transition-all hover:opacity-80 overflow-hidden"
                    )}
                    style={buttonStyle}
                    onClick={() => handleKitClick(kit)}
                  >
                    {/* Shine Border for Special Kits */}
                    {kit.isSpecial && (
                      <ShineBorderOverlay
                        borderRadius={8}
                        borderWidth={2}
                        duration={8}
                        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                      />
                    )}
                    <span
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{
                        color: theme?.button.secondaryText || '#374151'
                      }}
                    >
                      {kit.label}
                    </span>
                    {hasDiscount ? (
                      <div className="flex flex-col items-center leading-none">
                        <span
                          className="text-[10px] line-through mt-0.5"
                          style={{
                            opacity: 0.6,
                            color: theme?.button.secondaryText || '#9ca3af'
                          }}
                        >
                          R$ {kit.price.toFixed(0)}
                        </span>
                        <span className="text-base font-bold">
                          R$ {discountedPrice.toFixed(0)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-bold">
                        R$ {kit.price.toFixed(0)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
