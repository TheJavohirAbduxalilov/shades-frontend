import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = ({ label, className, ...props }: CheckboxProps) => {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm text-slate-700 transition-all duration-150 hover:bg-slate-50 active:bg-slate-100">
      <input
        type="checkbox"
        className={[
          'h-5 w-5 rounded border-slate-300 text-primary-600 transition-all duration-150 focus:ring-primary-500',
          className || '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
