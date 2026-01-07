import { HTMLAttributes } from 'react';

const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={['rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md', className || '']
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
};

export default Card;
