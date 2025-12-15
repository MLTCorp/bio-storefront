import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Upload, Loader2, Plus, Trash2, Percent, ZoomIn, MoveHorizontal, MoveVertical } from "lucide-react";
import { uploadImage } from "@/lib/supabase";
import { AnimatedGenerateButton } from "@/components/ui/animated-generate-button";
import { AIImageModal } from "@/components/ai-image-modal";
import type { ProductConfig, ProductKit } from "@/types/database";

interface ProductEditorProps {
  config: ProductConfig;
  onUpdate: (config: ProductConfig) => void;
}

export function ProductEditor({ config, onUpdate }: ProductEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, "products");
      if (url) {
        onUpdate({ ...config, image: url });
      }
    } finally {
      setUploading(false);
    }
  };

  const addKit = () => {
    onUpdate({
      ...config,
      kits: [
        ...config.kits,
        {
          id: crypto.randomUUID(),
          label: `${config.kits.length + 1} Un`,
          price: 99,
          link: "",
        },
      ],
    });
  };

  const updateKit = (kitId: string, updates: Partial<ProductKit>) => {
    onUpdate({
      ...config,
      kits: config.kits.map((kit) =>
        kit.id === kitId ? { ...kit, ...updates } : kit
      ),
    });
  };

  const removeKit = (kitId: string) => {
    onUpdate({
      ...config,
      kits: config.kits.filter((kit) => kit.id !== kitId),
    });
  };

  const calculateDiscountedPrice = (price: number) => {
    if (!config.discountPercent) return price;
    return price - (price * config.discountPercent) / 100;
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex gap-3 cursor-pointer"
      >
        {/* Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative group">
          {config.image ? (
            <img
              src={config.image}
              alt={config.title}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${(config.imageScale || 100) / 100})`,
                objectPosition: `${config.imagePositionX ?? 50}% ${config.imagePositionY ?? 50}%`,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Upload className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{config.title || "Produto"}</h3>
          <p className="text-sm text-gray-500 truncate">
            {config.description || "Descricao"}
          </p>
          {config.kits.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium">
                R$ {config.kits[0].price.toFixed(2)}
              </span>
              {config.discountPercent > 0 && (
                <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                  -{config.discountPercent}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-xs">Imagem do Produto</Label>
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
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <AnimatedGenerateButton
                labelIdle="Gerar"
                labelActive="..."
                generating={false}
                onClick={() => setAiModalOpen(true)}
                highlightHueDeg={160}
              />
            </div>
            {config.image && (
              <div className="space-y-2">
                {/* Zoom */}
                <div className="flex items-center gap-2">
                  <ZoomIn className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <Slider
                    value={[config.imageScale || 100]}
                    min={50}
                    max={200}
                    step={10}
                    onValueChange={([value]) =>
                      onUpdate({ ...config, imageScale: value })
                    }
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-8">
                    {config.imageScale || 100}%
                  </span>
                </div>
                {/* Position X */}
                <div className="flex items-center gap-2">
                  <MoveHorizontal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <Slider
                    value={[config.imagePositionX ?? 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([value]) =>
                      onUpdate({ ...config, imagePositionX: value })
                    }
                    className="flex-1"
                  />
                </div>
                {/* Position Y */}
                <div className="flex items-center gap-2">
                  <MoveVertical className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <Slider
                    value={[config.imagePositionY ?? 50]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([value]) =>
                      onUpdate({ ...config, imagePositionY: value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <Label className="text-xs">Titulo</Label>
            <Input
              value={config.title}
              onChange={(e) => onUpdate({ ...config, title: e.target.value })}
              placeholder="Nome do produto"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Descricao</Label>
            <Textarea
              value={config.description}
              onChange={(e) =>
                onUpdate({ ...config, description: e.target.value })
              }
              placeholder="Descricao do produto"
              rows={2}
            />
          </div>

          {/* Discount */}
          <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">
                Desconto
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={config.discountPercent || 0}
                onChange={(e) =>
                  onUpdate({
                    ...config,
                    discountPercent: parseInt(e.target.value),
                  })
                }
                className="h-8 text-sm bg-white border rounded px-2"
              >
                <option value="0">Sem desconto</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
              </select>
            </div>
          </div>

          {/* Kits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Opcoes de Compra</Label>
              <Button variant="ghost" size="sm" onClick={addKit}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            {config.kits.map((kit) => (
              <div
                key={kit.id}
                className="flex gap-2 items-center p-2 bg-white rounded-lg"
              >
                <Input
                  value={kit.label}
                  onChange={(e) => updateKit(kit.id, { label: e.target.value })}
                  placeholder="Label"
                  className="w-24"
                />
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-sm text-gray-500">R$</span>
                  <Input
                    type="number"
                    value={kit.price}
                    onChange={(e) =>
                      updateKit(kit.id, { price: parseFloat(e.target.value) || 0 })
                    }
                    className="flex-1"
                  />
                </div>
                <Input
                  value={kit.link}
                  onChange={(e) => updateKit(kit.id, { link: e.target.value })}
                  placeholder="Link"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeKit(kit.id)}
                  className="text-red-500 hover:text-red-600"
                  disabled={config.kits.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Image Generation Modal */}
      <AIImageModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        type="product"
        onImageGenerated={(imageUrl) => onUpdate({ ...config, image: imageUrl })}
      />
    </div>
  );
}
