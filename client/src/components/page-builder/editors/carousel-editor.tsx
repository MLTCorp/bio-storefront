import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Images, ChevronRight, Plus, Trash2, GripVertical, Link, Tag, X } from "lucide-react";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import type { CarouselConfig, CarouselImage } from "@/types/database";

interface CarouselEditorProps {
  config: CarouselConfig;
  onUpdate: (config: CarouselConfig) => void;
}

export function CarouselEditor({ config, onUpdate }: CarouselEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [localConfig, updateField] = useDebouncedConfig(config, onUpdate, 500);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = localConfig.images || [];
    const remainingSlots = 10 - currentImages.length;

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: CarouselImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: reader.result as string,
          scale: 100,
          positionX: 50,
          positionY: 50,
        };
        updateField("images", [...(localConfig.images || []), newImage]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    const newImages = (localConfig.images || []).filter((img) => img.id !== id);
    updateField("images", newImages);
  };

  const updateImage = (id: string, updates: Partial<CarouselImage>) => {
    const newImages = (localConfig.images || []).map((img) =>
      img.id === id ? { ...img, ...updates } : img
    );
    updateField("images", newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...(localConfig.images || [])];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    updateField("images", newImages);
  };

  const images = localConfig.images || [];
  const canAddMore = images.length < 10;

  return (
    <div className="space-y-3">
      {/* Preview */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
      >
        <div className="flex items-center gap-2">
          <Images className="h-4 w-4 text-amber-600" />
          <span className="text-amber-700">
            Galeria ({images.length}/10 imagens)
          </span>
        </div>
        <ChevronRight
          className={`h-4 w-4 text-amber-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
          {/* Image Grid Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    editingImageId === img.id ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => setEditingImageId(editingImageId === img.id ? null : img.id)}
                >
                  <img
                    src={img.url}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${(img.scale || 100) / 100})`,
                      objectPosition: `${img.positionX || 50}% ${img.positionY || 50}%`,
                    }}
                  />
                  {img.badge && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded">
                      {img.badge}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-[8px] rounded">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Add Image Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          {canAddMore && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-400 hover:bg-amber-50/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                Adicionar imagem ({10 - images.length} restantes)
              </span>
            </button>
          )}

          {/* Selected Image Editor */}
          {editingImageId && (
            <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-amber-700">Editando Imagem</Label>
                <button
                  onClick={() => setEditingImageId(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Badge */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Badge (opcional)
                </Label>
                <Input
                  value={images.find((img) => img.id === editingImageId)?.badge || ""}
                  onChange={(e) => updateImage(editingImageId, { badge: e.target.value })}
                  placeholder="Ex: NOVO, 🔥, 50% OFF"
                  className="text-sm"
                />
              </div>

              {/* Link */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Link className="h-3 w-3" />
                  Link (opcional)
                </Label>
                <Input
                  value={images.find((img) => img.id === editingImageId)?.link || ""}
                  onChange={(e) => updateImage(editingImageId, { link: e.target.value })}
                  placeholder="https://..."
                  className="text-sm"
                />
              </div>

              {/* Scale */}
              <div className="space-y-2">
                <Label className="text-xs">Zoom</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="100"
                    max="200"
                    step="5"
                    value={images.find((img) => img.id === editingImageId)?.scale || 100}
                    onChange={(e) => updateImage(editingImageId, { scale: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-10">
                    {images.find((img) => img.id === editingImageId)?.scale || 100}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Carousel Options */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Opcoes do Carrossel</p>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label className="text-xs">Formato</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'square', label: 'Quadrado', aspect: '1:1' },
                  { value: 'landscape', label: 'Paisagem', aspect: '4:3' },
                  { value: 'portrait', label: 'Retrato', aspect: '3:4' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateField("aspectRatio", option.value as CarouselConfig['aspectRatio'])}
                    className={`p-2 rounded-lg text-xs transition-all ${
                      (localConfig.aspectRatio || 'landscape') === option.value
                        ? "bg-amber-100 text-amber-700 border-2 border-amber-500"
                        : "bg-white border hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-[10px] text-gray-400">{option.aspect}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Show Dots */}
            <div className="flex items-center justify-between">
              <Label className="text-xs">Mostrar indicadores</Label>
              <Switch
                checked={localConfig.showDots !== false}
                onCheckedChange={(checked) => updateField("showDots", checked)}
              />
            </div>

            {/* Auto Play */}
            <div className="flex items-center justify-between">
              <Label className="text-xs">Reproduzir automaticamente</Label>
              <Switch
                checked={localConfig.autoPlay === true}
                onCheckedChange={(checked) => updateField("autoPlay", checked)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
