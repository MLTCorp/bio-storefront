import { useState } from "react";
import { Plus, Link as LinkIcon, Type, ShoppingBag, Video, Share2, MousePointer2, X } from "lucide-react";
import type { ComponentType } from "@/types/database";

interface AddComponentMenuProps {
  onAdd: (type: ComponentType) => void;
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

export function AddComponentMenu({ onAdd }: AddComponentMenuProps) {
  const [expanded, setExpanded] = useState(false);

  const handleAdd = (type: ComponentType) => {
    onAdd(type);
    setExpanded(false);
  };

  return (
    <div className="mt-4">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-gray-500 hover:text-gray-600"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">Adicionar elemento</span>
        </button>
      ) : (
        <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Adicionar elemento</span>
            <button
              onClick={() => setExpanded(false)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {componentOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleAdd(option.type)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-sm transition-all active:scale-95"
              >
                <span className={option.iconColor}>{option.icon}</span>
                <span className="text-xs font-medium text-gray-600">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
