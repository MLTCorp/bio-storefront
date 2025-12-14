import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon, Percent, Save, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductKit {
  id: string;
  label: string;
  price: number;
  link: string;
  discountLinks?: {
    [percent: number]: string;
  };
}

interface Product {
  id: string;
  title: string;
  discountPercent: number;
  kits: ProductKit[];
}

interface KitLinksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSave: (productId: string, kits: ProductKit[]) => void;
}

// Percentuais de desconto disponíveis
const DISCOUNT_PERCENTAGES = [10, 15, 20, 25, 30, 35, 40, 45, 50];

export function KitLinksModal({ open, onOpenChange, product, onSave }: KitLinksModalProps) {
  const [kits, setKits] = useState<ProductKit[]>([]);

  useEffect(() => {
    if (product) {
      // Deep clone to avoid mutating original
      setKits(JSON.parse(JSON.stringify(product.kits)));
    }
  }, [product, open]);

  const updateKitLink = (kitId: string, link: string) => {
    setKits(prev => prev.map(kit =>
      kit.id === kitId ? { ...kit, link } : kit
    ));
  };

  const updateKitDiscountLink = (kitId: string, percent: number, link: string) => {
    setKits(prev => prev.map(kit => {
      if (kit.id !== kitId) return kit;
      return {
        ...kit,
        discountLinks: {
          ...(kit.discountLinks || {}),
          [percent]: link,
        },
      };
    }));
  };

  const handleSave = () => {
    onSave(product.id, kits);
    onOpenChange(false);
  };

  const hasDiscount = product.discountPercent > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Links de Compra - {product.title}
          </DialogTitle>
          <DialogDescription>
            Configure os links de checkout para cada kit.
            {hasDiscount && (
              <span className="block mt-1 text-orange-600">
                Desconto ativo: {product.discountPercent}% - Configure também os links com desconto.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {kits.map((kit) => (
            <div key={kit.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
              {/* Kit Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-800">{kit.label}</span>
                  <span className="text-sm text-gray-500 ml-2">R$ {kit.price.toFixed(2)}</span>
                </div>
                {hasDiscount && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Com {product.discountPercent}%: R$ {(kit.price * (1 - product.discountPercent / 100)).toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Link Padrão (sem desconto) */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  Link Padrão (sem desconto)
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={kit.link || ""}
                    onChange={(e) => updateKitLink(kit.id, e.target.value)}
                    placeholder="https://site.com/checkout/produto"
                    className="text-sm"
                  />
                  {kit.link && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => window.open(kit.link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Links com Desconto */}
              {hasDiscount && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <Label className="text-xs text-orange-600 flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    Links com Desconto
                  </Label>
                  <div className="grid gap-2">
                    {DISCOUNT_PERCENTAGES.map((percent) => {
                      const isActive = percent === product.discountPercent;
                      const discountLink = kit.discountLinks?.[percent] || "";

                      return (
                        <div
                          key={percent}
                          className={`flex items-center gap-2 ${isActive ? 'bg-orange-50 p-2 rounded-md -mx-2' : ''}`}
                        >
                          <span className={`text-xs w-12 shrink-0 ${isActive ? 'font-bold text-orange-600' : 'text-gray-500'}`}>
                            {percent}%
                            {isActive && " ✓"}
                          </span>
                          <Input
                            value={discountLink}
                            onChange={(e) => updateKitDiscountLink(kit.id, percent, e.target.value)}
                            placeholder={`Link para ${percent}% de desconto`}
                            className={`text-xs h-8 ${isActive ? 'border-orange-300' : ''}`}
                          />
                          {discountLink && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 h-8 w-8"
                              onClick={() => window.open(discountLink, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Preencha apenas os percentuais que você usa. O link ativo ({product.discountPercent}%) está destacado.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Salvar Links
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
