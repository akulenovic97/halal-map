import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  position?: 'fixed' | 'absolute' | 'relative';
};

export function Card({
  position = 'relative',
  className = '',
  children,
  ...props
}: CardProps) {
  const positionClasses = {
    fixed: 'fixed',
    absolute: 'absolute bottom-4 left-4',
    relative: 'relative',
  };

  return (
    <div
      className={`${positionClasses[position]} max-w-sm rounded-lg bg-white p-4 shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
