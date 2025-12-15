import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageComponent, ComponentConfig } from "@/types/database";
import { ButtonEditor } from "./editors/button-editor";
import { TextEditor } from "./editors/text-editor";
import { ProductEditor } from "./editors/product-editor";
import { VideoEditor } from "./editors/video-editor";
import { SocialEditor } from "./editors/social-editor";
import { LinkEditor } from "./editors/link-editor";

interface SortableComponentProps {
  component: PageComponent;
  onUpdate: (config: ComponentConfig) => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

export function SortableComponent({
  component,
  onUpdate,
  onDelete,
  onToggleVisibility,
}: SortableComponentProps) {
  const isHidden = component.is_visible === false;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderEditor = () => {
    switch (component.type) {
      case "button":
        return (
          <ButtonEditor
            config={component.config as any}
            onUpdate={onUpdate}
          />
        );
      case "text":
        return (
          <TextEditor
            config={component.config as any}
            onUpdate={onUpdate}
          />
        );
      case "product":
        return (
          <ProductEditor
            config={component.config as any}
            onUpdate={onUpdate}
          />
        );
      case "video":
        return (
          <VideoEditor
            config={component.config as any}
            onUpdate={onUpdate}
          />
        );
      case "social":
        return (
          <SocialEditor
            config={component.config as any}
            onUpdate={onUpdate}
          />
        );
      case "link":
        return (
          <LinkEditor
            config={component.config as any}
            onUpdate={onUpdate}
          />
        );
      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white rounded-xl border overflow-hidden transition-colors ${
        isHidden
          ? "border-gray-300 border-dashed"
          : "border-gray-200 hover:border-primary/50"
      }`}
    >
      {/* Hidden Overlay */}
      {isHidden && (
        <div className="absolute inset-0 bg-gray-100/80 z-[5] flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm">
            <EyeOff className="h-4 w-4" />
            <span className="text-xs font-medium">Oculto</span>
          </div>
        </div>
      )}

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1 rounded cursor-grab active:cursor-grabbing bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {/* Visibility Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVisibility}
          className={`p-1 h-auto ${
            isHidden
              ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
          title={isHidden ? "Mostrar componente" : "Ocultar componente"}
        >
          {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="p-1 h-auto text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Component Editor */}
      <div className={`p-3 ${isHidden ? "opacity-50" : ""}`}>{renderEditor()}</div>
    </div>
  );
}
