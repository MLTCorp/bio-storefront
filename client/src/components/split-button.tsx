import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SplitButtonProps {
  title: string;
  description?: string;
  image: string;
  basePrice: number;
  discountPercent?: number;
  onSelect?: (quantity: number) => void;
}

export function SplitButton({ title, description, image, basePrice, discountPercent = 0, onSelect }: SplitButtonProps) {
  const { toast } = useToast();

  const handleSelect = (qty: number) => {
    toast({
      title: "Added to Cart",
      description: `Added ${qty}x ${title} to your cart.`,
      duration: 2000,
      className: "bg-primary text-primary-foreground border-none shadow-lg",
    });
    if (onSelect) onSelect(qty);
  };

  // Calculate "From" price for display (usually the 1 unit price)
  const displayPrice = discountPercent > 0 
    ? basePrice * (1 - discountPercent / 100) 
    : basePrice;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex w-full bg-white rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 mb-4"
    >
      {/* Left Side: Product Info */}
      <div className="flex-1 flex items-center p-3 gap-3">
        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-white border border-gray-100 p-1">
          <img src={image} alt={title} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="flex flex-col min-w-0 py-1">
          <h3 className="font-semibold text-foreground text-sm truncate leading-tight mb-1">{title}</h3>
          {description && <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">{description}</p>}
          <div className="flex items-center gap-2 mt-auto">
             {discountPercent > 0 ? (
               <>
                 <span className="text-xs text-muted-foreground line-through decoration-red-400">R$ {basePrice.toFixed(2)}</span>
                 <span className="text-sm font-bold text-primary">R$ {displayPrice.toFixed(2)}</span>
               </>
             ) : (
               <span className="text-sm font-bold text-primary">R$ {basePrice.toFixed(2)}</span>
             )}
          </div>
        </div>
      </div>

      {/* Right Side: Split Actions */}
      <div className="flex flex-col w-[100px] border-l border-border bg-gray-50/80 divide-y divide-border/60">
        <ActionButton 
          quantity={1} 
          label="1 unidade" 
          basePrice={basePrice} 
          discountPercent={discountPercent} 
          onClick={() => handleSelect(1)} 
        />
        <ActionButton 
          quantity={3} 
          label="3 unidades" 
          highlight 
          basePrice={basePrice} 
          discountPercent={discountPercent} 
          onClick={() => handleSelect(3)} 
        />
        <ActionButton 
          quantity={5} 
          label="5 unidades" 
          basePrice={basePrice} 
          discountPercent={discountPercent} 
          onClick={() => handleSelect(5)} 
        />
      </div>
    </motion.div>
  );
}

interface ActionButtonProps { 
  quantity: number; 
  label: string; 
  highlight?: boolean; 
  basePrice: number;
  discountPercent: number;
  onClick: () => void; 
}

function ActionButton({ quantity, label, highlight, basePrice, discountPercent, onClick }: ActionButtonProps) {
  // Simple multiplier logic for price - in a real app this might be different
  const originalTotal = basePrice * quantity;
  const discountedTotal = originalTotal * (1 - discountPercent / 100);

  return (
    <button 
      className={cn(
        "flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors hover:bg-primary hover:text-white relative overflow-hidden active:scale-95 duration-200 cursor-pointer text-center",
        highlight ? "bg-primary/5 text-primary" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      <span className="text-[10px] font-medium leading-tight mb-0.5 opacity-80">{quantity}x</span>
      
      {discountPercent > 0 ? (
        <div className="flex flex-col items-center leading-none">
           <span className="text-[9px] line-through opacity-60 decoration-current">R$ {originalTotal.toFixed(0)}</span>
           <span className="text-xs font-bold">R$ {discountedTotal.toFixed(0)}</span>
        </div>
      ) : (
        <span className="text-xs font-bold leading-none">R$ {originalTotal.toFixed(0)}</span>
      )}

      {highlight && (
        <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-bl-full group-hover:bg-white" />
      )}
    </button>
  );
}
