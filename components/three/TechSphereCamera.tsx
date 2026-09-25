"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TechSphereCameraProps, TRANSITION_TARGET_DOT_POS } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Dedicated Camera controller for the TechSphere 3D system.
 * 
 * Implements the 6-phase Target-Dot Scroll Storytelling:
 * - Target Dot 80: cx = -0.0068, cy = -0.0270, cz = 1.5652
 * 1. Phase 1 (0.00–0.25): Hero Rest (very calm Hero state, minimal movement)
 * 2. Phase 2 (0.25–0.45): Slow camera departure toward Dot 80
 * 3. Phase 3 (0.45–0.62): Gradually increase the sense of approach
 * 4. Phase 4 (0.62–0.78): More noticeable acceleration toward the real Dot 80
 * 5. Phase 5 (0.78–0.85): Very close approach (Dot 80 naturally dominates through perspective)
 * 6. Phase 6 (0.85–1.00): Existing portal transition into BusinessChallenge
 * 
 * Supports:
 * - Calibrated travel across Desktop, Tablet, and Mobile
 * - Parallax attenuation so scroll motion strictly dominates
 * - Zero render thrashing via ScrollTrigger mutable ref
 * - Reduced-motion safety (static camera)
 */
export function TechSphereCamera({
  scrollProgress,
  progressRef,
  triggerId,
  targetDotPos = TRANSITION_TARGET_DOT_POS,
  interactive = true,
  reducedMotion = false,
  isMobile = false,
  isTablet = false,
}: TechSphereCameraProps) {
  const { camera, pointer } = useThree();
  const triggerProgressRef = useRef(0);
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const [tX, tY, tZ] = targetDotPos;

  const isHeroTrackRef = useRef(true);

  // Direct ScrollTrigger binding for zero-render-thrashing scroll progress telemetry
  // Skipped when authoritative progressRef is provided by parent section
  useEffect(() => {
    if (progressRef || !triggerId || typeof window === "undefined" || reducedMotion) return;

    const selector = triggerId.startsWith("#") ? triggerId : `#${triggerId}`;
    const el = document.querySelector(selector);
    if (!el) return;

    const isHeroTrack =
      el.id === "hero-story-track" ||
      el.id === "hero-section" ||
      el.classList.contains("scroll-story-track");
    isHeroTrackRef.current = isHeroTrack;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: isHeroTrack
          ? () =>
              "top " +
              (document.querySelector("header")?.offsetHeight || 0) +
              "px"
          : "top top",
        end: isHeroTrack ? "bottom bottom" : "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          triggerProgressRef.current = self.progress;
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [triggerId, progressRef, reducedMotion]);

  // Calibrated camera coordinates across device tiers
  const restZ = isMobile ? 6.8 : isTablet ? 6.2 : 5.8;
  const p2Z = isMobile ? 5.6 : isTablet ? 5.0 : 4.6;
  const p3Z = isMobile ? 4.2 : isTablet ? 3.6 : 3.2;
  const enterOffset = isMobile ? 0.45 : isTablet ? 0.35 : 0.28;
  const enterZ = tZ + enterOffset;
  const closeOffset = isMobile ? 0.20 : isTablet ? 0.16 : 0.12;
  const closeZ = tZ + closeOffset;
  const finalZ = tZ + (isMobile ? 0.14 : isTablet ? 0.10 : 0.08);

  useFrame((_, delta) => {
    if (reducedMotion || !interactive) {
      // Resting position: perfectly centered, no movement
      camera.position.set(0, 0, restZ);
      camera.lookAt(0, 0, 0);
      return;
    }

    const rawP =
      progressRef !== undefined
        ? progressRef.current
        : scrollProgress !== undefined
        ? scrollProgress
        : triggerProgressRef.current;
    const isScrollStory =
      progressRef !== undefined ||
      scrollProgress !== undefined ||
      triggerId !== undefined;
    const p = Math.max(0, Math.min(1, rawP));

    let camTargetX = 0;
    let camTargetY = 0;
    let camTargetZ = restZ;

    let lookTargetX = 0;
    let lookTargetY = 0;
    let lookTargetZ = 0;

    let parallaxFactor = 1.0;

    if (isScrollStory) {
      if (isHeroTrackRef.current) {
        if (p <= 0.25) {
          // Phase 1 (0.00 -> 0.25): Very calm Hero state. Minimal movement.
          camTargetX = 0;
          camTargetY = 0;
          camTargetZ = restZ;
          lookTargetX = 0;
          lookTargetY = 0;
          lookTargetZ = 0;
          parallaxFactor = 1.0;
        } else if (p <= 0.45) {
          // Phase 2 (0.25 -> 0.45): Slow camera departure toward Dot 80
          const p2 = (p - 0.25) / 0.20;
          const easeP2 = gsap.parseEase("power1.inOut")(p2);
          camTargetX = THREE.MathUtils.lerp(0, tX * 0.25, easeP2);
          camTargetY = THREE.MathUtils.lerp(0, tY * 0.25, easeP2);
          camTargetZ = THREE.MathUtils.lerp(restZ, p2Z, easeP2);

          lookTargetX = THREE.MathUtils.lerp(0, tX * 0.5, easeP2);
          lookTargetY = THREE.MathUtils.lerp(0, tY * 0.5, easeP2);
          lookTargetZ = THREE.MathUtils.lerp(0, tZ * 0.3, easeP2);

          parallaxFactor = Math.max(0, 1.0 - p2 * 1.5);
        } else if (p <= 0.62) {
          // Phase 3 (0.45 -> 0.62): Gradually increase the sense of approach
          const p3 = (p - 0.45) / 0.17;
          const easeP3 = gsap.parseEase("power1.inOut")(p3);
          camTargetX = THREE.MathUtils.lerp(tX * 0.25, tX, easeP3);
          camTargetY = THREE.MathUtils.lerp(tY * 0.25, tY, easeP3);
          camTargetZ = THREE.MathUtils.lerp(p2Z, p3Z, easeP3);

          lookTargetX = THREE.MathUtils.lerp(tX * 0.5, tX, easeP3);
          lookTargetY = THREE.MathUtils.lerp(tY * 0.5, tY, easeP3);
          lookTargetZ = THREE.MathUtils.lerp(tZ * 0.3, tZ, easeP3);

          parallaxFactor = 0.0;
        } else if (p <= 0.78) {
          // Phase 4 (0.62 -> 0.78): More noticeable acceleration toward the real Dot 80
          const p4 = (p - 0.62) / 0.16;
          const easeP4 = gsap.parseEase("power1.inOut")(p4);
          camTargetX = tX;
          camTargetY = tY;
          camTargetZ = THREE.MathUtils.lerp(p3Z, enterZ, easeP4);

          lookTargetX = tX;
          lookTargetY = tY;
          lookTargetZ = tZ;

          parallaxFactor = 0.0;
        } else if (p <= 0.85) {
          // Phase 5 (0.78 -> 0.85): Very close approach. Dot 80 naturally dominates through perspective.
          const p5 = (p - 0.78) / 0.07;
          const easeP5 = gsap.parseEase("sine.inOut")(p5);
          camTargetX = tX;
          camTargetY = tY;
          camTargetZ = THREE.MathUtils.lerp(enterZ, closeZ, easeP5);

          lookTargetX = tX;
          lookTargetY = tY;
          lookTargetZ = tZ;

          parallaxFactor = 0.0;
        } else {
          // Phase 6 (0.85 -> 1.00): Existing portal transition
          const p6 = Math.min(1.0, (p - 0.85) / 0.15);
          camTargetX = tX;
          camTargetY = tY;
          camTargetZ = THREE.MathUtils.lerp(closeZ, finalZ, p6);

          lookTargetX = tX;
          lookTargetY = tY;
          lookTargetZ = tZ;

          parallaxFactor = 0.0;
        }
      } else {
        // Business Challenge active system camera trajectory:
        // Subtle restrained orbital movement (yaw ±7° max, pitch ±3° max, small dolly variation)
        const scaleFactor = isMobile ? 0.35 : isTablet ? 0.65 : 1.0;
        const maxYaw = 0.12 * scaleFactor; // ±7° (~0.12 rad)
        const maxPitch = 0.05 * scaleFactor; // ±3° (~0.05 rad)

        // Movement completes and settles calmly by p = 0.90 so camera holds still during final insight
        const effectiveP = Math.min(1.0, p / 0.90);
        const yaw = Math.sin(effectiveP * Math.PI * 1.5) * maxYaw;
        const pitch = Math.sin(effectiveP * Math.PI * 2.0) * maxPitch;
        const dolly = Math.sin(effectiveP * Math.PI) * (isMobile ? 0.15 : 0.28);
        const dist = restZ - dolly;

        camTargetX = dist * Math.sin(yaw) * Math.cos(pitch);
        camTargetY = dist * Math.sin(pitch);
        camTargetZ = dist * Math.cos(yaw) * Math.cos(pitch);

        lookTargetX = 0;
        lookTargetY = 0;
        lookTargetZ = 0;
        parallaxFactor = isMobile ? 0.0 : 0.35;
      }
    }

    // Pointer parallax (active during Phase 1, smoothly fading out during Phase 2)
    const pointerX = pointer.x * (isMobile ? 0.06 : 0.12) * parallaxFactor;
    const pointerY = pointer.y * (isMobile ? 0.04 : 0.08) * parallaxFactor;

    const lerpSpeed = Math.min(1, delta * 4.5);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      camTargetX + pointerX,
      lerpSpeed
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      camTargetY + pointerY,
      lerpSpeed
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      camTargetZ,
      lerpSpeed
    );

    currentLookAt.current.x = THREE.MathUtils.lerp(
      currentLookAt.current.x,
      lookTargetX,
      lerpSpeed
    );
    currentLookAt.current.y = THREE.MathUtils.lerp(
      currentLookAt.current.y,
      lookTargetY,
      lerpSpeed
    );
    currentLookAt.current.z = THREE.MathUtils.lerp(
      currentLookAt.current.z,
      lookTargetZ,
      lerpSpeed
    );

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
