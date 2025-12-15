import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Play, Upload, Loader2, Pencil, Video, ZoomIn, MoveHorizontal, MoveVertical } from "lucide-react";
import { uploadImage } from "@/lib/supabase";
import { AnimatedGenerateButton } from "@/components/ui/animated-generate-button";
import { AIImageModal } from "@/components/ai-image-modal";
import type { VideoConfig } from "@/types/database";

interface VideoEditorProps {
  config: VideoConfig;
  onUpdate: (config: VideoConfig) => void;
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
  );
  if (match) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}

export function VideoEditor({ config, onUpdate }: VideoEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const thumbnail =
    config.thumbnail || getYouTubeThumbnail(config.url || "") || "";

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, "profile");
      if (url) {
        onUpdate({ ...config, thumbnail: url });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors"
      >
        {thumbnail ? (
          <>
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${(config.thumbnailScale || 100) / 100})`,
                objectPosition: `${config.thumbnailPositionX ?? 50}% ${config.thumbnailPositionY ?? 50}%`,
              }}
            />
            {/* Edit Overlay - appears on hover when there's a thumbnail */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Pencil className="h-5 w-5 text-gray-700" />
                </div>
                <span className="text-white text-sm font-medium">Clique para editar</span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <Video className="h-10 w-10" />
            <span className="text-sm font-medium">Clique para configurar vídeo</span>
          </div>
        )}
      </div>

      {config.showTitle && config.title && (
        <p className="text-sm text-center text-gray-600">{config.title}</p>
      )}

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <Label className="text-xs">URL do YouTube</Label>
            <Input
              value={config.url || ""}
              onChange={(e) => onUpdate({ ...config, url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Thumbnail Personalizada</Label>
            <div className="flex gap-2">
              <label className="flex-1 p-3 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
                ) : (
                  <>
                    <Upload className="h-5 w-5 mx-auto text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1 block">
                      Upload
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <AnimatedGenerateButton
                labelIdle="Gerar"
                labelActive="..."
                generating={false}
                onClick={() => setAiModalOpen(true)}
                highlightHueDeg={200}
              />
            </div>
            {config.thumbnail && (
              <div className="space-y-2 mt-2">
                {/* Zoom */}
                <div className="flex items-center gap-2">
                  <ZoomIn className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <Slider
                    value={[config.thumbnailScale || 100]}
                    min={100}
                    max={200}
                    step={5}
                    onValueChange={([value]) =>
                      onUpdate({ ...config, thumbnailScale: value })
                    }
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-8">
                    {config.thumbnailScale || 100}%
                  </span>
                </div>
                {/* Position X */}
                <div className="flex items-center gap-2">
                  <MoveHorizontal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <Slider
                    value={[config.thumbnailPositionX ?? 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([value]) =>
                      onUpdate({ ...config, thumbnailPositionX: value })
                    }
                    className="flex-1"
                  />
                </div>
                {/* Position Y */}
                <div className="flex items-center gap-2">
                  <MoveVertical className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <Slider
                    value={[config.thumbnailPositionY ?? 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([value]) =>
                      onUpdate({ ...config, thumbnailPositionY: value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Titulo (opcional)</Label>
            <Input
              value={config.title || ""}
              onChange={(e) => onUpdate({ ...config, title: e.target.value })}
              placeholder="Titulo do video"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs">Mostrar Titulo</Label>
            <Switch
              checked={config.showTitle}
              onCheckedChange={(checked) =>
                onUpdate({ ...config, showTitle: checked })
              }
            />
          </div>
        </div>
      )}

      {/* AI Image Generation Modal */}
      <AIImageModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        type="thumbnail"
        onImageGenerated={(imageUrl) => onUpdate({ ...config, thumbnail: imageUrl })}
      />
    </div>
  );
}
