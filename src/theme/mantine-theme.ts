import { createTheme, rem } from '@mantine/core';

// Simplified UtilityPro Theme for Mantine
export const utilityProTheme = createTheme({
  // Primary brand color - Professional Blue
  primaryColor: 'blue',
  primaryShade: 6,
  
  // Color palette
  colors: {
    // Custom primary color scale
    'utility-blue': [
      '#eff6ff', // 0
      '#dbeafe', // 1
      '#bfdbfe', // 2
      '#93c5fd', // 3
      '#60a5fa', // 4
      '#3b82f6', // 5
      '#2563eb', // 6 - Main brand color
      '#1d4ed8', // 7
      '#1e40af', // 8
      '#1e3a8a', // 9
    ],
    
    // Custom secondary color scale (Energy Green)
    'utility-green': [
      '#f0fdf4', // 0
      '#dcfce7', // 1
      '#bbf7d0', // 2
      '#86efac', // 3
      '#4ade80', // 4
      '#22c55e', // 5
      '#16a34a', // 6
      '#15803d', // 7
      '#166534', // 8
      '#14532d', // 9
    ],
  },
  
  // Typography configuration
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: '"Fira Code", Monaco, Consolas, "Ubuntu Mono", monospace',
  
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { 
        fontSize: rem(36), 
        lineHeight: '1.2',
        fontWeight: '700',
      },
      h2: { 
        fontSize: rem(30), 
        lineHeight: '1.3',
        fontWeight: '600',
      },
      h3: { 
        fontSize: rem(24), 
        lineHeight: '1.4',
        fontWeight: '600',
      },
      h4: { 
        fontSize: rem(20), 
        lineHeight: '1.45',
        fontWeight: '500',
      },
      h5: { 
        fontSize: rem(18), 
        lineHeight: '1.5',
        fontWeight: '500',
      },
      h6: { 
        fontSize: rem(16), 
        lineHeight: '1.5',
        fontWeight: '500',
      },
    },
  },
  
  // Default component sizes
  defaultRadius: 'md',
  
  // Component default props and styles
  components: {
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
    },
    
    Card: {
      defaultProps: {
        padding: 'lg',
        radius: 'md',
        withBorder: true,
        shadow: 'sm',
      },
    },
    
    Container: {
      defaultProps: {
        size: 'xl', // Max width of 1200px
      },
    },
    
    TextInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
    },
    
    Badge: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
      },
    },
    
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'xs',
      },
    },
    
    Grid: {
      defaultProps: {
        gutter: 'md',
      },
    },
    
    Stack: {
      defaultProps: {
        gap: 'md',
      },
    },
    
    Group: {
      defaultProps: {
        gap: 'md',
      },
    },
  },
  
  // Other theme properties
  other: {
    // Custom utility-specific properties
    utilityBranding: {
      logoHeight: rem(40),
      sidebarWidth: rem(280),
      headerHeight: rem(64),
      maxContentWidth: rem(1200),
    },
    
    // Animation durations
    animations: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
  },
});

export default utilityProTheme;