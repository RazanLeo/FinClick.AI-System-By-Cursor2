import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  headerActions,
  footer,
  padding = 'md',
  shadow = 'md',
  border = true,
  hover = false,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  const borderClasses = border ? 'border border-gray-200 dark:border-gray-700' : '';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  const classes = `bg-white dark:bg-gray-800 rounded-lg ${borderClasses} ${shadowClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes}>
      {/* Header */}
      {(title || subtitle || headerActions) && (
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center space-x-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
