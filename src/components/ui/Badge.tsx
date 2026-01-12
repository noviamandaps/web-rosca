interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'new' | 'sale' | 'best';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-brand-black text-brand-white',
    new: 'bg-brand-black text-brand-white',
    sale: 'bg-ui-error text-brand-white',
    best: 'bg-brand-gray text-brand-white',
  };

  return (
    <span className={`inline-block px-2 py-1 text-2xs font-bold uppercase tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
