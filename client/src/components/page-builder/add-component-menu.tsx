import { Plus, Link as LinkIcon, Type, ShoppingBag, Video, Share2, MousePointer2 } from "lucide-react";
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
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-3 text-gray-500">
        <Plus className="h-4 w-4" />
        <span className="text-sm font-medium">Adicionar</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {componentOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onAdd(option.type)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all active:scale-95"
          >
            <span className={option.iconColor}>{option.icon}</span>
            <span className="text-xs font-medium text-gray-600">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
