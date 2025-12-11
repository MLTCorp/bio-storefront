import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight } from "lucide-react";
import type { ProductKit } from "@/lib/store";

interface SplitButtonProps {
  title: string;
  description?: string;
  image: string;
  kits: ProductKit[];
  discountPercent?: number;
  onSelect?: (kitLabel: string) => void;
}

export function SplitButton({ title, description, image, kits, discountPercent = 0, onSelect }: SplitButtonProps) {
  const { toast } = useToast();

  const handleSelect = (kit: ProductKit) => {
    toast({
      title: "Adicionado ao Carrinho",
      description: `Você selecionou: ${kit.label} de ${title}`,
      duration: 2000,
      className: "bg-primary text-primary-foreground border-none shadow-lg",
    });
    if (onSelect) onSelect(kit.label);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full mb-12 mt-8" // Added margin top for floating image space
    >
      {/* Floating Image - Positioned absolute to overlap */}
      <div className="absolute -top-6 -left-2 z-20 w-28 h-28 drop-shadow-xl filter pointer-events-none">
         <img 
           src={image} 
           alt={title} 
           className="w-full h-full object-contain transform -rotate-6 scale-110" 
         />
      </div>

      <div className="flex bg-white rounded-2xl shadow-sm border border-border/60 overflow-visible relative z-10 min-h-[110px]">
        
        {/* Left Side: Spacer for image + Product Info */}
        <div className="flex-1 flex flex-col justify-center pl-24 pr-2 py-3">
          <h3 className="font-bold text-foreground text-base leading-tight mb-1">{title}</h3>
          {description && <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">{description}</p>}
          
          {discountPercent > 0 && (
            <div className="inline-flex items-center self-start bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Right Side: Kit Actions */}
        <div className="flex flex-col w-[110px] border-l border-border/60 bg-gray-50/50 divide-y divide-border/60 rounded-r-2xl overflow-hidden">
          {kits.map((kit, index) => (
            <ActionButton 
              key={kit.id}
              label={kit.label} 
              basePrice={kit.price} 
              discountPercent={discountPercent} 
              highlight={index === 1} // Highlight the middle option usually
              onClick={() => handleSelect(kit)} 
            />
          ))}
        </div>
        
        {/* Visual Cue */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-sm border border-border flex items-center justify-center z-30 pointer-events-none">
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}

interface ActionButtonProps { 
  label: string; 
  highlight?: boolean; 
  basePrice: number;
  discountPercent: number;
  onClick: () => void; 
}

function ActionButton({ label, highlight, basePrice, discountPercent, onClick }: ActionButtonProps) {
  const discountedPrice = basePrice * (1 - discountPercent / 100);

  return (
    <button 
      className={cn(
        "flex-1 flex flex-col items-center justify-center py-2 px-1 transition-all hover:bg-primary hover:text-white relative overflow-hidden active:scale-95 duration-200 cursor-pointer text-center group",
        highlight ? "bg-primary/5" : "bg-transparent"
      )}
      onClick={onClick}
    >
      <span className={cn(
        "text-[9px] font-semibold uppercase tracking-wide mb-0.5 opacity-70 group-hover:opacity-90",
         highlight && !discountPercent ? "text-primary" : "text-muted-foreground",
         "group-hover:text-white"
      )}>
        {label}
      </span>
      
      {discountPercent > 0 ? (
        <div className="flex flex-col items-center leading-none">
           <span className="text-[9px] line-through opacity-50 decoration-current mb-[1px]">R$ {basePrice.toFixed(0)}</span>
           <span className={cn("text-sm font-black group-hover:text-white", highlight ? "text-primary" : "text-foreground")}>
             R$ {discountedPrice.toFixed(0)}
           </span>
        </div>
      ) : (
        <span className={cn("text-sm font-black leading-none group-hover:text-white", highlight ? "text-primary" : "text-foreground")}>
          R$ {basePrice.toFixed(0)}
        </span>
      )}
    </button>
  );
}
