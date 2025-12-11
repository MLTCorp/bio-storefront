import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SplitButtonProps {
  title: string;
  description?: string;
  image: string;
  priceStart?: string;
  onSelect?: (quantity: number) => void;
}

export function SplitButton({ title, description, image, priceStart = "$39", onSelect }: SplitButtonProps) {
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex w-full bg-white rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 mb-4"
    >
      {/* Left Side: Product Info */}
      <div className="flex-1 flex items-center p-3 gap-3">
        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-secondary/30">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate leading-tight mb-1">{title}</h3>
          {description && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{description}</p>}
          <div className="flex items-center gap-1.5 mt-auto">
            <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{priceStart}</span>
          </div>
        </div>
      </div>

      {/* Right Side: Split Actions */}
      <div className="flex flex-col w-[88px] border-l border-border bg-gray-50/50 divide-y divide-border/60">
        <ActionButton quantity={1} label="1x" onClick={() => handleSelect(1)} />
        <ActionButton quantity={3} label="3x" highlight onClick={() => handleSelect(3)} />
        <ActionButton quantity={5} label="5x" onClick={() => handleSelect(5)} />
      </div>
    </motion.div>
  );
}

function ActionButton({ quantity, label, highlight, onClick }: { quantity: number; label: string; highlight?: boolean; onClick: () => void }) {
  return (
    <button 
      className={cn(
        "flex-1 flex items-center justify-center gap-1 text-xs font-medium transition-colors hover:bg-primary hover:text-white relative overflow-hidden active:scale-95 duration-200 cursor-pointer",
        highlight ? "bg-primary/5 text-primary font-semibold" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      <span>{label}</span>
      {highlight && (
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-bl-full group-hover:bg-white" />
      )}
    </button>
  );
}
