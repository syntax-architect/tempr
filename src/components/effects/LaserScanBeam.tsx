import React, { useEffect, useRef } from 'react';
import { isReducedMotion } from '../../lib/motion';

interface LaserScanBeamProps {
  isScanning: boolean;
  onComplete?: () => void;
  className?: string;
}

export const LaserScanBeam: React.FC<LaserScanBeamProps> = ({
  isScanning,
  onComplete,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScanning || !containerRef.current) return;

    if (isReducedMotion()) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 300);
      return () => clearTimeout(timer);
    }

    // Hardware-accelerated Web Animations API scan
    const anim = containerRef.current.animate(
      [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(520px)', opacity: 1, offset: 0.8 },
        { transform: 'translateY(520px)', opacity: 0, offset: 1.0 },
      ],
      {
        duration: 1600,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        fill: 'forwards',
      }
    );

    anim.onfinish = () => {
      if (onComplete) onComplete();
    };

    return () => {
      anim.cancel();
    };
  }, [isScanning, onComplete]);

  if (!isScanning) return null;

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-x-0 top-0 z-30 ${className}`}
    >
      {/* Intense laser hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10B981]" />
      {/* Soft trailing phosphor glow */}
      <div className="h-10 w-full -translate-y-full bg-gradient-to-t from-emerald-500/20 to-transparent blur-sm" />
    </div>
  );
};
