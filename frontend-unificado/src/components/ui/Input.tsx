// =====================================================
// COMPONENTE UI - INPUT
// =====================================================
// Input reutilizable con estados de error y etiquetas
// Basado en el sistema de diseño unificado
// =====================================================

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Componente Input
 *
 * @example
 * ```tsx
 * <Input
 *   label="Nombre"
 *   placeholder="Ingresa tu nombre"
 *   error="Este campo es requerido"
 * />
 *
 * <Input
 *   type="email"
 *   label="Email"
 *   helperText="Usaremos tu email para contactarte"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputClasses = ['input', error ? 'input-error' : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <input ref={ref} className={inputClasses} {...props} />

        {error && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
