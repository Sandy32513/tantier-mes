/**
 * ═══════════════════════════════════════════════════════════════════
 * ARTISAN THEME - Japanese Wabi-Sabi Inspired Design System
 * Designed with: Natural textures, earthy tones, indigo blues, terracotta
 * ═══════════════════════════════════════════════════════════════════
 */

export const theme = {
  // ════ Primary Colors - Japanese Indigo & Sumi Ink ════
  colors: {
    primary: {
      main: '#2B4C7E',        // Ai-iro (Indigo)
      light: '#3D5A80',       // Lighter indigo
      dark: '#1A365D',         // Deep sumi ink
      contrast: '#FFFFFF',
    },
    
    // ════ Accent Colors - Earth & Clay ════
    accent: {
      terracotta: '#C2703E',   // Tsuchi (earth)
      terracottaLight: '#D4855C',
      terracottaDark: '#9C5929',
      sage: '#8B9A7D',        // Natural green
      sageLight: '#A8B89B',
    },
    
    // ════ Background - Washi Paper Tones ════
    background: {
      default: '#F5F1EB',     // Aged washi paper
      paper: '#FDFBF7',       // White washi
      elevated: '#FFFFFF',
    },
    
    // ════ Text Colors - Sumi Ink Tones ════
    text: {
      primary: '#2D2926',     // Sumi ink black
      secondary: '#5C5552',
      muted: '#8C8582',
      disabled: '#A9A5A2',
      inverse: '#FFFFFF',
    },
    
    // ════ Status Colors - Muted Artisan Tones ════
    status: {
      error: '#A63D40',       // Faded red (beni)
      success: '#5B7553',     // Matcha green
      warning: '#C9A227',    // Gold lacquer
      info: '#2B4C7E',       // Indigo
      pending: '#B86E3E',     // Persimmon
    },
    
    // ════ Border & Divider ════
    border: {
      default: '#C9C3BA',
      light: '#E0DCD4',
      dark: '#A9A29A',
    },
    
    // ════ Table ════
    table: {
      header: '#E8E4DC',      // Natural paper
      rowHover: '#F0EBE3',
      rowSelected: '#E5DFD5',
      line: '#D4CFC7',
    },
    
    // ════ Sidebar ════
    sidebar: {
      background: '#F8F5F0',
      active: '#DDD5C7',
      hover: '#EDE8DF',
    },
  },

  // ════ Typography ════
  typography: {
    fontFamily: "'Noto Sans JP', 'Segoe UI', 'Hiragino Kaku Gothic Pro', sans-serif",
    fontFamilyMono: "'Consolas', 'Monaco', monospace",
    
    fontSize: {
      xs: '11px',
      sm: '12px',
      md: '13px',
      lg: '15px',
      xl: '18px',
      xxl: '24px',
      xxxl: '32px',
    },
    
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.6,
      relaxed: 1.75,
    },
  },

  // ════ Spacing ════
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },

  // ════ Border Radius ════
  borderRadius: {
    none: '0px',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },

  // ════ Shadows ════
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(45, 41, 38, 0.05)',
    md: '0 2px 4px rgba(45, 41, 38, 0.08), 0 1px 2px rgba(45, 41, 38, 0.04)',
    lg: '0 4px 8px rgba(45, 41, 38, 0.1), 0 2px 4px rgba(45, 41, 38, 0.06)',
    xl: '0 8px 16px rgba(45, 41, 38, 0.12), 0 4px 8px rgba(45, 41, 38, 0.08)',
  },

  // ════ Transitions ════
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },

  // ════ Z-Index ════
  zIndex: {
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
  },
};

// ════ CSS Variables Helper ════
export const cssVariables = `
  :root {
    /* Primary */
    --color-primary: ${theme.colors.primary.main};
    --color-primary-light: ${theme.colors.primary.light};
    --color-primary-dark: ${theme.colors.primary.dark};
    
    /* Accent */
    --color-accent: ${theme.colors.accent.terracotta};
    --color-accent-light: ${theme.colors.accent.terracottaLight};
    --color-sage: ${theme.colors.accent.sage};
    
    /* Background */
    --color-bg: ${theme.colors.background.default};
    --color-paper: ${theme.colors.background.paper};
    
    /* Text */
    --color-text: ${theme.colors.text.primary};
    --color-text-secondary: ${theme.colors.text.secondary};
    --color-text-muted: ${theme.colors.text.muted};
    
    /* Status */
    --color-error: ${theme.colors.status.error};
    --color-success: ${theme.colors.status.success};
    --color-warning: ${theme.colors.status.warning};
    --color-info: ${theme.colors.status.info};
    
    /* Border */
    --color-border: ${theme.colors.border.default};
    --color-border-light: ${theme.colors.border.light};
    
    /* Table */
    --color-table-header: ${theme.colors.table.header};
    --color-table-hover: ${theme.colors.table.rowHover};
    
    /* Spacing */
    --space-xs: ${theme.spacing.xs};
    --space-sm: ${theme.spacing.sm};
    --space-md: ${theme.spacing.md};
    --space-lg: ${theme.spacing.lg};
    --space-xl: ${theme.spacing.xl};
    
    /* Radius */
    --radius-sm: ${theme.borderRadius.sm};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    
    /* Shadows */
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
  }
`;

export default theme;
