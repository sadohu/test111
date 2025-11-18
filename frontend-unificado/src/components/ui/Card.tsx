// =====================================================
// COMPONENTE UI - CARD
// =====================================================
// Card reutilizable con variantes de interactividad
// Basado en el sistema de diseño unificado
// =====================================================

import React from 'react';

export type CardVariant = 'default' | 'hover' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Componente Card
 *
 * @example
 * ```tsx
 * <Card variant="interactive">
 *   <CardHeader>
 *     <CardTitle>Título</CardTitle>
 *     <CardDescription>Descripción</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Contenido principal
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Acción</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, className = '', ...props }, ref) => {
    const baseClasses = 'card';

    const variantClasses: Record<CardVariant, string> = {
      default: '',
      hover: 'card-hover',
      interactive: 'card-interactive',
    };

    const classes = [baseClasses, variantClasses[variant], className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Title
 */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-2xl font-bold tracking-tight ${className}`}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

/**
 * Card Description
 */
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <p ref={ref} className={`text-sm text-muted-foreground mt-2 ${className}`} {...props}>
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

/**
 * Card Content
 */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 pt-0 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * Card Footer
 */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-6 pt-0 flex items-center gap-2 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export default Card;
