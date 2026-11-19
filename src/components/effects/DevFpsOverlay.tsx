import React, { useEffect, useState, useRef } from 'react';
import { getDevicePerfTier, isReducedMotion, PerfTier } from '../../lib/motion';

export const DevFpsOverlay: React.FC = () => {
  const [fps, setFps] = useState<number>(60);
  const [longTaskCount, setLongTaskCount] = useState<number>(0);
  const [tier, setTier] = useState<PerfTier>('high');
  const [reduced, setReduced] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const url = new URLSearchParams(window.location.search);
      return url.get('fps') === 'true';
    }
    return false;
  });

  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());

  // Listen for Alt+F shortcut to toggle FPS overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsVisible((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Performance tier and reduced motion state
  useEffect(() => {
    setTier(getDevicePerfTier());
    setReduced(isReducedMotion());
  }, [isVisible]);

  // Measure Real FPS
  useEffect(() => {
    if (!isVisible) return;

    let animId: number;

    const loop = (now: number) => {
      frameCount.current++;
      const delta = now - lastTime.current;

      if (delta >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / delta));
        frameCount.current = 0;
        lastTime.current = now;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isVisible]);

  // Monitor Long Tasks (> 50ms) using PerformanceObserver
  useEffect(() => {
    if (!isVisible || typeof PerformanceObserver === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            setLongTaskCount((c) => c + 1);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
      return () => observer.disconnect();
    } catch {
      // PerformanceObserver longtask might not be supported in some browsers
    }
  }, [isVisible]);

  const toggleReduceMotion = () => {
    const next = !reduced;
    try {
      localStorage.setItem('heatledger_reduce_motion', String(next));
    } catch {}
    setReduced(next);
    setTier(getDevicePerfTier());
  };

  if (!isVisible) return null;

  const fpsColor =
    fps >= 55 ? 'text-emerald-400' : fps >= 30 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="fixed bottom-16 right-4 z-50 p-2.5 rounded-xl bg-slate-950/90 text-white border border-slate-800 shadow-2xl font-mono text-xs backdrop-blur-md flex flex-col gap-1.5 select-none pointer-events-auto">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Dev Motion QA</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-500 hover:text-white text-xs px-1"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-slate-400">FPS:</span>
        <strong className={`${fpsColor} text-sm`}>{fps} fps</strong>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-slate-400">Perf Tier:</span>
        <span
          className={`px-1.5 py-0.2 rounded uppercase font-bold text-xs ${
            tier === 'high'
              ? 'bg-emerald-500/20 text-emerald-400'
              : tier === 'mid'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-rose-500/20 text-rose-400'
          }`}
        >
          {tier}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-slate-400">Long Tasks (&gt;50ms):</span>
        <span
          className={`font-bold ${longTaskCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}
        >
          {longTaskCount}
        </span>
      </div>

      <div className="pt-1 border-t border-slate-800">
        <button
          onClick={toggleReduceMotion}
          className={`w-full py-1 px-2 rounded text-xs transition-colors cursor-pointer ${
            reduced
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {reduced ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
        </button>
      </div>
    </div>
  );
};
