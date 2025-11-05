import { forwardRef } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'full';
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}

const variantStyles = {
  default: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  outline: 'bg-transparent text-gray-700 border-gray-300',
} as const;

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
} as const;

const radiusStyles = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    children,
    variant = 'default',
    size = 'md',
    radius = 'md',
    leftSection,
    rightSection,
    className = '',
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center gap-1 font-medium border transition-colors';
    const variantClasses = variantStyles[variant];
    const sizeClasses = sizeStyles[size];
    const radiusClasses = radiusStyles[radius];
    
    const badgeClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${radiusClasses} ${className}`;

    return (
      <span
        ref={ref}
        className={badgeClasses}
        {...props}
      >
        {leftSection && (
          <span className="flex-shrink-0">
            {leftSection}
          </span>
        )}
        
        <span className="truncate">
          {children}
        </span>
        
        {rightSection && (
          <span className="flex-shrink-0">
            {rightSection}
          </span>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';