import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Move, MoveHorizontal, MoveVertical } from "lucide-react";

interface ImagePositionControlProps {
  imageUrl: string;
  scale?: number;
  positionX: number;
  positionY: number;
  onPositionXChange: (value: number) => void;
  onPositionYChange: (value: number) => void;
  aspectRatio?: "square" | "video"; // square = 1:1, video = 16:9
  className?: string;
}

export function ImagePositionControl({
  imageUrl,
  scale = 100,
  positionX,
  positionY,
  onPositionXChange,
  onPositionYChange,
  aspectRatio = "square",
  className = "",
}: ImagePositionControlProps) {
  const aspectClass = aspectRatio === "video" ? "aspect-video" : "aspect-square";

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Preview */}
      <div className={`relative ${aspectClass} bg-gray-100 rounded-lg overflow-hidden border border-gray-200`}>
        <img
          src={imageUrl}
          alt="Preview"
          className="absolute w-full h-full"
          style={{
            objectFit: "cover",
            objectPosition: `${positionX}% ${positionY}%`,
            transform: `scale(${scale / 100})`,
          }}
        />
        {/* Position indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-3 h-3 bg-white rounded-full shadow-lg border-2 border-purple-500 transition-all duration-150"
            style={{
              transform: `translate(${(positionX - 50) * 1.5}px, ${(positionY - 50) * 1.5}px)`,
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MoveHorizontal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <Slider
            value={[positionX]}
            onValueChange={([val]) => onPositionXChange(val)}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-gray-500 w-8 text-right">{positionX}%</span>
        </div>
        <div className="flex items-center gap-2">
          <MoveVertical className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <Slider
            value={[positionY]}
            onValueChange={([val]) => onPositionYChange(val)}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-gray-500 w-8 text-right">{positionY}%</span>
        </div>
      </div>
    </div>
  );
}

// Simpler version with just sliders (no preview)
interface ImagePositionSlidersProps {
  positionX: number;
  positionY: number;
  onPositionXChange: (value: number) => void;
  onPositionYChange: (value: number) => void;
  label?: string;
}

export function ImagePositionSliders({
  positionX,
  positionY,
  onPositionXChange,
  onPositionYChange,
  label = "Posicao",
}: ImagePositionSlidersProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-xs text-gray-500 flex items-center gap-1">
          <Move className="w-3 h-3" />
          {label}
        </Label>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <MoveHorizontal className="w-3 h-3 text-gray-400 shrink-0" />
          <Slider
            value={[positionX]}
            onValueChange={([val]) => onPositionXChange(val)}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <MoveVertical className="w-3 h-3 text-gray-400 shrink-0" />
          <Slider
            value={[positionY]}
            onValueChange={([val]) => onPositionYChange(val)}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
