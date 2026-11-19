import React from 'react';

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'emerald' | 'amber' | 'multi';
  active?: boolean;
}

export const GlowingBorder: React.FC<GlowingBorderProps> = ({
  children,
  className = '',
  glowColor = 'emerald',
  active = true,
}) => {
  if (!active) {
    return <div className={className}>{children}</div>;
  }

  const gradientMap = {
    emerald: 'conic-gradient(from 0deg, #10B981, #059669, #090D16, #10B981)',
    amber: 'conic-gradient(from 0deg, #F59E0B, #EA580C, #090D16, #F59E0B)',
    multi: 'conic-gradient(from 0deg, #10B981, #F59E0B, #2563EB, #10B981)',
  };

  return (
    <div className={`relative p-[1.5px] overflow-hidden rounded-xl group ${className}`}>
      {/* Animated Rotating Conic Shimmer */}
      <div
        className="absolute -inset-[100%] animate-[spin_6s_linear_infinite] opacity-75 group-hover:opacity-100 transition-opacity"
        style={{
          background: gradientMap[glowColor],
        }}
      />
      {/* Card Content Surface */}
      <div className="relative z-10 h-full w-full rounded-[10px] bg-slate-900/90 backdrop-blur-md">
        {children}
      </div>
    </div>
  );
};
