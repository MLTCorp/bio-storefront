import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, ChevronRight } from "lucide-react";
import type { LinkConfig } from "@/types/database";

interface LinkEditorProps {
  config: LinkConfig;
  onUpdate: (config: LinkConfig) => void;
}

export function LinkEditor({ config, onUpdate }: LinkEditorProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-3">
      {/* Link Preview */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-gray-500" />
          <span>{config.text || "Novo Link"}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </button>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <Label className="text-xs">Texto do Link</Label>
            <Input
              value={config.text}
              onChange={(e) => onUpdate({ ...config, text: e.target.value })}
              placeholder="Ex: Meu Portfolio"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">URL</Label>
            <Input
              value={config.url || ""}
              onChange={(e) => onUpdate({ ...config, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Estilo</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdate({ ...config, style: "large" })}
                className={`p-2 rounded-lg text-sm ${
                  config.style === "large"
                    ? "bg-primary/10 text-primary border-2 border-primary"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                Grande
              </button>
              <button
                onClick={() => onUpdate({ ...config, style: "small" })}
                className={`p-2 rounded-lg text-sm ${
                  config.style === "small"
                    ? "bg-primary/10 text-primary border-2 border-primary"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                Compacto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
