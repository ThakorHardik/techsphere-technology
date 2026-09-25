"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TechnologySystemCameraProps {
  readonly triggerId?: string;
  readonly progress?: number;
  readonly progressRef?: React.RefObject<number>;
  readonly interactive?: boolean;
  readonly reducedMotion?: boolean;
  readonly isMobile?: boolean;
  readonly isTablet?: boolean;
  readonly onProgressUpdate?: (p: number) => void;
}

export function TechnologySystemCamera({
  triggerId,
  progress: externalProgress,
  progressRef,
  interactive = true,
  reducedMotion = false,
  isMobile = false,
  isTablet = false,
  onProgressUpdate,
}: TechnologySystemCameraProps) {
  const { camera } = useThree();
  const triggerProgressRef = useRef(0);

  // Bind ScrollTrigger ONLY if no external progressRef is provided (fallback for standalone use)
  useEffect(() => {
    if (progressRef || !triggerId || typeof window === "undefined" || reducedMotion) return;

    const selector = triggerId.startsWith("#") ? triggerId : `#${triggerId}`;
    const el = document.querySelector(selector);
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          triggerProgressRef.current = self.progress;
          if (onProgressUpdate) {
            onProgressUpdate(self.progress);
          }
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [triggerId, progressRef, reducedMotion, onProgressUpdate]);



  // 1. Stage 1: Exact Hero Dot 80 Anchor (p = 0.00 – 0.28)
  // Calibrated so Node 01 projects to EXACT Dot 80 screen coordinates (50.00%, 54.45%)
  const handoffPos = isMobile
    ? new THREE.Vector3(-0.30, -0.2266, 4.60)
    : isTablet
    ? new THREE.Vector3(-0.30, -0.2266, 4.20)
    : new THREE.Vector3(-0.30, -0.2266, 3.70);

  const handoffLook = isMobile
    ? new THREE.Vector3(-0.30, -0.2266, 1.30)
    : isTablet
    ? new THREE.Vector3(-0.30, -0.2266, 1.30)
    : new THREE.Vector3(-0.30, -0.2266, 1.30);

  // 2. Stage 2: Corridor Reveal & Establishing Shot (p = 0.35 – 0.42)
  // Dedicated mobile framing transitions calmly from portal handoff into lower visual stage
  const openingPos = isMobile
    ? new THREE.Vector3(-0.40, -0.235, 4.32)
    : isTablet
    ? new THREE.Vector3(-0.35, -0.32, 3.80)
    : new THREE.Vector3(-0.40, -0.22, 3.12);

  const openingLook = isMobile
    ? new THREE.Vector3(-0.34, -0.14, 1.30)
    : isTablet
    ? new THREE.Vector3(-0.50, -0.08, 0.35)
    : new THREE.Vector3(-0.75, 0.02, 0.32);

  // 3. Stage 3: Mid-flight waypoint along corridor (p ~ 0.60)
  const midPos = isMobile
    ? new THREE.Vector3(-0.47, -0.24, 4.12)
    : isTablet
    ? new THREE.Vector3(-0.46, -0.38, 3.30)
    : new THREE.Vector3(-0.55, -0.34, 2.75);

  const midLook = isMobile
    ? new THREE.Vector3(-0.37, -0.08, 1.30)
    : isTablet
    ? new THREE.Vector3(-0.47, -0.15, 0.42)
    : new THREE.Vector3(-0.72, -0.10, 0.42);

  // 4. Stage 4: Final Arrival State at Node 01 (p = 0.85 – 1.00)
  // Mobile: Active Node 01 at X ~63%, Y ~66%, apparent diameter ~82px
  const arrivalPos = isMobile
    ? new THREE.Vector3(-0.58, -0.25, 3.80)
    : isTablet
    ? new THREE.Vector3(-0.58, -0.45, 2.90)
    : new THREE.Vector3(-0.70, -0.45, 2.45);

  const arrivalLook = isMobile
    ? new THREE.Vector3(-0.42, 0.02, 1.30)
    : isTablet
    ? new THREE.Vector3(-0.44, -0.22, 0.50)
    : new THREE.Vector3(-0.70, -0.22, 0.50);

  // 5. Stage 5: Node 01 -> Node 02 Waypoint & Final Arrival State (p = 1.00 – 2.00)
  // Mobile: Active Node 02 at X ~63%, Y ~66%, apparent diameter ~82px
  const midPosNode02 = isMobile
    ? new THREE.Vector3(-0.79, -0.17, 3.59)
    : isTablet
    ? new THREE.Vector3(-0.75, -0.42, 2.55)
    : new THREE.Vector3(-0.80, -0.42, 2.25);

  const midLookNode02 = isMobile
    ? new THREE.Vector3(-0.63, 0.08, 1.09)
    : isTablet
    ? new THREE.Vector3(-0.58, -0.16, 0.28)
    : new THREE.Vector3(-0.68, -0.15, 0.25);

  const arrivalPosNode02 = isMobile
    ? new THREE.Vector3(-1.00, -0.13, 3.38)
    : isTablet
    ? new THREE.Vector3(-0.78, -0.20, 2.40)
    : new THREE.Vector3(-0.83, -0.18, 2.20);

  const arrivalLookNode02 = isMobile
    ? new THREE.Vector3(-0.84, 0.14, 0.88)
    : isTablet
    ? new THREE.Vector3(-1.02, -0.18, 0.25)
    : new THREE.Vector3(-1.10, -0.18, 0.20);

  // 6. Stage 6: Node 02 -> Node 03 Waypoint & Final Arrival State (p = 2.00 – 3.00)
  // Mobile: Active Node 03 at X ~63%, Y ~66%, apparent diameter ~82px
  const midPosNode03 = isMobile
    ? new THREE.Vector3(-0.94, -0.04, 3.17)
    : isTablet
    ? new THREE.Vector3(-0.78, -0.09, 2.25)
    : new THREE.Vector3(-0.825, -0.05, 1.91);

  const midLookNode03 = isMobile
    ? new THREE.Vector3(-0.78, 0.21, 0.67)
    : isTablet
    ? new THREE.Vector3(-0.89, -0.13, 0.15)
    : new THREE.Vector3(-1.01, -0.12, 0.09);

  const arrivalPosNode03 = isMobile
    ? new THREE.Vector3(-0.88, 0.01, 2.96)
    : isTablet
    ? new THREE.Vector3(-0.78, 0.02, 2.10)
    : new THREE.Vector3(-0.82, 0.08, 1.62);

  const arrivalLookNode03 = isMobile
    ? new THREE.Vector3(-0.72, 0.28, 0.46)
    : isTablet
    ? new THREE.Vector3(-0.76, -0.08, 0.05)
    : new THREE.Vector3(-0.92, -0.07, -0.02);

  // 7. Stage 7: Node 03 -> Node 04 Waypoint & Final Arrival State (p = 3.00 – 4.00)
  // Mobile: Active Node 04 at X ~63%, Y ~66%, apparent diameter ~82px
  const midPosNode04 = isMobile
    ? new THREE.Vector3(-0.67, 0.10, 2.75)
    : isTablet
    ? new THREE.Vector3(-0.76, 0.13, 1.90)
    : new THREE.Vector3(-0.80, 0.20, 1.42);

  const midLookNode04 = isMobile
    ? new THREE.Vector3(-0.51, 0.35, 0.25)
    : isTablet
    ? new THREE.Vector3(-0.60, 0.00, 0.02)
    : new THREE.Vector3(-0.70, 0.02, -0.03);

  const arrivalPosNode04 = isMobile
    ? new THREE.Vector3(-0.46, 0.15, 2.54)
    : isTablet
    ? new THREE.Vector3(-0.75, 0.24, 1.70)
    : new THREE.Vector3(-0.80, 0.30, 1.25);

  const arrivalLookNode04 = isMobile
    ? new THREE.Vector3(-0.30, 0.42, 0.04)
    : isTablet
    ? new THREE.Vector3(-0.46, 0.06, 0.00)
    : new THREE.Vector3(-0.52, 0.09, -0.04);

  // 8. Stage 8: Node 04 -> Node 05 Waypoint & Final Arrival State (p = 4.00 – 5.00)
  // Mobile: Active Node 05 at X ~63%, Y ~66%, apparent diameter ~82px
  const midPosNode05 = isMobile
    ? new THREE.Vector3(-0.23, 0.25, 2.33)
    : isTablet
    ? new THREE.Vector3(-0.50, 0.34, 1.45)
    : new THREE.Vector3(-0.55, 0.38, 1.05);

  const midLookNode05 = isMobile
    ? new THREE.Vector3(-0.07, 0.50, -0.17)
    : isTablet
    ? new THREE.Vector3(-0.24, 0.14, -0.15)
    : new THREE.Vector3(-0.28, 0.17, -0.23);

  const arrivalPosNode05 = isMobile
    ? new THREE.Vector3(0.00, 0.31, 2.12)
    : isTablet
    ? new THREE.Vector3(-0.26, 0.40, 1.25)
    : new THREE.Vector3(-0.30, 0.46, 0.85);

  const arrivalLookNode05 = isMobile
    ? new THREE.Vector3(0.16, 0.58, -0.38)
    : isTablet
    ? new THREE.Vector3(-0.02, 0.22, -0.32)
    : new THREE.Vector3(-0.05, 0.26, -0.42);

  // 9. Stage 9: Node 05 -> Node 06 Waypoint & Final Arrival State (p = 5.00 – 6.00)
  // Mobile: Active Node 06 at X ~63%, Y ~66%, apparent diameter ~82px
  const midPosNode06 = isMobile
    ? new THREE.Vector3(0.20, 0.42, 1.91)
    : isTablet
    ? new THREE.Vector3(-0.06, 0.56, 1.18)
    : new THREE.Vector3(-0.10, 0.62, 0.78);

  const midLookNode06 = isMobile
    ? new THREE.Vector3(0.36, 0.67, -0.59)
    : isTablet
    ? new THREE.Vector3(0.10, 0.30, -0.56)
    : new THREE.Vector3(0.12, 0.34, -0.66);

  const arrivalPosNode06 = isMobile
    ? new THREE.Vector3(0.40, 0.49, 1.70)
    : isTablet
    ? new THREE.Vector3(0.18, 0.72, 1.10)
    : new THREE.Vector3(0.14, 0.79, 0.70);

  const arrivalLookNode06 = isMobile
    ? new THREE.Vector3(0.56, 0.76, -0.80)
    : isTablet
    ? new THREE.Vector3(0.26, 0.38, -0.80)
    : new THREE.Vector3(0.30, 0.42, -0.90);

  // 10. Stage 10: Node 06 -> Node 07 Waypoint & Final Arrival State (p = 6.00 – 7.00)
  // Mobile: Active Node 07 at X ~63%, Y ~66%, apparent diameter ~82px
  const midPosNode07 = isMobile
    ? new THREE.Vector3(0.27, 0.62, 1.48)
    : isTablet
    ? new THREE.Vector3(0.26, 0.92, 0.98)
    : new THREE.Vector3(0.34, 0.98, 0.62);

  const midLookNode07 = isMobile
    ? new THREE.Vector3(0.43, 0.87, -1.02)
    : isTablet
    ? new THREE.Vector3(0.18, 0.44, -1.05)
    : new THREE.Vector3(0.12, 0.48, -1.15);

  const arrivalPosNode07 = isMobile
    ? new THREE.Vector3(0.14, 0.71, 1.25)
    : isTablet
    ? new THREE.Vector3(0.38, 1.15, 0.90)
    : new THREE.Vector3(0.58, 1.23, 0.50);

  const arrivalLookNode07 = isMobile
    ? new THREE.Vector3(0.30, 0.98, -1.25)
    : isTablet
    ? new THREE.Vector3(0.12, 0.50, -1.35)
    : new THREE.Vector3(-0.05, 0.55, -1.40);

  // 11. Stage 11: Node 07 -> Node 08 Waypoint & Final Arrival State (p = 7.00 – 8.00)
  // Mobile: Active Node 08 at X ~63%, Y ~66%, apparent diameter ~82px
  const midPosNode08 = isMobile
    ? new THREE.Vector3(-0.03, 0.85, 1.02)
    : isTablet
    ? new THREE.Vector3(0.38, 1.20, 0.55)
    : new THREE.Vector3(0.48, 1.28, 0.20);

  const midLookNode08 = isMobile
    ? new THREE.Vector3(0.13, 1.10, -1.48)
    : isTablet
    ? new THREE.Vector3(-0.15, 0.62, -1.55)
    : new THREE.Vector3(-0.22, 0.68, -1.65);

  const arrivalPosNode08 = isMobile
    ? new THREE.Vector3(-0.20, 0.95, 0.80)
    : isTablet
    ? new THREE.Vector3(0.30, 1.22, 0.30)
    : new THREE.Vector3(0.40, 1.30, -0.10);

  const arrivalLookNode08 = isMobile
    ? new THREE.Vector3(-0.04, 1.22, -1.70)
    : isTablet
    ? new THREE.Vector3(-0.25, 0.72, -1.80)
    : new THREE.Vector3(-0.40, 0.80, -1.90);

  // 12. Stage 12: Phase 2 Final Complete System Overview (p = 8.00 – 9.00)
  // Mobile: Dedicated complete 8-node system visualization in lower half stage (all 8 nodes visible)
  const systemOverviewPos = isMobile
    ? new THREE.Vector3(0.00, 1.25, 5.40)
    : isTablet
    ? new THREE.Vector3(0.25, 0.85, 4.60)
    : new THREE.Vector3(0.40, 0.75, 4.00);

  const systemOverviewLook = isMobile
    ? new THREE.Vector3(0.00, 1.10, -0.20)
    : isTablet
    ? new THREE.Vector3(-0.40, 0.22, -0.10)
    : new THREE.Vector3(-0.55, 0.18, -0.10);

  // 13. Stage 13: Section 03 Industries Phase A — Continuous Architectural Film (p = 9.00 – 10.00)
  // Phase 1 (p = 9.00 - 9.12): Approach Node 08 naturally as it transforms into an architectural marker
  const camPosApproachNode08 = isMobile
    ? new THREE.Vector3(0.00, 1.15, 3.80)
    : isTablet
    ? new THREE.Vector3(0.10, 0.90, 3.10)
    : new THREE.Vector3(0.15, 0.88, 2.60);

  const camLookApproachNode08 = isMobile
    ? new THREE.Vector3(-0.04, 0.95, -1.70)
    : isTablet
    ? new THREE.Vector3(-0.04, 0.90, -1.70)
    : new THREE.Vector3(-0.04, 0.90, -1.70);

  // Phase 2 (p = 9.12 - 9.28): Enter property & descend toward foundation plinth
  const camPosFoundation = isMobile
    ? new THREE.Vector3(1.20, -0.65, 4.20)
    : isTablet
    ? new THREE.Vector3(-0.45, 0.32, 3.40)
    : new THREE.Vector3(-0.65, 0.22, 2.95);

  const camLookFoundation = isMobile
    ? new THREE.Vector3(1.35, 0.80, -2.60)
    : isTablet
    ? new THREE.Vector3(0.55, -0.10, -2.60)
    : new THREE.Vector3(0.45, -0.15, -2.60);

  // Phase 5 (p >= 9.75): Final Real Estate 3/4 elevated perspective
  // Calibrated so left 42% of viewport is 100% clean typography safe zone and building is anchored in right 58% (X: 46% - 96%)
  const industriesBridgePos = isMobile
    ? new THREE.Vector3(1.55, -1.10, 4.60)
    : isTablet
    ? new THREE.Vector3(-0.65, 0.62, 3.80)
    : new THREE.Vector3(-1.15, 0.60, 3.60);

  const industriesBridgeLook = isMobile
    ? new THREE.Vector3(1.55, 2.25, -2.85)
    : isTablet
    ? new THREE.Vector3(0.60, 0.20, -2.85)
    : new THREE.Vector3(0.20, 0.15, -2.85);

  useFrame((state) => {
    if (reducedMotion || !interactive) {
      camera.position.copy(systemOverviewPos);
      camera.lookAt(systemOverviewLook);
      return;
    }

    // Determine current deterministic progress:
    // When progressRef is provided, it is the primary high-performance source (zero React re-renders)
    const rawP = progressRef
      ? progressRef.current
      : typeof externalProgress === "number"
      ? externalProgress
      : triggerProgressRef.current;
    const p = Math.max(0, Math.min(10, rawP));

    // Story-Driven Camera Timeline:
    // [0.00–1.00] Node 01 Segment:
    // - 0.00–0.28: EXACT Hero Dot 80 anchor & Node 01 formation hold
    // - 0.28–0.40: Corridor reveal — smooth glide into establishing corridor shot
    // - 0.40–0.85: Main physical 3D flight along corridor toward Node 01
    // - 0.85–1.00: Stable arrival hold at Node 01 landmark
    // [1.00–2.00] Node 02 Segment (t = p - 1.00):
    // - 0.00–0.10: Node 01 release hold
    // - 0.10–0.85: Continuous 3D flight along corridor to Node 02
    // - 0.85–1.00: Stable arrival hold at Node 02 landmark
    // [2.00–3.00] Node 03 Segment (t = p - 2.00):
    // - 0.00–0.10: Node 02 release hold
    // - 0.10–0.85: Continuous 3D physical flight along corridor to Node 03
    // - 0.85–1.00: Stable arrival hold at Node 03 landmark
    // [3.00–4.00] Node 04 Segment (t = p - 3.00):
    // - 0.00–0.10: Node 03 release hold
    // - 0.10–0.85: Continuous 3D physical flight along corridor to Node 04
    // - 0.85–1.00: Stable arrival hold at Node 04 landmark
    // [4.00–5.00] Node 05 Segment (t = p - 4.00):
    // - 0.00–0.10: Node 04 release hold
    // - 0.10–0.85: Continuous 3D physical flight along corridor to Node 05
    // - 0.85–1.00: Stable arrival hold at Node 05 landmark
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (p <= 1.0) {
      if (p <= 0.28) {
        targetPos.copy(handoffPos);
        targetLook.copy(handoffLook);
      } else if (p < 0.40) {
        const t = (p - 0.28) / (0.40 - 0.28);
        const ease = t * t * (3 - 2 * t); // smoothstep
        targetPos.lerpVectors(handoffPos, openingPos, ease);
        targetLook.lerpVectors(handoffLook, openingLook, ease);
      } else if (p < 0.85) {
        const t = (p - 0.40) / (0.85 - 0.40);
        const oneMinusT = 1 - t;
        targetPos.set(
          oneMinusT * oneMinusT * openingPos.x + 2 * oneMinusT * t * midPos.x + t * t * arrivalPos.x,
          oneMinusT * oneMinusT * openingPos.y + 2 * oneMinusT * t * midPos.y + t * t * arrivalPos.y,
          oneMinusT * oneMinusT * openingPos.z + 2 * oneMinusT * t * midPos.z + t * t * arrivalPos.z
        );
        targetLook.set(
          oneMinusT * oneMinusT * openingLook.x + 2 * oneMinusT * t * midLook.x + t * t * arrivalLook.x,
          oneMinusT * oneMinusT * openingLook.y + 2 * oneMinusT * t * midLook.y + t * t * arrivalLook.y,
          oneMinusT * oneMinusT * openingLook.z + 2 * oneMinusT * t * midLook.z + t * t * arrivalLook.z
        );
      } else {
        targetPos.copy(arrivalPos);
        targetLook.copy(arrivalLook);
      }
    } else if (p <= 2.0) {
      // Node 02 Journey (t = p - 1.0 in [0.0, 1.0])
      const t = p - 1.0;
      if (t <= 0.10) {
        targetPos.copy(arrivalPos);
        targetLook.copy(arrivalLook);
      } else if (t < 0.85) {
        const flightT = (t - 0.10) / (0.85 - 0.10);
        const ease = flightT * flightT * (3 - 2 * flightT); // smoothstep acceleration & deceleration
        const oneMinusE = 1 - ease;
        targetPos.set(
          oneMinusE * oneMinusE * arrivalPos.x + 2 * oneMinusE * ease * midPosNode02.x + ease * ease * arrivalPosNode02.x,
          oneMinusE * oneMinusE * arrivalPos.y + 2 * oneMinusE * ease * midPosNode02.y + ease * ease * arrivalPosNode02.y,
          oneMinusE * oneMinusE * arrivalPos.z + 2 * oneMinusE * ease * midPosNode02.z + ease * ease * arrivalPosNode02.z
        );
        targetLook.set(
          oneMinusE * oneMinusE * arrivalLook.x + 2 * oneMinusE * ease * midLookNode02.x + ease * ease * arrivalLookNode02.x,
          oneMinusE * oneMinusE * arrivalLook.y + 2 * oneMinusE * ease * midLookNode02.y + ease * ease * arrivalLookNode02.y,
          oneMinusE * oneMinusE * arrivalLook.z + 2 * oneMinusE * ease * midLookNode02.z + ease * ease * arrivalLookNode02.z
        );
      } else {
        targetPos.copy(arrivalPosNode02);
        targetLook.copy(arrivalLookNode02);
      }
    } else if (p <= 3.0) {
      // Node 03 Journey (t = p - 2.0 in [0.0, 1.0])
      const t = p - 2.0;
      if (t <= 0.10) {
        targetPos.copy(arrivalPosNode02);
        targetLook.copy(arrivalLookNode02);
      } else if (t < 0.85) {
        const flightT = (t - 0.10) / (0.85 - 0.10);
        const ease = flightT * flightT * (3 - 2 * flightT); // smoothstep acceleration & deceleration
        const oneMinusE = 1 - ease;
        targetPos.set(
          oneMinusE * oneMinusE * arrivalPosNode02.x + 2 * oneMinusE * ease * midPosNode03.x + ease * ease * arrivalPosNode03.x,
          oneMinusE * oneMinusE * arrivalPosNode02.y + 2 * oneMinusE * ease * midPosNode03.y + ease * ease * arrivalPosNode03.y,
          oneMinusE * oneMinusE * arrivalPosNode02.z + 2 * oneMinusE * ease * midPosNode03.z + ease * ease * arrivalPosNode03.z
        );
        targetLook.set(
          oneMinusE * oneMinusE * arrivalLookNode02.x + 2 * oneMinusE * ease * midLookNode03.x + ease * ease * arrivalLookNode03.x,
          oneMinusE * oneMinusE * arrivalLookNode02.y + 2 * oneMinusE * ease * midLookNode03.y + ease * ease * arrivalLookNode03.y,
          oneMinusE * oneMinusE * arrivalLookNode02.z + 2 * oneMinusE * ease * midLookNode03.z + ease * ease * arrivalLookNode03.z
        );
      } else {
        targetPos.copy(arrivalPosNode03);
        targetLook.copy(arrivalLookNode03);
      }
    } else if (p <= 4.0) {
      // Node 04 Journey (t = p - 3.0 in [0.0, 1.0])
      const t = p - 3.0;
      if (t <= 0.10) {
        targetPos.copy(arrivalPosNode03);
        targetLook.copy(arrivalLookNode03);
      } else if (t < 0.85) {
        const flightT = (t - 0.10) / (0.85 - 0.10);
        const ease = flightT * flightT * (3 - 2 * flightT); // smoothstep acceleration & deceleration
        const oneMinusE = 1 - ease;
        targetPos.set(
          oneMinusE * oneMinusE * arrivalPosNode03.x + 2 * oneMinusE * ease * midPosNode04.x + ease * ease * arrivalPosNode04.x,
          oneMinusE * oneMinusE * arrivalPosNode03.y + 2 * oneMinusE * ease * midPosNode04.y + ease * ease * arrivalPosNode04.y,
          oneMinusE * oneMinusE * arrivalPosNode03.z + 2 * oneMinusE * ease * midPosNode04.z + ease * ease * arrivalPosNode04.z
        );
        targetLook.set(
          oneMinusE * oneMinusE * arrivalLookNode03.x + 2 * oneMinusE * ease * midLookNode04.x + ease * ease * arrivalLookNode04.x,
          oneMinusE * oneMinusE * arrivalLookNode03.y + 2 * oneMinusE * ease * midLookNode04.y + ease * ease * arrivalLookNode04.y,
          oneMinusE * oneMinusE * arrivalLookNode03.z + 2 * oneMinusE * ease * midLookNode04.z + ease * ease * arrivalLookNode04.z
        );
      } else {
        targetPos.copy(arrivalPosNode04);
        targetLook.copy(arrivalLookNode04);
      }
    } else if (p <= 5.0) {
      // Node 05 Journey (t = p - 4.0 in [0.0, 1.0])
      const t = p - 4.0;
      if (t <= 0.10) {
        targetPos.copy(arrivalPosNode04);
        targetLook.copy(arrivalLookNode04);
      } else if (t < 0.85) {
        const flightT = (t - 0.10) / (0.85 - 0.10);
        const ease = flightT * flightT * (3 - 2 * flightT); // smoothstep acceleration & deceleration
        const oneMinusE = 1 - ease;
        targetPos.set(
          oneMinusE * oneMinusE * arrivalPosNode04.x + 2 * oneMinusE * ease * midPosNode05.x + ease * ease * arrivalPosNode05.x,
          oneMinusE * oneMinusE * arrivalPosNode04.y + 2 * oneMinusE * ease * midPosNode05.y + ease * ease * arrivalPosNode05.y,
          oneMinusE * oneMinusE * arrivalPosNode04.z + 2 * oneMinusE * ease * midPosNode05.z + ease * ease * arrivalPosNode05.z
        );
        targetLook.set(
          oneMinusE * oneMinusE * arrivalLookNode04.x + 2 * oneMinusE * ease * midLookNode05.x + ease * ease * arrivalLookNode05.x,
          oneMinusE * oneMinusE * arrivalLookNode04.y + 2 * oneMinusE * ease * midLookNode05.y + ease * ease * arrivalLookNode05.y,
          oneMinusE * oneMinusE * arrivalLookNode04.z + 2 * oneMinusE * ease * midLookNode05.z + ease * ease * arrivalLookNode05.z
        );
      } else {
        targetPos.copy(arrivalPosNode05);
        targetLook.copy(arrivalLookNode05);
      }
    } else if (p <= 6.0) {
      // Node 06 Journey (t = p - 5.0 in [0.0, 1.0])
      const t = p - 5.0;
      if (t <= 0.10) {
        targetPos.copy(arrivalPosNode05);
        targetLook.copy(arrivalLookNode05);
      } else if (t < 0.85) {
        const flightT = (t - 0.10) / (0.85 - 0.10);
        const ease = flightT * flightT * (3 - 2 * flightT); // smoothstep acceleration & deceleration
        const oneMinusE = 1 - ease;
        targetPos.set(
          oneMinusE * oneMinusE * arrivalPosNode05.x + 2 * oneMinusE * ease * midPosNode06.x + ease * ease * arrivalPosNode06.x,
          oneMinusE * oneMinusE * arrivalPosNode05.y + 2 * oneMinusE * ease * midPosNode06.y + ease * ease * arrivalPosNode06.y,
          oneMinusE * oneMinusE * arrivalPosNode05.z + 2 * oneMinusE * ease * midPosNode06.z + ease * ease * arrivalPosNode06.z
        );
        targetLook.set(
          oneMinusE * oneMinusE * arrivalLookNode05.x + 2 * oneMinusE * ease * midLookNode06.x + ease * ease * arrivalLookNode06.x,
          oneMinusE * oneMinusE * arrivalLookNode05.y + 2 * oneMinusE * ease * midLookNode06.y + ease * ease * arrivalLookNode06.y,
          oneMinusE * oneMinusE * arrivalLookNode05.z + 2 * oneMinusE * ease * midLookNode06.z + ease * ease * arrivalLookNode06.z
        );
      } else {
        targetPos.copy(arrivalPosNode06);
        targetLook.copy(arrivalLookNode06);
      }
    } else if (p <= 7.0) {
      // Node 07 Journey (t = p - 6.0 in [0.0, 1.0])
      const t = p - 6.0;
      if (t <= 0.10) {
        targetPos.copy(arrivalPosNode06);
        targetLook.copy(arrivalLookNode06);
      } else if (t < 0.85) {
        const flightT = (t - 0.10) / (0.85 - 0.10);
        const ease = flightT * flightT * (3 - 2 * flightT); // smoothstep acceleration & deceleration
        const oneMinusE = 1 - ease;
        targetPos.set(
          oneMinusE * oneMinusE * arrivalPosNode06.x + 2 * oneMinusE * ease * midPosNode07.x + ease * ease * arrivalPosNode07.x,
          oneMinusE * oneMinusE * arrivalPosNode06.y + 2 * oneMinusE * ease * midPosNode07.y + ease * ease * arrivalPosNode07.y,
          oneMinusE * oneMinusE * arrivalPosNode06.z + 2 * oneMinusE * ease * midPosNode07.z + ease * ease * arrivalPosNode07.z
        );
        targetLook.set(
          oneMinusE * oneMinusE * arrivalLookNode06.x + 2 * oneMinusE * ease * midLookNode07.x + ease * ease * arrivalLookNode07.x,
          oneMinusE * oneMinusE * arrivalLookNode06.y + 2 * oneMinusE * ease * midLookNode07.y + ease * ease * arrivalLookNode07.y,
          oneMinusE * oneMinusE * arrivalLookNode06.z + 2 * oneMinusE * ease * midLookNode07.z + ease * ease * arrivalLookNode07.z
        );
      } else {
        targetPos.copy(arrivalPosNode07);
        targetLook.copy(arrivalLookNode07);
      }
    } else if (p <= 8.0) {
      // Node 08 Journey (t = p - 7.0 in [0.0, 1.0])
      const t = p - 7.0;
      if (t <= 0.10) {
        targetPos.copy(arrivalPosNode07);
        targetLook.copy(arrivalLookNode07);
      } else if (t < 0.85) {
        const flightT = (t - 0.10) / (0.85 - 0.10);
        const ease = flightT * flightT * (3 - 2 * flightT); // smoothstep acceleration & deceleration
        const oneMinusE = 1 - ease;
        targetPos.set(
          oneMinusE * oneMinusE * arrivalPosNode07.x + 2 * oneMinusE * ease * midPosNode08.x + ease * ease * arrivalPosNode08.x,
          oneMinusE * oneMinusE * arrivalPosNode07.y + 2 * oneMinusE * ease * midPosNode08.y + ease * ease * arrivalPosNode08.y,
          oneMinusE * oneMinusE * arrivalPosNode07.z + 2 * oneMinusE * ease * midPosNode08.z + ease * ease * arrivalPosNode08.z
        );
        targetLook.set(
          oneMinusE * oneMinusE * arrivalLookNode07.x + 2 * oneMinusE * ease * midLookNode08.x + ease * ease * arrivalLookNode08.x,
          oneMinusE * oneMinusE * arrivalLookNode07.y + 2 * oneMinusE * ease * midLookNode08.y + ease * ease * arrivalLookNode08.y,
          oneMinusE * oneMinusE * arrivalLookNode07.z + 2 * oneMinusE * ease * midLookNode08.z + ease * ease * arrivalLookNode08.z
        );
      } else {
        targetPos.copy(arrivalPosNode08);
        targetLook.copy(arrivalLookNode08);
      }
    } else if (p <= 9.0) {
      // Phase 2: Final Complete System Pull-Back (p in [8.00, 9.00])
      const t = p - 8.0;
      if (t <= 0.15) {
        // 0.00–0.15 (p in [8.00, 8.15]): Complete reading hold & realization at Node 08 terminus
        targetPos.copy(arrivalPosNode08);
        targetLook.copy(arrivalLookNode08);
      } else if (t < 0.85) {
        // 0.15–0.85 (p in [8.15, 8.85]): Physical camera retreat revealing full 8-node system
        const retreatT = (t - 0.15) / (0.85 - 0.15);
        const ease = retreatT * retreatT * (3 - 2 * retreatT);
        targetPos.lerpVectors(arrivalPosNode08, systemOverviewPos, ease);
        targetLook.lerpVectors(arrivalLookNode08, systemOverviewLook, ease);
      } else {
        // 0.85–1.00 (p in [8.85, 9.00]): Complete 8-node system final hold
        targetPos.copy(systemOverviewPos);
        targetLook.copy(systemOverviewLook);
      }
    } else {
      // Stage 13: Section 03 Industries Phase A — Continuous Architectural Film (p in [9.00, 10.00])
      // Phase 1 (p in [9.00, 9.12]): Approach Node 08 naturally as it transforms into property marker
      // Phase 2 (p in [9.12, 9.28]): Move toward building site & descend toward foundation plinth
      // Phase 3 & 4 (p in [9.28, 9.75]): Travel forward through construction, rise with building height
      // Phase 5 (p in [9.75, 10.00]): Settle into final 3/4 elevated perspective with rock-solid reading hold
      const t = p - 9.0;
      if (t <= 0.12) {
        // Phase 1: Natural approach toward Node 08
        const u = t / 0.12;
        const ease = u * u * (3 - 2 * u);
        targetPos.lerpVectors(systemOverviewPos, camPosApproachNode08, ease);
        targetLook.lerpVectors(systemOverviewLook, camLookApproachNode08, ease);
      } else if (t < 0.28) {
        // Phase 2: Enter property & descend toward foundation plinth
        const u = (t - 0.12) / (0.28 - 0.12);
        const ease = u * u * (3 - 2 * u);
        targetPos.lerpVectors(camPosApproachNode08, camPosFoundation, ease);
        targetLook.lerpVectors(camLookApproachNode08, camLookFoundation, ease);
      } else if (t < 0.75) {
        // Phase 3 & 4: Travel through construction & rise as building gains height
        const u = (t - 0.28) / (0.75 - 0.28);
        const ease = u * u * (3 - 2 * u);
        targetPos.lerpVectors(camPosFoundation, industriesBridgePos, ease);
        targetPos.y += 0.08 * Math.sin(ease * Math.PI); // subtle architectural rise tracking building growth
        targetLook.lerpVectors(camLookFoundation, industriesBridgeLook, ease);
      } else {
        // Phase 5: Rock-solid settle into final Real Estate editorial framing
        targetPos.copy(industriesBridgePos);
        targetLook.copy(industriesBridgeLook);
      }
    }

    // Subtle Ambient Motion at p = 0 only (fades out completely once scroll begins)
    const ambientFade = Math.max(0, 1 - p / 0.05);
    if (ambientFade > 0.001) {
      const elapsed = state.clock.getElapsedTime();
      // Tiny depth drift and vertical breathing
      const driftY = Math.sin(elapsed * 0.75) * 0.010 * ambientFade;
      const driftZ = Math.cos(elapsed * 0.60) * 0.012 * ambientFade;
      // Very restrained pointer parallax
      const pointerX = state.pointer.x * 0.020 * ambientFade;
      const pointerY = state.pointer.y * 0.012 * ambientFade;

      targetPos.x += pointerX;
      targetPos.y += driftY + pointerY;
      targetPos.z += driftZ;

      targetLook.x += pointerX * 0.5;
      targetLook.y += driftY * 0.5 + pointerY * 0.5;
    }

    camera.position.copy(targetPos);
    camera.lookAt(targetLook);
    if (typeof window !== "undefined") {
      (window as unknown as { __techCamera?: unknown }).__techCamera = {
        pos: [camera.position.x, camera.position.y, camera.position.z],
        look: [targetLook.x, targetLook.y, targetLook.z]
      };
    }
  });

  return null;
}
