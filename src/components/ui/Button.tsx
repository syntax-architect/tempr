import React from 'react';
import { Loader2 } from 'lucide-react';
import { tapFeedback, haptics } from '../../lib/motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    haptics.tap();
    if (onClick) onClick(e);
  };

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-4 py-2.5 min-h-[44px] gap-2',
    lg: 'text-base px-5 py-3 min-h-[48px] gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-primary text-black font-semibold hover:bg-emerald-400 shadow-md shadow-emerald-950/20',
    secondary:
      'bg-surface-2 text-text border border-border hover:bg-surface hover:border-emerald-500/40',
    ghost: 'text-text hover:bg-surface-2',
    danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string; // Accessible ARIA label
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'secondary',
  size = 'md',
  disabled,
  className = '',
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    haptics.tap();
    if (onClick) onClick(e);
  };

  const sizeStyles = {
    sm: 'w-9 h-9 p-1.5 text-xs',
    md: 'w-11 h-11 p-2 text-sm',
    lg: 'w-12 h-12 p-2.5 text-base',
  }[size];

  const variantStyles = {
    primary: 'bg-primary text-black hover:bg-emerald-400',
    secondary: 'bg-surface-2 text-text border border-border hover:bg-surface',
    ghost: 'text-text hover:bg-surface-2',
    danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
  }[variant];

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {icon}
    </button>
  );
};
