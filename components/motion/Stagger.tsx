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

export interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Stagger delay between items in seconds (50–100ms). Default: 0.07s
   */
  staggerDelay?: number;
  /**
   * Upward translation distance in pixels (16–24px). Default: 20px
   */
  distance?: number;
  /**
   * Duration per child item in seconds. Default: 0.6s
   */
  duration?: number;
  /**
   * ScrollTrigger start position. Default: "top 85%"
   */
  start?: string;
  /**
   * Selector for child elements to stagger. If omitted, direct children are staggered.
   */
  childSelector?: string;
  /**
   * HTML tag to render for container. Default: "div"
   */
  as?: React.ElementType;
}

/**
 * Reusable stagger container component.
 * Coordinated entrance for lists, cards, navigation items, and capability badges.
 * Automatically adapts stagger timing and movement for mobile devices.
 */
export function Stagger({
  children,
  staggerDelay = 0.07,
  distance = 20,
  duration = 0.6,
  start = "top 85%",
  childSelector,
  as = "div",
  className,
  ...props
}: StaggerProps) {
  const Component = as as any;
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    const targets = childSelector
      ? el.querySelectorAll(childSelector)
      : el.children;

    if (!targets || targets.length === 0) return;

    // Reduced motion: instant reveal of all children
    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "all" });
      return;
    }

    const actualDistance = isMobile ? Math.round(distance * 0.5) : distance;
    const actualStagger = isMobile ? Math.max(0.03, staggerDelay * 0.6) : staggerDelay;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: actualDistance,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger: actualStagger,
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
  }, [staggerDelay, distance, duration, start, childSelector, reducedMotion, isMobile]);

  return (
    <Component ref={containerRef} className={cn(className)} {...props}>
      {children}
    </Component>
  );
}
