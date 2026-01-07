import { ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none min-h-[48px]';
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-3 text-base',
  };
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
    danger: 'bg-error text-white hover:bg-red-600',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };

  const classes = [
    base,
    sizes[size],
    variants[variant],
    fullWidth ? 'w-full' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
