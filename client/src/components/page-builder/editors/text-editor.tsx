import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import type { TextConfig } from "@/types/database";

interface TextEditorProps {
  config: TextConfig;
  onUpdate: (config: TextConfig) => void;
}

export function TextEditor({ config, onUpdate }: TextEditorProps) {
  const [editing, setEditing] = useState(false);
  const [localConfig, updateField] = useDebouncedConfig(config, onUpdate, 500);

  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  if (editing) {
    return (
      <div className="space-y-2">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <Button
            variant={config.bold ? "default" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onUpdate({ ...config, bold: !config.bold })}
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={config.italic ? "default" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onUpdate({ ...config, italic: !config.italic })}
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <Button
            variant={config.alignment === "left" ? "default" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onUpdate({ ...config, alignment: "left" })}
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={config.alignment === "center" ? "default" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onUpdate({ ...config, alignment: "center" })}
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={config.alignment === "right" ? "default" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onUpdate({ ...config, alignment: "right" })}
          >
            <AlignRight className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <select
            value={config.size}
            onChange={(e) =>
              onUpdate({ ...config, size: e.target.value as TextConfig["size"] })
            }
            className="h-7 text-xs bg-transparent border-none"
          >
            <option value="small">Pequeno</option>
            <option value="medium">Medio</option>
            <option value="large">Grande</option>
          </select>
        </div>

        <Textarea
          value={localConfig.content}
          onChange={(e) => updateField("content", e.target.value)}
          onBlur={() => setEditing(false)}
          autoFocus
          rows={3}
          className={`${alignClasses[localConfig.alignment]} ${sizeClasses[localConfig.size]} ${
            localConfig.bold ? "font-bold" : ""
          } ${localConfig.italic ? "italic" : ""}`}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className={`p-2 cursor-text hover:bg-gray-50 rounded transition-colors ${
        alignClasses[localConfig.alignment]
      } ${sizeClasses[localConfig.size]} ${localConfig.bold ? "font-bold" : ""} ${
        localConfig.italic ? "italic" : ""
      }`}
    >
      {localConfig.content || "Clique para editar o texto..."}
    </div>
  );
}
