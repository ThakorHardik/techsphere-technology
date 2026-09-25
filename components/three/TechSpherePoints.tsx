"use client";

import * as React from "react";
import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TechSpherePointsProps, TRANSITION_TARGET_DOT_INDEX } from "./types";
import { generateTechSphereBuffers } from "./TechSphereGeometry";
import { TechSphereConnections } from "./TechSphereConnections";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  uniform float uPixelRatio;
  uniform float uBaseScale;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Attenuate point size by distance to camera
    // Calibrated so largest master dots are ~22-26 CSS px, leaving clear space between neighbors
    float size = aSize * uBaseScale * (108.0 / -mvPosition.z) * uPixelRatio;
    gl_PointSize = max(1.5, size);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    // Sharp, circular halftone point with subtle anti-aliased edge
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float edge = smoothstep(0.5, 0.44, dist);
    gl_FragColor = vec4(uColor, edge * vAlpha);
  }
`;

export function TechSpherePoints({
  state,
  targetState,
  scrollProgress,
  progressRef,
  triggerId,
  targetDotIndex = TRANSITION_TARGET_DOT_INDEX,
  color,
  interactive,
  reducedMotion,
  pointCount,
  isMobile = false,
  isTablet = false,
  theme = "light",
}: TechSpherePointsProps) {
  const { gl, pointer, camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const triggerProgressRef = useRef(0);

  const anchorMetricsRef = useRef<{
    restWorldX: number;
    restWorldY: number;
    restScale: number;
    valid: boolean;
  }>({
    restWorldX: 0,
    restWorldY: 0,
    restScale: 1.0,
    valid: false,
  });

  // Touch drag tracking for mobile and pointer drag with smooth return
  const isPointerDown = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dom = gl.domElement;
    if (!dom) return;

    let startX = 0;
    let startY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isPointerDown.current = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current || !interactive || reducedMotion) return;
      const dx = (e.clientX - startX) / (window.innerWidth || 400);
      const dy = (e.clientY - startY) / (window.innerHeight || 600);
      // Low-amplitude touch drag deflection (never aggressive, max ±0.10 rad yaw, ±0.05 rad pitch)
      dragOffset.current.x = Math.max(-0.10, Math.min(0.10, dx * 0.5));
      dragOffset.current.y = Math.max(-0.05, Math.min(0.05, -dy * 0.35));
    };

    const handlePointerUp = () => {
      isPointerDown.current = false;
    };

    dom.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      dom.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [gl, interactive, reducedMotion]);

  // Direct ScrollTrigger binding for zero-render-thrashing scroll progress telemetry
  // Skipped when authoritative progressRef is provided by parent section
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
          : "top top",
        end: "bottom bottom",
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

  // Generate multi-state geometry buffers with device adaptation
  const buffers = useMemo(() => {
    return generateTechSphereBuffers(isMobile, isTablet);
  }, [isMobile, isTablet]);

  // Current interpolated buffers
  const currentPositions = useMemo(() => {
    return new Float32Array(buffers.positionsSphere);
  }, [buffers]);

  const currentSizes = useMemo(() => {
    return new Float32Array(buffers.sizesSphere);
  }, [buffers]);

  const currentAlphas = useMemo(() => {
    return new Float32Array(buffers.alphasSphere);
  }, [buffers]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(currentSizes, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(currentAlphas, 1));
    return geo;
  }, [currentPositions, currentSizes, currentAlphas]);

  // Shader uniforms
  const uniforms = useMemo(() => {
    return {
      uColor: { value: new THREE.Color(color) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uBaseScale: { value: 1.0 },
    };
  }, [color]);

  // Update color uniform when theme changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.set(color);
    }
  }, [color]);

  // Keep pixel ratio accurate
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);
    }
  }, [gl]);

  // Target positions based on current state
  const targetPositions = useMemo(() => {
    switch (state) {
      case "particles":
        return buffers.positionsParticles;
      case "system":
        return buffers.positionsSystem;
      case "connections":
        return buffers.positionsConnections;
      case "sphere":
      default:
        return buffers.positionsSphere;
    }
  }, [state, buffers]);

  // Target sizes based on current state
  const targetSizes = useMemo(() => {
    return state === "particles" ? buffers.sizesParticles : buffers.sizesSphere;
  }, [state, buffers]);

  // Target alphas based on current state (0.0 for secondary points in SPHERE/SYSTEM/CONNECTIONS)
  const targetAlphas = useMemo(() => {
    return state === "particles" ? buffers.alphasParticles : buffers.alphasSphere;
  }, [state, buffers]);

  // Compute normalized distance from each master dot to Target Dot 80
  // Used to gracefully fade peripheral dots first while preserving surrounding halftone context
  const targetDotDistances = useMemo(() => {
    const tX = buffers.positionsSphere[targetDotIndex * 3];
    const tY = buffers.positionsSphere[targetDotIndex * 3 + 1];
    const tZ = buffers.positionsSphere[targetDotIndex * 3 + 2];
    const count = buffers.count;
    const dists = new Float32Array(count);
    let maxD = 0.001;

    for (let i = 0; i < count; i++) {
      const idx3 = i * 3;
      const dx = buffers.positionsSphere[idx3] - tX;
      const dy = buffers.positionsSphere[idx3 + 1] - tY;
      const dz = buffers.positionsSphere[idx3 + 2] - tZ;
      const d = Math.hypot(dx, dy, dz);
      dists[i] = d;
      if (d > maxD) maxD = d;
    }

    const normDists = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      normDists[i] = dists[i] / maxD;
    }
    return normDists;
  }, [buffers, targetDotIndex]);

  const isHeroStory = triggerId === "hero-story-track" || triggerId === "hero-section";

  // Compute resting anchor alignment metrics so the full-viewport canvas
  // accurately projects the TechSphere inside .hero-sphere-anchor at rest
  useEffect(() => {
    if (!isHeroStory || typeof window === "undefined") return;

    const updateMetrics = () => {
      const anchor = document.querySelector(".hero-sphere-anchor");
      const canvas = gl.domElement;
      if (!anchor || !canvas) return;

      const anchorRect = anchor.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      if (
        canvasRect.width === 0 ||
        canvasRect.height === 0 ||
        anchorRect.height === 0
      )
        return;

      const anchorCenterX = anchorRect.left + anchorRect.width / 2;
      const anchorCenterY = anchorRect.top + anchorRect.height / 2;

      const canvasCenterX = canvasRect.left + canvasRect.width / 2;
      const canvasCenterY = canvasRect.top + canvasRect.height / 2;

      const deltaPxX = anchorCenterX - canvasCenterX;
      const deltaPxY = canvasCenterY - anchorCenterY;

      const persCam = camera as THREE.PerspectiveCamera;
      const fovRad = THREE.MathUtils.degToRad(persCam.fov / 2);
      const restZ = isMobile ? 6.8 : isTablet ? 6.2 : 5.8;
      const visibleHeightAtRest = 2 * Math.tan(fovRad) * restZ;
      const unitsPerPixel = visibleHeightAtRest / canvasRect.height;

      anchorMetricsRef.current = {
        restWorldX: deltaPxX * unitsPerPixel,
        restWorldY: deltaPxY * unitsPerPixel,
        restScale: Math.min(1.0, anchorRect.height / canvasRect.height),
        valid: true,
      };
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    window.addEventListener("orientationchange", updateMetrics);

    const rafId = requestAnimationFrame(updateMetrics);
    const timerId = setTimeout(updateMetrics, 100);

    return () => {
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("orientationchange", updateMetrics);
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [isHeroStory, gl, camera, isMobile, isTablet]);

  useFrame((_, delta) => {
    elapsedRef.current += delta;

    const rawProgress =
      progressRef !== undefined
        ? progressRef.current
        : scrollProgress !== undefined
        ? scrollProgress
        : triggerProgressRef.current;
    const p = Math.max(0, Math.min(1, rawProgress));

    // 1. Interpolate positions, sizes, and alphas towards target state
    if (pointsRef.current) {
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const sizeAttr = geometry.attributes.aSize as THREE.BufferAttribute;
      const sizeArray = sizeAttr.array as Float32Array;
      const alphaAttr = geometry.attributes.aAlpha as THREE.BufferAttribute;
      const alphaArray = alphaAttr.array as Float32Array;

      const baseSpeed = reducedMotion ? 1.0 : Math.min(1, delta * 3.5);

      const isScrollSphereToParticles =
        targetState === "particles" &&
        (scrollProgress !== undefined || triggerId !== undefined);
      const isScrollParticlesToConnections =
        state === "particles" &&
        targetState === "connections" &&
        (scrollProgress !== undefined || triggerId !== undefined);
      const isScrollSphereToConnections =
        state === "sphere" &&
        targetState === "connections" &&
        (scrollProgress !== undefined || triggerId !== undefined);

      let posMoved = false;
      let sizeMoved = false;
      let alphaMoved = false;

      const count = buffers.count;
      for (let i = 0; i < count; i++) {
        // Staged transition into PARTICLES or CONNECTIONS:
        // Outer edge dots lead the expansion, core follows gently, secondary particles fade in
        const ef = buffers.edgeFactors[i];
        let lerpSpeed = baseSpeed;
        if (
          (state === "particles" ||
            isScrollSphereToParticles ||
            isScrollParticlesToConnections ||
            isScrollSphereToConnections) &&
          !reducedMotion
        ) {
          lerpSpeed = Math.min(1, delta * (2.2 + ef * 2.0));
        }

        const idx3 = i * 3;
        let targetX = targetPositions[idx3];
        let targetY = targetPositions[idx3 + 1];
        let targetZ = targetPositions[idx3 + 2];
        let targetS = targetSizes[i];
        let targetA = targetAlphas[i];

        if (isHeroStory) {
          // ===================================================================
          // TECHSPHERE HERO TARGET-DOT SCROLL TRANSITION:
          // Pacing:
          // 0.00–0.25: Very calm Hero state. Minimal movement.
          // 0.25–0.45: Slow camera departure toward Dot 80.
          // 0.45–0.62: Gradually increase the sense of approach.
          // 0.62–0.78: More noticeable acceleration toward the real Dot 80.
          // 0.78–0.85: Very close approach. Dot 80 naturally dominates through perspective.
          // 0.85–1.00: Existing portal transition into BusinessChallenge.
          // ===================================================================
          if (i === targetDotIndex) {
            // Target Dot 80: The ONE real dot from the logo-derived geometry
            targetX = buffers.positionsSphere[idx3];
            targetY = buffers.positionsSphere[idx3 + 1];
            targetZ = buffers.positionsSphere[idx3 + 2];
            targetA = 1.0;

            // Natural sizing emphasis inside the real points system:
            if (p <= 0.62) {
              targetS = buffers.sizesSphere[i];
            } else if (p <= 0.78) {
              const p4 = (p - 0.62) / 0.16;
              targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i], buffers.sizesSphere[i] * 1.6, p4);
            } else if (p <= 0.85) {
              const p5 = (p - 0.78) / 0.07;
              targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i] * 1.6, buffers.sizesSphere[i] * 2.4, p5);
            } else {
              targetS = buffers.sizesSphere[i] * 2.4;
            }
          } else {
            const distFactor = targetDotDistances[i]; // 0 = adjacent to Dot 80, 1 = far periphery

            if (p <= 0.25) {
              // Phase 1 (0.00–0.25): Full TechSphere visible and stable in authentic SPHERE positions
              targetX = buffers.positionsSphere[idx3];
              targetY = buffers.positionsSphere[idx3 + 1];
              targetZ = buffers.positionsSphere[idx3 + 2];
              targetS = buffers.sizesSphere[i];
              targetA = buffers.alphasSphere[i];
            } else if (p <= 0.45) {
              // Phase 2 (0.25–0.45): Slow camera departure toward Dot 80
              // Surrounding TechSphere remains fully recognizable; peripheral dots soften slightly
              const p2 = (p - 0.25) / 0.20;
              targetX = buffers.positionsSphere[idx3];
              targetY = buffers.positionsSphere[idx3 + 1];
              targetZ = buffers.positionsSphere[idx3 + 2];
              targetS = buffers.sizesSphere[i];

              if (distFactor > 0.5) {
                targetA = THREE.MathUtils.lerp(buffers.alphasSphere[i], 0.85, p2);
              } else {
                targetA = buffers.alphasSphere[i];
              }
            } else if (p <= 0.62) {
              // Phase 3 (0.45–0.62): Gradually increase the sense of approach
              // Surrounding particles become quieter, but remain visible; TechSphere stays recognizable
              const p3 = (p - 0.45) / 0.17;
              const dirX = buffers.positionsSphere[idx3] - buffers.positionsSphere[targetDotIndex * 3];
              const dirY = buffers.positionsSphere[idx3 + 1] - buffers.positionsSphere[targetDotIndex * 3 + 1];

              if (distFactor > 0.5) {
                const drift = p3 * 0.05 * distFactor;
                targetX = buffers.positionsSphere[idx3] + dirX * drift;
                targetY = buffers.positionsSphere[idx3 + 1] + dirY * drift;
                targetZ = buffers.positionsSphere[idx3 + 2];
                targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i], buffers.sizesSphere[i] * 0.9, p3);
                targetA = THREE.MathUtils.lerp(0.85, 0.35, p3);
              } else {
                // Immediate halftone neighbors remain visible with authentic structure
                targetX = buffers.positionsSphere[idx3];
                targetY = buffers.positionsSphere[idx3 + 1];
                targetZ = buffers.positionsSphere[idx3 + 2];
                targetS = buffers.sizesSphere[i];
                targetA = THREE.MathUtils.lerp(1.0, 0.85, p3);
              }
            } else if (p <= 0.78) {
              // Phase 4 (0.62–0.78): More noticeable acceleration toward the real Dot 80
              // Moving into the particle field; surrounding dots gently drift and soften
              const p4 = (p - 0.62) / 0.16;
              const dirX = buffers.positionsSphere[idx3] - buffers.positionsSphere[targetDotIndex * 3];
              const dirY = buffers.positionsSphere[idx3 + 1] - buffers.positionsSphere[targetDotIndex * 3 + 1];

              if (distFactor > 0.5) {
                targetA = THREE.MathUtils.lerp(0.35, 0.0, p4);
                targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i] * 0.9, 0.0, p4);
                targetX = buffers.positionsSphere[idx3];
                targetY = buffers.positionsSphere[idx3 + 1];
                targetZ = buffers.positionsSphere[idx3 + 2];
              } else {
                const drift = p4 * 0.08 * (1.0 - distFactor);
                targetX = buffers.positionsSphere[idx3] + dirX * drift;
                targetY = buffers.positionsSphere[idx3 + 1] + dirY * drift;
                targetZ = buffers.positionsSphere[idx3 + 2];
                targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i], buffers.sizesSphere[i] * 0.6, p4);
                targetA = THREE.MathUtils.lerp(0.85, 0.30, p4);
              }
            } else if (p <= 0.85) {
              // Phase 5 (0.78–0.85): Very close approach. Dot 80 naturally dominates through perspective.
              const p5 = (p - 0.78) / 0.07;
              targetX = buffers.positionsSphere[idx3];
              targetY = buffers.positionsSphere[idx3 + 1];
              targetZ = buffers.positionsSphere[idx3 + 2];
              targetS = 0.0;
              targetA = distFactor <= 0.5 ? THREE.MathUtils.lerp(0.30, 0.0, p5) : 0.0;
            } else {
              // Phase 6 (0.85–1.00): Existing portal transition
              targetA = 0.0;
              targetS = 0.0;
              targetX = buffers.positionsSphere[idx3];
              targetY = buffers.positionsSphere[idx3 + 1];
              targetZ = buffers.positionsSphere[idx3 + 2];
            }
          }
        } else if (isScrollSphereToConnections) {
          // Synchronized with Business Challenge V3 particle progression:
          // 0.00: recognizable sphere
          // 0.20: still recognizable
          // 0.40: very subtle loosening
          // 0.55: fragmentation begins
          // 0.70: visible fragmentation
          // 0.85: strong dispersed structure
          // 0.95: fragmented state
          // 1.00: gentle beginning of reorganization
          if (p <= 0.20) {
            targetX = buffers.positionsSphere[idx3];
            targetY = buffers.positionsSphere[idx3 + 1];
            targetZ = buffers.positionsSphere[idx3 + 2];
            targetS = buffers.sizesSphere[i];
            targetA = buffers.alphasSphere[i];
          } else if (p <= 0.35) {
            // 0.20–0.35: very subtle loosening
            const p2 = (p - 0.20) / 0.15;
            const drift = p2 * 0.03 * ef;
            targetX = buffers.positionsSphere[idx3] * (1.0 + drift);
            targetY = buffers.positionsSphere[idx3 + 1] * (1.0 + drift);
            targetZ = buffers.positionsSphere[idx3 + 2] * (1.0 + drift);
            targetS = buffers.sizesSphere[i];
            targetA = buffers.alphasSphere[i];
          } else if (p <= 0.50) {
            // 0.35–0.50: fragmentation begins
            const p3 = (p - 0.35) / 0.15;
            const pointBlend = p3 * 0.18 * (0.6 + ef * 0.4);
            targetX = THREE.MathUtils.lerp(buffers.positionsSphere[idx3], buffers.positionsParticles[idx3], pointBlend);
            targetY = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 1], buffers.positionsParticles[idx3 + 1], pointBlend);
            targetZ = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 2], buffers.positionsParticles[idx3 + 2], pointBlend);
            targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i], buffers.sizesParticles[i], pointBlend);
            targetA = THREE.MathUtils.lerp(buffers.alphasSphere[i], buffers.alphasParticles[i], pointBlend);
          } else if (p <= 0.65) {
            // 0.50–0.65: visible fragmentation
            const p4 = (p - 0.50) / 0.15;
            const pointBlend = (0.18 + p4 * 0.24) * (0.6 + ef * 0.4);
            targetX = THREE.MathUtils.lerp(buffers.positionsSphere[idx3], buffers.positionsParticles[idx3], pointBlend);
            targetY = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 1], buffers.positionsParticles[idx3 + 1], pointBlend);
            targetZ = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 2], buffers.positionsParticles[idx3 + 2], pointBlend);
            targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i], buffers.sizesParticles[i], pointBlend);
            targetA = THREE.MathUtils.lerp(buffers.alphasSphere[i], buffers.alphasParticles[i], pointBlend);
          } else if (p <= 0.78) {
            // 0.65–0.78: strong dispersed structure
            const p5 = (p - 0.65) / 0.13;
            const pointBlend = Math.min(0.85, (0.42 + p5 * 0.35) * (0.7 + ef * 0.3));
            targetX = THREE.MathUtils.lerp(buffers.positionsSphere[idx3], buffers.positionsParticles[idx3], pointBlend);
            targetY = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 1], buffers.positionsParticles[idx3 + 1], pointBlend);
            targetZ = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 2], buffers.positionsParticles[idx3 + 2], pointBlend);
            targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i], buffers.sizesParticles[i], pointBlend);
            targetA = THREE.MathUtils.lerp(buffers.alphasSphere[i], buffers.alphasParticles[i], pointBlend);
          } else if (p <= 0.86) {
            // 0.78–0.86: fragmented state
            const p6 = (p - 0.78) / 0.08;
            const pointBlend = Math.min(1.0, 0.77 + p6 * 0.23);
            targetX = THREE.MathUtils.lerp(buffers.positionsSphere[idx3], buffers.positionsParticles[idx3], pointBlend);
            targetY = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 1], buffers.positionsParticles[idx3 + 1], pointBlend);
            targetZ = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 2], buffers.positionsParticles[idx3 + 2], pointBlend);
            targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i], buffers.sizesParticles[i], pointBlend);
            targetA = THREE.MathUtils.lerp(buffers.alphasSphere[i], buffers.alphasParticles[i], pointBlend);
          } else {
            // 0.86–0.92: gentle reorganization; 0.92–1.00: holds calm and motionless during final insight
            const p7 = Math.min(1.0, (p - 0.86) / 0.06);
            const startX = buffers.positionsParticles[idx3];
            const startY = buffers.positionsParticles[idx3 + 1];
            const startZ = buffers.positionsParticles[idx3 + 2];
            targetX = THREE.MathUtils.lerp(startX, buffers.positionsConnections[idx3], p7 * 0.6);
            targetY = THREE.MathUtils.lerp(startY, buffers.positionsConnections[idx3 + 1], p7 * 0.6);
            targetZ = THREE.MathUtils.lerp(startZ, buffers.positionsConnections[idx3 + 2], p7 * 0.6);
            targetS = THREE.MathUtils.lerp(buffers.sizesParticles[i], buffers.sizesSphere[i], p7 * 0.5);
            targetA = THREE.MathUtils.lerp(buffers.alphasParticles[i], buffers.alphasSphere[i], p7 * 0.5);
          }
        } else if (isScrollSphereToParticles) {
          // Hero Scroll Foreshadowing:
          let pointBlend = 0.0;
          let depthDeform = 0.0;

          if (p <= 0.25) {
            const phaseP = p / 0.25;
            pointBlend = phaseP * 0.08 * (0.8 + ef * 0.35);
            depthDeform = Math.sin(phaseP * Math.PI) * 0.06 * ef;
          } else if (p <= 0.65) {
            const phaseP = (p - 0.25) / 0.40;
            pointBlend = (0.08 + phaseP * 0.14) * (0.8 + ef * 0.35);
            depthDeform = Math.cos(phaseP * Math.PI * 0.5) * 0.06 * ef;
          } else {
            const phaseP = Math.min(1.0, (p - 0.65) / 0.35);
            pointBlend = (0.22 + phaseP * 0.13) * (0.8 + ef * 0.35);
          }

          targetX = THREE.MathUtils.lerp(buffers.positionsSphere[idx3], buffers.positionsParticles[idx3], pointBlend);
          targetY = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 1], buffers.positionsParticles[idx3 + 1], pointBlend);
          targetZ = THREE.MathUtils.lerp(buffers.positionsSphere[idx3 + 2], buffers.positionsParticles[idx3 + 2], pointBlend) + depthDeform;
          targetS = THREE.MathUtils.lerp(buffers.sizesSphere[i], buffers.sizesParticles[i], pointBlend);
          targetA = THREE.MathUtils.lerp(buffers.alphasSphere[i], buffers.alphasParticles[i], pointBlend);
        } else if (isScrollParticlesToConnections) {
          let dotBlend = 0.0;
          if (p > 0.25) {
            dotBlend = Math.min(1.0, (p - 0.25) / 0.60);
          }

          targetX = THREE.MathUtils.lerp(buffers.positionsParticles[idx3], buffers.positionsConnections[idx3], dotBlend);
          targetY = THREE.MathUtils.lerp(buffers.positionsParticles[idx3 + 1], buffers.positionsConnections[idx3 + 1], dotBlend);
          targetZ = THREE.MathUtils.lerp(buffers.positionsParticles[idx3 + 2], buffers.positionsConnections[idx3 + 2], dotBlend);
          targetS = THREE.MathUtils.lerp(buffers.sizesParticles[i], buffers.sizesSphere[i], dotBlend);
          targetA = THREE.MathUtils.lerp(buffers.alphasParticles[i], buffers.alphasSphere[i], dotBlend);
        }

        const dx = targetX - posArray[idx3];
        const dy = targetY - posArray[idx3 + 1];
        const dz = targetZ - posArray[idx3 + 2];

        if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005 || Math.abs(dz) > 0.0005) {
          posArray[idx3] += dx * lerpSpeed;
          posArray[idx3 + 1] += dy * lerpSpeed;
          posArray[idx3 + 2] += dz * lerpSpeed;
          posMoved = true;
        }

        const sDiff = targetS - sizeArray[i];
        if (Math.abs(sDiff) > 0.001) {
          sizeArray[i] += sDiff * baseSpeed;
          sizeMoved = true;
        }

        const aDiff = targetA - alphaArray[i];
        if (Math.abs(aDiff) > 0.001) {
          alphaArray[i] += aDiff * baseSpeed;
          alphaMoved = true;
        }
      }

      if (posMoved) posAttr.needsUpdate = true;
      if (sizeMoved) sizeAttr.needsUpdate = true;
      if (alphaMoved) alphaAttr.needsUpdate = true;

      // Adapt point color as Hero background transitions from Warm Cream to Deep Brown
      if (isScrollSphereToConnections && materialRef.current && theme === "light") {
        const colorP = Math.max(0, Math.min(1, (p - 0.65) / 0.30));
        const lightColor = new THREE.Color("#4A3725");
        const darkColor = new THREE.Color("#FFF6ED");
        materialRef.current.uniforms.uColor.value.copy(lightColor).lerp(darkColor, colorP);
      }
    }

    // 2. Controlled group transform: Position, Scale & Sway
    if (groupRef.current) {
      let currentWorldX = 0;
      let currentWorldY = 0;
      let currentScale = 1.0;

      if (isHeroStory) {
        if (!anchorMetricsRef.current.valid) {
          const anchor = document.querySelector(".hero-sphere-anchor");
          const canvas = gl.domElement;
          if (anchor && canvas) {
            const aRect = anchor.getBoundingClientRect();
            const cRect = canvas.getBoundingClientRect();
            if (cRect.width > 0 && cRect.height > 0 && aRect.height > 0) {
              const persCam = camera as THREE.PerspectiveCamera;
              const fovRad = THREE.MathUtils.degToRad(persCam.fov / 2);
              const restZ = isMobile ? 6.8 : isTablet ? 6.2 : 5.8;
              const visibleH = 2 * Math.tan(fovRad) * restZ;
              const upp = visibleH / cRect.height;
              anchorMetricsRef.current = {
                restWorldX:
                  (aRect.left + aRect.width / 2 - (cRect.left + cRect.width / 2)) * upp,
                restWorldY:
                  (cRect.top + cRect.height / 2 - (aRect.top + aRect.height / 2)) * upp,
                restScale: Math.min(1.0, aRect.height / cRect.height),
                valid: true,
              };
            }
          }
        }

        const { restWorldX, restWorldY, restScale } = anchorMetricsRef.current;

        // Progressive expansion from right column anchor to full viewport:
        // 0.00 - 0.20: Locked in right column at resting scale and position
        // 0.20 - 0.45: Smoothly glide to viewport center (0, 0) and expand to scale 1.0
        // 0.45 - 1.00: Centered at (0, 0) with scale 1.0 as camera approaches Dot 80
        if (p <= 0.20) {
          currentWorldX = restWorldX;
          currentWorldY = restWorldY;
          currentScale = restScale;
        } else if (p <= 0.45) {
          const expandP = (p - 0.20) / 0.25;
          const easeExpand = gsap.parseEase("power2.inOut")(expandP);
          currentWorldX = THREE.MathUtils.lerp(restWorldX, 0, easeExpand);
          currentWorldY = THREE.MathUtils.lerp(restWorldY, 0, easeExpand);
          currentScale = THREE.MathUtils.lerp(restScale, 1.0, easeExpand);
        } else {
          currentWorldX = 0;
          currentWorldY = 0;
          currentScale = 1.0;
        }
      }

      if (reducedMotion) {
        groupRef.current.rotation.set(0, 0, 0);
        if (isHeroStory) {
          groupRef.current.position.set(currentWorldX, currentWorldY, 0);
          groupRef.current.scale.set(currentScale, currentScale, currentScale);
        } else {
          groupRef.current.position.set(0, 0, 0);
          groupRef.current.scale.set(1, 1, 1);
        }
        return;
      }

      const t = elapsedRef.current;

      // Attenuate ambient sway as camera approaches Dot 80 so target remains rock-solid in center
      const swayAttenuation = isHeroStory ? Math.max(0, 1.0 - (p - 0.25) / 0.25) : 1.0;

      // Ambient breathing: very subtle sinusoidal scale oscillation ±0.012
      const ambientBreath = 1.0 + Math.sin(t * 0.8) * 0.012 * swayAttenuation;
      groupRef.current.scale.set(
        currentScale * ambientBreath,
        currentScale * ambientBreath,
        currentScale * ambientBreath
      );

      groupRef.current.position.set(currentWorldX, currentWorldY, 0);

      // Yaw: ±5° (±0.087 rad), Pitch: ±2° (±0.035 rad)
      const ambientYaw = Math.sin(t * 0.28) * 0.087 * swayAttenuation;
      const ambientPitch = Math.cos(t * 0.18) * 0.035 * swayAttenuation;

      // When user releases touch, smoothly return dragOffset to 0
      if (!isPointerDown.current) {
        dragOffset.current.x = THREE.MathUtils.lerp(dragOffset.current.x, 0, 0.06);
        dragOffset.current.y = THREE.MathUtils.lerp(dragOffset.current.y, 0, 0.06);
      }

      // Subtle, restrained touch and mouse orientation
      const mouseTiltX = interactive && !isMobile ? -pointer.y * 0.03 * swayAttenuation : 0;
      const mouseTiltY = interactive && !isMobile ? pointer.x * 0.05 * swayAttenuation : 0;

      const targetTiltX = ambientPitch + dragOffset.current.y * swayAttenuation + mouseTiltX;
      const targetTiltY = ambientYaw + dragOffset.current.x * swayAttenuation + mouseTiltY;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetTiltX,
        0.04
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetTiltY,
        0.04
      );

      // Publish Dot 80 live projected screen position for circular portal reveal
      if (isHeroStory) {
        const dotWorld = new THREE.Vector3(
          buffers.positionsSphere[targetDotIndex * 3],
          buffers.positionsSphere[targetDotIndex * 3 + 1],
          buffers.positionsSphere[targetDotIndex * 3 + 2]
        );
        dotWorld.applyMatrix4(groupRef.current.matrixWorld);
        dotWorld.project(camera);
        const rect = gl.domElement.getBoundingClientRect();
        if (typeof window !== "undefined") {
          window.__techSphereDot80Screen = {
            pxX: (dotWorld.x * 0.5 + 0.5) * rect.width + rect.left,
            pxY: (-dotWorld.y * 0.5 + 0.5) * rect.height + rect.top,
          };
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>

      {/* Relationship lines for CONNECTIONS and structural accents for SYSTEM */}
      <TechSphereConnections
        state={state}
        targetState={targetState}
        scrollProgress={scrollProgress}
        progressRef={progressRef}
        triggerId={triggerId}
        connectionLinePositions={buffers.connectionLinePositions}
        connectionLineDelays={buffers.connectionLineDelays}
        systemLinePositions={buffers.systemLinePositions}
        theme={theme}
      />
    </group>
  );
}
