import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlayCircle as Play, Plus, Trash2, GripVertical, Link as LinkIcon, Camera, X, Image, FileVideo, Loader2 } from "lucide-react";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import { useToast } from "@/hooks/use-toast";
import type { StoriesConfig, StoriesItem } from "@/types/database";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface StoriesEditorProps {
  config: StoriesConfig;
  onUpdate: (config: StoriesConfig) => void;
}

// Helper function to validate video file format
function isValidVideoFile(file: File): boolean {
  const validExtensions = ['.mp4', '.webm', '.mov'];
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  return validExtensions.includes(fileExtension);
}

// Helper function to validate video file size (max 50MB)
function isValidVideoSize(file: File): boolean {
  const maxSizeBytes = 50 * 1024 * 1024; // 50MB
  return file.size <= maxSizeBytes;
}

// Helper function to generate thumbnail from video at 1 second
function generateVideoThumbnail(file: File, callback: (thumbnail: string) => void, errorCallback: (error: string) => void): void {
  const video = document.createElement('video');
  const url = URL.createObjectURL(file);

  video.src = url;
  video.currentTime = 1; // Seek to 1 second

  video.addEventListener('loadeddata', () => {
    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(url);
      errorCallback('Failed to create canvas context');
      return;
    }

    // Draw the video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(url);
      callback(dataUrl);
    } catch (error) {
      URL.revokeObjectURL(url);
      errorCallback('Failed to generate thumbnail');
    }
  });

  video.addEventListener('error', () => {
    URL.revokeObjectURL(url);
    errorCallback('Failed to load video for thumbnail generation');
  });
}

// Helper function to get video duration
function getVideoDuration(file: File, callback: (duration: number) => void, errorCallback: (error: string) => void): void {
  const video = document.createElement('video');
  const url = URL.createObjectURL(file);

  video.src = url;

  video.addEventListener('loadedmetadata', () => {
    URL.revokeObjectURL(url);
    callback(video.duration);
  });

  video.addEventListener('error', () => {
    URL.revokeObjectURL(url);
    errorCallback('Failed to load video metadata');
  });
}

// Helper function to format duration as MM:SS
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Sortable Story Item Component
function SortableStoryItem({
  item,
  index,
  isSelected,
  onClick,
  onRemove,
}: {
  item: StoriesItem;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-[4/2.5] rounded-lg overflow-hidden border-2 cursor-pointer transition-all group ${
        isSelected ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-200 hover:border-amber-300'
      }`}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <img
        src={item.thumbnail || item.url}
        alt={`Story ${index + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Circular Story Icon (colored blur) */}
      <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 opacity-80" />

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-1 left-1 p-0.5 rounded cursor-grab active:cursor-grabbing bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-3 w-3 text-gray-400" />
      </div>

      {/* Index Badge */}
      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-[8px] rounded">
        {index + 1}
      </span>

      {/* Video Icon overlay for videos */}
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="h-4 w-4 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>

      {/* Duration Badge (for videos) - positioned at bottom-right */}
      {item.type === 'video' && item.duration && (
        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] rounded font-medium">
          {formatDuration(item.duration)}
        </div>
      )}
    </div>
  );
}

export function StoriesEditor({ config, onUpdate }: StoriesEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [localConfig, updateField] = useDebouncedConfig(config, onUpdate, 500);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [generatingThumbnails, setGeneratingThumbnails] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentItems = localConfig.items || [];
    const remainingSlots = 10 - currentItems.length;

    for (const file of Array.from(files).slice(0, remainingSlots)) {
      const isVideo = file.type.startsWith('video/');

      // Validate video file format
      if (isVideo && !isValidVideoFile(file)) {
        toast({
          variant: "destructive",
          title: "Formato de vídeo inválido",
          description: "Apenas arquivos .mp4, .webm e .mov são aceitos",
        });
        continue;
      }

      // Validate video file size
      if (isVideo && !isValidVideoSize(file)) {
        toast({
          variant: "destructive",
          title: "Vídeo muito grande",
          description: "O tamanho máximo permitido é 50MB por vídeo",
        });
        continue;
      }

      // Generate temporary ID
      const tempId = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Start progress tracking
      setUploadProgress(prev => ({ ...prev, [tempId]: 0 }));

      if (isVideo) {
        // For videos: generate thumbnail and detect duration
        setGeneratingThumbnails(prev => {
          const newSet = new Set(prev);
          newSet.add(tempId);
          return newSet;
        });

        try {
          // Auto-detect duration first
          const duration = await new Promise<number>((resolve, reject) => {
            getVideoDuration(file, resolve, reject);
          });

          // Generate thumbnail
          const thumbnail = await new Promise<string>((resolve, reject) => {
            generateVideoThumbnail(file, resolve, reject);
          });

          // Convert video file to base64 URL
          const videoUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read video file'));
            reader.readAsDataURL(file);
          });

          // Update progress
          setUploadProgress(prev => ({ ...prev, [tempId]: 100 }));

          const newItem: StoriesItem = {
            id: tempId,
            url: videoUrl,
            type: 'video',
            thumbnail,
            duration: Math.round(duration),
            link: undefined,
          };

          updateField("items", [...(localConfig.items || []), newItem]);

          // Remove progress entry after a short delay
          setTimeout(() => {
            setUploadProgress(prev => {
              const updated = { ...prev };
              delete updated[tempId];
              return updated;
            });
          }, 1500);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
          toast({
            variant: "destructive",
            title: "Erro ao processar vídeo",
            description: errorMessage,
          });
          setUploadProgress(prev => {
            const updated = { ...prev };
            delete updated[tempId];
            return updated;
          });
        } finally {
          setGeneratingThumbnails(prev => {
            const updated = new Set(prev);
            updated.delete(tempId);
            return updated;
          });
        }
      } else {
        // For images: just read file
        try {
          const imageUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.onprogress = (e) => {
              if (e.lengthComputable) {
                const progress = Math.round((e.loaded / e.total) * 100);
                setUploadProgress(prev => ({ ...prev, [tempId]: progress }));
              }
            };
            reader.readAsDataURL(file);
          });

          setUploadProgress(prev => ({ ...prev, [tempId]: 100 }));

          const newItem: StoriesItem = {
            id: tempId,
            url: imageUrl,
            type: 'image',
            thumbnail: imageUrl,
            link: undefined,
          };

          updateField("items", [...(localConfig.items || []), newItem]);

          // Remove progress entry after a short delay
          setTimeout(() => {
            setUploadProgress(prev => {
              const updated = { ...prev };
              delete updated[tempId];
              return updated;
            });
          }, 1500);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
          toast({
            variant: "destructive",
            title: "Erro ao carregar imagem",
            description: errorMessage,
          });
          setUploadProgress(prev => {
            const updated = { ...prev };
            delete updated[tempId];
            return updated;
          });
        }
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localConfig.items.findIndex((item) => item.id === active.id);
      const newIndex = localConfig.items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(localConfig.items, oldIndex, newIndex);
        updateField("items", newItems);
      }
    }
  };

  const removeItem = (id: string) => {
    const newItems = (localConfig.items || []).filter((item) => item.id !== id);
    updateField("items", newItems);

    // Close editor if removing the currently editing item
    if (editingItemId === id) {
      setEditingItemId(null);
    }
  };

  const updateItem = (id: string, updates: Partial<StoriesItem>) => {
    const newItems = (localConfig.items || []).map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateField("items", newItems);
  };

  const items = localConfig.items || [];
  const canAddMore = items.length < 10;
  const editingItem = items.find((item) => item.id === editingItemId);

  return (
    <div className="space-y-3">
      {/* Preview */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
      >
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-amber-600" />
          <span className="text-amber-700">
            Stories ({items.length}/10 itens)
          </span>
        </div>
        <Play
          className={`h-4 w-4 text-amber-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
          {/* Stories Grid Preview */}
          {items.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-4 gap-2">
                  {items.map((item, index) => (
                    <SortableStoryItem
                      key={item.id}
                      item={item}
                      index={index}
                      isSelected={editingItemId === item.id}
                      onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Add Story Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Upload Progress Indicators */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([id, progress]) => (
                <div key={id} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                  <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{progress}%</span>
                </div>
              ))}
            </div>
          )}

          {canAddMore && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-400 hover:bg-amber-50/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                Adicionar Story ({10 - items.length} restantes)
              </span>
            </button>
          )}

          {/* Selected Item Editor */}
          {editingItem && (
            <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-amber-700">Editando Story</Label>
                <button
                  onClick={() => setEditingItemId(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Type Badge (read-only) */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>
                  {editingItem.type === 'image' ? '📷 Imagem' : '▶️ Vídeo'}
                </span>
              </div>

              {/* Thumbnail URL (editable for videos) */}
              {editingItem.type === 'video' && (
                <div className="space-y-2">
                  <Label className="text-xs">Thumbnail (opcional)</Label>
                  <Input
                    value={editingItem.thumbnail || ""}
                    onChange={(e) => updateItem(editingItem.id, { thumbnail: e.target.value })}
                    placeholder="URL da imagem de capa"
                    className="text-sm"
                  />
                </div>
              )}

              {/* Duration (for videos only) */}
              {editingItem.type === 'video' && (
                <div className="space-y-2">
                  <Label className="text-xs">Duração (segundos)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    step="1"
                    value={editingItem.duration || 5}
                    onChange={(e) =>
                      updateItem(editingItem.id, { duration: parseInt(e.target.value) || 5 })
                    }
                    className="text-sm"
                  />
                </div>
              )}

              {/* Link */}
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" />
                  Link (opcional)
                </Label>
                <Input
                  value={editingItem.link || ""}
                  onChange={(e) => updateItem(editingItem.id, { link: e.target.value })}
                  placeholder="https://..."
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {/* Stories Options */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Opções dos Stories</p>

            {/* Auto Play */}
            <div className="flex items-center justify-between">
              <Label className="text-xs">Reproduzir automaticamente</Label>
              <Switch
                checked={localConfig.autoPlay === true}
                onCheckedChange={(checked) => updateField("autoPlay", checked)}
              />
            </div>

            {/* Show on Carousel */}
            <div className="flex items-center justify-between">
              <Label className="text-xs">Mostrar no carrossel</Label>
              <Switch
                checked={localConfig.showOnCarousel !== false}
                onCheckedChange={(checked) => updateField("showOnCarousel", checked)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
