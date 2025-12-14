import { useConfig } from "@/lib/store";
import { ShirtParallaxCard } from "@/components/ui/shirt-parallax-card";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function ProductList() {
  const { config } = useConfig();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 50,
        damping: 15
      }
    }
  };

  return (
    <div className="space-y-6">
      <Section title="Ofertas Especiais">
        <motion.div
          className="space-y-4"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {config.products.map(product => (
            <motion.div key={product.id} variants={item}>
              <ShirtParallaxCard
                productId={product.id}
                title={product.title}
                description={product.description}
                imageUrl={product.image}
                imageScale={product.imageScale}
                kits={product.kits}
                discountPercent={product.discountPercent ?? config.discountPercent}
              />
            </motion.div>
          ))}
        </motion.div>
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
      <div className="px-2">
        {children}
      </div>
    </div>
  );
}
