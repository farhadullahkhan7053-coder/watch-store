import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'surface' | 'success' | 'error' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'surface',
  className = '',
}) => {
  const variants = {
    gold: 'bg-gold/15 text-gold-dark border border-gold/30',
    surface: 'bg-surface text-secondary border border-border',
    success: 'bg-green-50 text-success border border-green-200',
    error: 'bg-red-50 text-error border border-red-200',
    outline: 'border border-border text-text',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
