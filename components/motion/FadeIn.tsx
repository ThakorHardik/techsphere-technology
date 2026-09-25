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

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Animation duration in seconds. Default: 0.6s
   */
  duration?: number;
  /**
   * Initial delay in seconds. Default: 0
   */
  delay?: number;
  /**
   * ScrollTrigger start position. Default: "top 90%"
   */
  start?: string;
  /**
   * HTML tag to render. Default: "div"
   */
  as?: React.ElementType;
}

/**
 * Reusable pure opacity entrance component.
 * Reveals content softly without spatial translation.
 */
export function FadeIn({
  children,
  duration = 0.6,
  delay = 0,
  start = "top 90%",
  as = "div",
  className,
  ...props
}: FadeInProps) {
  const Component = as as any;
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
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
  }, [duration, delay, start, reducedMotion]);

  return (
    <Component ref={ref} className={cn(className)} {...props}>
      {children}
    </Component>
  );
}
