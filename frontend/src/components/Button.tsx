import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-gold text-primary-black hover:bg-primary-gold/90 focus:ring-primary-gold',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-primary-black focus:ring-primary-gold',
    ghost: 'text-primary-gold hover:bg-primary-gold/10 focus:ring-primary-gold',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;
  
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} className="mr-2" />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} className="ml-2" />
      )}
    </button>
  );
};

export default Button;
