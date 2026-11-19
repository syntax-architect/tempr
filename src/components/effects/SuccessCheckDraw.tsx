import React, { useEffect, useState } from 'react';
import { isReducedMotion } from '../../lib/motion';

interface SuccessCheckDrawProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  onAnimationEnd?: () => void;
}

export const SuccessCheckDraw: React.FC<SuccessCheckDrawProps> = ({
  size = 32,
  className = '',
  strokeWidth = 3,
  onAnimationEnd,
}) => {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (isReducedMotion()) {
      setDrawn(true);
      onAnimationEnd?.();
      return;
    }

    const timer = setTimeout(() => {
      setDrawn(true);
      onAnimationEnd?.();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle Outline */}
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="opacity-25"
      />
      {/* Dynamic Animated Circle */}
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{
          strokeDasharray: 132,
          strokeDashoffset: drawn ? 0 : 132,
          transition: isReducedMotion() ? 'none' : 'stroke-dashoffset 320ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        }}
      />
      {/* Checkmark Polyline */}
      <path
        d="M14 24L21 31L34 17"
        stroke="currentColor"
        strokeWidth={strokeWidth + 0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 36,
          strokeDashoffset: drawn ? 0 : 36,
          transition: isReducedMotion() ? 'none' : 'stroke-dashoffset 240ms cubic-bezier(0.05, 0.7, 0.1, 1) 120ms',
        }}
      />
    </svg>
  );
};
