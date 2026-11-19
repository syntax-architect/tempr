import React, { useEffect, useState, useRef } from 'react';
import { Activity, Zap, EyeOff, X } from 'lucide-react';
import { getDevicePerfTier, PerfTier } from '../../lib/motion';

export const FpsOverlay: React.FC = () => {
  const [fps, setFps] = useState<number>(60);
  const [tier, setTier] = useState<PerfTier>('high');
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Initial tier & motion preference
    setTier(getDevicePerfTier());
    try {
      setReduceMotion(localStorage.getItem('heatledger_reduce_motion') === 'true');
    } catch {}

    const loop = (now: number) => {
      frameCount.current++;
      const elapsed = now - lastTime.current;

      if (elapsed >= 500) {
        const calculatedFps = Math.round((frameCount.current * 1000) / elapsed);
        setFps(calculatedFps);
        frameCount.current = 0;
        lastTime.current = now;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const toggleReduceMotion = () => {
    const nextVal = !reduceMotion;
    setReduceMotion(nextVal);
    try {
      localStorage.setItem('heatledger_reduce_motion', String(nextVal));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  // Only render if in dev environment or query param ?dev=true
  if (
    import.meta.env.PROD &&
    typeof window !== 'undefined' &&
    !window.location.search.includes('dev=true')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2 font-mono text-xs select-none">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-all ${
            fps >= 55
              ? 'bg-surface/90 border-emerald-500/40 text-emerald-400 shadow-emerald-950/20'
              : fps >= 30
                ? 'bg-surface/90 border-amber-500/40 text-amber-400 shadow-amber-950/20'
                : 'bg-surface/90 border-red-500/40 text-red-400 shadow-red-950/20'
          }`}
          title="Telemetry FPS & Motion Inspector"
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-bold">{fps} FPS</span>
          <span className="text-xs text-text-muted px-1 py-0.5 rounded bg-surface-2 border border-border">
            {tier.toUpperCase()}
          </span>
        </button>
      ) : (
        <div className="w-64 p-3.5 rounded-xl bg-surface border border-border shadow-2xl backdrop-blur-md flex flex-col gap-2.5 text-text">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <Zap className="w-4 h-4" />
              <span>Motion Telemetry</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-text-muted">Frame Rate:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                fps >= 55
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : fps >= 30
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-red-500/10 text-red-400'
              }`}
            >
              {fps} FPS
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-text-muted">Perf Tier:</span>
            <span className="font-medium text-text px-2 py-0.5 rounded bg-surface-2 border border-border">
              {tier.toUpperCase()}
            </span>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-text">
              <EyeOff className="w-3.5 h-3.5 text-text-muted" />
              <span>Reduce Motion</span>
            </div>
            <button
              onClick={toggleReduceMotion}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                reduceMotion ? 'bg-emerald-500' : 'bg-surface-2 border border-border'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  reduceMotion ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
