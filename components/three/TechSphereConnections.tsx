"use client";

import * as React from "react";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TechSphereState, TechSphereTheme } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TechSphereConnectionsProps {
  state: TechSphereState;
  targetState?: TechSphereState;
  scrollProgress?: number;
  progressRef?: React.RefObject<number>;
  triggerId?: string;
  connectionLinePositions: Float32Array;
  connectionLineDelays: Float32Array;
  systemLinePositions?: Float32Array;
  theme?: TechSphereTheme;
  /**
   * Optional normalized line reveal progress [0.0, 1.0] driven by scroll storytelling.
   */
  connectionProgress?: number;
}

const connectionVertexShader = `
  attribute float aDelay;
  varying float vAlpha;
  uniform float uProgress;
  uniform float uBaseOpacity;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Staged progressive reveal in 5 spatial groups:
    // Group 0 begins immediately, later groups stagger in over 600–1000ms window
    float lineAlpha = smoothstep(aDelay * 0.55, aDelay * 0.55 + 0.45, uProgress);
    vAlpha = lineAlpha * uBaseOpacity;
  }
`;

const connectionFragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.002) discard;
    gl_FragColor = vec4(uColor, vAlpha);
  }
`;

const systemVertexShader = `
  varying float vAlpha;
  uniform float uProgress;
  uniform float uBaseOpacity;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = uProgress * uBaseOpacity;
  }
`;

const systemFragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.002) discard;
    gl_FragColor = vec4(uColor, vAlpha);
  }
`;

/**
 * Renders sparse, architectural relationship lines for "CONNECTIONS" state
 * and subtle structural alignment accents for "SYSTEM" state.
 *
 * Visual hierarchy:
 * 1. Master dots = primary
 * 2. Relationship / Alignment lines = secondary
 * 3. Background = tertiary
 *
 * Line Contrast & Width:
 * - Warm Cream (#FFF6ED): dark brown #35261A at 0.35 opacity (0.22 for system)
 * - Deep Brown (#35261A): warm cream #FFF6ED at 0.45 opacity (0.30 for system)
 * - Line width: ~0.8-1.0 CSS px (linewidth: 1)
 * - Zero bloom, zero neon, zero glow.
 */
export function TechSphereConnections({
  state,
  targetState,
  scrollProgress,
  progressRef,
  triggerId,
  connectionLinePositions,
  connectionLineDelays,
  systemLinePositions,
  theme = "light",
  connectionProgress,
}: TechSphereConnectionsProps) {
  const connMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const sysMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const isDark = theme === "dark";
  const triggerProgressRef = useRef(0);

  // Direct ScrollTrigger binding for zero-render-thrashing scroll progress telemetry
  // Skipped if authoritative progressRef is provided by parent
  useEffect(() => {
    if (progressRef || !triggerId || typeof window === "undefined") return;

    const selector = triggerId.startsWith("#") ? triggerId : `#${triggerId}`;
    const el = document.querySelector(selector);
    if (!el) return;

    const isHeroTrack =
      el.id === "hero-story-track" ||
      el.id === "hero-section" ||
      el.classList.contains("scroll-story-track");

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: isHeroTrack
          ? () =>
              "top " +
              (document.querySelector("header")?.offsetHeight || 0) +
              "px"
          : "top 80%",
        end: isHeroTrack ? "bottom bottom" : "bottom 20%",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          triggerProgressRef.current = self.progress;
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [triggerId]);

  // Connection lines base opacity:
  // Deep Brown: #FFF6ED at 0.45 opacity
  // Warm Cream: #35261A at 0.35 opacity
  const connBaseOpacity = isDark ? 0.45 : 0.35;

  // System alignment accents base opacity:
  // Deep Brown: #FFF6ED at 0.30 opacity
  // Warm Cream: #35261A at 0.22 opacity
  const sysBaseOpacity = isDark ? 0.30 : 0.22;

  // Adaptive line color tokens
  const lineColor = useMemo(
    () => new THREE.Color(isDark ? "#FFF6ED" : "#35261A"),
    [isDark]
  );

  // Connection geometry with staged progressive delay attribute
  const connGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(connectionLinePositions, 3)
    );
    geo.setAttribute(
      "aDelay",
      new THREE.BufferAttribute(connectionLineDelays, 1)
    );
    return geo;
  }, [connectionLinePositions, connectionLineDelays]);

  // System geometry
  const sysGeometry = useMemo(() => {
    if (!systemLinePositions || systemLinePositions.length === 0) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(systemLinePositions, 3)
    );
    return geo;
  }, [systemLinePositions]);

  // Connection uniforms
  const connUniforms = useMemo(() => {
    return {
      uColor: { value: lineColor },
      uProgress: { value: 0.0 },
      uBaseOpacity: { value: connBaseOpacity },
    };
  }, [lineColor, connBaseOpacity]);

  // System uniforms
  const sysUniforms = useMemo(() => {
    return {
      uColor: { value: lineColor },
      uProgress: { value: 0.0 },
      uBaseOpacity: { value: sysBaseOpacity },
    };
  }, [lineColor, sysBaseOpacity]);

  // Update uniforms when theme / contrast changes
  useEffect(() => {
    if (connMaterialRef.current) {
      connMaterialRef.current.uniforms.uColor.value = lineColor;
      connMaterialRef.current.uniforms.uBaseOpacity.value = connBaseOpacity;
    }
    if (sysMaterialRef.current) {
      sysMaterialRef.current.uniforms.uColor.value = lineColor;
      sysMaterialRef.current.uniforms.uBaseOpacity.value = sysBaseOpacity;
    }
  }, [lineColor, connBaseOpacity, sysBaseOpacity]);

  // Progress animation state
  const connProgress = useRef(0.0);
  const sysProgress = useRef(0.0);

  // Animate line reveals smoothly in useFrame
  useFrame((_, delta) => {
    // 1. Connection lines: scroll-driven progress or state-based progressive reveal
    const rawProgress =
      progressRef !== undefined
        ? progressRef.current
        : scrollProgress !== undefined
        ? scrollProgress
        : triggerProgressRef.current;
    const p = Math.max(0, Math.min(1, rawProgress));
    const isScrollParticlesToConnections =
      state === "particles" &&
      targetState === "connections" &&
      (scrollProgress !== undefined || triggerId !== undefined);
    const isScrollSphereToConnections =
      state === "sphere" &&
      targetState === "connections" &&
      (scrollProgress !== undefined || triggerId !== undefined);

    if (connectionProgress !== undefined) {
      connProgress.current = THREE.MathUtils.clamp(connectionProgress, 0.0, 1.0);
    } else if (isScrollParticlesToConnections) {
      // Reveal lines smoothly between 0.50 and 1.00 of section progress
      const lineP = Math.max(0, Math.min(1, (p - 0.50) / 0.50));
      connProgress.current = lineP;
    } else if (isScrollSphereToConnections) {
      // Reveal lines in Phase 4 & 5:
      // For Hero 5-phase storytelling: reveal lines between p=0.68 and p=0.92
      // For standard section storytelling: reveal lines between p=0.48 and p=0.95
      const isHeroStory = triggerId === "hero-story-track" || triggerId === "hero-section";
      const startP = isHeroStory ? 0.68 : 0.48;
      const endP = isHeroStory ? 0.92 : 0.95;
      const lineP = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
      connProgress.current = lineP;
    } else {
      const targetConn = state === "connections" ? 1.0 : 0.0;
      const connSpeed = targetConn > connProgress.current ? delta / 0.8 : delta / 0.4;
      connProgress.current = THREE.MathUtils.clamp(
        connProgress.current + (targetConn > connProgress.current ? connSpeed : -connSpeed),
        0.0,
        1.0
      );
    }

    if (connMaterialRef.current) {
      if (isScrollSphereToConnections && theme === "light") {
        const colorP = Math.max(0, Math.min(1, (p - 0.65) / 0.30));
        const lightLine = new THREE.Color("#35261A");
        const darkLine = new THREE.Color("#FFF6ED");
        connMaterialRef.current.uniforms.uColor.value.copy(lightLine).lerp(darkLine, colorP);
      }
      connMaterialRef.current.uniforms.uProgress.value = connProgress.current;
      connMaterialRef.current.visible = connProgress.current > 0.001;
    }

    // 2. System structural accents: reveal over ~700ms, fade-out over ~350ms
    const targetSys = state === "system" ? 1.0 : 0.0;
    const sysSpeed = targetSys > sysProgress.current ? delta / 0.7 : delta / 0.35;
    sysProgress.current = THREE.MathUtils.clamp(
      sysProgress.current + (targetSys > sysProgress.current ? sysSpeed : -sysSpeed),
      0.0,
      1.0
    );

    if (sysMaterialRef.current) {
      sysMaterialRef.current.uniforms.uProgress.value = sysProgress.current;
      sysMaterialRef.current.visible = sysProgress.current > 0.001;
    }
  });

  return (
    <group>
      {connectionLinePositions.length > 0 && (
        <lineSegments geometry={connGeometry}>
          <shaderMaterial
            ref={connMaterialRef}
            vertexShader={connectionVertexShader}
            fragmentShader={connectionFragmentShader}
            uniforms={connUniforms}
            transparent
            depthWrite={false}
            linewidth={1}
          />
        </lineSegments>
      )}

      {sysGeometry && (
        <lineSegments geometry={sysGeometry}>
          <shaderMaterial
            ref={sysMaterialRef}
            vertexShader={systemVertexShader}
            fragmentShader={systemFragmentShader}
            uniforms={sysUniforms}
            transparent
            depthWrite={false}
            linewidth={1}
          />
        </lineSegments>
      )}
    </group>
  );
}
