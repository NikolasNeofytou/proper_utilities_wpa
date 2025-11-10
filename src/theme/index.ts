import { createTheme, MantineTheme, rem } from '@mantine/core';

// Design tokens for UtilityPro PWA
export const designTokens = {
  // Color palette optimized for utility industry
  colors: {
    // Primary - Professional Blue (energy/trust)
    primary: [
      '#eff6ff', // 50
      '#dbeafe', // 100
      '#bfdbfe', // 200
      '#93c5fd', // 300
      '#60a5fa', // 400
      '#3b82f6', // 500 - Main brand color
      '#2563eb', // 600
      '#1d4ed8', // 700
      '#1e40af', // 800
      '#1e3a8a', // 900
    ],
    
    // Secondary - Energy Green (sustainability/efficiency)
    secondary: [
      '#f0fdf4', // 50
      '#dcfce7', // 100
      '#bbf7d0', // 200
      '#86efac', // 300
      '#4ade80', // 400
      '#22c55e', // 500 - Secondary brand color
      '#16a34a', // 600
      '#15803d', // 700
      '#166534', // 800
      '#14532d', // 900
    ],
    
    // Utility/Gray scale
    gray: [
      '#f9fafb', // 50
      '#f3f4f6', // 100
      '#e5e7eb', // 200
      '#d1d5db', // 300
      '#9ca3af', // 400
      '#6b7280', // 500
      '#4b5563', // 600
      '#374151', // 700
      '#1f2937', // 800
      '#111827', // 900
    ],
    
    // Semantic colors
    success: [
      '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', 
      '#4ade80', '#22c55e', '#16a34a', '#15803d', 
      '#166534', '#14532d'
    ],
    
    warning: [
      '#fffbeb', '#fef3c7', '#fde68a', '#fcd34d',
      '#fbbf24', '#f59e0b', '#d97706', '#b45309',
      '#92400e', '#78350f'
    ],
    
    error: [
      '#fef2f2', '#fecaca', '#fca5a5', '#f87171',
      '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
      '#7f1d1d', '#450a0a'
    ],
    
    info: [
      '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd',
      '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8',
      '#1e40af', '#1e3a8a'
    ],
  },
  
  // Typography system
  typography: {
    fontFamily: {
      // Greek-optimized font stack
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      mono: '"Fira Code", Monaco, Consolas, "Ubuntu Mono", monospace',
    },
    
    fontSize: {
      xs: rem(12),
      sm: rem(14),
      md: rem(16),
      lg: rem(18),
      xl: rem(20),
      '2xl': rem(24),
      '3xl': rem(30),
      '4xl': rem(36),
      '5xl': rem(48),
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing system (8px grid)
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
    '2xl': rem(48),
    '3xl': rem(64),
    '4xl': rem(96),
  },
  
  // Border radius system
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(8),
    lg: rem(12),
    xl: rem(16),
    '2xl': rem(24),
    full: '9999px',
  },
  
  // Shadows for depth
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    xs: rem(576),  // Small phones
    sm: rem(768),  // Large phones / Small tablets
    md: rem(992),  // Tablets / Small laptops
    lg: rem(1200), // Laptops / Small desktops
    xl: rem(1400), // Large desktops
  },
  
  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// Mantine theme configuration
export const utilityProTheme = createTheme({
  // Color configuration
  primaryColor: 'primary',
  primaryShade: { light: 5, dark: 6 },
  
  colors: {
    primary: designTokens.colors.primary,
    secondary: designTokens.colors.secondary,
    gray: designTokens.colors.gray,
    success: designTokens.colors.success,
    warning: designTokens.colors.warning,
    error: designTokens.colors.error,
    info: designTokens.colors.info,
  },
  
  // Typography
  fontFamily: designTokens.typography.fontFamily.sans,
  fontFamilyMonospace: designTokens.typography.fontFamily.mono,
  
  headings: {
    fontFamily: designTokens.typography.fontFamily.sans,
    fontWeight: String(designTokens.typography.fontWeight.semibold),
    textWrap: 'wrap',
    sizes: {
      h1: { 
        fontSize: designTokens.typography.fontSize['4xl'], 
        lineHeight: String(designTokens.typography.lineHeight.tight),
        fontWeight: String(designTokens.typography.fontWeight.bold),
      },
      h2: { 
        fontSize: designTokens.typography.fontSize['3xl'], 
        lineHeight: String(designTokens.typography.lineHeight.tight),
        fontWeight: String(designTokens.typography.fontWeight.semibold),
      },
      h3: { 
        fontSize: designTokens.typography.fontSize['2xl'], 
        lineHeight: String(designTokens.typography.lineHeight.normal),
        fontWeight: String(designTokens.typography.fontWeight.semibold),
      },
      h4: { 
        fontSize: designTokens.typography.fontSize.xl, 
        lineHeight: String(designTokens.typography.lineHeight.normal),
        fontWeight: String(designTokens.typography.fontWeight.medium),
      },
      h5: { 
        fontSize: designTokens.typography.fontSize.lg, 
        lineHeight: String(designTokens.typography.lineHeight.normal),
        fontWeight: String(designTokens.typography.fontWeight.medium),
      },
      h6: { 
        fontSize: designTokens.typography.fontSize.md, 
        lineHeight: String(designTokens.typography.lineHeight.normal),
        fontWeight: String(designTokens.typography.fontWeight.medium),
      },
    },
  },
  
  // Spacing
  spacing: {
    xs: designTokens.spacing.xs,
    sm: designTokens.spacing.sm,
    md: designTokens.spacing.md,
    lg: designTokens.spacing.lg,
    xl: designTokens.spacing.xl,
  },
  
  // Border radius
  radius: {
    xs: designTokens.radius.xs,
    sm: designTokens.radius.sm,
    md: designTokens.radius.md,
    lg: designTokens.radius.lg,
    xl: designTokens.radius.xl,
  },
  
  // Shadows
  shadows: {
    xs: designTokens.shadows.xs,
    sm: designTokens.shadows.sm,
    md: designTokens.shadows.md,
    lg: designTokens.shadows.lg,
    xl: designTokens.shadows.xl,
  },
  
  // Breakpoints
  breakpoints: {
    xs: designTokens.breakpoints.xs,
    sm: designTokens.breakpoints.sm,
    md: designTokens.breakpoints.md,
    lg: designTokens.breakpoints.lg,
    xl: designTokens.breakpoints.xl,
  },
  
  // Component-specific styling
  components: {
    // Button component customization
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          fontWeight: designTokens.typography.fontWeight.medium,
          borderWidth: rem(1),
          transition: 'all 150ms ease',
          
          // Focus styles for accessibility
          '&:focus-visible': {
            outline: `2px solid ${theme.colors.primary[5]}`,
            outlineOffset: rem(2),
          },
          
          // Hover states
          '&:hover:not(:disabled)': {
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows.md,
          },
        },
        
        // Size variants
        inner: {
          minHeight: rem(44), // Touch-friendly minimum
        },
      }),
    },
    
    // Input components
    TextInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
      styles: (theme: MantineTheme) => ({
        label: {
          fontWeight: designTokens.typography.fontWeight.medium,
          marginBottom: theme.spacing.xs,
          fontSize: designTokens.typography.fontSize.sm,
          color: theme.colors.gray[7],
        },
        
        input: {
          borderWidth: rem(1),
          fontSize: designTokens.typography.fontSize.md,
          minHeight: rem(44), // Touch-friendly
          
          '&:focus': {
            borderColor: theme.colors.primary[5],
            boxShadow: `0 0 0 3px ${theme.colors.primary[1]}`,
          },
          
          '&::placeholder': {
            color: theme.colors.gray[4],
            fontSize: designTokens.typography.fontSize.sm,
          },
        },
        
        error: {
          fontSize: designTokens.typography.fontSize.sm,
          marginTop: theme.spacing.xs,
        },
      }),
    },
    
    // Card component
    Card: {
      defaultProps: {
        padding: 'lg',
        radius: 'md',
        withBorder: true,
        shadow: 'sm',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          borderColor: theme.colors.gray[2],
          backgroundColor: theme.white,
          transition: 'all 150ms ease',
          
          '&:hover': {
            boxShadow: theme.shadows.md,
            borderColor: theme.colors.gray[3],
          },
        },
      }),
    },
    
    // Table component
    Table: {
      defaultProps: {
        striped: true,
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: false,
      },
      styles: (theme: MantineTheme) => ({
        th: {
          backgroundColor: theme.colors.gray[0],
          fontWeight: designTokens.typography.fontWeight.semibold,
          fontSize: designTokens.typography.fontSize.sm,
          color: theme.colors.gray[7],
          borderColor: theme.colors.gray[2],
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        },
        
        td: {
          fontSize: designTokens.typography.fontSize.sm,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          borderColor: theme.colors.gray[1],
        },
        
        tr: {
          '&:hover': {
            backgroundColor: theme.colors.gray[0],
          },
        },
      }),
    },
    
    // Navigation components
    Navbar: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.white,
          borderColor: theme.colors.gray[2],
        },
      }),
    },
    
    // Notification component
    Notification: {
      styles: (theme: MantineTheme) => ({
        root: {
          borderRadius: theme.radius.md,
          boxShadow: theme.shadows.lg,
        },
      }),
    },
  },
  
  // Other theme properties
  other: {
    // Custom utility-specific properties
    utilityBranding: {
      logoHeight: rem(40),
      sidebarWidth: rem(280),
      headerHeight: rem(64),
    },
    
    // Animation durations
    animations: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
    
    // Utility-specific measurements
    measurements: {
      minTouchTarget: rem(44),
      maxContentWidth: rem(1200),
      sidebarCollapsedWidth: rem(64),
    },
  },
});

// Dark theme variant
export const utilityProDarkTheme = createTheme({
  ...utilityProTheme,
  
  colors: {
    ...utilityProTheme.colors,
    
    // Dark mode color adjustments
    dark: [
      '#C1C2C5', // 0 - text on dark
      '#A6A7AB', // 1 - text on dark (secondary)
      '#909296', // 2 - text on dark (disabled)
      '#5C5F66', // 3 - text on dark (placeholder)
      '#373A40', // 4 - borders on dark
      '#2C2E33', // 5 - borders on dark (hover)
      '#25262B', // 6 - backgrounds on dark
      '#1A1B1E', // 7 - backgrounds on dark (elevated)
      '#141517', // 8 - backgrounds on dark (card)
      '#101113', // 9 - backgrounds on dark (body)
    ],
  },
  
  // Dark theme specific component overrides
  components: {
    ...utilityProTheme.components,
    
    Card: {
      ...utilityProTheme.components?.Card,
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.dark[8],
          borderColor: theme.colors.dark[4],
          
          '&:hover': {
            backgroundColor: theme.colors.dark[7],
            borderColor: theme.colors.dark[3],
          },
        },
      }),
    },
  },
});

export default utilityProTheme;