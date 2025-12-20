import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Palette,
  Sparkles,
  Image as ImageIcon,
  Upload,
  X,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  ShoppingBag,
  Music,
  Podcast,
  Video,
  Camera,
  Heart,
  Star,
  Zap,
  Gift,
  Calendar,
  MapPin,
  FileText,
  Download,
  Play,
  Link2
} from "lucide-react";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import type { LinkConfig } from "@/types/database";

interface LinkEditorProps {
  config: LinkConfig;
  onUpdate: (config: LinkConfig) => void;
}

// Icon options with labels
const iconOptions = [
  { value: "", label: "Nenhum", icon: null },
  { value: "link", label: "Link", icon: Link2 },
  { value: "external", label: "Externo", icon: ExternalLink },
  { value: "globe", label: "Website", icon: Globe },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "twitter", label: "Twitter/X", icon: Twitter },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "github", label: "GitHub", icon: Github },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Telefone", icon: Phone },
  { value: "shop", label: "Loja", icon: ShoppingBag },
  { value: "music", label: "Música", icon: Music },
  { value: "podcast", label: "Podcast", icon: Podcast },
  { value: "video", label: "Vídeo", icon: Video },
  { value: "camera", label: "Foto", icon: Camera },
  { value: "heart", label: "Favorito", icon: Heart },
  { value: "star", label: "Destaque", icon: Star },
  { value: "zap", label: "Novo", icon: Zap },
  { value: "gift", label: "Presente", icon: Gift },
  { value: "calendar", label: "Agenda", icon: Calendar },
  { value: "location", label: "Local", icon: MapPin },
  { value: "file", label: "Arquivo", icon: FileText },
  { value: "download", label: "Download", icon: Download },
  { value: "play", label: "Play", icon: Play },
];

// Color presets
const colorPresets = [
  { value: "#7F4AFF", label: "Roxo" },
  { value: "#3B82F6", label: "Azul" },
  { value: "#10B981", label: "Verde" },
  { value: "#F59E0B", label: "Amarelo" },
  { value: "#EF4444", label: "Vermelho" },
  { value: "#EC4899", label: "Rosa" },
  { value: "#000000", label: "Preto" },
  { value: "#6B7280", label: "Cinza" },
];

export function LinkEditor({ config, onUpdate }: LinkEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [styleExpanded, setStyleExpanded] = useState(false);
  const [effectsExpanded, setEffectsExpanded] = useState(false);
  const [extrasExpanded, setExtrasExpanded] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localConfig, updateField] = useDebouncedConfig(config, onUpdate, 500);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField("thumbnail", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    updateField("thumbnail", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get the selected icon component
  const SelectedIcon = iconOptions.find(i => i.value === localConfig.icon)?.icon;

  return (
    <div className="space-y-3">
      {/* Link Preview */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors"
        style={localConfig.backgroundColor && localConfig.variant === 'filled' ? {
          backgroundColor: localConfig.backgroundColor,
          color: 'white'
        } : undefined}
      >
        <div className="flex items-center gap-2">
          {SelectedIcon ? (
            <SelectedIcon className="h-4 w-4" />
          ) : (
            <ExternalLink className="h-4 w-4 text-gray-500" />
          )}
          <span>{localConfig.text || "Novo Link"}</span>
          {localConfig.badge && (
            <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">
              {localConfig.badge}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          {/* Basic Fields */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Texto do Link</Label>
              <Input
                value={localConfig.text}
                onChange={(e) => updateField("text", e.target.value)}
                placeholder="Ex: Meu Portfolio"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">URL</Label>
              <Input
                value={localConfig.url || ""}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Tamanho</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateField("style", "large")}
                  className={`p-2 rounded-lg text-sm ${
                    localConfig.style === "large"
                      ? "bg-primary/10 text-primary border-2 border-primary"
                      : "bg-white border hover:bg-gray-50"
                  }`}
                >
                  Grande
                </button>
                <button
                  onClick={() => updateField("style", "small")}
                  className={`p-2 rounded-lg text-sm ${
                    localConfig.style === "small"
                      ? "bg-primary/10 text-primary border-2 border-primary"
                      : "bg-white border hover:bg-gray-50"
                  }`}
                >
                  Compacto
                </button>
              </div>
            </div>
          </div>

          {/* Style Section */}
          <div className="border-t pt-3">
            <button
              onClick={() => setStyleExpanded(!styleExpanded)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700"
            >
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Estilo Visual</span>
              </div>
              {styleExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {styleExpanded && (
              <div className="mt-3 space-y-4">
                {/* Shape */}
                <div className="space-y-2">
                  <Label className="text-xs">Formato</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateField("shape", "rounded")}
                      className={`p-2 rounded-lg text-xs ${
                        (localConfig.shape || "rounded") === "rounded"
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-full h-4 bg-current opacity-30 rounded-lg mb-1" />
                      Arredondado
                    </button>
                    <button
                      onClick={() => updateField("shape", "pill")}
                      className={`p-2 rounded-lg text-xs ${
                        localConfig.shape === "pill"
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-full h-4 bg-current opacity-30 rounded-full mb-1" />
                      Pílula
                    </button>
                    <button
                      onClick={() => updateField("shape", "square")}
                      className={`p-2 rounded-lg text-xs ${
                        localConfig.shape === "square"
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-full h-4 bg-current opacity-30 rounded-sm mb-1" />
                      Quadrado
                    </button>
                  </div>
                </div>

                {/* Variant */}
                <div className="space-y-2">
                  <Label className="text-xs">Variação</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateField("variant", "filled")}
                      className={`p-2 rounded-lg text-xs ${
                        (localConfig.variant || "filled") === "filled"
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-full h-4 bg-gray-800 rounded mb-1" />
                      Preenchido
                    </button>
                    <button
                      onClick={() => updateField("variant", "outline")}
                      className={`p-2 rounded-lg text-xs ${
                        localConfig.variant === "outline"
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-full h-4 border-2 border-gray-800 rounded mb-1" />
                      Contorno
                    </button>
                    <button
                      onClick={() => updateField("variant", "soft")}
                      className={`p-2 rounded-lg text-xs ${
                        localConfig.variant === "soft"
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-full h-4 bg-gray-200 rounded mb-1" />
                      Suave
                    </button>
                  </div>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <Label className="text-xs">Cor</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateField("backgroundColor", color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          localConfig.backgroundColor === color.value
                            ? "border-gray-800 scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                    <div className="relative">
                      <input
                        type="color"
                        value={localConfig.backgroundColor || "#7F4AFF"}
                        onChange={(e) => updateField("backgroundColor", e.target.value)}
                        className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden"
                        style={{
                          WebkitAppearance: 'none',
                          appearance: 'none'
                        }}
                        title="Cor personalizada"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Effects Section */}
          <div className="border-t pt-3">
            <button
              onClick={() => setEffectsExpanded(!effectsExpanded)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Efeitos</span>
              </div>
              {effectsExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {effectsExpanded && (
              <div className="mt-3 space-y-4">
                {/* Icon Selector */}
                <div className="space-y-2">
                  <Label className="text-xs">Ícone</Label>
                  <div className="relative">
                    <button
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="w-full p-2 rounded-lg border bg-white hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {SelectedIcon ? (
                          <>
                            <SelectedIcon className="h-4 w-4" />
                            <span className="text-sm">
                              {iconOptions.find(i => i.value === localConfig.icon)?.label}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Selecionar ícone</span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>

                    {showIconPicker && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {iconOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              updateField("icon", option.value || undefined);
                              setShowIconPicker(false);
                            }}
                            className={`w-full p-2 flex items-center gap-2 hover:bg-gray-50 ${
                              localConfig.icon === option.value ? "bg-primary/10" : ""
                            }`}
                          >
                            {option.icon ? (
                              <option.icon className="h-4 w-4" />
                            ) : (
                              <div className="w-4 h-4" />
                            )}
                            <span className="text-sm">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Animation */}
                <div className="space-y-2">
                  <Label className="text-xs">Animação</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateField("animation", "none")}
                      className={`p-2 rounded-lg text-xs ${
                        (!localConfig.animation || localConfig.animation === "none")
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      Nenhuma
                    </button>
                    <button
                      onClick={() => updateField("animation", "pulse")}
                      className={`p-2 rounded-lg text-xs ${
                        localConfig.animation === "pulse"
                          ? "bg-primary/10 text-primary border-2 border-primary animate-pulse"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      Pulsar
                    </button>
                    <button
                      onClick={() => updateField("animation", "shine")}
                      className={`p-2 rounded-lg text-xs relative overflow-hidden ${
                        localConfig.animation === "shine"
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-white border hover:bg-gray-50"
                      }`}
                    >
                      Brilhar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Extras Section */}
          <div className="border-t pt-3">
            <button
              onClick={() => setExtrasExpanded(!extrasExpanded)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700"
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span>Extras</span>
              </div>
              {extrasExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {extrasExpanded && (
              <div className="mt-3 space-y-4">
                {/* Badge */}
                <div className="space-y-2">
                  <Label className="text-xs">Badge/Etiqueta</Label>
                  <Input
                    value={localConfig.badge || ""}
                    onChange={(e) => updateField("badge", e.target.value || undefined)}
                    placeholder="Ex: NOVO, 🔥, -20%"
                    maxLength={10}
                  />
                  <p className="text-[10px] text-gray-400">
                    Aparece no canto superior do botão
                  </p>
                </div>

                {/* Thumbnail */}
                <div className="space-y-2">
                  <Label className="text-xs">Thumbnail/Imagem</Label>

                  {localConfig.thumbnail ? (
                    <div className="space-y-3">
                      <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={localConfig.thumbnail}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          style={{
                            transform: `scale(${(localConfig.thumbnailScale || 100) / 100})`,
                            objectPosition: `${localConfig.thumbnailPositionX || 50}% ${localConfig.thumbnailPositionY || 50}%`
                          }}
                        />
                        <button
                          onClick={removeThumbnail}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Thumbnail Controls */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-gray-500">Zoom</Label>
                          <Slider
                            value={[localConfig.thumbnailScale || 100]}
                            onValueChange={([v]) => updateField("thumbnailScale", v)}
                            min={100}
                            max={200}
                            step={5}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-500">Posição X</Label>
                            <Slider
                              value={[localConfig.thumbnailPositionX || 50]}
                              onValueChange={([v]) => updateField("thumbnailPositionX", v)}
                              min={0}
                              max={100}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-gray-500">Posição Y</Label>
                            <Slider
                              value={[localConfig.thumbnailPositionY || 50]}
                              onValueChange={([v]) => updateField("thumbnailPositionY", v)}
                              min={0}
                              max={100}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
                    >
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Clique para adicionar imagem
                      </span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
