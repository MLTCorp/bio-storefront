import { useState } from "react";
import { Plus, Link as LinkIcon, Type, ShoppingBag, Video, Share2, MousePointer2, X } from "lucide-react";
import type { ComponentType } from "@/types/database";
import type { Theme } from "@/lib/themes";

interface AddComponentMenuProps {
  onAdd: (type: ComponentType) => void;
  theme?: Theme;
}

const componentOptions: {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
  iconColor: string;
}[] = [
  {
    type: "link",
    label: "Link",
    icon: <LinkIcon className="h-5 w-5" />,
    iconColor: "text-blue-500",
  },
  {
    type: "text",
    label: "Texto",
    icon: <Type className="h-5 w-5" />,
    iconColor: "text-purple-500",
  },
  {
    type: "product",
    label: "Produto",
    icon: <ShoppingBag className="h-5 w-5" />,
    iconColor: "text-green-500",
  },
  {
    type: "video",
    label: "Video",
    icon: <Video className="h-5 w-5" />,
    iconColor: "text-red-500",
  },
  {
    type: "social",
    label: "Social",
    icon: <Share2 className="h-5 w-5" />,
    iconColor: "text-pink-500",
  },
  {
    type: "button",
    label: "Botao",
    icon: <MousePointer2 className="h-5 w-5" />,
    iconColor: "text-indigo-500",
  },
];

export function AddComponentMenu({ onAdd, theme }: AddComponentMenuProps) {
  const [expanded, setExpanded] = useState(false);

  const handleAdd = (type: ComponentType) => {
    onAdd(type);
    setExpanded(false);
  };

  // Helper to get border color from theme
  const getBorderColor = () => {
    if (!theme) return undefined;
    return theme.card.border.replace('1px solid ', '');
  };

  return (
    <div className="mt-4">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-3 px-4 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2"
          style={{
            borderColor: theme?.text.secondary || '#d1d5db',
            color: theme?.text.secondary || '#6b7280',
            background: 'transparent',
          }}
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">Adicionar elemento</span>
        </button>
      ) : (
        <div
          className="p-4 rounded-xl shadow-sm"
          style={{
            background: theme?.card.bg || 'white',
            border: theme?.card.border || '1px solid #e5e7eb',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-sm font-medium"
              style={{ color: theme?.text.primary || '#374151' }}
            >
              Adicionar elemento
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="p-1 rounded-lg transition-colors"
              style={{ color: theme?.text.secondary || '#9ca3af' }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {componentOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleAdd(option.type)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-95"
                style={{
                  background: theme?.button.secondary || '#f9fafb',
                  border: `1px solid ${getBorderColor() || '#e5e7eb'}`,
                }}
              >
                <span className={option.iconColor}>{option.icon}</span>
                <span
                  className="text-xs font-medium"
                  style={{ color: theme?.text.secondary || '#4b5563' }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
