import { useState, useRef, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react";
import { Button } from "./button";
import { Slider } from "./slider";
import { cn } from "@/lib/utils";

interface ImagePositionerProps {
  src: string;
  positionX?: number; // 0-100, default 50
  positionY?: number; // 0-100, default 50
  scale?: number; // percentage, default 100
  aspectRatio?: "square" | "portrait" | "landscape" | "circle";
  minScale?: number;
  maxScale?: number;
  onChange: (values: { positionX: number; positionY: number; scale: number }) => void;
  className?: string;
}

export function ImagePositioner({
  src,
  positionX = 50,
  positionY = 50,
  scale = 100,
  aspectRatio = "square",
  minScale = 100,
  maxScale = 300,
  onChange,
  className,
}: ImagePositionerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: positionX, y: positionY });

  // Calculate aspect ratio class
  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-video",
    circle: "aspect-square rounded-full",
  }[aspectRatio];

  // Handle mouse/touch start
  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      setDragStart({ x: clientX, y: clientY });
      setStartPosition({ x: positionX, y: positionY });
    },
    [positionX, positionY]
  );

  // Handle mouse/touch move
  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // Calculate movement as percentage of container size
      const deltaX = ((clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((clientY - dragStart.y) / rect.height) * 100;

      // Invert direction (drag right = image moves left = lower positionX for object-position)
      // Higher zoom = LOWER sensitivity (100/scale), so when zoomed in, small drags have less effect
      const sensitivity = 100 / scale;
      const newX = Math.max(0, Math.min(100, startPosition.x - deltaX * sensitivity));
      const newY = Math.max(0, Math.min(100, startPosition.y - deltaY * sensitivity));

      onChange({ positionX: newX, positionY: newY, scale });
    },
    [isDragging, dragStart, startPosition, scale, onChange]
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  // Global mouse/touch move and end
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    };

    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Handle zoom change
  const handleZoomChange = (newScale: number) => {
    onChange({ positionX, positionY, scale: newScale });
  };

  // Reset to center
  const handleReset = () => {
    onChange({ positionX: 50, positionY: 50, scale: 100 });
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Preview container with drag area */}
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 cursor-move select-none",
          aspectClass,
          isDragging && "border-primary",
          aspectRatio === "circle" ? "rounded-full" : "rounded-lg"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* The image - using width/height percentage for true zoom effect */}
        <img
          src={src}
          alt="Preview"
          className="absolute pointer-events-none"
          style={{
            // Scale controls actual image size (100% = fills container, 200% = twice as big)
            width: `${scale}%`,
            height: `${scale}%`,
            objectFit: "cover",
            // Position calculates offset to keep focal point visible
            // At 100% scale: left/top = 0
            // At 200% scale with positionX=50: left = -50% (centers the image)
            left: `${-(scale - 100) * (positionX / 100)}%`,
            top: `${-(scale - 100) * (positionY / 100)}%`,
          }}
          draggable={false}
        />

        {/* Drag indicator overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            isDragging ? "opacity-0" : "opacity-0 hover:opacity-100"
          )}
        >
          <div className="bg-black/50 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5" />
            Arraste para ajustar
          </div>
        </div>

        {/* Corner guides when dragging */}
        {isDragging && (
          <>
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/70" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/70" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/70" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/70" />
          </>
        )}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => handleZoomChange(Math.max(minScale, scale - 10))}
          disabled={scale <= minScale}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <Slider
          value={[scale]}
          min={minScale}
          max={maxScale}
          step={5}
          onValueChange={([val]) => handleZoomChange(val)}
          className="flex-1"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => handleZoomChange(Math.min(maxScale, scale + 10))}
          disabled={scale >= maxScale}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-gray-500"
          onClick={handleReset}
          title="Resetar posição"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Position info (subtle) */}
      <div className="text-[10px] text-gray-400 text-center">
        Zoom: {scale}% | Pos: {Math.round(positionX)}%, {Math.round(positionY)}%
      </div>
    </div>
  );
}
