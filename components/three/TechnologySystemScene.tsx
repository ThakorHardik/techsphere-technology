"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TechnologySystem } from "./TechnologySystem";
import { TechnologySystemCamera } from "./TechnologySystemCamera";
import {
  TechnologySystemSceneProps,
  TechnologySystemTheme,
  TECH_SYSTEM_PALETTE,
} from "./technology-system-types";
import { RealEstateEnvironment } from "./real-estate/RealEstateEnvironment";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Internal Parallax & Camera Rig
 * Provides subtle interactive mouse deflection and responsive scale tuning.
 */
function TechnologySystemRig({
  theme = "light",
  activeNode = null,
  progress,
  progressRef,
  isStoryMode = false,
  interactive = true,
  autoRotate = true,
  scale = 1.0,
}: {
  readonly theme?: TechnologySystemTheme;
  readonly activeNode?: number | null;
  readonly progress?: number;
  readonly progressRef?: React.RefObject<number>;
  readonly isStoryMode?: boolean;
  readonly interactive?: boolean;
  readonly autoRotate?: boolean;
  readonly scale?: number;
}) {
  const rigGroupRef = useRef<THREE.Group>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // In story mode, mouse deflection is disabled to keep the camera trajectory pure and deterministic
    if (isStoryMode || !interactive || reducedMotion || typeof window === "undefined") return;

    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerTarget.current.x = x * 0.12; // Max ±0.12 rad yaw
      pointerTarget.current.y = y * 0.08; // Max ±0.08 rad pitch
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isStoryMode, interactive, reducedMotion]);

  useFrame((_, delta) => {
    if (!rigGroupRef.current) return;

    if (!isStoryMode && !reducedMotion && interactive) {
      const currentRotX = rigGroupRef.current.rotation.x;
      const currentRotY = rigGroupRef.current.rotation.y;
      rigGroupRef.current.rotation.y = THREE.MathUtils.damp(
        currentRotY,
        pointerTarget.current.x,
        3.5,
        delta
      );
      rigGroupRef.current.rotation.x = THREE.MathUtils.damp(
        currentRotX,
        -pointerTarget.current.y,
        3.5,
        delta
      );
    } else if (isStoryMode) {
      rigGroupRef.current.rotation.set(0, 0, 0);
    }
  });

  const shouldAutoRotate = !isStoryMode && autoRotate && !reducedMotion;

  return (
    <group ref={rigGroupRef} scale={[scale, scale, scale]}>
      <TechnologySystem
        theme={theme}
        activeNode={activeNode}
        progress={progress}
        progressRef={progressRef}
        autoRotate={shouldAutoRotate}
      />
    </group>
  );
}

const isClient = () => typeof window !== "undefined";
const subscribeNoop = () => () => {};

function checkWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

/**
 * Precomputes the initial camera position for story mode at p = 0.
 * Aligns Node 01 with the Hero Dot 80 portal origin before frame 0 renders,
 * completely preventing any initial jump from overview.
 */
function getInitialStoryCameraPosition(
  isMobile: boolean,
  isTablet: boolean
): [number, number, number] {
  if (isMobile) {
    return [-0.30, -0.2266, 4.60];
  }
  if (isTablet) {
    return [-0.30, -0.2266, 4.20];
  }
  return [-0.30, -0.2266, 3.70];
}

/**
 * TechnologySystemScene — Reusable 3D Scene Wrapper.
 * 
 * Embeds the 3D Technology System inside a high-performance R3F Canvas.
 * Supports:
 * - Deterministic continuous Hero Portal → Node 01 journey
 * - Zero React re-renders during scrolling via progressRef
 * - Theme switching ("light" | "dark")
 * - Responsive sizing and scaling
 */
export function TechnologySystemScene({
  theme = "light",
  activeNode = null,
  progress,
  progressRef,
  triggerId,
  isStoryMode,
  onProgressUpdate,
  interactive = true,
  autoRotate = true,
  className,
}: TechnologySystemSceneProps) {
  const reducedMotion = usePrefersReducedMotion();
  const mounted = React.useSyncExternalStore(
    subscribeNoop,
    isClient,
    () => false
  );
  const hasWebGL = React.useSyncExternalStore(
    subscribeNoop,
    checkWebGL,
    () => true
  );

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1023px)");

  if (!mounted || !hasWebGL) {
    // Graceful visual placeholder during SSR or unsupported WebGL
    return (
      <div
        className={cn(
          "size-full min-h-[360px] flex items-center justify-center",
          className
        )}
      >
        <div className="size-48 rounded-full border border-[#4A3725]/20 flex items-center justify-center font-mono text-xs text-[#4A3725]/60 uppercase tracking-widest">
          Technology System
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";
  const isStory = isStoryMode || Boolean(triggerId) || Boolean(progressRef);

  const cameraFov = isMobile ? 44 : isTablet ? 40 : 38;
  const rigScale = isMobile ? 0.95 : isTablet ? 0.98 : 1.0;

  // In story mode, initialize camera directly at handoffPos to eliminate any initial jump from center
  const initialCamPos: [number, number, number] = isStory
    ? getInitialStoryCameraPosition(isMobile, isTablet)
    : [0.0, 0.08, isMobile ? 4.8 : isTablet ? 4.3 : 3.8];

  return (
    <div
      className={cn(
        "relative size-full min-h-0 flex items-center justify-center select-none overflow-hidden touch-pan-y",
        className
      )}
    >
      <Canvas
        camera={{ position: initialCamPos, fov: cameraFov, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        frameloop="always"
        className="size-full"
      >
        {/* Curated Warm Architectural Lighting Environment */}
        <ambientLight
          intensity={isDark ? 0.6 : 0.8}
          color={isDark ? TECH_SYSTEM_PALETTE.softCream : TECH_SYSTEM_PALETTE.warmCream}
        />

        {/* Primary Warm Sun Key Light */}
        <directionalLight
          position={[5, 8, 6]}
          intensity={isDark ? 1.35 : 1.2}
          color="#FFFDF9"
          castShadow
        />

        {/* Soft Warm Fill Light */}
        <directionalLight
          position={[-5, 2, 4]}
          intensity={isDark ? 0.5 : 0.4}
          color="#F6EDE3"
        />

        {/* Low Warm Silhouette Back Light */}
        <directionalLight
          position={[0, -4, -5]}
          intensity={0.3}
          color={isDark ? "#FFF6ED" : "#4A3725"}
        />

        {/* Continuous Scroll Camera Controller — always mounted in story mode or when progressRef exists */}
        {(isStory || typeof progress === "number" || Boolean(progressRef) || Boolean(onProgressUpdate)) && (
          <TechnologySystemCamera
            triggerId={triggerId}
            progress={progress}
            progressRef={progressRef}
            interactive={interactive}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
            isTablet={isTablet}
            onProgressUpdate={onProgressUpdate}
          />
        )}

        {/* Master Technology System Rig */}
        <TechnologySystemRig
          theme={theme}
          activeNode={activeNode}
          progress={progress}
          progressRef={progressRef}
          isStoryMode={isStory}
          interactive={interactive && !isStory}
          autoRotate={autoRotate && !isStory}
          scale={rigScale}
        />

        {/* Section 03 Phase A: 3D Real Estate Architectural Environment */}
        <RealEstateEnvironment
          progressRef={progressRef}
          progress={progress}
          isDark={isDark}
        />
      </Canvas>
    </div>
  );
}
