import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ChevronRight, ExternalLink, Code } from "lucide-react";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import type { CalendlyConfig } from "@/types/database";

interface CalendlyEditorProps {
  config: CalendlyConfig;
  onUpdate: (config: CalendlyConfig) => void;
}

export function CalendlyEditor({ config, onUpdate }: CalendlyEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [localConfig, updateField] = useDebouncedConfig(config, onUpdate, 500);

  return (
    <div className="space-y-3">
      {/* Preview */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-between bg-cyan-50 hover:bg-cyan-100 transition-colors border border-cyan-200"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-cyan-600" />
          <span className="text-cyan-700">
            {localConfig.buttonText || "Agendar"}
          </span>
        </div>
        <ChevronRight
          className={`h-4 w-4 text-cyan-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
          {/* URL Input */}
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              URL do Calendly
            </Label>
            <Input
              value={localConfig.url || ""}
              onChange={(e) => updateField("url", e.target.value)}
              placeholder="https://calendly.com/seu-usuario"
            />
            <p className="text-[10px] text-gray-400">
              Cole o link do seu Calendly aqui
            </p>
          </div>

          {/* Embed Type */}
          <div className="space-y-2">
            <Label className="text-xs">Tipo de Exibicao</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateField("embedType", "button")}
                className={`p-3 rounded-lg text-sm flex flex-col items-center gap-1 transition-all ${
                  localConfig.embedType === "button"
                    ? "bg-cyan-100 text-cyan-700 border-2 border-cyan-500"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                <ExternalLink className="h-4 w-4" />
                <span>Botao</span>
              </button>
              <button
                onClick={() => updateField("embedType", "inline")}
                className={`p-3 rounded-lg text-sm flex flex-col items-center gap-1 transition-all ${
                  localConfig.embedType === "inline"
                    ? "bg-cyan-100 text-cyan-700 border-2 border-cyan-500"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                <Code className="h-4 w-4" />
                <span>Embutido</span>
              </button>
            </div>
          </div>

          {/* Button Text (only for button type) */}
          {localConfig.embedType === "button" && (
            <div className="space-y-2">
              <Label className="text-xs">Texto do Botao</Label>
              <Input
                value={localConfig.buttonText || ""}
                onChange={(e) => updateField("buttonText", e.target.value)}
                placeholder="Agendar"
              />
            </div>
          )}

          {/* Height (only for inline type) */}
          {localConfig.embedType === "inline" && (
            <div className="space-y-2">
              <Label className="text-xs">Altura do Embed</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="400"
                  max="800"
                  step="50"
                  value={localConfig.height || 600}
                  onChange={(e) => updateField("height", parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-12">
                  {localConfig.height || 600}px
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
