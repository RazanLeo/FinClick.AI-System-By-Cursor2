import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      iconPosition = 'left',
      onIconClick,
      fullWidth = false,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      w-full px-3 py-2 border rounded-lg transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-100 disabled:cursor-not-allowed
      ${error 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:border-blue-500'
      }
      ${size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-4 py-3 text-lg' : 'px-3 py-2'}
    `;

    const inputWithIconClasses = iconPosition === 'left' ? 'pl-10' : 'pr-10';

    const iconSize = {
      sm: 16,
      md: 20,
      lg: 24
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div
              className={`absolute inset-y-0 flex items-center ${
                iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'
              } ${onIconClick ? 'cursor-pointer' : ''}`}
              onClick={onIconClick}
            >
              <Icon size={iconSize[size]} className="text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <input
            ref={ref}
            className={`${baseClasses} ${Icon ? inputWithIconClasses : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
