import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Default Images
import defaultProfile from "@assets/Imagem_do_WhatsApp_de_2025-03-28_à(s)_14.01.21_f254eb2f_1765496582626.jpg";
import product1Image from "@assets/SECAPS_BLACK___Fundo_Transparente___1_(1)_1765496582626.png";
import product2Image from "@assets/SECAPS_CHÁ___1_POTE_1765496582614.png";

export interface ProductKit {
  id: string;
  label: string;
  price: number;
  link: string; // Link padrão (sem desconto)
  discountLinks?: {
    [percent: number]: string; // Links por percentual: { 10: "url", 20: "url", 30: "url" }
  };
  isVisible?: boolean;   // default true - when false, kit is hidden from display
  isSpecial?: boolean;   // when true, shows shine-border animation
  ignoreDiscount?: boolean; // when true, this kit ignores product discount
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  imageScale: number;
  discountPercent: number;
  kits: ProductKit[];
}

export interface AppConfig {
  profileName: string;
  profileBio: string;
  profileImage: string;
  profileImageScale: number;
  videoUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  couponCode: string;
  discountPercent: number;
  products: Product[];
}

const defaultProducts: Product[] = [
  {
    id: '1',
    title: 'Secaps Black',
    description: 'Energia, Foco e Força.',
    image: product1Image,
    imageScale: 110,
    discountPercent: 0,
    kits: [
      { id: 'k1-1', label: '1 Pote', price: 97.00, link: '#' },
      { id: 'k1-2', label: '3 Potes', price: 197.00, link: '#' },
      { id: 'k1-3', label: '5 Potes', price: 297.00, link: '#' },
    ]
  },
  {
    id: '2',
    title: 'Secaps Chá',
    description: 'Chá misto solúvel.',
    image: product2Image,
    imageScale: 100,
    discountPercent: 0,
    kits: [
      { id: 'k2-1', label: '1 Pote', price: 87.00, link: '#' },
      { id: 'k2-2', label: '3 Potes', price: 177.00, link: '#' },
      { id: 'k2-3', label: '5 Potes', price: 247.00, link: '#' },
    ]
  }
];

const defaultConfig: AppConfig = {
  profileName: "Tania Vi",
  profileBio: "Wellness & Lifestyle Creator ✨\nHelping you live your best healthy life.",
  profileImage: defaultProfile,
  profileImageScale: 100,
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  whatsappNumber: "5511999999999",
  whatsappMessage: "Olá, gostaria de saber mais sobre os produtos!",
  couponCode: "BEMVINDO",
  discountPercent: 0,
  products: defaultProducts,
};

interface ConfigContextType {
  config: AppConfig;
  isLoading: boolean;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductKit: (productId: string, kitId: string, updates: Partial<ProductKit>) => void;
  saveConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure all products have discountPercent field
  const normalizeProducts = (products: Product[]): Product[] => {
    return products.map(p => ({
      ...p,
      discountPercent: p.discountPercent ?? 0,
    }));
  };

  // Fetch config from API on mount
  useEffect(() => {
    // For this static demo, we skip fetching from the API to avoid errors.
    // In a real full-stack deployment, we would fetch from '/api/config'.
    setIsLoading(false);
  }, []);

  const saveConfigToAPI = async (configToSave: AppConfig) => {
    try {
      // Debug: log products being saved
      console.log('Saving products:', JSON.stringify(configToSave.products.map(p => ({ id: p.id, discountPercent: p.discountPercent }))));

      const response = await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      const updated = await response.json();
      // Normalize products to ensure discountPercent field exists
      setConfig({
        ...updated,
        products: normalizeProducts(updated.products),
      });
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  };

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

  const saveConfig = async () => {
    await saveConfigToAPI(config);
  };

  return (
    <ConfigContext.Provider value={{ config, isLoading, updateConfig, updateProduct, updateProductKit, saveConfig }}>
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
