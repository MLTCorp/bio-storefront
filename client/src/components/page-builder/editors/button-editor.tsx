import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, ExternalLink } from "lucide-react";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import type { ButtonConfig } from "@/types/database";

interface ButtonEditorProps {
  config: ButtonConfig;
  onUpdate: (config: ButtonConfig) => void;
}

export function ButtonEditor({ config, onUpdate }: ButtonEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [localConfig, updateField] = useDebouncedConfig(config, onUpdate, 500);

  const isWhatsApp = localConfig.type === "whatsapp";

  return (
    <div className="space-y-3">
      {/* Button Preview */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
          isWhatsApp
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {isWhatsApp ? (
          <MessageCircle className="h-5 w-5" />
        ) : (
          <ExternalLink className="h-4 w-4" />
        )}
        {localConfig.text || "Novo Botao"}
      </button>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateField("type", "whatsapp")}
              className={`p-2 rounded-lg text-sm font-medium ${
                isWhatsApp
                  ? "bg-green-100 text-green-700 border-2 border-green-500"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              WhatsApp
            </button>
            <button
              onClick={() => updateField("type", "link")}
              className={`p-2 rounded-lg text-sm font-medium ${
                !isWhatsApp
                  ? "bg-primary/10 text-primary border-2 border-primary"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              Link
            </button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Texto do Botao</Label>
            <Input
              value={localConfig.text}
              onChange={(e) => updateField("text", e.target.value)}
              placeholder="Ex: Fale Comigo"
            />
          </div>

          {isWhatsApp ? (
            <>
              <div className="space-y-2">
                <Label className="text-xs">Numero WhatsApp</Label>
                <Input
                  value={localConfig.whatsappNumber || ""}
                  onChange={(e) => updateField("whatsappNumber", e.target.value)}
                  placeholder="5511999999999"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Mensagem</Label>
                <Input
                  value={localConfig.whatsappMessage || ""}
                  onChange={(e) => updateField("whatsappMessage", e.target.value)}
                  placeholder="Ola! Vim pelo seu link..."
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs">URL</Label>
              <Input
                value={localConfig.url || ""}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
