"use client";

import { useState, useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseScrollProgressOptions {
  /**
   * ScrollTrigger start position. Default: "top bottom"
   */
  start?: string;
  /**
   * ScrollTrigger end position. Default: "bottom top"
   */
  end?: string;
  /**
   * Callback fired on each scroll update with normalized progress (0.0 to 1.0).
   */
  onUpdate?: (progress: number, direction: number) => void;
  /**
   * Whether to clamp progress strictly between 0 and 1. Default: true
   */
  clamp?: boolean;
}

export interface ScrollProgressState {
  /**
   * Normalized progress: 0.0 at trigger start, 0.5 at midpoint, 1.0 at trigger end.
   */
  progress: number;
  /**
   * Whether the target element is currently within the trigger viewport range.
   */
  isVisible: boolean;
  /**
   * Scroll direction: 1 for scrolling down (forward), -1 for scrolling up (backward).
   */
  direction: number;
}

/**
 * Custom React hook for tracking normalized section scroll progress.
 * Integrates safely with GSAP ScrollTrigger, React 19 Strict Mode, and reduced-motion settings.
 */
export function useScrollProgress(
  targetRef: RefObject<HTMLElement | null>,
  options: UseScrollProgressOptions = {}
): ScrollProgressState {
  const {
    start = "top bottom",
    end = "bottom top",
    onUpdate,
    clamp = true,
  } = options;

  const [state, setState] = useState<ScrollProgressState>({
    progress: 0,
    isVisible: false,
    direction: 1,
  });

  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof window === "undefined") return;

    // React 19 / Strict Mode safe GSAP Context
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start,
        end,
        onUpdate: (self) => {
          const rawProgress = self.progress;
          const progress = clamp
            ? Math.max(0, Math.min(1, rawProgress))
            : rawProgress;
          const isVisible = self.isActive;
          const direction = self.direction;

          setState({ progress, isVisible, direction });
          if (onUpdate) {
            onUpdate(progress, direction);
          }
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [targetRef, start, end, clamp, onUpdate, reducedMotion]);

  return state;
}
