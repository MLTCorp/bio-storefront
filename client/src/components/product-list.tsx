import { useConfig } from "@/lib/store";
import { SplitButton } from "./split-button";
import type { ReactNode } from "react";

export function ProductList() {
  const { config } = useConfig();

  // Group products if we had categories, for now just list them
  // Assuming first item is a "Best Seller"
  const bestSellers = config.products.slice(0, 1);
  const newArrivals = config.products.slice(1);

  return (
    <div className="space-y-6">
      {bestSellers.length > 0 && (
        <Section title="Destaques">
          {bestSellers.map(product => (
            <SplitButton 
              key={product.id}
              title={product.title} 
              description={product.description}
              image={product.image}
              basePrice={product.basePrice}
              discountPercent={config.discountPercent}
            />
          ))}
        </Section>
      )}

      {newArrivals.length > 0 && (
        <Section title="Outros Produtos">
          {newArrivals.map(product => (
            <SplitButton 
              key={product.id}
              title={product.title} 
              description={product.description}
              image={product.image}
              basePrice={product.basePrice}
              discountPercent={config.discountPercent}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-sm font-bold text-foreground/80 uppercase tracking-wider">{title}</h2>
        <div className="h-px bg-border flex-1" />
      </div>
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
}
