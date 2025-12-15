import { useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Upload,
  Sparkles,
  Wand2,
  Check,
  RefreshCw,
  X,
  ImageIcon,
  UserCircle,
  Package,
} from "lucide-react";

type ImageType = "profile" | "product" | "thumbnail";

interface AIImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ImageType;
  onImageGenerated: (imageUrl: string) => void;
}

const PROMPT_TEMPLATES: Record<ImageType, { label: string; prompt: string; description: string }[]> = {
  profile: [
    {
      label: "Profissional",
      prompt: "Retrato profissional de negócios, fundo neutro limpo, iluminação suave de estúdio, expressão confiante e amigável, foto de alta qualidade para redes sociais",
      description: "Ideal para perfil de negócios"
    },
    {
      label: "Influencer",
      prompt: "Retrato estilo influenciador de Instagram, iluminação natural brilhante, estética moderna, tons quentes, aparência estilosa e acessível, perfeito para bio de redes sociais",
      description: "Estilo redes sociais"
    },
    {
      label: "Elegante",
      prompt: "Retrato elegante e sofisticado, sombras suaves, estética luxuosa, visual profissional refinado, maquiagem sutil, qualidade premium",
      description: "Sofisticado e refinado"
    },
    {
      label: "Natural",
      prompt: "Retrato natural e autêntico, iluminação externa suave, sorriso genuíno, cores quentes e convidativas, aparência amigável e acessível",
      description: "Aparência natural e amigável"
    },
  ],
  product: [
    {
      label: "Fundo Branco",
      prompt: "Foto de produto em fundo branco puro, estilo profissional de e-commerce, foco nítido, estética clean e minimalista, iluminação perfeita, sem sombras",
      description: "Ideal para e-commerce"
    },
    {
      label: "Cosmético",
      prompt: "Fotografia de produto cosmético de luxo, iluminação feminina suave, apresentação elegante, atmosfera de spa, estética de beleza premium",
      description: "Produtos de beleza"
    },
    {
      label: "Premium",
      prompt: "Fotografia de produto de alta qualidade, iluminação dramática de estúdio, fundo elegante de mármore escuro, apresentação de marca premium, superfície reflexiva",
      description: "Aparência luxuosa"
    },
    {
      label: "Lifestyle",
      prompt: "Produto em cenário lifestyle, ambiente doméstico natural, iluminação quente e aconchegante, clima aspiracional, composição digna de Instagram",
      description: "Contexto de uso real"
    },
  ],
  thumbnail: [
    {
      label: "Chamativo",
      prompt: "Thumbnail de vídeo chamativa, cores vibrantes e ousadas, composição diagonal dinâmica, alto contraste, layout amigável para texto, estilo YouTube",
      description: "Máximo impacto visual"
    },
    {
      label: "Tutorial",
      prompt: "Thumbnail de tutorial limpa, estilo de apresentador profissional, layout organizado, ponto focal claro, sensação educacional, aparência confiável",
      description: "Para vídeos educativos"
    },
    {
      label: "Review",
      prompt: "Thumbnail de review de produto, estilo antes e depois, layout de comparação, apresentação limpa, estética profissional de análise",
      description: "Para reviews de produtos"
    },
    {
      label: "Transformação",
      prompt: "Thumbnail de transformação, efeito dramático de antes e depois, composição dividida, vitrine de resultados impressionantes, potencial viral",
      description: "Mostrar resultados"
    },
  ],
};

const TYPE_LABELS: Record<ImageType, string> = {
  profile: "Foto de Perfil",
  product: "Imagem do Produto",
  thumbnail: "Thumbnail do Video",
};

const REFERENCE_HINTS: Record<ImageType, { title: string; hint: string }> = {
  profile: {
    title: "Sua foto",
    hint: "Suba uma selfie ou foto sua para a IA usar como referência"
  },
  product: {
    title: "Foto do produto",
    hint: "Suba uma foto do seu produto para a IA recriar profissionalmente"
  },
  thumbnail: {
    title: "Imagem base",
    hint: "Suba uma imagem para usar como base da thumbnail"
  },
};

// Tipos que precisam de duas fotos (pessoa + produto)
const NEEDS_DUAL_UPLOAD: ImageType[] = ["product", "thumbnail"];

export function AIImageModal({
  open,
  onOpenChange,
  type,
  onImageGenerated,
}: AIImageModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState<"configure" | "result">("configure");
  const [prompt, setPrompt] = useState("");
  // Foto de referência principal (produto para product/thumbnail, pessoa para profile)
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  // Foto da pessoa (apenas para product/thumbnail)
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [improvingPrompt, setImprovingPrompt] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const personInputRef = useRef<HTMLInputElement>(null);

  const needsDualUpload = NEEDS_DUAL_UPLOAD.includes(type);

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setReferenceImage(base64);
      setReferencePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePersonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPersonImage(base64);
      setPersonPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleImprovePrompt = async () => {
    if (!prompt.trim() || !user) return;

    setImprovingPrompt(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/improve-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify({ prompt, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao melhorar prompt");
      }

      setPrompt(data.improvedPrompt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImprovingPrompt(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user.id,
        },
        body: JSON.stringify({
          type,
          prompt,
          referenceImage,
          personImage: needsDualUpload ? personImage : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao gerar imagem");
      }

      setRemaining(data.remaining);

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setStep("result");
      } else if (data.rawResponse) {
        // Model returned text instead of image
        setError(
          "O modelo retornou texto em vez de imagem. Tente um prompt diferente."
        );
        console.log("Raw AI response:", data.rawResponse);
      } else {
        setError("Nenhuma imagem foi gerada. Tente novamente.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleConfirm = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage);
      handleClose();
    }
  };

  const handleRegenerate = () => {
    setStep("configure");
    setGeneratedImage(null);
  };

  const handleClose = () => {
    setStep("configure");
    setPrompt("");
    setReferenceImage(null);
    setReferencePreview(null);
    setPersonImage(null);
    setPersonPreview(null);
    setGeneratedImage(null);
    setError(null);
    onOpenChange(false);
  };

  const handleTemplateClick = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Gerar {TYPE_LABELS[type]} com IA
          </DialogTitle>
        </DialogHeader>

        {step === "configure" ? (
          <div className="space-y-4">
            {/* Image Uploads - Dual for product/thumbnail, single for profile */}
            {needsDualUpload ? (
              <div className="grid grid-cols-2 gap-3">
                {/* Person Photo Upload */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <UserCircle className="h-3.5 w-3.5 text-blue-500" />
                    Sua foto
                  </Label>
                  <div
                    onClick={() => personInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-lg p-3 transition-colors cursor-pointer ${
                      personPreview
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                    }`}
                  >
                    {personPreview ? (
                      <div className="relative">
                        <img
                          src={personPreview}
                          alt="Person"
                          className="w-full h-24 object-contain rounded-lg bg-white"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPersonImage(null);
                            setPersonPreview(null);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-gray-500 py-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircle className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-xs text-gray-400 text-center">
                          Selfie ou foto sua
                        </span>
                      </div>
                    )}
                    <input
                      ref={personInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePersonUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Product Photo Upload */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-purple-500" />
                    Foto do produto
                  </Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-lg p-3 transition-colors cursor-pointer ${
                      referencePreview
                        ? "border-purple-400 bg-purple-50"
                        : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
                    }`}
                  >
                    {referencePreview ? (
                      <div className="relative">
                        <img
                          src={referencePreview}
                          alt="Product"
                          className="w-full h-24 object-contain rounded-lg bg-white"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReferenceImage(null);
                            setReferencePreview(null);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-gray-500 py-2">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className="text-xs text-gray-400 text-center">
                          Foto do seu produto
                        </span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleReferenceUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Single Upload for Profile */
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {REFERENCE_HINTS[type].title}
                  <span className="text-xs font-normal text-gray-400">(recomendado)</span>
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${
                    referencePreview
                      ? "border-purple-400 bg-purple-50"
                      : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
                  }`}
                >
                  {referencePreview ? (
                    <div className="relative">
                      <img
                        src={referencePreview}
                        alt="Reference"
                        className="w-full h-32 object-contain rounded-lg bg-white"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReferenceImage(null);
                          setReferencePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Foto carregada
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500 py-2">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-purple-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Clique para fazer upload
                      </span>
                      <span className="text-xs text-gray-400 text-center max-w-[200px]">
                        {REFERENCE_HINTS[type].hint}
                      </span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReferenceUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Prompt Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Descreva a imagem</Label>
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Uma foto profissional com fundo neutro e iluminacao suave..."
                  rows={3}
                  className="pr-12"
                />
                <button
                  onClick={handleImprovePrompt}
                  disabled={!prompt.trim() || improvingPrompt}
                  className="absolute bottom-2 right-2 p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Melhorar prompt com IA"
                >
                  {improvingPrompt ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Templates */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Estilos prontos</Label>
              <div className="grid grid-cols-2 gap-2">
                {PROMPT_TEMPLATES[type].map((template) => (
                  <button
                    key={template.label}
                    onClick={() => handleTemplateClick(template.prompt)}
                    className={`p-3 text-left rounded-lg border-2 transition-all ${
                      prompt === template.prompt
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                    }`}
                  >
                    <span className="font-medium text-sm block">{template.label}</span>
                    <span className="text-xs text-gray-500">{template.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Imagem
                </>
              )}
            </Button>

            {/* Remaining count */}
            {remaining !== null && (
              <p className="text-center text-sm text-gray-500">
                {remaining} {remaining === 1 ? "imagem restante" : "imagens restantes"} hoje
              </p>
            )}
          </div>
        ) : (
          /* Result Step */
          <div className="space-y-4">
            {/* Generated Image Preview */}
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRegenerate}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar outra
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
            </div>

            {/* Remaining count */}
            {remaining !== null && (
              <p className="text-center text-sm text-gray-500">
                {remaining} {remaining === 1 ? "imagem restante" : "imagens restantes"} hoje
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
