import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Plus, Trash2, Percent, Crop, Link as LinkIcon, ChevronDown, ChevronUp, Link2, ImageIcon, Pencil, Download, Eye, EyeOff, Sparkles, Star, CalendarIcon, Clock, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, addHours } from "date-fns";
import { ptBR } from "date-fns/locale";
import { uploadImage } from "@/lib/supabase";
import { AnimatedGenerateButton } from "@/components/ui/animated-generate-button";
import { AIImageModal } from "@/components/ai-image-modal";
import { ImagePositioner } from "@/components/ui/image-positioner";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProductConfig, ProductKit } from "@/types/database";
import type { Theme } from "@/lib/themes";

interface ProductEditorProps {
  config: ProductConfig;
  onUpdate: (config: ProductConfig) => void;
  theme?: Theme;
}

export function ProductEditor({ config, onUpdate, theme }: ProductEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [expandedKitId, setExpandedKitId] = useState<string | null>(null);
  const [imageEditMode, setImageEditMode] = useState(false);
  const [discountLinksExpandedKitId, setDiscountLinksExpandedKitId] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Debounced config - local state for instant UI, saves after 500ms of no typing
  const [localConfig, updateField, updateFields] = useDebouncedConfig(config, onUpdate, 500);

  // Reset image edit mode when card is collapsed
  useEffect(() => {
    if (!expanded) setImageEditMode(false);
  }, [expanded]);

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

  const handleDownloadImage = async () => {
    if (!config.image) return;
    try {
      const response = await fetch(config.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `produto-${localConfig.title || "imagem"}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(config.image, "_blank");
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
    const newKits = localConfig.kits.map((kit) =>
      kit.id === kitId ? { ...kit, ...updates } : kit
    );
    updateField("kits", newKits);
  };

  const removeKit = (kitId: string) => {
    const newKits = localConfig.kits.filter((kit) => kit.id !== kitId);
    updateField("kits", newKits);
  };

  const calculateDiscountedPrice = (price: number) => {
    if (!localConfig.discountPercent) return price;
    return price - (price * localConfig.discountPercent) / 100;
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="flex gap-3">
        {/* Image - Clickable to toggle edit mode when expanded */}
        <div
          onClick={(e) => {
            if (expanded) {
              e.stopPropagation();
              setImageEditMode(!imageEditMode);
            } else {
              setExpanded(true);
            }
          }}
          className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative group cursor-pointer"
        >
          {config.image ? (
            <img
              src={config.image}
              alt={config.title}
              className="absolute object-cover"
              style={{
                width: `${config.imageScale || 100}%`,
                height: `${config.imageScale || 100}%`,
                left: `${-((config.imageScale || 100) - 100) * ((config.imagePositionX ?? 50) / 100)}%`,
                top: `${-((config.imageScale || 100) - 100) * ((config.imagePositionY ?? 50) / 100)}%`,
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: theme?.text.secondary || '#9ca3af' }}
            >
              <ImageIcon className="h-6 w-6" />
            </div>
          )}

          {/* Edit Overlay - Only show when card is expanded */}
          {expanded && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Info - Clickable to expand/collapse card */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <h3
            className="font-medium truncate"
            style={{ color: theme?.text.primary }}
          >
            {localConfig.title || "Produto"}
          </h3>
          <p
            className="text-sm truncate"
            style={{ color: theme?.text.secondary || '#6b7280' }}
          >
            {localConfig.description || "Descricao"}
          </p>
          {localConfig.kits.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-sm"
                style={{ color: theme?.text.secondary || '#6b7280' }}
              >
                {localConfig.kits.length} {localConfig.kits.length === 1 ? 'kit configurado' : 'kits configurados'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Image Edit Controls - Show below preview when active */}
      {expanded && imageEditMode && (
        <div className="space-y-2 p-3 bg-gray-100 rounded-lg">
          <div className="flex gap-2">
            <label className="flex-1 p-3 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-white transition-colors bg-white/50">
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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPositionModalOpen(true)}
                className="flex-1 text-xs text-gray-500 hover:text-gray-700"
              >
                <Crop className="w-3.5 h-3.5 mr-1.5" />
                Ajustar posição
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadImage}
                className="flex-1 text-xs text-gray-500 hover:text-gray-700"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Baixar
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
          {/* Display Style */}
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Estilo</Label>
            <Select
              value={localConfig.displayStyle || "card"}
              onValueChange={(value) => updateField("displayStyle", value)}
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Card 3D</SelectItem>
                <SelectItem value="compact">Compacto</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <Label className="text-xs">Titulo</Label>
            <Input
              value={localConfig.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Nome do produto"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Descricao</Label>
            <Textarea
              value={localConfig.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Descricao do produto"
              rows={2}
            />
          </div>

          {/* Discount */}
          {localConfig.discountPercent > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">
                    Desconto
                  </span>
                </div>
                <select
                  value={localConfig.discountPercent}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    if (newValue === 0) {
                      // Clear discount end date when removing discount
                      updateFields({ discountPercent: 0, discountEndDate: undefined });
                    } else {
                      updateField("discountPercent", newValue);
                    }
                  }}
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

              {/* Discount Timer */}
              <div className="flex items-center gap-2 p-2 bg-orange-50/50 rounded-lg">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-orange-600 flex-1">Termina em:</span>

                {localConfig.discountEndDate ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-orange-700">
                      {format(new Date(localConfig.discountEndDate), "dd/MM HH:mm", { locale: ptBR })}
                    </span>
                    <button
                      onClick={() => updateField("discountEndDate", undefined)}
                      className="p-1 hover:bg-orange-100 rounded"
                    >
                      <X className="h-3 w-3 text-orange-500" />
                    </button>
                  </div>
                ) : (
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <button className="text-xs text-orange-600 hover:text-orange-700 underline">
                        Definir prazo
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <div className="p-3 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              updateField("discountEndDate", addHours(new Date(), 6).toISOString());
                              setDatePickerOpen(false);
                            }}
                          >
                            6 horas
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              updateField("discountEndDate", addDays(new Date(), 1).toISOString());
                              setDatePickerOpen(false);
                            }}
                          >
                            24 horas
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              updateField("discountEndDate", addDays(new Date(), 3).toISOString());
                              setDatePickerOpen(false);
                            }}
                          >
                            3 dias
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              updateField("discountEndDate", addDays(new Date(), 7).toISOString());
                              setDatePickerOpen(false);
                            }}
                          >
                            7 dias
                          </Button>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-xs text-gray-500 mb-2">Ou escolha uma data:</p>
                          <Calendar
                            mode="single"
                            selected={localConfig.discountEndDate ? new Date(localConfig.discountEndDate) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                // Set to end of day
                                date.setHours(23, 59, 59);
                                updateField("discountEndDate", date.toISOString());
                                setDatePickerOpen(false);
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            locale={ptBR}
                            className="rounded-md border"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <select
                value={0}
                onChange={(e) =>
                  updateField("discountPercent", parseInt(e.target.value))
                }
                className="text-sm text-orange-600 font-medium bg-transparent border-none cursor-pointer hover:text-orange-700 focus:outline-none focus:ring-0"
              >
                <option value="0">% Sem desconto</option>
                <option value="10">10% de desconto</option>
                <option value="20">20% de desconto</option>
                <option value="30">30% de desconto</option>
                <option value="40">40% de desconto</option>
                <option value="50">50% de desconto</option>
              </select>
            </div>
          )}

          {/* Compact Style: Rating & CTA */}
          {localConfig.displayStyle === "compact" && (
            <div className="space-y-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Avaliacoes</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-blue-600">Nota (0-5)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={localConfig.rating || ""}
                    onChange={(e) => updateField("rating", parseFloat(e.target.value) || 0)}
                    placeholder="4.7"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-blue-600">Qtd. avaliacoes</Label>
                  <Input
                    type="number"
                    value={localConfig.ratingCount || ""}
                    onChange={(e) => updateField("ratingCount", parseInt(e.target.value) || 0)}
                    placeholder="127"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-blue-200">
                <Label className="text-xs text-blue-600">Texto do Botao</Label>
                <Input
                  value={localConfig.ctaText || ""}
                  onChange={(e) => updateField("ctaText", e.target.value)}
                  placeholder="Comprar Agora"
                />
              </div>
            </div>
          )}

          {/* Kits - Mobile-friendly accordion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Opcoes de Compra</Label>
              <Button variant="ghost" size="sm" onClick={addKit}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            {localConfig.kits.map((kit) => {
              const isExpanded = expandedKitId === kit.id;
              const isHidden = kit.isVisible === false;
              return (
                <div key={kit.id} className={`bg-white rounded-lg overflow-hidden ${isHidden ? 'opacity-50' : ''}`}>
                  {/* Kit Header - Always visible */}
                  <div
                    onClick={() => setExpandedKitId(isExpanded ? null : kit.id)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {kit.isSpecial && (
                          <Sparkles className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                        )}
                        <span className={`font-medium text-sm truncate ${isHidden ? 'line-through' : ''}`}>
                          {kit.label || "Sem nome"}
                        </span>
                        <span className="text-sm text-gray-500">
                          R$ {kit.price.toFixed(2)}
                        </span>
                        {localConfig.discountPercent > 0 && !kit.ignoreDiscount && (
                          <span className="text-xs text-green-600">
                            → R$ {calculateDiscountedPrice(kit.price).toFixed(2)}
                          </span>
                        )}
                        {isHidden && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            oculto
                          </span>
                        )}
                        {kit.ignoreDiscount && localConfig.discountPercent > 0 && (
                          <span className="text-[10px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                            sem desc.
                          </span>
                        )}
                      </div>
                      {kit.link && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <LinkIcon className="h-3 w-3" />
                          <span className="truncate max-w-[180px]">{kit.link}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Visibility Toggle */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateKit(kit.id, { isVisible: isHidden ? true : false });
                        }}
                        className={`h-8 w-8 p-0 ${isHidden ? 'text-gray-400' : 'text-gray-500 hover:text-gray-700'}`}
                        title={isHidden ? 'Mostrar kit' : 'Ocultar kit'}
                      >
                        {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeKit(kit.id);
                        }}
                        className="text-red-500 hover:text-red-600 h-8 w-8 p-0"
                        disabled={localConfig.kits.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Kit Editor - Expandable */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-3 border-t bg-gray-50/50">
                      <div className="pt-3 space-y-2">
                        <Label className="text-xs text-gray-500">Nome da opcao</Label>
                        <Input
                          value={kit.label}
                          onChange={(e) => updateKit(kit.id, { label: e.target.value })}
                          placeholder="Ex: 1 Unidade, Kit com 3, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-500">Preco (R$)</Label>
                        <Input
                          type="number"
                          value={kit.price}
                          onChange={(e) =>
                            updateKit(kit.id, { price: parseFloat(e.target.value) || 0 })
                          }
                          placeholder="99.90"
                        />
                      </div>

                      {/* Links Section */}
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500 flex items-center gap-1.5">
                            <LinkIcon className="h-3 w-3" />
                            Link principal (sem desconto)
                          </Label>
                          <Input
                            value={kit.link}
                            onChange={(e) => updateKit(kit.id, { link: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>

                        {/* Discount Links Section */}
                        {kit.discountLinks === undefined ? (
                          /* Compact: Use same link */
                          <button
                            onClick={() => updateKit(kit.id, { discountLinks: {} })}
                            className="flex items-center gap-2 text-xs text-orange-600 hover:text-orange-700 transition-colors"
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            <span>Adicionar links com desconto</span>
                          </button>
                        ) : (
                          /* Expanded: Different links per discount */
                          <div className="space-y-2">
                            {discountLinksExpandedKitId === kit.id ? (
                              /* Expanded view */
                              <div className="p-3 bg-orange-50 rounded-lg space-y-3">
                                <div
                                  onClick={() => setDiscountLinksExpandedKitId(null)}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <Link2 className="h-4 w-4 text-orange-600" />
                                    <span className="text-xs font-medium text-orange-700">
                                      Links com desconto
                                    </span>
                                  </div>
                                  <ChevronUp className="h-4 w-4 text-orange-600" />
                                </div>

                                <div className="space-y-2 pt-2 border-t border-orange-200">
                                  {[10, 20, 30, 40, 50].map((discount) => (
                                    <div key={discount} className="flex items-center gap-2">
                                      <span className="text-xs text-orange-700 font-medium w-10 flex-shrink-0">
                                        {discount}%
                                      </span>
                                      <Input
                                        value={kit.discountLinks?.[discount] || ""}
                                        onChange={(e) => {
                                          const newDiscountLinks = {
                                            ...kit.discountLinks,
                                            [discount]: e.target.value,
                                          };
                                          updateKit(kit.id, { discountLinks: newDiscountLinks });
                                        }}
                                        placeholder={`Link para ${discount}% off`}
                                        className="text-xs h-8"
                                      />
                                    </div>
                                  ))}
                                  <p className="text-[10px] text-orange-600 mt-1">
                                    Se vazio, usará o link principal
                                  </p>
                                </div>

                                <button
                                  onClick={() => updateKit(kit.id, { discountLinks: undefined })}
                                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                                >
                                  Usar mesmo link para todos
                                </button>
                              </div>
                            ) : (
                              /* Collapsed view */
                              <button
                                onClick={() => setDiscountLinksExpandedKitId(kit.id)}
                                className="flex items-center gap-2 text-xs text-orange-600 hover:text-orange-700 transition-colors w-full justify-between p-2 bg-orange-50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <Link2 className="h-3.5 w-3.5" />
                                  <span>Editar links com desconto</span>
                                </div>
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Special Highlight Toggle */}
                      <button
                        onClick={() => updateKit(kit.id, { isSpecial: !kit.isSpecial })}
                        className={`w-full flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
                          kit.isSpecial
                            ? 'bg-purple-50 border border-purple-200 text-purple-700'
                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Sparkles className={`h-4 w-4 ${kit.isSpecial ? 'text-purple-500' : 'text-gray-400'}`} />
                        <span className="text-sm">{kit.isSpecial ? 'Destaque Ativo' : 'Ativar Destaque'}</span>
                      </button>

                      {/* Ignore Discount Toggle - only show when discount is active */}
                      {localConfig.discountPercent > 0 && (
                        <button
                          onClick={() => updateKit(kit.id, { ignoreDiscount: !kit.ignoreDiscount })}
                          className={`w-full flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
                            kit.ignoreDiscount
                              ? 'bg-orange-50 border border-orange-200 text-orange-700'
                              : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Percent className={`h-4 w-4 ${kit.ignoreDiscount ? 'text-orange-500' : 'text-gray-400'}`} />
                          <span className="text-sm">{kit.ignoreDiscount ? 'Desconto Ignorado' : 'Ignorar Desconto'}</span>
                        </button>
                      )}

                      {/* Highlight Toggle - only for ecommerce style */}
                      {localConfig.displayStyle === "ecommerce" && (
                        <button
                          onClick={() => {
                            // Only one kit can be highlighted at a time
                            const newKits = localConfig.kits.map((k) => ({
                              ...k,
                              isHighlighted: k.id === kit.id ? !kit.isHighlighted : false,
                            }));
                            updateField("kits", newKits);
                          }}
                          className={`w-full flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
                            kit.isHighlighted
                              ? 'bg-amber-50 border border-amber-200 text-amber-700'
                              : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Star className={`h-4 w-4 ${kit.isHighlighted ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                          <span className="text-sm">{kit.isHighlighted ? 'Kit em Destaque' : 'Destacar Este Kit'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* Image Position Modal */}
      <Dialog open={positionModalOpen} onOpenChange={setPositionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar imagem do produto</DialogTitle>
          </DialogHeader>
          {config.image && (
            <ImagePositioner
              src={config.image}
              positionX={config.imagePositionX ?? 50}
              positionY={config.imagePositionY ?? 50}
              scale={config.imageScale || 100}
              aspectRatio="square"
              minScale={50}
              maxScale={200}
              onChange={({ positionX, positionY, scale }) => {
                onUpdate({
                  ...config,
                  imagePositionX: positionX,
                  imagePositionY: positionY,
                  imageScale: scale,
                });
              }}
            />
          )}
          <div className="flex justify-end">
            <Button onClick={() => setPositionModalOpen(false)}>
              Pronto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
