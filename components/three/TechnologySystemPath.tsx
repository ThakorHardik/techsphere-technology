"use client";

import * as React from "react";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  TechnologySystemTheme,
  TECH_SYSTEM_PALETTE,
  createSystemPathCurve,
} from "./technology-system-types";

interface TechnologySystemPathProps {
  readonly theme?: TechnologySystemTheme;
  readonly activeNode?: number | null;
  readonly progress?: number;
  readonly progressRef?: React.RefObject<number>;
}

/**
 * TechnologySystemPath — The Continuous Open 3D Architectural Path.
 * 
 * Renders an elegant, tangible physical architectural line connecting the 8 nodes.
 * Strong enough to be clearly traced from 01 to 08, but restrained enough
 * not to dominate the landmark nodes.
 * 
 * Features:
 * - Truly OPEN Catmull-Rom 3D spline (closed: false).
 * - Tangible physical architectural geometry (radius: 0.0065 units).
 * - Warm architectural bronze/cream finish with subtle specular highlight.
 * - Dynamic opacity: subdued at portal handoff (0.00–0.10), emerging as camera travels (0.10–0.60).
 */
export function TechnologySystemPath({
  theme = "light",
  activeNode = null,
  progress,
  progressRef,
}: TechnologySystemPathProps) {
  const isDark = theme === "dark";
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Shared deterministic open curve constructed from the 8 node coordinates
  const curve = useMemo(() => createSystemPathCurve(), []);

  // Primary open corridor filament geometry with depth-toned vertex colors
  const pathGeometry = useMemo(() => {
    const tubularSegments = 280;
    const radialSegments = 12;
    const geom = new THREE.TubeGeometry(curve, tubularSegments, 0.0065, radialSegments, false);

    const pos = geom.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const startColor = new THREE.Color(isDark ? TECH_SYSTEM_PALETTE.white : TECH_SYSTEM_PALETTE.techBrown);
    const endColor = new THREE.Color(isDark ? TECH_SYSTEM_PALETTE.accentWarm : "#9E8A78");

    for (let i = 0; i <= tubularSegments; i++) {
      const u = i / tubularSegments;
      const c = startColor.clone().lerp(endColor, u);
      for (let j = 0; j <= radialSegments; j++) {
        const idx = (i * (radialSegments + 1) + j) * 3;
        colors[idx] = c.r;
        colors[idx + 1] = c.g;
        colors[idx + 2] = c.b;
      }
    }
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geom;
  }, [curve, isDark]);

  // Update draw range and material opacity directly inside useFrame — zero React re-render thrashing
  useFrame(() => {
    if (!materialRef.current) return;

    const geom = pathGeometry;
    const totalSegments = 280;
    const indicesPerSegment = 12 * 6; // 72 indices per segment (12 radial quads * 2 tris * 3 indices)
    const totalIndices = totalSegments * indicesPerSegment;

    if (activeNode !== null && !progressRef && typeof progress !== "number") {
      geom.setDrawRange(0, totalIndices);
      materialRef.current.opacity = 0.90;
      return;
    }

    const p = progressRef
      ? progressRef.current
      : typeof progress === "number"
      ? progress
      : 0;

    if (p < 9.40 && meshRef.current && !meshRef.current.visible) {
      meshRef.current.visible = true;
    }

    // Timeline:
    // 0.00–0.16: Node 01 formation & completion — path unextended (drawRange = 0)
    // 0.16–0.22: Very short section of path begins extending from Node 01 toward Node 02 (~12 -> 45 segments)
    // 0.22–0.28: Node 02 becomes faintly visible and path continues beyond (~45 -> 100 segments)
    // 0.28–0.40: Existing corridor reveal — path completes through Node 08 (full 280 segments)
    // 0.40+: Full corridor rendered, guiding camera flight to Node 01 arrival
    if (p <= 0.16) {
      geom.setDrawRange(0, 0);
      materialRef.current.opacity = 0.0;
    } else if (p <= 0.22) {
      const t = (p - 0.16) / (0.22 - 0.16);
      const segs = Math.max(12, Math.floor(THREE.MathUtils.lerp(12, 45, t)));
      geom.setDrawRange(0, segs * indicesPerSegment);
      materialRef.current.opacity = THREE.MathUtils.lerp(0.35, 0.60, t);
    } else if (p <= 0.28) {
      const t = (p - 0.22) / (0.28 - 0.22);
      const segs = Math.floor(THREE.MathUtils.lerp(45, 100, t));
      geom.setDrawRange(0, segs * indicesPerSegment);
      materialRef.current.opacity = THREE.MathUtils.lerp(0.60, 0.68, t);
    } else if (p <= 0.40) {
      const t = (p - 0.28) / (0.40 - 0.28);
      const segs = Math.floor(THREE.MathUtils.lerp(100, totalSegments, t));
      geom.setDrawRange(0, segs * indicesPerSegment);
      materialRef.current.opacity = THREE.MathUtils.lerp(0.68, 0.72, t);
    } else {
      if (p <= 1.0) {
        geom.setDrawRange(0, totalIndices);
        const t = Math.min(1.0, (p - 0.40) / (0.85 - 0.40));
        materialRef.current.opacity = THREE.MathUtils.lerp(0.72, 0.74, t);
      } else if (p <= 2.0) {
        geom.setDrawRange(0, totalIndices);
        const t = Math.min(1.0, (p - 1.0) / 0.85);
        materialRef.current.opacity = THREE.MathUtils.lerp(0.74, 0.64, t);
      } else if (p <= 3.0) {
        // p in [2.00, 3.00]: Node 03 Journey
        // Gracefully retire the pre-Node 02 segment (u <= 0.12) so the lower-right foreground
        // connector mass is eliminated, leaving Node 02 as a clean origin point leading into Node 03.
        const t = p - 2.0;
        if (t <= 0.10) {
          geom.setDrawRange(0, totalIndices);
          materialRef.current.opacity = 0.64;
        } else {
          const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
          const ease = recedeT * recedeT * (3 - 2 * recedeT);
          const startSeg = Math.floor(THREE.MathUtils.lerp(0, 42, ease));
          const startIndex = startSeg * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = THREE.MathUtils.lerp(0.64, 0.54, ease);
        }
      } else if (p <= 4.0) {
        // p in [3.00, 4.00]: Node 04 Journey
        // Gracefully retire the pre-Node 03 segment (u <= 0.28) so the foreground connector
        // mass before Node 03 is eliminated, leaving Node 03 as a clean origin point leading into Node 04 and Node 05.
        const t = p - 3.0;
        if (t <= 0.10) {
          const startIndex = 42 * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = 0.54;
        } else {
          const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
          const ease = recedeT * recedeT * (3 - 2 * recedeT);
          const startSeg = Math.floor(THREE.MathUtils.lerp(42, 82, ease));
          const startIndex = startSeg * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = THREE.MathUtils.lerp(0.54, 0.52, ease);
        }
      } else if (p <= 5.0) {
        // p in [4.00, 5.00]: Node 05 Journey (Cybersecurity Solutions)
        // Gracefully retire the pre-Node 04 segment (u <= 0.42) so the foreground connector
        // mass before Node 04 is eliminated, leaving Node 04 as a clean receding landmark leading into Node 05 and Node 06.
        const t = p - 4.0;
        if (t <= 0.10) {
          const startIndex = 82 * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = 0.52;
        } else {
          const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
          const ease = recedeT * recedeT * (3 - 2 * recedeT);
          const startSeg = Math.floor(THREE.MathUtils.lerp(82, 122, ease));
          const startIndex = startSeg * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = THREE.MathUtils.lerp(0.52, 0.50, ease);
        }
      } else if (p <= 6.0) {
        // p in [5.00, 6.00]: Node 06 Journey (Cloud & IT Solutions)
        // Gracefully retire the pre-Node 05 segment (u <= 0.57) so the foreground connector
        // mass before Node 05 is eliminated, leaving Node 05 as a clean receding landmark leading into Node 06 and Node 07.
        const t = p - 5.0;
        if (t <= 0.10) {
          const startIndex = 122 * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = 0.50;
        } else {
          const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
          const ease = recedeT * recedeT * (3 - 2 * recedeT);
          const startSeg = Math.floor(THREE.MathUtils.lerp(122, 162, ease));
          const startIndex = startSeg * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = THREE.MathUtils.lerp(0.50, 0.48, ease);
        }
      } else if (p <= 7.0) {
        // p in [6.00, 7.00]: Node 07 Journey (Data & Business Intelligence)
        // Gracefully retire the pre-Node 06 segment (u <= 0.71) so the foreground connector
        // mass before Node 06 is eliminated, leaving Node 06 as a clean receding landmark leading into Node 07 and Node 08.
        const t = p - 6.0;
        if (t <= 0.10) {
          const startIndex = 162 * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = 0.48;
        } else {
          const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
          const ease = recedeT * recedeT * (3 - 2 * recedeT);
          const startSeg = Math.floor(THREE.MathUtils.lerp(162, 202, ease));
          const startIndex = startSeg * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = THREE.MathUtils.lerp(0.48, 0.46, ease);
        }
      } else if (p <= 8.0) {
        // p in [7.00, 8.00]: Node 08 Journey (Technology Consulting)
        // Gracefully retire the pre-Node 07 segment (u <= 0.85) so the corridor leads cleanly into Node 08 terminus
        const t = p - 7.0;
        if (t <= 0.10) {
          const startIndex = 202 * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = 0.46;
        } else {
          const recedeT = Math.min(1.0, (t - 0.10) / (0.85 - 0.10));
          const ease = recedeT * recedeT * (3 - 2 * recedeT);
          const startSeg = Math.floor(THREE.MathUtils.lerp(202, 240, ease));
          const startIndex = startSeg * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = THREE.MathUtils.lerp(0.46, 0.44, ease);
        }
      } else if (p <= 9.0) {
        // p in [8.00, 9.00]: Phase 2 Final Complete System Pull-Back
        const t = p - 8.0;
        if (t <= 0.15) {
          // 0.00–0.15: Hold at Node 08 arrival state
          const startIndex = 240 * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = 0.44;
        } else if (t < 0.85) {
          // 0.15–0.85: As camera retreats, the entire corridor unrolls backwards (240 -> 0)
          // revealing the complete connected 8-node system
          const retreatT = (t - 0.15) / (0.85 - 0.15);
          const ease = retreatT * retreatT * (3 - 2 * retreatT);
          const startSeg = Math.floor(THREE.MathUtils.lerp(240, 0, ease));
          const startIndex = startSeg * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = THREE.MathUtils.lerp(0.44, 0.80, ease);
        } else {
          // 0.85–1.00: Complete system hold — full 280 segments drawn in refined architectural glory
          geom.setDrawRange(0, totalIndices);
          materialRef.current.opacity = 0.80;
        }
      } else {
        // p in [9.00, 10.00]: Stage 13 Section 03 Industries Phase A — Node 08 Bridge
        const t = p - 9.0;
        if (t <= 0.15) {
          // 0.00–0.15: Complete system hold
          geom.setDrawRange(0, totalIndices);
          materialRef.current.opacity = 0.80;
        } else if (t < 0.40) {
          // 0.15–0.40: Corridor contracts decisively toward Node 08, retiring earlier segments
          const contractT = (t - 0.15) / (0.40 - 0.15);
          const ease = contractT * contractT * (3 - 2 * contractT);
          const startSeg = Math.floor(THREE.MathUtils.lerp(0, 279, ease));
          const startIndex = startSeg * indicesPerSegment;
          geom.setDrawRange(startIndex, totalIndices - startIndex);
          materialRef.current.opacity = THREE.MathUtils.lerp(0.80, 0.10, ease);
          if (meshRef.current) meshRef.current.visible = true;
        } else {
          // 0.40–1.00 (p >= 9.40): Corridor completely dissolves as architectural datum & structure take over
          geom.setDrawRange(0, 0);
          materialRef.current.opacity = 0;
          if (meshRef.current) meshRef.current.visible = false;
        }
      }
    }
  });

  return (
    <group name="technology-system-path">
      {/* Tangible Architectural Path */}
      <mesh ref={meshRef} geometry={pathGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          ref={materialRef}
          vertexColors={true}
          roughness={0.38}
          metalness={0.18}
          transparent
          opacity={0.72}
        />
      </mesh>
    </group>
  );
}



