import { forwardRef } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const variantStyles = {
  default: 'bg-white border border-gray-200',
  bordered: 'bg-white border-2 border-gray-300',
  elevated: 'bg-white shadow-md border border-gray-100',
  outlined: 'bg-transparent border-2 border-gray-300',
} as const;

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const;

const radiusStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    variant = 'default', 
    padding = 'md', 
    radius = 'lg',
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'transition-all duration-200';
    const variantClasses = variantStyles[variant];
    const paddingClasses = paddingStyles[padding];
    const radiusClasses = radiusStyles[radius];
    
    const cardClasses = `${baseClasses} ${variantClasses} ${paddingClasses} ${radiusClasses} ${className}`;

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mb-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mt-4 pt-4 border-t border-gray-200 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';