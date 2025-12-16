"use client";

import { cn } from "@/lib/utils";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children?: React.ReactNode;
}

export function ShineBorder({
  borderRadius = 8,
  borderWidth = 2,
  duration = 8,
  color = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
  className,
  children,
}: ShineBorderProps) {
  const colors = Array.isArray(color) ? color.join(", ") : color;

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden",
        className,
      )}
      style={{
        borderRadius: `${borderRadius}px`,
      }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          borderRadius: `${borderRadius}px`,
          padding: `${borderWidth}px`,
          background: `linear-gradient(90deg, ${colors}, ${colors})`,
          backgroundSize: "200% 100%",
          animation: `shine ${duration}s linear infinite`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </div>
  );
}

// Simpler inline version for overlay use
export function ShineBorderOverlay({
  borderRadius = 8,
  borderWidth = 2,
  duration = 8,
  color = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
}: Omit<ShineBorderProps, 'className' | 'children'>) {
  const colors = Array.isArray(color) ? color.join(", ") : color;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        borderRadius: `${borderRadius}px`,
        padding: `${borderWidth}px`,
        background: `linear-gradient(90deg, ${colors}, ${colors})`,
        backgroundSize: "200% 100%",
        animation: `shine ${duration}s linear infinite`,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  );
}
