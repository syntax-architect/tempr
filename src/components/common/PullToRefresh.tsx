import React, { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh?: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  className = '',
}) => {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const THRESHOLD = 65;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!onRefresh) return;
    const scrollTop = containerRef.current?.scrollTop ?? window.scrollY;
    if (scrollTop <= 2) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing || !onRefresh) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      // Apply rubber-band dampening
      const dampened = Math.min(diff * 0.45, 100);
      setPullY(dampened);
    } else {
      setPullY(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling.current || !onRefresh) return;
    isPulling.current = false;

    if (pullY >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullY(THRESHOLD * 0.75);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullY(0);
      }
    } else {
      setPullY(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative ${className}`}
    >
      {/* Pull Indicator Pill */}
      {pullY > 0 && (
        <div
          style={{ transform: `translateY(${pullY - 45}px)` }}
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-center transition-transform duration-75 pointer-events-none"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-lg text-xs font-mono">
            <RefreshCw
              className={`w-3.5 h-3.5 text-emerald-400 ${
                isRefreshing || pullY >= THRESHOLD ? 'animate-spin' : ''
              }`}
              style={{ transform: `rotate(${pullY * 3.6}deg)` }}
            />
            <span>{isRefreshing ? 'Refreshing...' : pullY >= THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}</span>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
