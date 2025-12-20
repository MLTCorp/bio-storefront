import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, ChevronRight, Image, Type, Upload, User, DollarSign, FileText } from "lucide-react";
import { useDebouncedConfig } from "@/hooks/use-debounced-update";
import type { PixConfig } from "@/types/database";

interface PixEditorProps {
  config: PixConfig;
  onUpdate: (config: PixConfig) => void;
}

export function PixEditor({ config, onUpdate }: PixEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [localConfig, updateField] = useDebouncedConfig(config, onUpdate, 500);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("qrcodeImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-between bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-200"
      >
        <div className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-teal-600" />
          <span className="text-teal-700">
            PIX {localConfig.recipientName ? `- ${localConfig.recipientName}` : ""}
          </span>
        </div>
        <ChevronRight
          className={`h-4 w-4 text-teal-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded Editor */}
      {expanded && (
        <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
          {/* Mode Selector */}
          <div className="space-y-2">
            <Label className="text-xs">Modo de Exibicao</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateField("mode", "qrcode")}
                className={`p-3 rounded-lg text-sm flex flex-col items-center gap-1 transition-all ${
                  localConfig.mode === "qrcode"
                    ? "bg-teal-100 text-teal-700 border-2 border-teal-500"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                <Image className="h-4 w-4" />
                <span>QR Code</span>
              </button>
              <button
                onClick={() => updateField("mode", "copypaste")}
                className={`p-3 rounded-lg text-sm flex flex-col items-center gap-1 transition-all ${
                  localConfig.mode === "copypaste"
                    ? "bg-teal-100 text-teal-700 border-2 border-teal-500"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                <Type className="h-4 w-4" />
                <span>Codigo</span>
              </button>
            </div>
          </div>

          {/* QR Code Mode */}
          {localConfig.mode === "qrcode" && (
            <div className="space-y-3">
              <Label className="text-xs flex items-center gap-1">
                <Upload className="h-3 w-3" />
                Imagem do QR Code
              </Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {localConfig.qrcodeImage ? (
                <div className="relative">
                  <img
                    src={localConfig.qrcodeImage}
                    alt="QR Code PIX"
                    className="w-32 h-32 mx-auto rounded-lg border border-gray-200 object-contain bg-white"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 w-full text-xs text-teal-600 hover:text-teal-700"
                  >
                    Trocar imagem
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50/50 transition-colors flex flex-col items-center gap-2"
                >
                  <QrCode className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500">Clique para enviar o QR Code</span>
                </button>
              )}
            </div>
          )}

          {/* Copy-Paste Mode */}
          {localConfig.mode === "copypaste" && (
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Type className="h-3 w-3" />
                Codigo PIX (Copia e Cola)
              </Label>
              <Textarea
                value={localConfig.pixCode || ""}
                onChange={(e) => updateField("pixCode", e.target.value)}
                placeholder="Cole aqui o codigo PIX..."
                rows={3}
                className="text-xs font-mono"
              />
              <p className="text-[10px] text-gray-400">
                Gere o codigo no app do seu banco e cole aqui
              </p>
            </div>
          )}

          {/* Optional Fields */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Informacoes Opcionais</p>

            {/* Recipient Name */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <User className="h-3 w-3" />
                Nome do Destinatario
              </Label>
              <Input
                value={localConfig.recipientName || ""}
                onChange={(e) => updateField("recipientName", e.target.value)}
                placeholder="Ex: Maria Silva"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Valor (R$)
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={localConfig.amount || ""}
                onChange={(e) => updateField("amount", parseFloat(e.target.value) || undefined)}
                placeholder="0,00"
              />
              {localConfig.amount && (
                <p className="text-xs text-teal-600 font-medium">
                  {formatCurrency(localConfig.amount)}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Descricao
              </Label>
              <Input
                value={localConfig.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Ex: Pagamento do produto X"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
