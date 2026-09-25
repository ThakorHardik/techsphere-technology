"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SlideUpProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Vertical distance in pixels (max 20–32px). Default: 28px
   */
  distance?: number;
  /**
   * Animation duration in seconds. Default: 0.75s
   */
  duration?: number;
  /**
   * Delay in seconds. Default: 0
   */
  delay?: number;
  /**
   * ScrollTrigger start position. Default: "top 88%"
   */
  start?: string;
  /**
   * HTML tag to render. Default: "div"
   */
  as?: React.ElementType;
}

/**
 * Reusable architectural vertical slide-up component.
 * Elevates headings, stat blocks, and key editorial items with restrained motion.
 */
export function SlideUp({
  children,
  distance = 28,
  duration = 0.75,
  delay = 0,
  start = "top 88%",
  as = "div",
  className,
  ...props
}: SlideUpProps) {
  const Component = as as any;
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0, clearProps: "all" });
      return;
    }

    const actualDistance = isMobile ? Math.round(distance * 0.5) : distance;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: actualDistance,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [distance, duration, delay, start, reducedMotion, isMobile]);

  return (
    <Component ref={ref} className={cn("will-change-transform", className)} {...props}>
      {children}
    </Component>
  );
}
