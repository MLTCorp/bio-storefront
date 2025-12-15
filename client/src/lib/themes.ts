// Theme system for Bio-Storefront
// Combines background (layer 1) with card styles (layer 2)

export interface Theme {
  id: string;
  name: string;
  background: {
    type: 'color' | 'gradient';
    value: string;
  };
  card: {
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
  };
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
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      accent: '#ec4899'
    },
    button: {
      primary: '#111827',
      primaryText: '#ffffff',
      secondary: '#f3f4f6',
      secondaryText: '#374151'
    }
  },

  dark: {
    id: 'dark',
    name: 'Dark',
    background: {
      type: 'color',
      value: '#0f172a'
    },
    card: {
      bg: 'rgba(30, 41, 59, 0.8)',
      blur: 8,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      accent: '#f472b6'
    },
    button: {
      primary: '#3b82f6',
      primaryText: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.1)',
      secondaryText: '#e2e8f0'
    }
  },

  cyber: {
    id: 'cyber',
    name: 'Cyber',
    background: {
      type: 'color',
      value: '#0a0a0f'
    },
    card: {
      bg: 'rgba(255, 255, 255, 0.03)',
      blur: 16,
      border: '1px solid rgba(34, 211, 238, 0.3)',
      shadow: '0 0 30px rgba(34, 211, 238, 0.1)'
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
      secondaryText: '#22d3ee'
    }
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
      blur: 8,
      border: '1px solid rgba(236, 72, 153, 0.2)',
      shadow: '0 4px 6px rgba(236, 72, 153, 0.1)'
    },
    text: {
      primary: '#831843',
      secondary: '#9d174d',
      accent: '#ec4899'
    },
    button: {
      primary: '#ec4899',
      primaryText: '#ffffff',
      secondary: 'rgba(236, 72, 153, 0.1)',
      secondaryText: '#be185d'
    }
  },

  saude: {
    id: 'saude',
    name: 'Saude',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'
    },
    card: {
      bg: 'rgba(255, 255, 255, 0.8)',
      blur: 4,
      border: '1px solid rgba(34, 197, 94, 0.2)',
      shadow: '0 2px 4px rgba(34, 197, 94, 0.1)'
    },
    text: {
      primary: '#14532d',
      secondary: '#166534',
      accent: '#22c55e'
    },
    button: {
      primary: '#22c55e',
      primaryText: '#ffffff',
      secondary: 'rgba(34, 197, 94, 0.1)',
      secondaryText: '#15803d'
    }
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
