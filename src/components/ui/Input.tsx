import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  error?: string | boolean;
  label?: string;
  helperText?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  required?: boolean;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
} as const;

const variantStyles = {
  default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500',
  filled: 'border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 focus:bg-white',
  outline: 'border-2 border-gray-300 bg-transparent focus:border-blue-500',
} as const;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    size = 'md',
    variant = 'default',
    error,
    label,
    helperText,
    leftSection,
    rightSection,
    required = false,
    className = '',
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = Boolean(error);
    
    const baseClasses = 'w-full rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const sizeClasses = sizeStyles[size];
    const variantClasses = hasError 
      ? 'border border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
      : variantStyles[variant];
    
    const inputClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${leftSection ? 'pl-10' : ''} ${rightSection ? 'pr-10' : ''} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftSection && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">
                {leftSection}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={
              error || helperText ? `${inputId}-description` : undefined
            }
            required={required}
            {...props}
          />
          
          {rightSection && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="text-gray-400">
                {rightSection}
              </div>
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div id={`${inputId}-description`} className="mt-1">
            {error && typeof error === 'string' && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';