import { useConfig } from "@/lib/store";
import { SplitButton } from "./split-button";
import type { ReactNode } from "react";

export function ProductList() {
  const { config } = useConfig();

  return (
    <div className="space-y-6">
      <Section title="Ofertas Especiais">
        {config.products.map(product => (
          <SplitButton 
            key={product.id}
            title={product.title} 
            description={product.description}
            image={product.image}
            kits={product.kits}
            discountPercent={config.discountPercent}
          />
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-sm font-bold text-foreground/80 uppercase tracking-wider">{title}</h2>
        <div className="h-px bg-border flex-1" />
      </div>
      <div className="space-y-2 px-2">
        {children}
      </div>
    </div>
  );
}
