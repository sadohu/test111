// =====================================================
// COMPONENTE UI - BADGE
// =====================================================
// Badge reutilizable con variantes de color
// Basado en el sistema de diseño unificado
// =====================================================

import React from 'react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

/**
 * Componente Badge
 *
 * @example
 * ```tsx
 * <Badge variant="success">Completado</Badge>
 * <Badge variant="error">Error</Badge>
 * <Badge variant="warning">Pendiente</Badge>
 * <Badge variant="info">Información</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', children, className = '', ...props }, ref) => {
    const baseClasses = 'badge';

    const variantClasses: Record<BadgeVariant, string> = {
      primary: 'badge-primary',
      secondary: 'badge-secondary',
      success: 'badge-success',
      error: 'badge-error',
      warning: 'badge-warning',
      info: 'badge-info',
    };

    const classes = [baseClasses, variantClasses[variant], className]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
