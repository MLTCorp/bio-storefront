import { Card, CardContent } from "@/components/ui/card";
import { Plus, Link as LinkIcon, Type, ShoppingBag, Video, Share2, MousePointer2 } from "lucide-react";
import type { ComponentType } from "@/types/database";

interface AddComponentMenuProps {
  onAdd: (type: ComponentType) => void;
}

const componentOptions: {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    type: "link",
    label: "Link",
    icon: <LinkIcon className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    type: "text",
    label: "Texto",
    icon: <Type className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    type: "product",
    label: "Produto",
    icon: <ShoppingBag className="h-5 w-5" />,
    color: "bg-green-100 text-green-600",
  },
  {
    type: "video",
    label: "Video",
    icon: <Video className="h-5 w-5" />,
    color: "bg-red-100 text-red-600",
  },
  {
    type: "social",
    label: "Social",
    icon: <Share2 className="h-5 w-5" />,
    color: "bg-pink-100 text-pink-600",
  },
  {
    type: "button",
    label: "Botao",
    icon: <MousePointer2 className="h-5 w-5" />,
    color: "bg-indigo-100 text-indigo-600",
  },
];

export function AddComponentMenu({ onAdd }: AddComponentMenuProps) {
  return (
    <Card className="mt-4 border-dashed border-2 border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3 text-primary">
          <Plus className="h-5 w-5" />
          <span className="font-medium">Adicionar Componente</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {componentOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => onAdd(option.type)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${option.color} hover:opacity-80 transition-all shadow-sm hover:shadow-md active:scale-95`}
            >
              {option.icon}
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
