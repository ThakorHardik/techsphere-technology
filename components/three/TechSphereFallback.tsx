import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TechSphereFallbackProps } from "./types";

/**
 * High-performance 2D fallback for mobile viewports, non-WebGL environments,
 * and reduced motion contexts. Reuses the official TechSphere logo mark.
 */
export function TechSphereFallback({
  theme = "light",
  className,
  alt = "TechSphere Technology Dotted Sphere Symbol",
}: TechSphereFallbackProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-8 select-none pointer-events-none",
        className
      )}
      role="img"
      aria-label={alt}
    >
      <div className="relative size-full max-w-[380px] max-h-[380px] aspect-square flex items-center justify-center">
        <Image
          src="/brand/logo-mark.png"
          alt={alt}
          width={500}
          height={500}
          priority
          className={cn(
            "size-full object-contain transition-all duration-300 drop-shadow-xs",
            isDark && "invert sepia brightness-110 hue-rotate-15 contrast-95"
          )}
        />
      </div>
    </div>
  );
}
