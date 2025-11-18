// =====================================================
// COMPONENTE UI - BUTTON
// =====================================================
// Botón reutilizable con variantes y tamaños
// Basado en el sistema de diseño unificado
// =====================================================

import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'success'
  | 'error';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  isLoading?: boolean;
}

/**
 * Componente Button
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Enviar
 * </Button>
 *
 * <Button variant="outline" size="lg" isLoading>
 *   Cargando...
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, isLoading, className = '', ...props }, ref) => {
    const baseClasses = 'btn';

    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      link: 'btn-link',
      success: 'btn-success',
      error: 'btn-error',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
      xl: 'btn-xl',
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Cargando...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
