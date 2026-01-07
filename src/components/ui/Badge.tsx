import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'new' | 'in_progress' | 'measured' | 'completed';
}

const Badge = ({ tone = 'new', className, ...props }: BadgeProps) => {
  const tones = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    measured: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={['rounded-full px-3 py-1 text-xs font-medium', tones[tone], className || '']
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
};

export default Badge;
