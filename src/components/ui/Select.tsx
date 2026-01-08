import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = ({ label, error, className, children, ...props }: SelectProps) => {
  const selectClasses = [
    'w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 active:ring-2 active:ring-primary-500',
    error ? 'border-error' : 'border-slate-300 hover:border-slate-400',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className="block text-sm text-slate-700">
      {label ? <span className="mb-2 block font-medium">{label}</span> : null}
      <select className={selectClasses} {...props}>
        {children}
      </select>
      {error ? <span className="mt-2 block text-xs text-error">{error}</span> : null}
    </label>
  );
};

export default Select;
