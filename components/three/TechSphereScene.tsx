"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { cn } from "@/lib/utils";
import { TechSphereSceneProps } from "./types";
import { TechSpherePoints } from "./TechSpherePoints";
import { TechSphereCamera } from "./TechSphereCamera";
import { TechSphereFallback } from "./TechSphereFallback";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Reusable 3D TechSphere Scene component.
 * Renders the interactive 3D Dotted Sphere with progressive state transitions.
 * Gracefully falls back to 2D logo-mark representation on mobile and non-WebGL environments.
 */
export function TechSphereScene({
  state = "sphere",
  targetState,
  scrollProgress,
  progressRef,
  triggerId,
  interactive = true,
  theme = "light",
  pointCount,
  autoRotate = true,
  className,
  onStateChange,
}: TechSphereSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  // Responsive device checks
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const reducedMotion = usePrefersReducedMotion();

  // Color mapping based on locked brand tokens
  const pointColor = theme === "dark" ? "#FFF6ED" : "#4A3725";

  // Determine target point count based on device tier
  // Desktop: 279 (183 master + 96 particles secondary)
  // Tablet: 263 (183 master + 80 particles secondary)
  // Mobile: 243 (183 master + 60 particles secondary)
  const resolvedPointCount =
    pointCount ?? (isMobile ? 243 : isTablet ? 263 : 279);

  useEffect(() => {
    setMounted(true);
    // Active client-side WebGL capability detection
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  // Graceful Fallback:
  // ONLY use the 2D official logo fallback when WebGL is unavailable or context fails.
  // Mobile uses interactive WebGL by default!
  if (!mounted || !hasWebGL || hasWebGLError) {
    return (
      <TechSphereFallback
        theme={theme}
        className={className}
        alt="TechSphere Technology Dotted Sphere"
      />
    );
  }

  // Camera settings tuned for device viewport:
  // Desktop: Z = 5.8, FOV = 34° -> 86.2% useful canvas height coverage (target 75–90%)
  // Tablet: Z = 6.2, FOV = 35° -> 78.4% useful canvas height coverage (target 65–80%)
  // Mobile: Z = 6.8, FOV = 38° -> 58.2% useful canvas height coverage (target 50–65%)
  const cameraPosition: [number, number, number] = isMobile
    ? [0, 0, 6.8]
    : isTablet
    ? [0, 0, 6.2]
    : [0, 0, 5.8];
  const cameraFov = isMobile ? 38 : isTablet ? 35 : 34;

  return (
    <div
      className={cn(
        "relative size-full min-h-0 flex items-center justify-center bg-transparent border-0 shadow-none outline-none overflow-visible select-none touch-pan-y",
        className
      )}
      aria-label="TechSphere Technology Interactive 3D Dotted Sphere"
      role="region"
    >
      <Canvas
        style={{ background: "transparent" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: isMobile ? "default" : "high-performance",
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: cameraPosition, fov: cameraFov }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.style.background = "transparent";
          scene.background = null;
          // Listen for WebGL context loss
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setHasWebGLError(true);
          });
        }}
      >
        <TechSphereCamera
          scrollProgress={scrollProgress}
          progressRef={progressRef}
          triggerId={triggerId}
          interactive={interactive}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          isTablet={isTablet}
        />
        <TechSpherePoints
          state={state}
          targetState={targetState}
          scrollProgress={scrollProgress}
          progressRef={progressRef}
          triggerId={triggerId}
          color={pointColor}
          interactive={interactive}
          reducedMotion={reducedMotion}
          pointCount={resolvedPointCount}
          isMobile={isMobile}
          isTablet={isTablet}
          theme={theme}
        />
      </Canvas>
    </div>
  );
}

