"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface MotionSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "onProgress"> {
  id: string;
  children: React.ReactNode;
  /**
   * Optional callback receiving normalized section scroll progress (0.0 to 1.0).
   */
  onProgress?: (progress: number, direction: number) => void;
  /**
   * ScrollTrigger start position. Default: "top bottom"
   */
  start?: string;
  /**
   * ScrollTrigger end position. Default: "bottom top"
   */
  end?: string;
  /**
   * HTML tag to render. Default: "section"
   */
  as?: React.ElementType;
}

/**
 * Reusable MotionSection wrapper.
 * Establishes a stable section identity, ScrollTrigger boundary, and progress telemetry root.
 * Guarantees zero memory leaks with complete GSAP context cleanup on unmount.
 */
export function MotionSection({
  id,
  children,
  onProgress,
  start = "top bottom",
  end = "bottom top",
  as = "section",
  className,
  ...props
}: MotionSectionProps) {
  const Component = as as any;
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof window === "undefined" || !onProgress) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start,
        end,
        onUpdate: (self) => {
          onProgress(self.progress, self.direction);
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [id, onProgress, start, end, reducedMotion]);

  return (
    <Component
      ref={sectionRef}
      id={id}
      data-section={id}
      className={cn("relative w-full", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
