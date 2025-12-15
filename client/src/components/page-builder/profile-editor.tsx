import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Loader2, Upload, MoveHorizontal, MoveVertical, ZoomIn } from "lucide-react";
import { AnimatedGenerateButton } from "@/components/ui/animated-generate-button";
import { AIImageModal } from "@/components/ai-image-modal";
import type { Page } from "@/types/database";

interface ProfileEditorProps {
  page: Page;
  onUpdate: (updates: Partial<Page>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export function ProfileEditor({
  page,
  onUpdate,
  onImageUpload,
  uploading,
}: ProfileEditorProps) {
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="p-6 pb-4 text-center">
      {/* Profile Image */}
      <div className="relative inline-block mb-4">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg relative group cursor-pointer">
          {page.profile_image ? (
            <img
              src={page.profile_image}
              alt={page.profile_name}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${(page.profile_image_scale || 100) / 100})`,
                objectPosition: `${page.profile_image_position_x ?? 50}% ${page.profile_image_position_y ?? 50}%`,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400 bg-gray-100">
              {page.profile_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}

          {/* Upload Overlay */}
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            {uploading ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : (
              <Upload className="h-6 w-6 text-white" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Image Controls - Only show when image exists */}
        {page.profile_image && (
          <div className="mt-3 space-y-2 max-w-[200px] mx-auto">
            {/* Zoom */}
            <div className="flex items-center gap-2">
              <ZoomIn className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <Slider
                value={[page.profile_image_scale || 100]}
                onValueChange={([val]) => onUpdate({ profile_image_scale: val })}
                min={100}
                max={200}
                step={5}
                className="flex-1"
              />
            </div>
            {/* Position X */}
            <div className="flex items-center gap-2">
              <MoveHorizontal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <Slider
                value={[page.profile_image_position_x ?? 50]}
                onValueChange={([val]) => onUpdate({ profile_image_position_x: val })}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
            {/* Position Y */}
            <div className="flex items-center gap-2">
              <MoveVertical className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <Slider
                value={[page.profile_image_position_y ?? 50]}
                onValueChange={([val]) => onUpdate({ profile_image_position_y: val })}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </div>
        )}

        {/* AI Generate Button */}
        <div className="mt-2">
          <AnimatedGenerateButton
            labelIdle="Gerar com IA"
            labelActive="Gerando..."
            generating={false}
            onClick={() => setAiModalOpen(true)}
            highlightHueDeg={280}
            className="text-xs"
          />
        </div>
      </div>

      {/* AI Image Generation Modal */}
      <AIImageModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        type="profile"
        onImageGenerated={(imageUrl) => onUpdate({ profile_image: imageUrl })}
      />

      {/* Profile Name */}
      {editingName ? (
        <Input
          value={page.profile_name}
          onChange={(e) => onUpdate({ profile_name: e.target.value })}
          onBlur={() => setEditingName(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
          autoFocus
          className="text-center text-xl font-bold border-primary max-w-xs mx-auto"
        />
      ) : (
        <h1
          onClick={() => setEditingName(true)}
          className="text-xl font-bold cursor-text hover:bg-gray-100 rounded px-2 py-1 inline-block transition-colors"
        >
          {page.profile_name || "Seu Nome"}
        </h1>
      )}

      {/* Profile Bio */}
      {editingBio ? (
        <Textarea
          value={page.profile_bio || ""}
          onChange={(e) => onUpdate({ profile_bio: e.target.value })}
          onBlur={() => setEditingBio(false)}
          autoFocus
          rows={2}
          className="text-center text-sm text-gray-600 border-primary max-w-sm mx-auto mt-2"
          placeholder="Sua bio aqui..."
        />
      ) : (
        <p
          onClick={() => setEditingBio(true)}
          className="text-sm text-gray-600 cursor-text hover:bg-gray-100 rounded px-2 py-1 mt-1 inline-block transition-colors"
        >
          {page.profile_bio || "Clique para adicionar uma bio"}
        </p>
      )}
    </div>
  );
}
