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

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Direction from which the element slides into view. Default: "up"
   */
  direction?: "up" | "down" | "left" | "right" | "none";
  /**
   * Movement distance in pixels (max 16–32px). Default: 24px
   */
  distance?: number;
  /**
   * Animation duration in seconds. Default: 0.7s
   */
  duration?: number;
  /**
   * Initial delay in seconds. Default: 0
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
 * Reusable scroll reveal component.
 * Applies subtle opacity and restrained translation (16–32px) when entering viewport.
 * Fully compliant with React 19 Strict Mode, unmount/remount, and reduced-motion preferences.
 */
export function Reveal({
  children,
  direction = "up",
  distance = 24,
  duration = 0.7,
  delay = 0,
  start = "top 88%",
  as = "div",
  className,
  ...props
}: RevealProps) {
  const Component = as as any;
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    // Reduced motion: instant reveal
    if (reducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, clearProps: "all" });
      return;
    }

    // Scale down movement on mobile for responsive touch comfort
    const actualDistance = isMobile ? Math.round(distance * 0.55) : distance;

    let x = 0;
    let y = 0;
    if (direction === "up") y = actualDistance;
    else if (direction === "down") y = -actualDistance;
    else if (direction === "left") x = actualDistance;
    else if (direction === "right") x = -actualDistance;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x,
          y,
        },
        {
          opacity: 1,
          x: 0,
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
  }, [direction, distance, duration, delay, start, reducedMotion, isMobile]);

  return (
    <Component
      ref={containerRef}
      className={cn("will-change-transform", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
