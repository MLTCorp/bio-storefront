import { useState, useRef, useEffect } from "react";
import { Plus, Link as LinkIcon, Type, ShoppingBag, Video, Share2, MousePointer2, ChevronDown } from "lucide-react";
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
    label: "Botão",
    icon: <MousePointer2 className="h-5 w-5" />,
    iconColor: "text-indigo-500",
  },
];

export function AddComponentMenu({ onAdd, theme }: AddComponentMenuProps) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  const handleAdd = (type: ComponentType) => {
    onAdd(type);
    setExpanded(false);
  };

  return (
    <div
      className="mt-4 rounded-lg overflow-hidden transition-all duration-300 shadow-sm"
      style={{
        background: theme?.card.bg || 'white',
        border: theme?.card.border || '1px solid #e5e7eb',
      }}
    >
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 px-4 flex items-center justify-between transition-colors hover:bg-black/5"
        style={{
          color: theme?.text.primary || '#374151',
        }}
      >
        <div className="flex items-center gap-2">
          <Plus
            className="h-5 w-5 transition-transform duration-300"
            style={{
              transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
              color: theme?.text.accent || '#6366f1',
            }}
          />
          <span className="text-sm font-medium">Adicionar elemento</span>
        </div>
        <ChevronDown
          className="h-4 w-4 transition-transform duration-300"
          style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            color: theme?.text.secondary || '#9ca3af',
          }}
        />
      </button>

      {/* Expandable Content */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: expanded ? `${contentHeight}px` : '0px',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div
          ref={contentRef}
          className="px-3 pb-3"
        >
          <div className="grid grid-cols-3 gap-2">
            {componentOptions.map((option, index) => (
              <button
                key={option.type}
                onClick={() => handleAdd(option.type)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                style={{
                  background: theme?.button.secondary || '#f9fafb',
                  border: theme?.card.border || '1px solid #e5e7eb',
                  transitionDelay: expanded ? `${index * 30}ms` : '0ms',
                  transform: expanded ? 'translateY(0)' : 'translateY(-8px)',
                  opacity: expanded ? 1 : 0,
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
      </div>
    </div>
  );
}
