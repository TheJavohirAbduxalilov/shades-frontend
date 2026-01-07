import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className, ...props }: InputProps) => {
  const inputClasses = [
    'w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    error ? 'border-error' : 'border-slate-300',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className="block text-sm text-slate-700">
      {label ? <span className="mb-2 block font-medium">{label}</span> : null}
      <input className={inputClasses} {...props} />
      {error ? <span className="mt-2 block text-xs text-error">{error}</span> : null}
    </label>
  );
};

export default Input;
