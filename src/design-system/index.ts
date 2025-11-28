/**
 * VAULTHEIR™ DESIGN SYSTEM
 * Complete, production-ready design system with all tokens, components, and utilities
 */

// ==================== DESIGN TOKENS ====================

export const DesignTokens = {
  // Color System
  colors: {
    // Primary Palette
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main primary
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Grayscale (Noir & Silver theme)
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
    
    // Semantic Colors
    success: {
      light: '#86efac',
      main: '#22c55e',
      dark: '#16a34a',
    },
    warning: {
      light: '#fcd34d',
      main: '#f59e0b',
      dark: '#d97706',
    },
    error: {
      light: '#fca5a5',
      main: '#ef4444',
      dark: '#dc2626',
    },
    info: {
      light: '#93c5fd',
      main: '#3b82f6',
      dark: '#2563eb',
    },
    
    // Brand Colors
    brand: {
      noir: '#000000',
      silver: '#c0c0c0',
      gold: '#ffd700',
      accent: '#0ea5e9',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"Fira Code", "Courier New", monospace',
      display: '"Playfair Display", serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    slowest: '700ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-index
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// ==================== COMPONENT STYLES ====================

export const ComponentStyles = {
  // Button Variants
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: DesignTokens.typography.fontWeight.medium,
      transition: DesignTokens.transitions.base,
      cursor: 'pointer',
      outline: 'none',
      userSelect: 'none',
    },
    
    sizes: {
      sm: {
        padding: `${DesignTokens.spacing[2]} ${DesignTokens.spacing[3]}`,
        fontSize: DesignTokens.typography.fontSize.sm,
        borderRadius: DesignTokens.borderRadius.md,
      },
      md: {
        padding: `${DesignTokens.spacing[3]} ${DesignTokens.spacing[6]}`,
        fontSize: DesignTokens.typography.fontSize.base,
        borderRadius: DesignTokens.borderRadius.lg,
      },
      lg: {
        padding: `${DesignTokens.spacing[4]} ${DesignTokens.spacing[8]}`,
        fontSize: DesignTokens.typography.fontSize.lg,
        borderRadius: DesignTokens.borderRadius.xl,
      },
    },
    
    variants: {
      primary: {
        backgroundColor: DesignTokens.colors.primary[500],
        color: 'white',
        boxShadow: DesignTokens.shadows.sm,
        ':hover': {
          backgroundColor: DesignTokens.colors.primary[600],
          boxShadow: DesignTokens.shadows.md,
        },
        ':active': {
          backgroundColor: DesignTokens.colors.primary[700],
        },
      },
      secondary: {
        backgroundColor: DesignTokens.colors.gray[800],
        color: 'white',
        boxShadow: DesignTokens.shadows.sm,
        ':hover': {
          backgroundColor: DesignTokens.colors.gray[700],
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: DesignTokens.colors.primary[500],
        border: `2px solid ${DesignTokens.colors.primary[500]}`,
        ':hover': {
          backgroundColor: DesignTokens.colors.primary[50],
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: DesignTokens.colors.gray[700],
        ':hover': {
          backgroundColor: DesignTokens.colors.gray[100],
        },
      },
    },
  },

  // Card
  card: {
    base: {
      backgroundColor: 'white',
      borderRadius: DesignTokens.borderRadius.xl,
      boxShadow: DesignTokens.shadows.lg,
      padding: DesignTokens.spacing[6],
      transition: DesignTokens.transitions.base,
    },
    hover: {
      boxShadow: DesignTokens.shadows.xl,
      transform: 'translateY(-2px)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  },

  // Input
  input: {
    base: {
      width: '100%',
      padding: `${DesignTokens.spacing[3]} ${DesignTokens.spacing[4]}`,
      fontSize: DesignTokens.typography.fontSize.base,
      lineHeight: DesignTokens.typography.lineHeight.normal,
      color: DesignTokens.colors.gray[900],
      backgroundColor: 'white',
      border: `1px solid ${DesignTokens.colors.gray[300]}`,
      borderRadius: DesignTokens.borderRadius.lg,
      transition: DesignTokens.transitions.fast,
      outline: 'none',
      ':focus': {
        borderColor: DesignTokens.colors.primary[500],
        boxShadow: `0 0 0 3px ${DesignTokens.colors.primary[100]}`,
      },
      ':disabled': {
        backgroundColor: DesignTokens.colors.gray[100],
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
    error: {
      borderColor: DesignTokens.colors.error.main,
      ':focus': {
        borderColor: DesignTokens.colors.error.dark,
        boxShadow: `0 0 0 3px ${DesignTokens.colors.error.light}`,
      },
    },
  },

  // Badge
  badge: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${DesignTokens.spacing[1]} ${DesignTokens.spacing[2]}`,
      fontSize: DesignTokens.typography.fontSize.xs,
      fontWeight: DesignTokens.typography.fontWeight.semibold,
      borderRadius: DesignTokens.borderRadius.full,
    },
    variants: {
      success: {
        backgroundColor: DesignTokens.colors.success.light,
        color: DesignTokens.colors.success.dark,
      },
      warning: {
        backgroundColor: DesignTokens.colors.warning.light,
        color: DesignTokens.colors.warning.dark,
      },
      error: {
        backgroundColor: DesignTokens.colors.error.light,
        color: DesignTokens.colors.error.dark,
      },
      info: {
        backgroundColor: DesignTokens.colors.info.light,
        color: DesignTokens.colors.info.dark,
      },
    },
  },

  // Alert
  alert: {
    base: {
      padding: DesignTokens.spacing[4],
      borderRadius: DesignTokens.borderRadius.lg,
      borderLeft: '4px solid',
      marginBottom: DesignTokens.spacing[4],
    },
    variants: {
      success: {
        backgroundColor: `${DesignTokens.colors.success.light}20`,
        borderColor: DesignTokens.colors.success.main,
        color: DesignTokens.colors.success.dark,
      },
      warning: {
        backgroundColor: `${DesignTokens.colors.warning.light}20`,
        borderColor: DesignTokens.colors.warning.main,
        color: DesignTokens.colors.warning.dark,
      },
      error: {
        backgroundColor: `${DesignTokens.colors.error.light}20`,
        borderColor: DesignTokens.colors.error.main,
        color: DesignTokens.colors.error.dark,
      },
      info: {
        backgroundColor: `${DesignTokens.colors.info.light}20`,
        borderColor: DesignTokens.colors.info.main,
        color: DesignTokens.colors.info.dark,
      },
    },
  },

  // Modal
  modal: {
    overlay: {
      position: 'fixed',
      inset: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: DesignTokens.zIndex.modalBackdrop,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      backgroundColor: 'white',
      borderRadius: DesignTokens.borderRadius['2xl'],
      boxShadow: DesignTokens.shadows['2xl'],
      padding: DesignTokens.spacing[6],
      maxWidth: '600px',
      width: '90%',
      zIndex: DesignTokens.zIndex.modal,
    },
  },

  // Tooltip
  tooltip: {
    base: {
      position: 'absolute',
      padding: `${DesignTokens.spacing[2]} ${DesignTokens.spacing[3]}`,
      fontSize: DesignTokens.typography.fontSize.sm,
      color: 'white',
      backgroundColor: DesignTokens.colors.gray[900],
      borderRadius: DesignTokens.borderRadius.md,
      boxShadow: DesignTokens.shadows.lg,
      zIndex: DesignTokens.zIndex.tooltip,
      whiteSpace: 'nowrap',
    },
  },
};

// ==================== UTILITY CLASSES ====================

export const UtilityClasses = {
  // Flex utilities
  flex: {
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    between: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    start: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    end: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  },

  // Text utilities
  text: {
    center: { textAlign: 'center' },
    left: { textAlign: 'left' },
    right: { textAlign: 'right' },
    truncate: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },

  // Visibility utilities
  visibility: {
    hidden: { visibility: 'hidden' },
    visible: { visibility: 'visible' },
    srOnly: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    },
  },
};

// ==================== ANIMATION PRESETS ====================

export const AnimationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

// Export everything
export default {
  tokens: DesignTokens,
  components: ComponentStyles,
  utilities: UtilityClasses,
  animations: AnimationPresets,
};

