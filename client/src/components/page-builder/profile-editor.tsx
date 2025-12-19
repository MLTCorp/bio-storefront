import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Crop, Download } from "lucide-react";
import { AnimatedGenerateButton } from "@/components/ui/animated-generate-button";
import { AIImageModal } from "@/components/ai-image-modal";
import { ImagePositioner } from "@/components/ui/image-positioner";
import { useDebouncedUpdate } from "@/hooks/use-debounced-update";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Page } from "@/types/database";
import type { Theme } from "@/lib/themes";

interface ProfileEditorProps {
  page: Page;
  onUpdate: (updates: Partial<Page>) => void;
  onSave: () => Promise<boolean>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  theme?: Theme;
}

export function ProfileEditor({
  page,
  onUpdate,
  onSave,
  onImageUpload,
  uploading,
  theme,
}: ProfileEditorProps) {
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [positionModalOpen, setPositionModalOpen] = useState(false);

  // Debounced values for smooth typing
  const [localName, setLocalName] = useDebouncedUpdate(
    page.profile_name,
    (value) => onUpdate({ profile_name: value }),
    500
  );
  const [localBio, setLocalBio] = useDebouncedUpdate(
    page.profile_bio || "",
    (value) => onUpdate({ profile_bio: value }),
    500
  );

  const handleDownloadImage = async () => {
    if (!page.profile_image) return;
    try {
      const response = await fetch(page.profile_image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `foto-perfil-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(page.profile_image, "_blank");
    }
  };

  // Render bio with line breaks
  const renderBioWithBreaks = (bio: string) => {
    return bio.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="p-6 pb-4 text-center">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center mb-4">
        {/* Image Container */}
        <div
          className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shadow-lg relative group cursor-pointer"
          style={{ border: `4px solid #9ca3af40` }}
        >
          {page.profile_image ? (
            <img
              src={page.profile_image}
              alt={page.profile_name}
              className="absolute object-cover"
              style={{
                width: `${page.profile_image_scale || 100}%`,
                height: `${page.profile_image_scale || 100}%`,
                left: `${-((page.profile_image_scale || 100) - 100) * ((page.profile_image_position_x ?? 50) / 100)}%`,
                top: `${-((page.profile_image_scale || 100) - 100) * ((page.profile_image_position_y ?? 50) / 100)}%`,
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

        {/* Image Action Buttons */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2">
          {page.profile_image && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPositionModalOpen(true)}
                className="text-xs text-gray-500 hover:text-gray-700 h-7 px-1.5 sm:px-2"
                title="Ajustar posição da imagem"
              >
                <Crop className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Ajustar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadImage}
                className="text-xs text-gray-500 hover:text-gray-700 h-7 px-1.5 sm:px-2"
                title="Baixar imagem"
              >
                <Download className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Salvar</span>
              </Button>
            </>
          )}
          <AnimatedGenerateButton
            labelIdle="Gerar com IA"
            labelActive="Gerando..."
            generating={false}
            onClick={() => setAiModalOpen(true)}
            highlightHueDeg={280}
            className="text-xs"
            hideTextOnMobile
          />
        </div>
      </div>

      {/* Profile Name */}
      {editingName ? (
        <Input
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onBlur={() => setEditingName(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
          autoFocus
          className="text-center text-xl font-bold border-primary max-w-xs mx-auto"
        />
      ) : (
        <h1
          onClick={() => setEditingName(true)}
          className="text-xl font-bold cursor-text hover:opacity-80 rounded px-2 py-1 inline-block transition-colors"
          style={{ color: theme?.text.primary || '#111827' }}
        >
          {localName || "Seu Nome"}
        </h1>
      )}

      {/* Profile Bio */}
      {editingBio ? (
        <Textarea
          value={localBio}
          onChange={(e) => setLocalBio(e.target.value)}
          onBlur={() => setEditingBio(false)}
          autoFocus
          rows={3}
          className="text-center text-sm text-gray-600 border-primary max-w-sm mx-auto mt-2"
          placeholder="Sua bio aqui... (use Enter para quebrar linha)"
        />
      ) : (
        <p
          onClick={() => setEditingBio(true)}
          className="text-sm cursor-text hover:opacity-80 rounded px-2 py-1 mt-1 inline-block transition-colors whitespace-pre-line"
          style={{ color: theme?.text.secondary || '#6b7280' }}
        >
          {localBio ? renderBioWithBreaks(localBio) : "Clique para adicionar uma bio"}
        </p>
      )}

      {/* AI Image Generation Modal */}
      <AIImageModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        type="profile"
        onImageGenerated={(imageUrl) => onUpdate({ profile_image: imageUrl })}
      />

      {/* Image Position Modal */}
      <Dialog open={positionModalOpen} onOpenChange={setPositionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar foto de perfil</DialogTitle>
          </DialogHeader>
          {page.profile_image && (
            <ImagePositioner
              src={page.profile_image}
              positionX={page.profile_image_position_x ?? 50}
              positionY={page.profile_image_position_y ?? 50}
              scale={page.profile_image_scale || 100}
              aspectRatio="circle"
              minScale={100}
              maxScale={200}
              onChange={({ positionX, positionY, scale }) => {
                onUpdate({
                  profile_image_position_x: positionX,
                  profile_image_position_y: positionY,
                  profile_image_scale: scale,
                });
              }}
            />
          )}
          <div className="flex justify-end">
            <Button
              onClick={async () => {
                await onSave();
                setPositionModalOpen(false);
              }}
            >
              Pronto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
