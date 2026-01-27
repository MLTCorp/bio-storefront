import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2, PenLine, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { ProductConfig, ProductKit, SaleFormData } from '@/types/database';

const MANUAL_PRODUCT_VALUE = '__manual__';

interface NewSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: ProductConfig[];
  onSave: (data: SaleFormData) => Promise<boolean>;
}

export function NewSaleModal({ open, onOpenChange, products, onSave }: NewSaleModalProps) {
  // Selection mode state
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedKitId, setSelectedKitId] = useState<string>('');

  // Manual mode state
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [manualProductTitle, setManualProductTitle] = useState<string>('');
  const [manualKitLabel, setManualKitLabel] = useState<string>('');

  // Shared state
  const [customerName, setCustomerName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [commissionAmount, setCommissionAmount] = useState<string>('');
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);

  // Derived values for selection mode
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const availableKits = selectedProduct?.kits.filter(k => k.isVisible !== false) || [];
  const selectedKit = availableKits.find(k => k.id === selectedKitId);

  const hasProducts = products.length > 0;

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedProductId('');
      setSelectedKitId('');
      setManualProductTitle('');
      setManualKitLabel('');
      setCustomerName('');
      setProductPrice('');
      setCommissionAmount('');
      setSaleDate(new Date());
      setIsManualMode(!hasProducts);
    }
  }, [open, hasProducts]);

  // Auto-fill price when kit is selected (selection mode)
  useEffect(() => {
    if (selectedKit) {
      setProductPrice(selectedKit.price.toFixed(2));
    }
  }, [selectedKit]);

  // Reset kit when product changes (selection mode)
  useEffect(() => {
    setSelectedKitId('');
    setProductPrice('');
  }, [selectedProductId]);

  // Handle product select change (includes manual option)
  const handleProductChange = (value: string) => {
    if (value === MANUAL_PRODUCT_VALUE) {
      setIsManualMode(true);
      setSelectedProductId('');
      setSelectedKitId('');
      setProductPrice('');
    } else {
      setIsManualMode(false);
      setSelectedProductId(value);
    }
  };

  // Switch back to selection mode
  const switchToSelectionMode = () => {
    setIsManualMode(false);
    setManualProductTitle('');
    setManualKitLabel('');
    setProductPrice('');
    setCommissionAmount('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let formData: SaleFormData;

      if (isManualMode) {
        if (!manualProductTitle || !manualKitLabel || !productPrice || !commissionAmount) return;

        formData = {
          product_id: `manual_${Date.now()}`,
          product_title: manualProductTitle.trim(),
          product_image: null,
          kit_id: `kit_manual_${Date.now()}`,
          kit_label: manualKitLabel.trim(),
          product_price: parseFloat(productPrice),
          commission_amount: parseFloat(commissionAmount),
          sale_date: saleDate,
          customer_name: customerName.trim() || undefined,
        };
      } else {
        if (!selectedProduct || !selectedKit || !productPrice || !commissionAmount) return;

        formData = {
          product_id: selectedProduct.id,
          product_title: selectedProduct.title,
          product_image: selectedProduct.image || null,
          kit_id: selectedKit.id,
          kit_label: selectedKit.label,
          product_price: parseFloat(productPrice),
          commission_amount: parseFloat(commissionAmount),
          sale_date: saleDate,
          customer_name: customerName.trim() || undefined,
        };
      }

      const success = await onSave(formData);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = isManualMode
    ? !!(manualProductTitle.trim() && manualKitLabel.trim() && productPrice && commissionAmount && saleDate)
    : !!(selectedProductId && selectedKitId && productPrice && commissionAmount && saleDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Venda</DialogTitle>
          <DialogDescription>
            Registre uma venda manualmente.{' '}
            {hasProducts
              ? 'Selecione um produto existente ou digite os dados manualmente.'
              : 'Preencha os dados do produto e os valores.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* === SELECTION MODE === */}
          {!isManualMode && hasProducts && (
            <>
              {/* Product Selection */}
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Select value={selectedProductId} onValueChange={handleProductChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.title}
                      </SelectItem>
                    ))}
                    <SelectItem value={MANUAL_PRODUCT_VALUE}>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <PenLine className="h-3 w-3" />
                        Outro produto (digitar manualmente)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Kit Selection */}
              <div className="space-y-2">
                <Label htmlFor="kit">Kit / Opcao</Label>
                <Select
                  value={selectedKitId}
                  onValueChange={setSelectedKitId}
                  disabled={!selectedProductId || availableKits.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedProductId ? "Selecione o kit" : "Selecione um produto primeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableKits.map((kit) => (
                      <SelectItem key={kit.id} value={kit.id}>
                        {kit.label} - R$ {kit.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* === MANUAL MODE === */}
          {isManualMode && (
            <>
              {/* Back to selection link (only if there are products) */}
              {hasProducts && (
                <button
                  type="button"
                  onClick={switchToSelectionMode}
                  className="text-sm text-primary hover:underline"
                >
                  Voltar para selecao de produtos
                </button>
              )}

              {/* Manual Product Title */}
              <div className="space-y-2">
                <Label htmlFor="manual-product">Nome do Produto</Label>
                <Input
                  id="manual-product"
                  placeholder="Ex: Curso de Marketing Digital"
                  value={manualProductTitle}
                  onChange={(e) => setManualProductTitle(e.target.value)}
                />
              </div>

              {/* Manual Kit Label */}
              <div className="space-y-2">
                <Label htmlFor="manual-kit">Kit / Opcao</Label>
                <Input
                  id="manual-kit"
                  placeholder="Ex: 1 Unidade, Kit Completo, Plano Anual..."
                  value={manualKitLabel}
                  onChange={(e) => setManualKitLabel(e.target.value)}
                />
              </div>
            </>
          )}

          {/* === SHARED FIELDS (both modes) === */}

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customer-name">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Cliente
              </span>
            </Label>
            <Input
              id="customer-name"
              placeholder="Nome do comprador (opcional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Identifique quem fez a compra
            </p>
          </div>

          {/* Product Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Valor do Produto (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Valor faturado na venda
            </p>
          </div>

          {/* Commission Amount */}
          <div className="space-y-2">
            <Label htmlFor="commission">Valor Recebido (R$)</Label>
            <Input
              id="commission"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={commissionAmount}
              onChange={(e) => setCommissionAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Comissao que voce realmente recebeu
            </p>
          </div>

          {/* Sale Date */}
          <div className="space-y-2">
            <Label>Data da Venda</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !saleDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {saleDate ? format(saleDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={saleDate}
                  onSelect={(date) => date && setSaleDate(date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid || saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Venda'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
