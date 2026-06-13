import { type ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassPanel({ children, className = '', hover = true, onClick }: GlassPanelProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-soft
        transition-all duration-300
        ${hover ? 'hover:shadow-card hover:border-white/[0.35] cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
