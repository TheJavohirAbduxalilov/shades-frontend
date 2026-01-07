import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = ({ label, className, ...props }: CheckboxProps) => {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-700">
      <input
        type="checkbox"
        className={[
          'h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500',
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
