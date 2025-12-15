import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import type { SocialConfig } from "@/types/database";

interface SocialEditorProps {
  config: SocialConfig;
  onUpdate: (config: SocialConfig) => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  tiktok: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  ),
  custom: <span className="text-xs">Link</span>,
};

const platformColors: Record<string, string> = {
  instagram: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
  youtube: "bg-red-600",
  facebook: "bg-blue-600",
  twitter: "bg-black",
  tiktok: "bg-black",
  custom: "bg-gray-600",
};

export function SocialEditor({ config, onUpdate }: SocialEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [localConfig, updateField, updateFields] = useDebouncedConfig(config, onUpdate, 500);

  const addLink = (platform: SocialConfig["links"][0]["platform"]) => {
    updateField("links", [
      ...localConfig.links,
      {
        id: crypto.randomUUID(),
        platform,
        url: "",
      },
    ]);
  };

  const updateLink = (
    id: string,
    updates: Partial<SocialConfig["links"][0]>
  ) => {
    updateField("links", localConfig.links.map((link) =>
      link.id === id ? { ...link, ...updates } : link
    ));
  };

  const removeLink = (id: string) => {
    updateField("links", localConfig.links.filter((link) => link.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex flex-wrap gap-2 justify-center cursor-pointer"
      >
        {localConfig.links.length === 0 ? (
          <div className="text-sm text-gray-400 py-2">
            Clique para adicionar redes sociais
          </div>
        ) : (
          localConfig.links.map((link) => (
            <div
              key={link.id}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                platformColors[link.platform]
              }`}
            >
              {platformIcons[link.platform]}
            </div>
          ))
        )}
      </div>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          {/* Existing Links */}
          {localConfig.links.map((link) => (
            <div key={link.id} className="flex gap-2 items-center">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${
                  platformColors[link.platform]
                }`}
              >
                {platformIcons[link.platform]}
              </div>
              <Input
                value={link.url}
                onChange={(e) => updateLink(link.id, { url: e.target.value })}
                placeholder={`URL do ${link.platform}`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLink(link.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Add New */}
          <div className="space-y-2">
            <Label className="text-xs">Adicionar Rede</Label>
            <div className="flex flex-wrap gap-2">
              {(
                ["instagram", "tiktok", "youtube", "facebook", "twitter"] as const
              ).map((platform) => (
                <button
                  key={platform}
                  onClick={() => addLink(platform)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${platformColors[platform]} hover:opacity-80 transition-opacity`}
                >
                  {platformIcons[platform]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
