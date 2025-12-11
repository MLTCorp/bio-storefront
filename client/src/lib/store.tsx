import React, { createContext, useContext, useState, ReactNode } from 'react';

// Default Images
import defaultProfile from "@assets/Imagem_do_WhatsApp_de_2025-03-28_à(s)_14.01.21_f254eb2f_1765496582626.jpg";
import product1Image from "@assets/SECAPS_BLACK___Fundo_Transparente___1_(1)_1765496582626.png";
import product2Image from "@assets/SECAPS_CHÁ___1_POTE_1765496582614.png";

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  basePrice: number; // Price for 1 unit
}

export interface AppConfig {
  profileName: string;
  profileBio: string;
  profileImage: string;
  videoUrl: string; // Not fully implemented in UI yet but good to have
  couponCode: string;
  discountPercent: number; // 0 to 100
  products: Product[];
}

const defaultProducts: Product[] = [
  {
    id: '1',
    title: 'Secaps Black',
    description: 'Fórmula 10x mais potente. Energia, Foco e Força.',
    image: product1Image,
    basePrice: 97.00,
  },
  {
    id: '2',
    title: 'Secaps Chá',
    description: 'Chá misto solúvel. 30 porções.',
    image: product2Image,
    basePrice: 87.00,
  }
];

const defaultConfig: AppConfig = {
  profileName: "Tania Vi",
  profileBio: "Wellness & Lifestyle Creator ✨\nHelping you live your best healthy life.",
  profileImage: defaultProfile,
  videoUrl: "",
  couponCode: "",
  discountPercent: 0,
  products: defaultProducts,
};

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
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

  return (
    <ConfigContext.Provider value={{ config, updateConfig, updateProduct }}>
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
