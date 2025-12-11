import React, { createContext, useContext, useState, ReactNode } from 'react';

// Default Images
import defaultProfile from "@assets/Imagem_do_WhatsApp_de_2025-03-28_à(s)_14.01.21_f254eb2f_1765496582626.jpg";
import product1Image from "@assets/SECAPS_BLACK___Fundo_Transparente___1_(1)_1765496582626.png";
import product2Image from "@assets/SECAPS_CHÁ___1_POTE_1765496582614.png";

export interface ProductKit {
  id: string;
  label: string; // e.g. "1 Pote", "3 Frascos"
  price: number; // The base price for this specific kit
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  kits: ProductKit[];
}

export interface AppConfig {
  profileName: string;
  profileBio: string;
  profileImage: string;
  videoUrl: string; 
  couponCode: string;
  discountPercent: number; // 0 to 100
  products: Product[];
}

const defaultProducts: Product[] = [
  {
    id: '1',
    title: 'Secaps Black',
    description: 'Energia, Foco e Força.',
    image: product1Image,
    kits: [
      { id: 'k1-1', label: '1 Pote', price: 97.00 },
      { id: 'k1-2', label: '3 Potes', price: 197.00 }, // Example bulk pricing
      { id: 'k1-3', label: '5 Potes', price: 297.00 },
    ]
  },
  {
    id: '2',
    title: 'Secaps Chá',
    description: 'Chá misto solúvel.',
    image: product2Image,
    kits: [
      { id: 'k2-1', label: '1 Pote', price: 87.00 },
      { id: 'k2-2', label: '3 Potes', price: 177.00 },
      { id: 'k2-3', label: '5 Potes', price: 247.00 },
    ]
  }
];

const defaultConfig: AppConfig = {
  profileName: "Tania Vi",
  profileBio: "Wellness & Lifestyle Creator ✨\nHelping you live your best healthy life.",
  profileImage: defaultProfile,
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
  couponCode: "BEMVINDO",
  discountPercent: 0,
  products: defaultProducts,
};

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductKit: (productId: string, kitId: string, updates: Partial<ProductKit>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setConfig(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const updateProductKit = (productId: string, kitId: string, updates: Partial<ProductKit>) => {
    setConfig(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          kits: p.kits.map(k => k.id === kitId ? { ...k, ...updates } : k)
        };
      })
    }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, updateProduct, updateProductKit }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
