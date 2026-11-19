import React from 'react';

interface LogoProps {
  className?: string;
  isLight?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const HexagonalIngotIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <defs>
        <linearGradient
          id="ingotGradient"
          x1="10"
          y1="10"
          x2="90"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Hexagonal Outer Frame with Refined Hairline */}
      <polygon
        points="50,8 86,28 86,72 50,92 14,72 14,28"
        fill="#090D16"
        stroke="url(#ingotGradient)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Top Facet (Molten Amber) */}
      <polygon points="50,16 78,32 50,49 22,32" fill="#F59E0B" fillOpacity="0.9" />

      {/* Left Facet (Forged Copper) */}
      <polygon points="22,32 50,49 50,83 22,66" fill="#EA580C" fillOpacity="0.8" />

      {/* Right Facet (Electric Emerald) */}
      <polygon points="50,49 78,32 78,66 50,83" fill="#10B981" fillOpacity="0.9" />

      {/* Center Precision Ridge Line */}
      <line
        x1="50"
        y1="16"
        x2="50"
        y2="83"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({ className = '', isLight = false, size = 'md' }) => {
  const iconSizes = {
    sm: 22,
    md: 28,
    lg: 36,
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
  };

  return (
    <div
      className={`flex items-center gap-2.5 font-sans select-none tracking-tight group ${className}`}
    >
      <div className="relative">
        <HexagonalIngotIcon size={iconSizes[size]} />
        <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={`tracking-tight ${textSizes[size]} ${isLight ? 'text-slate-900' : 'text-white'}`}
        >
          HeatLedger
        </span>
        <span className="text-xs font-mono font-medium tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md uppercase">
          AI
        </span>
      </div>
    </div>
  );
};
