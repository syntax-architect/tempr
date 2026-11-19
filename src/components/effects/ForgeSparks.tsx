import React, { useEffect, useRef } from 'react';
import { getDevicePerfTier, isReducedMotion } from '../../lib/motion';

export const ForgeSparks: React.FC<{ density?: number }> = ({ density = 35 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only render sparks on tier 'high' and when reduced-motion is disabled
    if (getDevicePerfTier() !== 'high' || isReducedMotion()) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let isTabVisible = !document.hidden;

    // Cap devicePixelRatio at 2 to conserve GPU fill-rate
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;

    const setupCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);

    // Pause when tab is hidden
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isVisible) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Pause when off-screen using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && isTabVisible) {
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      fadeRate: number;
      hue: number;
    }

    const sparks: Spark[] = [];

    const createSpark = (resetY?: boolean): Spark => ({
      x: Math.random() * width,
      y: resetY ? height + Math.random() * 20 : Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: -(Math.random() * 0.9 + 0.4), // Drifts gently upward
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.6 + 0.2,
      fadeRate: Math.random() * 0.003 + 0.001,
      hue: Math.random() > 0.4 ? 38 : 155, // Amber or Emerald spark
    });

    const activeDensity = Math.min(density, 40);
    for (let i = 0; i < activeDensity; i++) {
      sparks.push(createSpark());
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isVisible || !isTabVisible) return;

      const delta = Math.min(time - lastTime, 64);
      lastTime = time;
      const stepFactor = delta / 16.6;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.x += s.vx * stepFactor;
        s.y += s.vy * stepFactor;
        s.alpha -= s.fadeRate * stepFactor;

        if (s.alpha <= 0 || s.y < -10 || s.x < 0 || s.x > width) {
          sparks[i] = createSpark(true);
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        if (s.hue === 38) {
          ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0, s.alpha)})`;
        } else {
          ctx.fillStyle = `rgba(16, 185, 129, ${Math.max(0, s.alpha)})`;
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, [density]);

  // If mid/low tier or reduced motion, render nothing to save 100% of GPU
  if (getDevicePerfTier() !== 'high' || isReducedMotion()) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60"
    />
  );
};
