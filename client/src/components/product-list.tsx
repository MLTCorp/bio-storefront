import { SplitButton } from "./split-button";
import supplementImage from "@assets/generated_images/minimalist_green_supplement_bottle_product_shot.png";
import creamImage from "@assets/generated_images/minimalist_white_skincare_cream_jar_product_shot.png";
import type { ReactNode } from "react";

export function ProductList() {
  return (
    <div className="space-y-6">
      <Section title="Best Sellers">
        <SplitButton 
          title="Daily Greens Complex" 
          description="Boost energy & immunity with organic greens."
          image={supplementImage}
          priceStart="$45"
        />
        <SplitButton 
          title="Hydration Glow Cream" 
          description="Deep moisture for radiant, healthy skin."
          image={creamImage}
          priceStart="$32"
        />
      </Section>

      <Section title="New Arrivals">
        <SplitButton 
          title="Night Recovery Oil" 
          description="Repair while you sleep."
          image={supplementImage} // Reusing for now
          priceStart="$55"
        />
      </Section>
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