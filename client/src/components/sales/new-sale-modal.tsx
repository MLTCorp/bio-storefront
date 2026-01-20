import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
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

interface NewSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: ProductConfig[];
  onSave: (data: SaleFormData) => Promise<boolean>;
}

export function NewSaleModal({ open, onOpenChange, products, onSave }: NewSaleModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedKitId, setSelectedKitId] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [commissionAmount, setCommissionAmount] = useState<string>('');
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);

  // Get selected product and its kits
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const availableKits = selectedProduct?.kits.filter(k => k.isVisible !== false) || [];
  const selectedKit = availableKits.find(k => k.id === selectedKitId);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setSelectedProductId('');
      setSelectedKitId('');
      setProductPrice('');
      setCommissionAmount('');
      setSaleDate(new Date());
    }
  }, [open]);

  // Auto-fill price when kit is selected
  useEffect(() => {
    if (selectedKit) {
      setProductPrice(selectedKit.price.toFixed(2));
    }
  }, [selectedKit]);

  // Reset kit when product changes
  useEffect(() => {
    setSelectedKitId('');
    setProductPrice('');
  }, [selectedProductId]);

  const handleSave = async () => {
    if (!selectedProduct || !selectedKit || !productPrice || !commissionAmount) return;

    setSaving(true);
    try {
      const success = await onSave({
        product_id: selectedProduct.id,
        product_title: selectedProduct.title,
        product_image: selectedProduct.image || null,
        kit_id: selectedKit.id,
        kit_label: selectedKit.label,
        product_price: parseFloat(productPrice),
        commission_amount: parseFloat(commissionAmount),
        sale_date: saleDate,
      });

      if (success) {
        onOpenChange(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = selectedProductId && selectedKitId && productPrice && commissionAmount && saleDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Venda</DialogTitle>
          <DialogDescription>
            Registre uma venda manualmente. Selecione o produto e preencha os valores.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">Produto</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kit Selection */}
          <div className="space-y-2">
            <Label htmlFor="kit">Kit / Opção</Label>
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
              Comissão que você realmente recebeu
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
