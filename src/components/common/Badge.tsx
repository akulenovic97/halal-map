type BadgeProps = {
  children: React.ReactNode;
  variant: 'halal' | 'info';
};

export function Badge({ children, variant }: BadgeProps) {
  const variants = {
    halal: 'bg-halal-green-100 text-halal-green-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`rounded px-2 py-1 text-xs ${variants[variant]}`}>
      {children}
    </span>
  );
}
