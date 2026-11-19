/**
 * HeatLedger AI - Motion System (Prompt D4)
 * Smooth, tasteful, cheap on GPU.
 * Strict rules:
 * - Only animate transform and opacity.
 * - Respects prefers-reduced-motion and performance tiers.
 * - Zero GSAP dependency.
 */

export const MOTION_DURATIONS = {
  fast: 0.12, // 120ms - micro-interactions, toggles
  standard: 0.2, // 200ms - list rows, chips, dropdowns
  deliberate: 0.32, // 320ms - modal sheets, route transitions
} as const;

export const MOTION_EASINGS = {
  standard: [0.2, 0, 0, 1] as const,
  emphasised: [0.05, 0.7, 0.1, 1.0] as const,
  decelerate: [0, 0, 0.2, 1] as const,
} as const;

export const SPRING_PRESETS = {
  snappy: { type: 'spring', stiffness: 380, damping: 30 } as const,
  gentle: { type: 'spring', stiffness: 220, damping: 26 } as const,
} as const;

export type PerfTier = 'high' | 'mid' | 'low';

export function getDevicePerfTier(): PerfTier {
  if (typeof window === 'undefined') return 'high';

  // Check manual user override in localStorage
  try {
    const userPref = localStorage.getItem('heatledger_reduce_motion');
    if (userPref === 'true') return 'low';
  } catch {}

  // Respect system prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return 'low';

  // SaveData mode
  const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return 'low';

  // Concurrency & Memory
  const concurrency = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

  if (concurrency <= 2 || memory <= 2) return 'low';
  if (concurrency <= 4 || memory <= 4) return 'mid';

  return 'high';
}

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem('heatledger_reduce_motion') === 'true') return true;
  } catch {}
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Common Animation Variants for Framer Motion / LazyMotion
 */
export const routeVariants = {
  initial: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : 8,
  }),
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.deliberate,
      ease: MOTION_EASINGS.emphasised,
    },
  },
  exit: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : -8,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.decelerate,
    },
  }),
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03, // 30ms step
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : 6,
  }),
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.standard,
      ease: MOTION_EASINGS.standard,
    },
  },
};

export const tapFeedback = {
  scale: 0.97,
  transition: SPRING_PRESETS.snappy,
};

/**
 * Subtle haptic feedback helper for mobile devices
 */
export const haptics = {
  tap: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  },
  success: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([12, 40, 16]);
      } catch {}
    }
  },
  error: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([35, 50, 35]);
      } catch {}
    }
  },
};
