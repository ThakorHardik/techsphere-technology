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

export interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Parallax speed multiplier (-0.2 to 0.2). Positive values move with scroll, negative against. Default: 0.12
   */
  speed?: number;
  /**
   * ScrollTrigger start position. Default: "top bottom"
   */
  start?: string;
  /**
   * ScrollTrigger end position. Default: "bottom top"
   */
  end?: string;
  /**
   * HTML tag to render. Default: "div"
   */
  as?: React.ElementType;
}

/**
 * Reusable parallax motion primitive.
 * Applies subtle, restrained scrubbed translation to background elements, imagery, or architectural lines.
 * Strictly disabled when prefers-reduced-motion is active; amplitude is halved on mobile.
 */
export function Parallax({
  children,
  speed = 0.08,
  start = "top bottom",
  end = "bottom top",
  as = "div",
  className,
  ...props
}: ParallaxProps) {
  const Component = as as any;
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    if (reducedMotion) {
      gsap.set(el, { y: 0, clearProps: "transform" });
      return;
    }

    // Halve parallax intensity on mobile to preserve touch stability
    const actualSpeed = isMobile ? speed * 0.5 : speed;
    const yMovement = Math.round(actualSpeed * 100);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -yMovement },
        {
          y: yMovement,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 0.6,
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [speed, start, end, reducedMotion, isMobile]);

  return (
    <Component ref={ref} className={cn("will-change-transform", className)} {...props}>
      {children}
    </Component>
  );
}
