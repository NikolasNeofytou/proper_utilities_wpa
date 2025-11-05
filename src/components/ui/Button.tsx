import { forwardRef } from 'react';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';

// Extended Button interface that maps our custom variants to Mantine
export interface ButtonProps extends Omit<MantineButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'utility';
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    isLoading = false,
    loadingText,
    children,
    ...props 
  }, ref) => {
    // Map custom variants to Mantine variants and colors
    const getMantineProps = (customVariant: ButtonProps['variant']) => {
      switch (customVariant) {
        case 'primary':
          return { variant: 'filled' as const, color: 'utility-blue' };
        case 'secondary':
          return { variant: 'light' as const, color: 'gray' };
        case 'outline':
          return { variant: 'outline' as const, color: 'utility-blue' };
        case 'ghost':
          return { variant: 'subtle' as const, color: 'gray' };
        case 'danger':
          return { variant: 'filled' as const, color: 'red' };
        case 'success':
          return { variant: 'filled' as const, color: 'utility-green' };
        case 'utility':
          return { 
            variant: 'gradient' as const, 
            gradient: { from: 'utility-blue', to: 'utility-green', deg: 45 }
          };
        default:
          return { variant: 'filled' as const, color: 'utility-blue' };
      }
    };

    const mantineProps = getMantineProps(variant);

    return (
      <MantineButton
        ref={ref}
        loading={isLoading}
        loaderProps={{
          children: loadingText || 'Φόρτωση...',
        }}
        {...mantineProps}
        {...props}
      >
        {children}
      </MantineButton>
    );
  }
);

Button.displayName = 'Button';