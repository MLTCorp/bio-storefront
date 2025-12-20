import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapPin, ChevronRight, Link, Navigation } from "lucide-react";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import type { MapsConfig } from "@/types/database";

interface MapsEditorProps {
  config: MapsConfig;
  onUpdate: (config: MapsConfig) => void;
}

export function MapsEditor({ config, onUpdate }: MapsEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [localConfig, updateField] = useDebouncedConfig(config, onUpdate, 500);

  return (
    <div className="space-y-3">
      {/* Preview */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-600" />
          <span className="text-emerald-700 truncate max-w-[200px]">
            {localConfig.address || "Mapa"}
          </span>
        </div>
        <ChevronRight
          className={`h-4 w-4 text-emerald-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
          {/* Embed URL Input */}
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1">
              <Link className="h-3 w-3" />
              URL do Google Maps (Embed)
            </Label>
            <Input
              value={localConfig.embedUrl || ""}
              onChange={(e) => updateField("embedUrl", e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-[10px] text-gray-400">
              Va no Google Maps, clique em Compartilhar, depois Incorporar e copie o src do iframe
            </p>
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1">
              <Navigation className="h-3 w-3" />
              Endereco (exibicao)
            </Label>
            <Input
              value={localConfig.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Rua Exemplo, 123 - Cidade/UF"
            />
          </div>

          {/* Height Slider */}
          <div className="space-y-2">
            <Label className="text-xs">Altura do Mapa</Label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="150"
                max="400"
                step="25"
                value={localConfig.height || 200}
                onChange={(e) => updateField("height", parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-12">
                {localConfig.height || 200}px
              </span>
            </div>
          </div>

          {/* Show Open Button Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Mostrar botao "Abrir no Maps"</Label>
            <Switch
              checked={localConfig.showOpenButton !== false}
              onCheckedChange={(checked) => updateField("showOpenButton", checked)}
            />
          </div>

          {/* Preview */}
          {localConfig.embedUrl && (
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Preview</Label>
              <div
                className="rounded-lg overflow-hidden border border-gray-200"
                style={{ height: Math.min(localConfig.height || 200, 150) }}
              >
                <iframe
                  src={localConfig.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
