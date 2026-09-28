"use client";

import * as React from "react";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  TechnologySystemTheme,
  TECH_SYSTEM_PALETTE,
  SYSTEM_NODE_COORDINATES,
  createSystemPathCurve,
} from "./technology-system-types";

interface TechnologySystemNodesProps {
  readonly theme?: TechnologySystemTheme;
  readonly activeNode?: number | null;
  readonly progress?: number;
  readonly progressRef?: React.RefObject<number>;
}

interface SingleNodeProps {
  readonly id: string;
  readonly index: number;
  readonly position: [number, number, number];
  readonly tangent: THREE.Vector3;
  readonly isActive: boolean;
  readonly hasActiveSelection: boolean;
  readonly isDark: boolean;
  readonly isStart: boolean;
  readonly isEnd: boolean;
  readonly progress?: number;
  readonly progressRef?: React.RefObject<number>;
}

const colorWhite = new THREE.Color(TECH_SYSTEM_PALETTE.white);
const colorSoftCream = new THREE.Color(TECH_SYSTEM_PALETTE.softCream);
const colorDeepBrown = new THREE.Color(TECH_SYSTEM_PALETTE.deepBrown);
const colorTechBrown = new THREE.Color(TECH_SYSTEM_PALETTE.techBrown);
const colorAccentWarm = new THREE.Color(TECH_SYSTEM_PALETTE.accentWarm);

/**
 * Single Architectural Capability Node
 * 
 * A refined 3D faceted geometric bead (beveled icosahedron with flat shading).
 * Pure geometric landmark without hardware, clamps, brackets, or gimbal rings.
 * 
 * Hierarchy:
 * - Active node: expands to 1.50x with warm accent nucleus (#B88E68) and high contrast.
 * - Inactive nodes: gently recede (opacity 0.60, scale 0.92) when another node is selected.
 * - Overview (all): all nodes stand at balanced 1.0x scale and full opacity.
 */
function SystemNodeItem({
  id,
  index,
  position,
  tangent,
  isActive,
  hasActiveSelection,
  isDark,
  isStart,
  progress,
  progressRef,
}: SingleNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const beadMeshRef = useRef<THREE.Mesh>(null);
  const nucleusMeshRef = useRef<THREE.Mesh>(null);
  const beadMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const nucleusMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Compute orientation aligned with the path tangent
  const rotationQuaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4();
    m.lookAt(new THREE.Vector3(0, 0, 0), tangent, up);
    q.setFromRotationMatrix(m);
    return q;
  }, [tangent]);

  // Dynamic progress-driven or interactive selection scale & material transition
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    const isProgressDriven = progressRef !== undefined || typeof progress === "number";
    const p = progressRef ? progressRef.current : typeof progress === "number" ? progress : 0;

    let isThisActive = false;

    if (isProgressDriven) {
      if (index === 0) {
        // Node 01: Hero Dot 80 anchor (100% opacity) -> Refined Formation -> Corridor -> Arrival
        isThisActive = true;

        let currentScale = 0.85;
        let currentRoughness = 0.28;
        let currentMetalness = 0.22;

        if (p <= 1.0) {
          if (p <= 0.10) {
            // 0.00–0.10: Dot -> Node 01 formation
            // Starts at exact Dot 80 visual scale (0.85x) and deep brown color (#1F1915)
            // Dot grows slightly (0.85 -> 1.05) as shell constructs around it and nucleus warms
            const formT = p / 0.10;
            currentScale = THREE.MathUtils.lerp(0.85, 1.05, formT);
            currentRoughness = THREE.MathUtils.lerp(0.28, 0.22, formT);
            currentMetalness = THREE.MathUtils.lerp(0.20, 0.30, formT);

            if (beadMatRef.current && nucleusMatRef.current) {
              beadMatRef.current.opacity = 1.0;
              beadMatRef.current.color.copy(isDark ? colorWhite : colorDeepBrown);
              beadMatRef.current.roughness = currentRoughness;
              beadMatRef.current.metalness = currentMetalness;

              nucleusMatRef.current.opacity = 1.0;
              nucleusMatRef.current.color.copy(colorDeepBrown).lerp(colorAccentWarm, formT);
              nucleusMatRef.current.roughness = 0.16;
              nucleusMatRef.current.metalness = 0.40;
            }
          } else if (p <= 0.16) {
            // 0.10–0.16: Node 01 faceted form completes (1.05 -> 1.18)
            const resolveT = (p - 0.10) / (0.16 - 0.10);
            currentScale = THREE.MathUtils.lerp(1.05, 1.18, resolveT);
            currentRoughness = THREE.MathUtils.lerp(0.22, 0.18, resolveT);
            currentMetalness = THREE.MathUtils.lerp(0.30, 0.35, resolveT);

            if (beadMatRef.current && nucleusMatRef.current) {
              beadMatRef.current.opacity = 1.0;
              beadMatRef.current.color.copy(isDark ? colorWhite : colorDeepBrown);
              beadMatRef.current.roughness = currentRoughness;
              beadMatRef.current.metalness = currentMetalness;

              nucleusMatRef.current.opacity = 1.0;
              nucleusMatRef.current.color.copy(colorAccentWarm);
            }
          } else if (p <= 0.40) {
            // 0.16–0.40: Path seeds, system emerges, camera begins moving (Node 01 holds stable at 1.18x)
            currentScale = 1.18;

            if (beadMatRef.current && nucleusMatRef.current) {
              beadMatRef.current.opacity = 1.0;
              beadMatRef.current.color.copy(isDark ? colorWhite : colorDeepBrown);
              beadMatRef.current.roughness = 0.18;
              beadMatRef.current.metalness = 0.35;

              nucleusMatRef.current.opacity = 1.0;
              nucleusMatRef.current.color.copy(colorAccentWarm);
            }
          } else {
            // 0.40–0.85: Forward travel along corridor to arrival (1.18 -> 1.30)
            const travelT = Math.min(1.0, (p - 0.40) / (0.85 - 0.40));
            currentScale = THREE.MathUtils.lerp(1.18, 1.30, travelT);

            if (beadMatRef.current && nucleusMatRef.current) {
              beadMatRef.current.opacity = 1.0;
              beadMatRef.current.color.copy(isDark ? colorWhite : colorDeepBrown);
              beadMatRef.current.roughness = 0.18;
              beadMatRef.current.metalness = 0.35;

              nucleusMatRef.current.opacity = 1.0;
              nucleusMatRef.current.color.copy(colorAccentWarm);
            }
          }
        } else {
          // p in [1.00, 2.00]: Node 01 recedes into perspective as camera travels toward Node 02
          const t = Math.min(1.0, p - 1.0);
          const releaseT = Math.min(1.0, t / 0.25);
          currentScale = THREE.MathUtils.lerp(1.30, 1.00, releaseT);
          currentRoughness = THREE.MathUtils.lerp(0.18, 0.28, releaseT);
          currentMetalness = THREE.MathUtils.lerp(0.35, 0.22, releaseT);

          if (beadMatRef.current && nucleusMatRef.current) {
            beadMatRef.current.opacity = 1.0;
            beadMatRef.current.color.copy(isDark ? colorWhite : colorDeepBrown);
            beadMatRef.current.roughness = currentRoughness;
            beadMatRef.current.metalness = currentMetalness;

            nucleusMatRef.current.opacity = 1.0;
            nucleusMatRef.current.color.copy(colorAccentWarm).lerp(colorDeepBrown, releaseT);
            nucleusMatRef.current.roughness = 0.16;
            nucleusMatRef.current.metalness = 0.40;
          }
        }

        if (p > 8.15) {
          const retreatT = Math.min(1.0, (p - 8.15) / (0.85 - 0.15));
          const ease = retreatT * retreatT * (3 - 2 * retreatT);
          currentScale = THREE.MathUtils.lerp(currentScale, 1.00, ease);
        }

        beadMeshRef.current?.scale.set(currentScale, currentScale, currentScale);
        nucleusMeshRef.current?.scale.set(1.0, 1.0, 1.0);
      } else if (index === 1) {
        // Node 02: Destination for Phase 2
        let targetOpacity = 0.14;
        let targetScale = 0.78;
        let currentRoughness = 0.28;
        let currentMetalness = 0.22;
        let nucleusWarmT = 0.0;

        if (p <= 1.0) {
          if (p <= 0.16) {
            targetOpacity = 0.14;
            targetScale = 0.78;
          } else if (p <= 0.22) {
            const seedT = (p - 0.16) / (0.22 - 0.16);
            targetOpacity = THREE.MathUtils.lerp(0.14, 0.22, seedT);
            targetScale = THREE.MathUtils.lerp(0.78, 0.80, seedT);
          } else if (p <= 0.28) {
            const reachT = (p - 0.22) / (0.28 - 0.22);
            targetOpacity = THREE.MathUtils.lerp(0.22, 0.42, reachT);
            targetScale = THREE.MathUtils.lerp(0.80, 0.84, reachT);
          } else if (p <= 0.40) {
            const revealT = (p - 0.28) / (0.40 - 0.28);
            targetOpacity = THREE.MathUtils.lerp(0.42, 0.68, revealT);
            targetScale = THREE.MathUtils.lerp(0.84, 0.88, revealT);
          } else {
            const recedeP = Math.min(1.0, (p - 0.40) / (0.85 - 0.40));
            targetOpacity = THREE.MathUtils.lerp(0.68, 0.55, recedeP);
            targetScale = THREE.MathUtils.lerp(0.88, 0.82, recedeP);
          }
        } else if (p <= 2.0) {
          // p in [1.00, 2.00]: Node 02 becomes the dominant destination and arrives
          const t = Math.min(1.0, p - 1.0);
          if (t <= 0.65) {
            const travelT = t / 0.65;
            targetScale = THREE.MathUtils.lerp(0.82, 0.92, travelT);
            targetOpacity = THREE.MathUtils.lerp(0.55, 0.75, travelT);
            currentRoughness = THREE.MathUtils.lerp(0.28, 0.50, travelT);
            currentMetalness = THREE.MathUtils.lerp(0.22, 0.08, travelT);
          } else if (t <= 0.85) {
            const approachT = (t - 0.65) / (0.85 - 0.65);
            targetScale = THREE.MathUtils.lerp(0.92, 1.12, approachT);
            targetOpacity = THREE.MathUtils.lerp(0.75, 1.0, approachT);
            currentRoughness = THREE.MathUtils.lerp(0.50, 0.55, approachT);
            currentMetalness = THREE.MathUtils.lerp(0.08, 0.05, approachT);
            nucleusWarmT = approachT;
          } else {
            const settleT = (t - 0.85) / (1.0 - 0.85);
            targetScale = THREE.MathUtils.lerp(1.12, 1.20, settleT);
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          }
        } else {
          // p in [2.00, 3.00]: Node 02 gracefully recedes into a quiet, secondary previous destination
          const t = Math.min(1.0, p - 2.0);
          if (t <= 0.10) {
            targetScale = 1.20;
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          } else {
            const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
            const ease = recedeT * recedeT * (3 - 2 * recedeT);
            targetScale = THREE.MathUtils.lerp(1.20, 0.46, ease);
            targetOpacity = THREE.MathUtils.lerp(1.0, 0.26, ease);
            currentRoughness = THREE.MathUtils.lerp(0.55, 0.28, ease);
            currentMetalness = THREE.MathUtils.lerp(0.05, 0.22, ease);
            nucleusWarmT = Math.max(0.0, 1.0 - recedeT * 2.0);
          }
        }

        if (p > 8.15) {
          const retreatT = Math.min(1.0, (p - 8.15) / (0.85 - 0.15));
          const ease = retreatT * retreatT * (3 - 2 * retreatT);
          targetScale = THREE.MathUtils.lerp(targetScale, 1.00, ease);
          targetOpacity = THREE.MathUtils.lerp(targetOpacity, 0.95, ease);
        }

        beadMeshRef.current?.scale.set(targetScale, targetScale, targetScale);
        nucleusMeshRef.current?.scale.set(1.0, 1.0, 1.0);

        if (beadMatRef.current && nucleusMatRef.current) {
          beadMatRef.current.opacity = targetOpacity;
          beadMatRef.current.color.copy(isDark ? colorSoftCream : colorDeepBrown);
          beadMatRef.current.roughness = currentRoughness;
          beadMatRef.current.metalness = currentMetalness;

          nucleusMatRef.current.opacity = targetOpacity;
          nucleusMatRef.current.color.copy(colorDeepBrown).lerp(colorAccentWarm, nucleusWarmT);
          nucleusMatRef.current.roughness = 0.16;
          nucleusMatRef.current.metalness = 0.40;
        }
      } else if (index === 2) {
        // Node 03: Destination for Phase 3
        let targetOpacity = 0.06;
        let targetScale = 0.74;
        let currentRoughness = 0.28;
        let currentMetalness = 0.22;
        let nucleusWarmT = 0.0;

        if (p <= 1.0) {
          if (p <= 0.16) {
            targetOpacity = 0.06;
            targetScale = 0.74;
          } else if (p <= 0.22) {
            const seedT = (p - 0.16) / (0.22 - 0.16);
            targetOpacity = THREE.MathUtils.lerp(0.06, 0.10, seedT);
            targetScale = THREE.MathUtils.lerp(0.74, 0.76, seedT);
          } else if (p <= 0.28) {
            const reachT = (p - 0.22) / (0.28 - 0.22);
            targetOpacity = THREE.MathUtils.lerp(0.10, 0.24, reachT);
            targetScale = THREE.MathUtils.lerp(0.76, 0.78, reachT);
          } else if (p <= 0.40) {
            const revealT = (p - 0.28) / (0.40 - 0.28);
            targetOpacity = THREE.MathUtils.lerp(0.24, 0.55, revealT);
            targetScale = THREE.MathUtils.lerp(0.78, 0.82, revealT);
          } else {
            const recedeP = Math.min(1.0, (p - 0.40) / (0.85 - 0.40));
            targetOpacity = THREE.MathUtils.lerp(0.55, 0.40, recedeP);
            targetScale = THREE.MathUtils.lerp(0.82, 0.76, recedeP);
          }
        } else if (p <= 2.0) {
          // p in [1.00, 2.00]: Subtle look-ahead destination cue ahead in corridor
          const t = p - 1.0;
          targetOpacity = THREE.MathUtils.lerp(0.40, 0.52, t);
          targetScale = THREE.MathUtils.lerp(0.76, 0.80, t);
        } else if (p <= 3.0) {
          // p in [2.00, 3.00]: Node 03 becomes the dominant destination and arrives
          const t = Math.min(1.0, p - 2.0);
          if (t <= 0.65) {
            const travelT = t / 0.65;
            targetScale = THREE.MathUtils.lerp(0.80, 0.95, travelT);
            targetOpacity = THREE.MathUtils.lerp(0.52, 0.75, travelT);
            currentRoughness = THREE.MathUtils.lerp(0.28, 0.50, travelT);
            currentMetalness = THREE.MathUtils.lerp(0.22, 0.08, travelT);
          } else if (t <= 0.85) {
            const approachT = (t - 0.65) / (0.85 - 0.65);
            targetScale = THREE.MathUtils.lerp(0.95, 1.12, approachT);
            targetOpacity = THREE.MathUtils.lerp(0.75, 1.0, approachT);
            currentRoughness = THREE.MathUtils.lerp(0.50, 0.55, approachT);
            currentMetalness = THREE.MathUtils.lerp(0.08, 0.05, approachT);
            nucleusWarmT = approachT;
          } else {
            const settleT = (t - 0.85) / (1.0 - 0.85);
            targetScale = THREE.MathUtils.lerp(1.12, 1.18, settleT);
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          }
        } else {
          // p in [3.00, 4.00]: Node 03 gracefully recedes into quiet previous destination
          const t = Math.min(1.0, p - 3.0);
          if (t <= 0.10) {
            targetScale = 1.18;
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          } else {
            const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
            const ease = recedeT * recedeT * (3 - 2 * recedeT);
            targetScale = THREE.MathUtils.lerp(1.18, 0.48, ease);
            targetOpacity = THREE.MathUtils.lerp(1.0, 0.30, ease);
            currentRoughness = THREE.MathUtils.lerp(0.55, 0.28, ease);
            currentMetalness = THREE.MathUtils.lerp(0.05, 0.22, ease);
            nucleusWarmT = Math.max(0.0, 1.0 - recedeT * 2.0);
          }
        }

        if (p > 8.15) {
          const retreatT = Math.min(1.0, (p - 8.15) / (0.85 - 0.15));
          const ease = retreatT * retreatT * (3 - 2 * retreatT);
          targetScale = THREE.MathUtils.lerp(targetScale, 1.00, ease);
          targetOpacity = THREE.MathUtils.lerp(targetOpacity, 0.95, ease);
        }

        beadMeshRef.current?.scale.set(targetScale, targetScale, targetScale);
        nucleusMeshRef.current?.scale.set(1.0, 1.0, 1.0);

        if (beadMatRef.current && nucleusMatRef.current) {
          beadMatRef.current.opacity = targetOpacity;
          beadMatRef.current.color.copy(isDark ? colorSoftCream : colorDeepBrown);
          beadMatRef.current.roughness = currentRoughness;
          beadMatRef.current.metalness = currentMetalness;

          nucleusMatRef.current.opacity = targetOpacity;
          nucleusMatRef.current.color.copy(colorDeepBrown).lerp(colorAccentWarm, nucleusWarmT);
          nucleusMatRef.current.roughness = 0.16;
          nucleusMatRef.current.metalness = 0.40;
        }
      } else if (index === 3) {
        // Node 04: Destination for Phase 4 (E-Commerce Solution)
        let targetOpacity = 0.05;
        let targetScale = 0.74;
        let currentRoughness = 0.28;
        let currentMetalness = 0.22;
        let nucleusWarmT = 0.0;

        if (p <= 1.0) {
          if (p <= 0.16) {
            targetOpacity = 0.06;
            targetScale = 0.74;
          } else if (p <= 0.22) {
            const seedT = (p - 0.16) / (0.22 - 0.16);
            targetOpacity = THREE.MathUtils.lerp(0.06, 0.10, seedT);
            targetScale = THREE.MathUtils.lerp(0.74, 0.76, seedT);
          } else if (p <= 0.28) {
            const reachT = (p - 0.22) / (0.28 - 0.22);
            targetOpacity = THREE.MathUtils.lerp(0.10, 0.24, reachT);
            targetScale = THREE.MathUtils.lerp(0.76, 0.78, reachT);
          } else if (p <= 0.40) {
            const revealT = (p - 0.28) / (0.40 - 0.28);
            targetOpacity = THREE.MathUtils.lerp(0.24, 0.55, revealT);
            targetScale = THREE.MathUtils.lerp(0.78, 0.82, revealT);
          } else {
            const recedeP = Math.min(1.0, (p - 0.40) / (0.85 - 0.40));
            targetOpacity = THREE.MathUtils.lerp(0.55, 0.40, recedeP);
            targetScale = THREE.MathUtils.lerp(0.82, 0.76, recedeP);
          }
        } else if (p <= 2.0) {
          // p in [1.00, 2.00]: Subtle background presence
          const t = Math.min(1.0, p - 1.0);
          targetOpacity = THREE.MathUtils.lerp(0.30, 0.35, t);
          targetScale = THREE.MathUtils.lerp(0.72, 0.74, t);
        } else if (p <= 3.0) {
          // p in [2.00, 3.00]: Look-ahead destination cue ahead in corridor
          const t = Math.min(1.0, p - 2.0);
          targetOpacity = THREE.MathUtils.lerp(0.35, 0.52, t);
          targetScale = THREE.MathUtils.lerp(0.74, 0.80, t);
        } else if (p <= 4.0) {
          // p in [3.00, 4.00]: Node 04 becomes the dominant destination and arrives
          const t = Math.min(1.0, p - 3.0);
          if (t <= 0.65) {
            const travelT = t / 0.65;
            targetScale = THREE.MathUtils.lerp(0.80, 0.95, travelT);
            targetOpacity = THREE.MathUtils.lerp(0.52, 0.75, travelT);
            currentRoughness = THREE.MathUtils.lerp(0.28, 0.50, travelT);
            currentMetalness = THREE.MathUtils.lerp(0.22, 0.08, travelT);
          } else if (t <= 0.85) {
            const approachT = (t - 0.65) / (0.85 - 0.65);
            targetScale = THREE.MathUtils.lerp(0.95, 1.12, approachT);
            targetOpacity = THREE.MathUtils.lerp(0.75, 1.0, approachT);
            currentRoughness = THREE.MathUtils.lerp(0.50, 0.55, approachT);
            currentMetalness = THREE.MathUtils.lerp(0.08, 0.05, approachT);
            nucleusWarmT = approachT;
          } else {
            const settleT = (t - 0.85) / (1.0 - 0.85);
            targetScale = THREE.MathUtils.lerp(1.12, 1.18, settleT);
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          }
        } else {
          // p in [4.00, 5.00]: Node 04 gracefully recedes into quiet previous destination
          const t = Math.min(1.0, p - 4.0);
          if (t <= 0.10) {
            targetScale = 1.18;
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          } else {
            const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
            const ease = recedeT * recedeT * (3 - 2 * recedeT);
            targetScale = THREE.MathUtils.lerp(1.18, 0.48, ease);
            targetOpacity = THREE.MathUtils.lerp(1.0, 0.30, ease);
            currentRoughness = THREE.MathUtils.lerp(0.55, 0.28, ease);
            currentMetalness = THREE.MathUtils.lerp(0.05, 0.22, ease);
            nucleusWarmT = Math.max(0.0, 1.0 - recedeT * 2.0);
          }
        }

        if (p > 8.15) {
          const retreatT = Math.min(1.0, (p - 8.15) / (0.85 - 0.15));
          const ease = retreatT * retreatT * (3 - 2 * retreatT);
          targetScale = THREE.MathUtils.lerp(targetScale, 1.00, ease);
          targetOpacity = THREE.MathUtils.lerp(targetOpacity, 0.95, ease);
        }

        beadMeshRef.current?.scale.set(targetScale, targetScale, targetScale);
        nucleusMeshRef.current?.scale.set(1.0, 1.0, 1.0);

        if (beadMatRef.current && nucleusMatRef.current) {
          beadMatRef.current.opacity = targetOpacity;
          beadMatRef.current.color.copy(isDark ? colorSoftCream : colorDeepBrown);
          beadMatRef.current.roughness = currentRoughness;
          beadMatRef.current.metalness = currentMetalness;

          nucleusMatRef.current.opacity = targetOpacity;
          nucleusMatRef.current.color.copy(colorDeepBrown).lerp(colorAccentWarm, nucleusWarmT);
          nucleusMatRef.current.roughness = 0.16;
          nucleusMatRef.current.metalness = 0.40;
        }
      } else if (index === 4) {
        // Node 05: Destination for Phase 5 (Cybersecurity Solutions)
        let targetOpacity = 0.06;
        let targetScale = 0.74;
        let currentRoughness = 0.28;
        let currentMetalness = 0.22;
        let nucleusWarmT = 0.0;

        if (p <= 1.0) {
          if (p <= 0.16) {
            targetOpacity = 0.06;
            targetScale = 0.74;
          } else if (p <= 0.22) {
            const seedT = (p - 0.16) / (0.22 - 0.16);
            targetOpacity = THREE.MathUtils.lerp(0.06, 0.10, seedT);
            targetScale = THREE.MathUtils.lerp(0.74, 0.76, seedT);
          } else if (p <= 0.28) {
            const reachT = (p - 0.22) / (0.28 - 0.22);
            targetOpacity = THREE.MathUtils.lerp(0.10, 0.24, reachT);
            targetScale = THREE.MathUtils.lerp(0.76, 0.78, reachT);
          } else if (p <= 0.40) {
            const revealT = (p - 0.28) / (0.40 - 0.28);
            targetOpacity = THREE.MathUtils.lerp(0.24, 0.55, revealT);
            targetScale = THREE.MathUtils.lerp(0.78, 0.82, revealT);
          } else {
            const recedeP = Math.min(1.0, (p - 0.40) / (0.85 - 0.40));
            targetOpacity = THREE.MathUtils.lerp(0.55, 0.40, recedeP);
            targetScale = THREE.MathUtils.lerp(0.82, 0.76, recedeP);
          }
        } else if (p <= 2.0) {
          // p in [1.00, 2.00]: Subtle background presence
          const t = Math.min(1.0, p - 1.0);
          targetOpacity = THREE.MathUtils.lerp(0.30, 0.35, t);
          targetScale = THREE.MathUtils.lerp(0.72, 0.74, t);
        } else if (p <= 3.0) {
          // p in [2.00, 3.00]: Subtle presence
          const t = Math.min(1.0, p - 2.0);
          targetOpacity = THREE.MathUtils.lerp(0.24, 0.32, t);
          targetScale = THREE.MathUtils.lerp(0.71, 0.73, t);
        } else if (p <= 4.0) {
          // p in [3.00, 4.00]: Look-ahead destination cue ahead in corridor
          const t = Math.min(1.0, p - 3.0);
          targetOpacity = THREE.MathUtils.lerp(0.32, 0.52, t);
          targetScale = THREE.MathUtils.lerp(0.72, 0.80, t);
        } else if (p <= 5.0) {
          // p in [4.00, 5.00]: Node 05 becomes the dominant destination and arrives
          const t = Math.min(1.0, p - 4.0);
          if (t <= 0.65) {
            const travelT = t / 0.65;
            targetScale = THREE.MathUtils.lerp(0.80, 0.95, travelT);
            targetOpacity = THREE.MathUtils.lerp(0.52, 0.75, travelT);
            currentRoughness = THREE.MathUtils.lerp(0.28, 0.50, travelT);
            currentMetalness = THREE.MathUtils.lerp(0.22, 0.08, travelT);
          } else if (t <= 0.85) {
            const approachT = (t - 0.65) / (0.85 - 0.65);
            targetScale = THREE.MathUtils.lerp(0.95, 1.12, approachT);
            targetOpacity = THREE.MathUtils.lerp(0.75, 1.0, approachT);
            currentRoughness = THREE.MathUtils.lerp(0.50, 0.55, approachT);
            currentMetalness = THREE.MathUtils.lerp(0.08, 0.05, approachT);
            nucleusWarmT = approachT;
          } else {
            const settleT = (t - 0.85) / (1.0 - 0.85);
            targetScale = THREE.MathUtils.lerp(1.12, 1.18, settleT);
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          }
        } else {
          // p in [5.00, 6.00]: Node 05 gracefully recedes into quiet previous destination
          const t = Math.min(1.0, p - 5.0);
          if (t <= 0.10) {
            targetScale = 1.18;
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          } else {
            const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
            const ease = recedeT * recedeT * (3 - 2 * recedeT);
            targetScale = THREE.MathUtils.lerp(1.18, 0.48, ease);
            targetOpacity = THREE.MathUtils.lerp(1.0, 0.30, ease);
            currentRoughness = THREE.MathUtils.lerp(0.55, 0.28, ease);
            currentMetalness = THREE.MathUtils.lerp(0.05, 0.22, ease);
            nucleusWarmT = Math.max(0.0, 1.0 - recedeT * 2.0);
          }
        }

        if (p > 8.15) {
          const retreatT = Math.min(1.0, (p - 8.15) / (0.85 - 0.15));
          const ease = retreatT * retreatT * (3 - 2 * retreatT);
          targetScale = THREE.MathUtils.lerp(targetScale, 1.00, ease);
          targetOpacity = THREE.MathUtils.lerp(targetOpacity, 0.95, ease);
        }

        beadMeshRef.current?.scale.set(targetScale, targetScale, targetScale);
        nucleusMeshRef.current?.scale.set(1.0, 1.0, 1.0);

        if (beadMatRef.current && nucleusMatRef.current) {
          beadMatRef.current.opacity = targetOpacity;
          beadMatRef.current.color.copy(isDark ? colorSoftCream : colorDeepBrown);
          beadMatRef.current.roughness = currentRoughness;
          beadMatRef.current.metalness = currentMetalness;

          nucleusMatRef.current.opacity = targetOpacity;
          nucleusMatRef.current.color.copy(colorDeepBrown).lerp(colorAccentWarm, nucleusWarmT);
          nucleusMatRef.current.roughness = 0.16;
          nucleusMatRef.current.metalness = 0.40;
        }
      } else if (index === 5) {
        // Node 06: Destination for Phase 6 (Cloud & IT Solutions)
        let targetOpacity = 0.05;
        let targetScale = 0.75;
        let currentRoughness = 0.28;
        let currentMetalness = 0.22;
        let nucleusWarmT = 0.0;

        if (p <= 1.0) {
          if (p <= 0.16) {
            targetOpacity = 0.03;
            targetScale = 0.70;
          } else if (p <= 0.22) {
            const seedT = (p - 0.16) / (0.22 - 0.16);
            targetOpacity = THREE.MathUtils.lerp(0.03, 0.06, seedT);
            targetScale = THREE.MathUtils.lerp(0.70, 0.72, seedT);
          } else if (p <= 0.28) {
            const reachT = (p - 0.22) / (0.28 - 0.22);
            targetOpacity = THREE.MathUtils.lerp(0.06, 0.14, reachT);
            targetScale = THREE.MathUtils.lerp(0.72, 0.74, reachT);
          } else if (p <= 0.40) {
            const revealT = (p - 0.28) / (0.40 - 0.28);
            targetOpacity = THREE.MathUtils.lerp(0.14, 0.42, revealT);
            targetScale = THREE.MathUtils.lerp(0.74, 0.76, revealT);
          } else {
            const recedeP = Math.min(1.0, (p - 0.40) / (0.85 - 0.40));
            targetOpacity = THREE.MathUtils.lerp(0.42, 0.25, recedeP);
            targetScale = THREE.MathUtils.lerp(0.76, 0.70, recedeP);
          }
        } else if (p <= 2.0) {
          const t = Math.min(1.0, p - 1.0);
          targetOpacity = THREE.MathUtils.lerp(0.30, 0.35, t);
          targetScale = THREE.MathUtils.lerp(0.72, 0.74, t);
        } else if (p <= 3.0) {
          const t = Math.min(1.0, p - 2.0);
          targetOpacity = THREE.MathUtils.lerp(0.24, 0.32, t);
          targetScale = THREE.MathUtils.lerp(0.71, 0.73, t);
        } else if (p <= 4.0) {
          const t = Math.min(1.0, p - 3.0);
          targetOpacity = THREE.MathUtils.lerp(0.20, 0.28, t);
          targetScale = THREE.MathUtils.lerp(0.70, 0.72, t);
        } else if (p <= 5.0) {
          // p in [4.00, 5.00]: Restrained future look-ahead destination along continuing corridor
          const t = Math.min(1.0, p - 4.0);
          targetOpacity = THREE.MathUtils.lerp(0.28, 0.50, t);
          targetScale = THREE.MathUtils.lerp(0.72, 0.78, t);
        } else if (p <= 6.0) {
          // p in [5.00, 6.00]: Node 06 becomes the dominant destination and arrives
          const t = Math.min(1.0, p - 5.0);
          if (t <= 0.65) {
            const travelT = t / 0.65;
            targetScale = THREE.MathUtils.lerp(0.78, 0.95, travelT);
            targetOpacity = THREE.MathUtils.lerp(0.50, 0.75, travelT);
            currentRoughness = THREE.MathUtils.lerp(0.28, 0.50, travelT);
            currentMetalness = THREE.MathUtils.lerp(0.22, 0.08, travelT);
          } else if (t <= 0.85) {
            const approachT = (t - 0.65) / (0.85 - 0.65);
            targetScale = THREE.MathUtils.lerp(0.95, 1.12, approachT);
            targetOpacity = THREE.MathUtils.lerp(0.75, 1.0, approachT);
            currentRoughness = THREE.MathUtils.lerp(0.50, 0.55, approachT);
            currentMetalness = THREE.MathUtils.lerp(0.08, 0.05, approachT);
            nucleusWarmT = approachT;
          } else {
            const settleT = (t - 0.85) / (1.0 - 0.85);
            targetScale = THREE.MathUtils.lerp(1.12, 1.18, settleT);
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          }
        } else {
          // p in [6.00, 7.00]: Node 06 recedes into perspective as camera travels toward Node 07
          const t = Math.min(1.0, p - 6.0);
          const releaseT = Math.min(1.0, t / 0.25);
          targetScale = THREE.MathUtils.lerp(1.18, 0.76, releaseT);
          targetOpacity = THREE.MathUtils.lerp(1.0, 0.35, releaseT);
          currentRoughness = THREE.MathUtils.lerp(0.55, 0.28, releaseT);
          currentMetalness = THREE.MathUtils.lerp(0.05, 0.22, releaseT);
          nucleusWarmT = 1.0 - releaseT;
        }

        if (p > 8.15) {
          const retreatT = Math.min(1.0, (p - 8.15) / (0.85 - 0.15));
          const ease = retreatT * retreatT * (3 - 2 * retreatT);
          targetScale = THREE.MathUtils.lerp(targetScale, 1.00, ease);
          targetOpacity = THREE.MathUtils.lerp(targetOpacity, 0.95, ease);
        }

        beadMeshRef.current?.scale.set(targetScale, targetScale, targetScale);
        nucleusMeshRef.current?.scale.set(1.0, 1.0, 1.0);

        if (beadMatRef.current && nucleusMatRef.current) {
          beadMatRef.current.opacity = targetOpacity;
          beadMatRef.current.color.copy(isDark ? colorSoftCream : colorDeepBrown);
          beadMatRef.current.roughness = currentRoughness;
          beadMatRef.current.metalness = currentMetalness;

          nucleusMatRef.current.opacity = targetOpacity;
          nucleusMatRef.current.color.copy(colorDeepBrown).lerp(colorAccentWarm, nucleusWarmT);
          nucleusMatRef.current.roughness = 0.16;
          nucleusMatRef.current.metalness = 0.40;
        }
      } else if (index === 6) {
        // Node 07: Destination for Phase 7 (Data & Business Intelligence)
        let targetOpacity = 0.05;
        let targetScale = 0.75;
        let currentRoughness = 0.28;
        let currentMetalness = 0.22;
        let nucleusWarmT = 0.0;

        if (p <= 1.0) {
          if (p <= 0.16) {
            targetOpacity = 0.03;
            targetScale = 0.70;
          } else if (p <= 0.22) {
            const seedT = (p - 0.16) / (0.22 - 0.16);
            targetOpacity = THREE.MathUtils.lerp(0.03, 0.06, seedT);
            targetScale = THREE.MathUtils.lerp(0.70, 0.72, seedT);
          } else if (p <= 0.28) {
            const reachT = (p - 0.22) / (0.28 - 0.22);
            targetOpacity = THREE.MathUtils.lerp(0.06, 0.14, reachT);
            targetScale = THREE.MathUtils.lerp(0.72, 0.74, reachT);
          } else if (p <= 0.40) {
            const revealT = (p - 0.28) / (0.40 - 0.28);
            targetOpacity = THREE.MathUtils.lerp(0.14, 0.42, revealT);
            targetScale = THREE.MathUtils.lerp(0.74, 0.76, revealT);
          } else {
            const recedeP = Math.min(1.0, (p - 0.40) / (0.85 - 0.40));
            targetOpacity = THREE.MathUtils.lerp(0.42, 0.25, recedeP);
            targetScale = THREE.MathUtils.lerp(0.76, 0.70, recedeP);
          }
        } else if (p <= 2.0) {
          targetOpacity = 0.22;
          targetScale = 0.70;
        } else if (p <= 3.0) {
          targetOpacity = 0.20;
          targetScale = 0.70;
        } else if (p <= 4.0) {
          targetOpacity = 0.18;
          targetScale = 0.68;
        } else if (p <= 5.0) {
          targetOpacity = 0.16;
          targetScale = 0.68;
        } else if (p <= 6.0) {
          // p in [5.00, 6.00]: Node 07 subtle next-destination look-ahead along continuing corridor
          const t = Math.min(1.0, p - 5.0);
          targetOpacity = THREE.MathUtils.lerp(0.28, 0.48, t);
          targetScale = THREE.MathUtils.lerp(0.72, 0.78, t);
        } else if (p <= 7.0) {
          // p in [6.00, 7.00]: Node 07 becomes the dominant destination and arrives
          const t = Math.min(1.0, p - 6.0);
          if (t <= 0.65) {
            const travelT = t / 0.65;
            targetScale = THREE.MathUtils.lerp(0.78, 0.95, travelT);
            targetOpacity = THREE.MathUtils.lerp(0.48, 0.75, travelT);
            currentRoughness = THREE.MathUtils.lerp(0.28, 0.50, travelT);
            currentMetalness = THREE.MathUtils.lerp(0.22, 0.08, travelT);
          } else if (t <= 0.85) {
            const approachT = (t - 0.65) / (0.85 - 0.65);
            targetScale = THREE.MathUtils.lerp(0.95, 1.12, approachT);
            targetOpacity = THREE.MathUtils.lerp(0.75, 1.0, approachT);
            currentRoughness = THREE.MathUtils.lerp(0.50, 0.55, approachT);
            currentMetalness = THREE.MathUtils.lerp(0.08, 0.05, approachT);
            nucleusWarmT = approachT;
          } else {
            const settleT = (t - 0.85) / (1.0 - 0.85);
            targetScale = THREE.MathUtils.lerp(1.12, 1.18, settleT);
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          }
        } else if (p <= 8.0) {
          // p in [7.00, 8.00]: Node 07 recedes into secondary background as camera flies to Node 08
          const t = Math.min(1.0, p - 7.0);
          if (t <= 0.10) {
            targetScale = 1.18;
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          } else {
            const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
            const ease = recedeT * recedeT * (3 - 2 * recedeT);
            targetScale = THREE.MathUtils.lerp(1.18, 0.76, ease);
            targetOpacity = THREE.MathUtils.lerp(1.0, 0.35, ease);
            currentRoughness = THREE.MathUtils.lerp(0.55, 0.28, ease);
            currentMetalness = THREE.MathUtils.lerp(0.05, 0.22, ease);
            nucleusWarmT = Math.max(0.0, 1.0 - recedeT * 2.0);
          }
        } else {
          // p in [8.00, 9.00]: Phase 2 Final Complete System Pull-Back
          // Node 07 re-illuminates as part of the complete connected architecture
          if (p <= 8.15) {
            targetScale = 0.76;
            targetOpacity = 0.35;
            currentRoughness = 0.28;
            currentMetalness = 0.22;
            nucleusWarmT = 0.0;
          } else {
            const retreatT = Math.min(1.0, (p - 8.15) / (0.85 - 0.15));
            const ease = retreatT * retreatT * (3 - 2 * retreatT);
            targetScale = THREE.MathUtils.lerp(0.76, 1.00, ease);
            targetOpacity = THREE.MathUtils.lerp(0.35, 0.95, ease);
            currentRoughness = 0.28;
            currentMetalness = 0.22;
            nucleusWarmT = 0.0;
          }
        }

        beadMeshRef.current?.scale.set(targetScale, targetScale, targetScale);
        nucleusMeshRef.current?.scale.set(1.0, 1.0, 1.0);

        if (beadMatRef.current && nucleusMatRef.current) {
          beadMatRef.current.opacity = targetOpacity;
          beadMatRef.current.color.copy(isDark ? colorSoftCream : colorDeepBrown);
          beadMatRef.current.roughness = currentRoughness;
          beadMatRef.current.metalness = currentMetalness;

          nucleusMatRef.current.opacity = targetOpacity;
          nucleusMatRef.current.color.copy(colorDeepBrown).lerp(colorAccentWarm, nucleusWarmT);
          nucleusMatRef.current.roughness = 0.16;
          nucleusMatRef.current.metalness = 0.40;
        }
      } else {
        // Node 08: Distant horizon beacon -> Destination Arrival (Technology Consulting)
        let targetOpacity = 0.05;
        let targetScale = 0.75;
        let currentRoughness = 0.28;
        let currentMetalness = 0.22;
        let nucleusWarmT = 0.0;

        if (p <= 1.0) {
          if (p <= 0.16) {
            targetOpacity = 0.03;
            targetScale = 0.70;
          } else if (p <= 0.22) {
            const seedT = (p - 0.16) / (0.22 - 0.16);
            targetOpacity = THREE.MathUtils.lerp(0.03, 0.06, seedT);
            targetScale = THREE.MathUtils.lerp(0.70, 0.72, seedT);
          } else if (p <= 0.28) {
            const reachT = (p - 0.22) / (0.28 - 0.22);
            targetOpacity = THREE.MathUtils.lerp(0.06, 0.14, reachT);
            targetScale = THREE.MathUtils.lerp(0.72, 0.74, reachT);
          } else if (p <= 0.40) {
            const revealT = (p - 0.28) / (0.40 - 0.28);
            targetOpacity = THREE.MathUtils.lerp(0.14, 0.42, revealT);
            targetScale = THREE.MathUtils.lerp(0.74, 0.76, revealT);
          } else {
            const recedeP = Math.min(1.0, (p - 0.40) / (0.85 - 0.40));
            targetOpacity = THREE.MathUtils.lerp(0.42, 0.25, recedeP);
            targetScale = THREE.MathUtils.lerp(0.76, 0.70, recedeP);
          }
        } else if (p <= 2.0) {
          targetOpacity = 0.22;
          targetScale = 0.70;
        } else if (p <= 3.0) {
          targetOpacity = 0.20;
          targetScale = 0.70;
        } else if (p <= 4.0) {
          targetOpacity = 0.18;
          targetScale = 0.68;
        } else if (p <= 5.0) {
          targetOpacity = 0.16;
          targetScale = 0.68;
        } else if (p <= 6.0) {
          targetOpacity = 0.16;
          targetScale = 0.68;
        } else if (p <= 7.0) {
          // p in [6.00, 7.00]: Node 08 subtle final look-ahead
          const t = Math.min(1.0, p - 6.0);
          targetOpacity = THREE.MathUtils.lerp(0.16, 0.45, t);
          targetScale = THREE.MathUtils.lerp(0.68, 0.75, t);
        } else if (p <= 8.0) {
          // p in [7.00, 8.00]: Node 08 becomes dominant destination and arrives
          const t = Math.min(1.0, p - 7.0);
          if (t <= 0.65) {
            const travelT = t / 0.65;
            targetScale = THREE.MathUtils.lerp(0.75, 0.95, travelT);
            targetOpacity = THREE.MathUtils.lerp(0.45, 0.75, travelT);
            currentRoughness = THREE.MathUtils.lerp(0.28, 0.50, travelT);
            currentMetalness = THREE.MathUtils.lerp(0.22, 0.08, travelT);
          } else if (t <= 0.85) {
            const approachT = (t - 0.65) / (0.85 - 0.65);
            targetScale = THREE.MathUtils.lerp(0.95, 1.12, approachT);
            targetOpacity = THREE.MathUtils.lerp(0.75, 1.0, approachT);
            currentRoughness = THREE.MathUtils.lerp(0.50, 0.55, approachT);
            currentMetalness = THREE.MathUtils.lerp(0.08, 0.05, approachT);
            nucleusWarmT = approachT;
          } else {
            const settleT = (t - 0.85) / (1.0 - 0.85);
            targetScale = THREE.MathUtils.lerp(1.12, 1.18, settleT);
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          }
        } else {
          // p in [8.00, 9.00]: Phase 2 Final Complete System Pull-Back
          if (p <= 8.15) {
            targetScale = 1.18;
            targetOpacity = 1.0;
            currentRoughness = 0.55;
            currentMetalness = 0.05;
            nucleusWarmT = 1.0;
          } else {
            const retreatT = Math.min(1.0, (p - 8.15) / (0.85 - 0.15));
            const ease = retreatT * retreatT * (3 - 2 * retreatT);
            targetScale = THREE.MathUtils.lerp(1.18, 1.05, ease);
            targetOpacity = 1.0;
            currentRoughness = THREE.MathUtils.lerp(0.55, 0.35, ease);
            currentMetalness = THREE.MathUtils.lerp(0.05, 0.18, ease);
            nucleusWarmT = 1.0;
          }
        }

        beadMeshRef.current?.scale.set(targetScale, targetScale, targetScale);
        nucleusMeshRef.current?.scale.set(1.0, 1.0, 1.0);

        if (beadMatRef.current && nucleusMatRef.current) {
          beadMatRef.current.opacity = targetOpacity;
          beadMatRef.current.color.copy(isDark ? colorSoftCream : colorDeepBrown);
          beadMatRef.current.roughness = currentRoughness;
          beadMatRef.current.metalness = currentMetalness;

          nucleusMatRef.current.opacity = targetOpacity;
          nucleusMatRef.current.color.copy(colorDeepBrown).lerp(colorAccentWarm, nucleusWarmT);
          nucleusMatRef.current.roughness = 0.16;
          nucleusMatRef.current.metalness = 0.40;
        }
      }

      // Stage 13: Section 03 Industries Phase A Transition (p > 9.0)
      // Node 08 transforms into architectural marker, then travels into property interface totem
      if (p > 9.0) {
        if (index < 6 && beadMatRef.current && nucleusMatRef.current) {
          // Nodes 01 through 06 fade out gracefully (p in [9.08, 9.24])
          const earlyFadeT = Math.min(1.0, Math.max(0.0, (p - 9.08) / (9.24 - 9.08)));
          const earlyEase = earlyFadeT * earlyFadeT * (3 - 2 * earlyFadeT);
          beadMatRef.current.opacity = beadMatRef.current.opacity * (1 - earlyEase);
          nucleusMatRef.current.opacity = nucleusMatRef.current.opacity * (1 - earlyEase);
        } else if (index === 6 && beadMatRef.current && nucleusMatRef.current) {
          // Node 07 dims to quiet origin anchor (p in [9.10, 9.35])
          const n7FadeT = Math.min(1.0, Math.max(0.0, (p - 9.10) / (9.35 - 9.10)));
          const n7Ease = n7FadeT * n7FadeT * (3 - 2 * n7FadeT);
          beadMatRef.current.opacity = beadMatRef.current.opacity * (1 - n7Ease);
          nucleusMatRef.current.opacity = nucleusMatRef.current.opacity * (1 - n7Ease);
        } else if (index === 7) {
          // Node 08 acts as the stationary spatial origin datum for Section 03
          // Remains anchored at canonical coordinate [-0.04, 0.90, -1.70], projecting the datum line
          groupRef.current.position.set(position[0], position[1], position[2]);

          if (p <= 9.15) {
            const morphT = (p - 9.00) / (9.15 - 9.00);
            const morphEase = morphT * morphT * (3 - 2 * morphT);
            const targetS = THREE.MathUtils.lerp(1.05, 0.82, morphEase);
            beadMeshRef.current?.scale.set(targetS, targetS, targetS);
            if (beadMatRef.current) {
              beadMatRef.current.opacity = 1.0;
              beadMatRef.current.roughness = THREE.MathUtils.lerp(0.35, 0.20, morphEase);
              beadMatRef.current.metalness = THREE.MathUtils.lerp(0.18, 0.45, morphEase);
            }
          } else {
            // Graceful fade-out as architectural monolith and foundation solidify (p in [9.15, 9.36])
            const fadeOutT = Math.min(1.0, (p - 9.15) / (9.36 - 9.15));
            const fadeEase = fadeOutT * fadeOutT * (3 - 2 * fadeOutT);
            const nodeOpacity = Math.max(0, 1.0 - fadeEase);
            const targetS = THREE.MathUtils.lerp(0.82, 0.001, fadeEase);
            beadMeshRef.current?.scale.set(targetS, targetS, targetS);

            if (beadMatRef.current) {
              beadMatRef.current.opacity = nodeOpacity;
            }
            if (nucleusMatRef.current) {
              nucleusMatRef.current.opacity = nodeOpacity;
            }
            if (groupRef.current) {
              groupRef.current.visible = nodeOpacity > 0.005;
            }
          }
        }
      } else if (index === 7) {
        // Deterministic reverse scroll restoration: always restore exact canonical coordinates, scale, and visibility
        groupRef.current.position.set(position[0], position[1], position[2]);
        groupRef.current.visible = true;
        beadMeshRef.current?.scale.set(1.05, 1.05, 1.05);
        if (beadMatRef.current) beadMatRef.current.opacity = 1.0;
        if (nucleusMatRef.current) nucleusMatRef.current.opacity = 1.0;
      }
    } else {
      // Interactive mode
      let targetScale = 1.0;
      let targetOpacity = 1.0;

      if (isActive) {
        isThisActive = true;
        targetScale = 1.25;
        targetOpacity = 1.0;
      } else if (hasActiveSelection) {
        targetScale = 0.90;
        targetOpacity = 0.55;
      }

      const microPulse = Math.sin(t * 1.5 + index * 0.45) * (isThisActive ? 0.015 : 0.004);
      const currentS = groupRef.current.scale.x;
      const newS = THREE.MathUtils.lerp(currentS, targetScale + microPulse, 0.15);
      groupRef.current.scale.set(newS, newS, newS);

      if (beadMatRef.current && nucleusMatRef.current) {
        if (isDark) {
          beadMatRef.current.color.copy(isThisActive ? colorWhite : colorSoftCream);
          nucleusMatRef.current.color.copy(isThisActive ? colorAccentWarm : colorWhite);
        } else {
          beadMatRef.current.color.copy(isThisActive ? colorDeepBrown : colorTechBrown);
          nucleusMatRef.current.color.copy(isThisActive ? colorAccentWarm : colorDeepBrown);
        }
        beadMatRef.current.roughness = isThisActive ? 0.18 : 0.28;
        beadMatRef.current.metalness = isThisActive ? 0.35 : 0.22;
        beadMatRef.current.opacity = targetOpacity;
        nucleusMatRef.current.opacity = targetOpacity;
      }
    }
  });

  // Base radius: Node 01 has largest physical foundation (0.080), receding naturally into depth
  const baseRadius = isStart
    ? 0.080
    : index === 1
    ? 0.068
    : index >= 2 && index <= 4
    ? 0.066
    : 0.064;

  return (
    <group
      ref={groupRef}
      name={`node-${id}`}
      position={position}
      quaternion={rotationQuaternion}
    >
      {/* 1. Primary Faceted Spherical Bead (Icosahedron detail 1 = 80 micro-facets) */}
      <mesh ref={beadMeshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[baseRadius, 1]} />
        <meshStandardMaterial
          ref={beadMatRef}
          color={isDark ? TECH_SYSTEM_PALETTE.softCream : TECH_SYSTEM_PALETTE.techBrown}
          roughness={0.28}
          metalness={0.22}
          transparent
          opacity={1.0}
          flatShading={true}
        />
      </mesh>

      {/* 2. Inner Specular Nucleus Core */}
      <mesh ref={nucleusMeshRef}>
        <sphereGeometry args={[baseRadius * 0.44, 16, 16]} />
        <meshStandardMaterial
          ref={nucleusMatRef}
          color={isDark ? TECH_SYSTEM_PALETTE.white : TECH_SYSTEM_PALETTE.deepBrown}
          roughness={0.16}
          metalness={0.4}
          transparent
          opacity={1.0}
        />
      </mesh>
    </group>
  );
}

/**
 * TechnologySystemNodes — Exactly 8 Primary Capability Nodes.
 * Renders nodes 01 through 08 along the open 3D path.
 */
export function TechnologySystemNodes({
  theme = "light",
  activeNode = null,
  progress,
  progressRef,
}: TechnologySystemNodesProps) {
  const isDark = theme === "dark";
  const hasActiveSelection = activeNode !== null;

  // Build the curve and compute tangents for each node along the open path
  const nodes = useMemo(() => {
    const curve = createSystemPathCurve();
    const count = SYSTEM_NODE_COORDINATES.length;

    return SYSTEM_NODE_COORDINATES.map((coord, idx) => {
      // For open curve: u = 0.0 at Node 01, u = 1.0 at Node 08
      const u = Math.min(Math.max(idx / (count - 1), 0.001), 0.999);
      const tangent = curve.getTangentAt(u).normalize();
      const id = String(idx + 1).padStart(2, "0");

      return {
        id,
        index: idx,
        position: coord,
        tangent,
        isStart: idx === 0,
        isEnd: idx === count - 1,
      };
    });
  }, []);

  return (
    <group name="technology-system-nodes">
      {nodes.map((node) => (
        <SystemNodeItem
          key={node.id}
          id={node.id}
          index={node.index}
          position={node.position}
          tangent={node.tangent}
          isActive={activeNode === node.index}
          hasActiveSelection={hasActiveSelection}
          isDark={isDark}
          isStart={node.isStart}
          isEnd={node.isEnd}
          progress={progress}
          progressRef={progressRef}
        />
      ))}
    </group>
  );
}


