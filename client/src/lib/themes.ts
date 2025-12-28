// Theme system for Bio-Storefront
// Combines background (layer 1) with card styles (layer 2)

export interface Theme {
  id: string;
  name: string;
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string;
    overlay?: string; // Overlay color for image backgrounds
  };
  card: {
    bg: string;
    blur: number;
    border: string;
    shadow: string;
  };
  // Styles for product cards and other inner components
  innerCard: {
    bg: string;
    blur: number;
    border: string;
    shadow: string;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  button: {
    primary: string;
    primaryText: string;
    secondary: string;
    secondaryText: string;
    highlight: string;
    highlightText: string;
  };
  // Avatar border color (separate from accent for neutral themes)
  avatarBorder: string;
}

export const themes: Record<string, Theme> = {
  light: {
    id: 'light',
    name: 'Light',
    background: {
      type: 'color',
      value: '#ffffff'
    },
    card: {
      bg: 'rgba(255, 255, 255, 1)',
      blur: 0,
      border: '1px solid #e5e7eb',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    innerCard: {
      bg: '#f9fafb',
      blur: 0,
      border: '1px solid #e5e7eb',
      shadow: 'none'
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      accent: '#ec4899'
    },
    button: {
      primary: '#111827',
      primaryText: '#ffffff',
      secondary: '#ffffff',
      secondaryText: '#111827',
      highlight: 'linear-gradient(135deg, #059669, #047857)',
      highlightText: '#ffffff'
    },
    avatarBorder: '#d1d5db' // neutral gray
  },

  dark: {
    id: 'dark',
    name: 'Dark',
    background: {
      type: 'color',
      value: '#0a0a0f'
    },
    card: {
      bg: 'rgba(30, 30, 40, 0.6)',
      blur: 20,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    },
    innerCard: {
      bg: 'rgba(255, 255, 255, 0.05)',
      blur: 10,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      shadow: 'none'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      accent: '#f472b6'
    },
    button: {
      primary: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      primaryText: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.08)',
      secondaryText: '#e2e8f0',
      highlight: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      highlightText: '#ffffff'
    },
    avatarBorder: '#4b5563' // neutral dark gray
  },

  cyber: {
    id: 'cyber',
    name: 'Cyber',
    background: {
      type: 'color',
      value: '#050510'
    },
    card: {
      bg: 'rgba(10, 10, 20, 0.7)',
      blur: 24,
      border: '1px solid rgba(34, 211, 238, 0.2)',
      shadow: '0 0 40px rgba(34, 211, 238, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
    },
    innerCard: {
      bg: 'rgba(34, 211, 238, 0.03)',
      blur: 12,
      border: '1px solid rgba(34, 211, 238, 0.15)',
      shadow: '0 0 20px rgba(34, 211, 238, 0.05)'
    },
    text: {
      primary: '#22d3ee',
      secondary: '#a5f3fc',
      accent: '#a855f7'
    },
    button: {
      primary: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
      primaryText: '#ffffff',
      secondary: 'rgba(34, 211, 238, 0.1)',
      secondaryText: '#22d3ee',
      highlight: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
      highlightText: '#ffffff'
    },
    avatarBorder: '#374151' // neutral gray for cyber
  },

  rosa: {
    id: 'rosa',
    name: 'Rosa',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)'
    },
    card: {
      bg: 'rgba(255, 255, 255, 0.7)',
      blur: 12,
      border: '1px solid rgba(236, 72, 153, 0.15)',
      shadow: '0 4px 20px rgba(236, 72, 153, 0.1)'
    },
    innerCard: {
      bg: 'rgba(255, 255, 255, 0.6)',
      blur: 8,
      border: '1px solid rgba(236, 72, 153, 0.12)',
      shadow: 'none'
    },
    text: {
      primary: '#831843',
      secondary: '#9d174d',
      accent: '#ec4899'
    },
    button: {
      primary: 'linear-gradient(135deg, #ec4899, #f472b6)',
      primaryText: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.8)',
      secondaryText: '#831843',
      highlight: 'linear-gradient(135deg, #ec4899, #f472b6)',
      highlightText: '#ffffff'
    },
    avatarBorder: '#ec4899' // pink accent for rosa theme
  },

  saude: {
    id: 'saude',
    name: 'Saude',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'
    },
    card: {
      bg: 'rgba(255, 255, 255, 0.75)',
      blur: 10,
      border: '1px solid rgba(34, 197, 94, 0.15)',
      shadow: '0 4px 16px rgba(34, 197, 94, 0.1)'
    },
    innerCard: {
      bg: 'rgba(255, 255, 255, 0.6)',
      blur: 6,
      border: '1px solid rgba(34, 197, 94, 0.12)',
      shadow: 'none'
    },
    text: {
      primary: '#14532d',
      secondary: '#166534',
      accent: '#22c55e'
    },
    button: {
      primary: 'linear-gradient(135deg, #22c55e, #16a34a)',
      primaryText: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.8)',
      secondaryText: '#14532d',
      highlight: 'linear-gradient(135deg, #22c55e, #16a34a)',
      highlightText: '#ffffff'
    },
    avatarBorder: '#22c55e' // green accent for saude theme
  },

  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glass',
    background: {
      type: 'image',
      value: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80',
      overlay: 'rgba(0, 0, 0, 0.3)'
    },
    card: {
      bg: 'rgba(255, 255, 255, 0.15)',
      blur: 20,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
    },
    innerCard: {
      bg: 'rgba(255, 255, 255, 0.12)',
      blur: 15,
      border: '1px solid rgba(255, 255, 255, 0.15)',
      shadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.9)',
      accent: '#ffffff'
    },
    button: {
      primary: 'rgba(255, 255, 255, 0.2)',
      primaryText: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.1)',
      secondaryText: '#ffffff',
      highlight: 'rgba(255, 255, 255, 0.25)',
      highlightText: '#ffffff'
    },
    avatarBorder: 'rgba(255, 255, 255, 0.3)'
  }
};

// Get theme by ID, fallback to light
export function getTheme(themeId: string | null | undefined): Theme {
  if (!themeId || !themes[themeId]) {
    return themes.light;
  }
  return themes[themeId];
}

// Get theme ID from background_value (for backwards compatibility)
export function getThemeIdFromBackground(backgroundValue: string | null | undefined): string {
  if (!backgroundValue) return 'light';

  // Check each theme's background value
  for (const [id, theme] of Object.entries(themes)) {
    if (theme.background.value === backgroundValue) {
      return id;
    }
    // Also check if it starts with the gradient (partial match for gradients)
    if (theme.background.type === 'gradient' && backgroundValue.includes(theme.background.value.slice(0, 30))) {
      return id;
    }
    // Check for glassmorphism theme (image type)
    if (theme.background.type === 'image' && backgroundValue === 'glassmorphism') {
      return id;
    }
  }

  return 'light';
}

// Generate CSS custom properties for a theme
export function getThemeCSSVars(theme: Theme): Record<string, string> {
  return {
    '--theme-bg': theme.background.value,
    '--theme-card-bg': theme.card.bg,
    '--theme-card-blur': `${theme.card.blur}px`,
    '--theme-card-border': theme.card.border,
    '--theme-card-shadow': theme.card.shadow,
    '--theme-text-primary': theme.text.primary,
    '--theme-text-secondary': theme.text.secondary,
    '--theme-text-accent': theme.text.accent,
    '--theme-button-primary': theme.button.primary,
    '--theme-button-primary-text': theme.button.primaryText,
    '--theme-button-secondary': theme.button.secondary,
    '--theme-button-secondary-text': theme.button.secondaryText,
  };
}

// Theme array for iteration in selectors
export const themeList = Object.values(themes);
