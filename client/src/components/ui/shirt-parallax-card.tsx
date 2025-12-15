"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Sparkles } from "lucide-react";
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
  className?: string;
  theme?: Theme;
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
  className,
  theme,
}: ShirtParallaxCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

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
    let link = kit.link;
    if (discountPercent > 0 && kit.discountLinks?.[discountPercent]) {
      link = kit.discountLinks[discountPercent];
    }

    if (link && link !== '#') {
      window.open(link, '_blank');
    }
  };

  // Build card styles based on theme
  const cardStyle: React.CSSProperties = theme ? {
    background: theme.card.bg,
    backdropFilter: theme.card.blur > 0 ? `blur(${theme.card.blur}px)` : 'none',
    WebkitBackdropFilter: theme.card.blur > 0 ? `blur(${theme.card.blur}px)` : 'none',
    border: theme.card.border,
    boxShadow: theme.card.shadow,
  } : {};

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
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-20">
            <Badge
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-2.5 py-1 text-xs shadow-lg animate-pulse"
            >
              <Flame className="w-3 h-3 mr-1" />
              {discountPercent}% OFF
            </Badge>
          </div>
        )}

        <div className="flex">
          {/* Image Section */}
          <div className="relative w-28 sm:w-36 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <motion.img
              src={imageUrl}
              alt={title}
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
                {discountPercent > 0 && (
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

            {/* Kit Buttons */}
            <div className="flex gap-1.5 flex-wrap">
              {kits.map((kit, index) => {
                const discountedPrice = kit.price * (1 - discountPercent / 100);
                const isHighlighted = index === 1;
                const hasDiscount = discountPercent > 0;

                return (
                  <Button
                    key={kit.id}
                    variant={isHighlighted ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "flex-1 min-w-[70px] flex flex-col h-auto py-1.5 px-2 gap-0 rounded-lg transition-all",
                      isHighlighted
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md border-0"
                        : "bg-white hover:bg-gray-50 border-gray-200 hover:border-emerald-300"
                    )}
                    onClick={() => handleKitClick(kit)}
                  >
                    <span className={cn(
                      "text-[9px] uppercase tracking-wider font-medium",
                      isHighlighted ? "text-emerald-100" : "text-gray-400"
                    )}>
                      {kit.label}
                    </span>
                    {hasDiscount ? (
                      <div className="flex flex-col items-center leading-none">
                        <span className={cn(
                          "text-[8px] line-through",
                          isHighlighted ? "text-emerald-200" : "text-gray-300"
                        )}>
                          R$ {kit.price.toFixed(0)}
                        </span>
                        <span className={cn(
                          "text-sm font-black",
                          isHighlighted ? "text-white" : "text-emerald-600"
                        )}>
                          R$ {discountedPrice.toFixed(0)}
                        </span>
                      </div>
                    ) : (
                      <span className={cn(
                        "text-sm font-black",
                        isHighlighted ? "text-white" : "text-gray-800"
                      )}>
                        R$ {kit.price.toFixed(0)}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
