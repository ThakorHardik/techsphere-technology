"use client";

import * as React from "react";
import { useRef } from "react";
import { useScrollProgress, ScrollProgressState, UseScrollProgressOptions } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

export interface ScrollProgressProps extends UseScrollProgressOptions {
  /**
   * Render function receiving the normalized scroll progress state.
   */
  children: (state: ScrollProgressState) => React.ReactNode;
  /**
   * Optional wrapper CSS class names.
   */
  className?: string;
  /**
   * HTML tag for wrapper. Default: "div"
   */
  as?: React.ElementType;
}

/**
 * Reusable scroll progress component.
 * Exposes continuous normalized progress (0.0 to 1.0) of its container via a render prop.
 * Ideal for driving future continuous transformations and telemetry without manual scroll math.
 */
export function ScrollProgress({
  children,
  className,
  as = "div",
  start,
  end,
  onUpdate,
  clamp,
  ...props
}: ScrollProgressProps) {
  const Component = as as any;
  const containerRef = useRef<HTMLDivElement>(null);
  const state = useScrollProgress(containerRef, { start, end, onUpdate, clamp });

  return (
    <Component ref={containerRef} className={cn("relative", className)} {...props}>
      {children(state)}
    </Component>
  );
}
