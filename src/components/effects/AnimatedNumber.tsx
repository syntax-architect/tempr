import React, { useEffect, useRef } from 'react';
import { isReducedMotion } from '../../lib/motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 0.8,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const startValRef = useRef<number>(value);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = startValRef.current;
    const endVal = value;
    startValRef.current = value;

    if (isReducedMotion() || duration <= 0) {
      if (spanRef.current) {
        const formatted =
          decimals > 0 ? endVal.toFixed(decimals) : Math.round(endVal).toLocaleString();
        spanRef.current.innerText = `${prefix}${formatted}${suffix}`;
      }
      return;
    }

    const startTime = performance.now();
    const durationMs = duration * 1000;

    // Cubic bezier ease-out approximation: 1 - Math.pow(1 - t, 3)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const updateFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, Math.max(0, elapsed / durationMs));
      const eased = easeOutCubic(progress);
      const current = startVal + (endVal - startVal) * eased;

      if (spanRef.current) {
        const formatted =
          decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString();
        spanRef.current.innerText = `${prefix}${formatted}${suffix}`;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(updateFrame);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [value, duration, prefix, suffix, decimals]);

  return (
    <span ref={spanRef} className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : value.toLocaleString()}
      {suffix}
    </span>
  );
};
