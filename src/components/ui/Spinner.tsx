const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div
      className={[
        'animate-spin rounded-full border-2 border-slate-200 border-t-primary-600',
        sizes[size],
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
};

export default Spinner;
