"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  ARCHITECTURAL_SCALE,
  RealEstateEnvironmentProps,
  ArchitecturalRevealPhases,
  computeArchitecturalPhases,
} from "./types";
import { RealEstateStructure } from "./RealEstateStructure";
import { RealEstateScreens } from "./RealEstateScreens";
import { RealEstateDatum } from "./RealEstateDatum";

/**
 * RealEstateEnvironment — Master 3D Architectural Scene for Section 03 (Real Estate v3)
 * 
 * Embeds directly inside the existing persistent TechnologySystemScene Canvas:
 * - Exactly 2 homepage Canvases (zero duplicate WebGL contexts, zero remounts)
 * - 100% idle/invisible for Nodes 01–08 (p < 8.95), consuming zero GPU render time
 * - High-precision architectural daylight illumination with true shadow mapping & chiaroscuro
 * - Houses the monolithic limestone mass, deep void, cantilevered slabs, and timber louvers
 * - Smooth architectural reveal driven deterministically across p in [9.00, 10.00]
 */
export function RealEstateEnvironment({
  progressRef,
  progress: externalProgress,
  isDark = false,
  isMobile = false,
}: RealEstateEnvironmentProps) {
  const masterGroupRef = useRef<THREE.Group>(null);
  const buildingGroupRef = useRef<THREE.Group>(null);
  const lastPRef = useRef<number>(-1);
  const isVisibleRef = useRef<boolean>(false);

  const [phases, setPhases] = useState<ArchitecturalRevealPhases>(() => computeArchitecturalPhases(0));

  const { buildingPos: desktopBuildingPos, buildingRotationY } = ARCHITECTURAL_SCALE;
  const currentBuildingPos: [number, number, number] = isMobile
    ? [-0.04, -1.08, -2.85]
    : [desktopBuildingPos[0], desktopBuildingPos[1], desktopBuildingPos[2]];
  const currentScale = isMobile ? 0.72 : 0.92;

  // Master scale calibrated so building has substantial architectural weight
  // On desktop: X: 44-93%, Y: 24-78%
  // On mobile: Zone 2 lower band (Y: 52-88%), strictly below editorial copy
  useEffect(() => {
    if (masterGroupRef.current) {
      masterGroupRef.current.scale.set(currentScale, currentScale, currentScale);
    }
  }, [currentScale]);

  useFrame(() => {
    if (!masterGroupRef.current) return;

    const p = progressRef ? progressRef.current : typeof externalProgress === "number" ? externalProgress : 0;

    // Strict performance optimization: completely invisible during Nodes 01–08 corridor
    if (p < 8.25) {
      if (isVisibleRef.current) {
        masterGroupRef.current.visible = false;
        isVisibleRef.current = false;
      }
      return;
    }

    if (!isVisibleRef.current) {
      masterGroupRef.current.visible = true;
      isVisibleRef.current = true;
    }

    // Update phases state with minimum delta threshold to prevent unnecessary re-renders
    const delta = Math.abs(p - lastPRef.current);
    if (delta >= 0.002 || (p >= 9.95 && lastPRef.current < 9.95)) {
      lastPRef.current = p;
      setPhases(computeArchitecturalPhases(p));
    }

    // Subtle architectural grounding: structure settles gently into final rock-solid rest
    if (buildingGroupRef.current) {
      const ph = computeArchitecturalPhases(p);
      const settleEase = ph.ground;
      const ySettle = THREE.MathUtils.lerp(currentBuildingPos[1] - 0.02, currentBuildingPos[1], settleEase);
      buildingGroupRef.current.position.set(currentBuildingPos[0], ySettle, currentBuildingPos[2]);
    }
  });

  return (
    <group ref={masterGroupRef} name="real-estate-3d-environment" visible={false}>
      {/* ─────────────────────────────────────────────────────────────
          ARCHITECTURAL DAYLIGHTING RIG WITH SHADOW MAPPING
          Dominant warm key sun + cool atmospheric skylight + warm bounce
          ───────────────────────────────────────────────────────────── */}
      {/* 1. Key Sun: High-intensity raking light casting crisp diagonal architectural shadows */}
      <directionalLight
        position={[-5.4, 6.2, 4.2]}
        intensity={isDark ? 2.4 : 3.1}
        color={isDark ? "#FFF4E8" : "#FFF8EE"}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-3.8}
        shadow-camera-right={3.8}
        shadow-camera-top={3.8}
        shadow-camera-bottom={-3.8}
        shadow-bias={-0.0004}
        shadow-radius={1.5}
      />

      {/* 2. Atmospheric Sky Fill: Soft neutral daylight keeping deep recesses luminous without flattening */}
      <ambientLight
        intensity={isDark ? 0.16 : 0.22}
        color={isDark ? "#8C98A2" : "#D8DFE4"}
      />

      {/* 3. Ground Bounce Light: Warm floor reflection softly revealing stone slab soffits */}
      <directionalLight
        position={[0.5, -4.0, 1.0]}
        intensity={0.15}
        color={isDark ? "#2A2016" : "#483B2C"}
      />

      {/* ─────────────────────────────────────────────────────────────
          ARCHITECTURAL STRUCTURE & SELECTIVE TIMBER SCREEN
          Positioned firmly on right side of desktop viewport (X >= 46%)
          ───────────────────────────────────────────────────────────── */}
      <group
        ref={buildingGroupRef}
        position={currentBuildingPos}
        rotation={[0, buildingRotationY, 0]}
      >
        {/* Monolithic Limestone Mass, Deep Two-Story Void, Slabs & Glazing */}
        <RealEstateStructure isDark={isDark} phases={phases} />

        {/* Selective Natural Architectural Teak Timber Louver Screen */}
        <RealEstateScreens isDark={isDark} phases={phases} />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          RESTRAINED ARCHITECTURAL STRUCTURAL AXIS
          Subtle warm-bronze alignment datum linking Node 08 to the site
          ───────────────────────────────────────────────────────────── */}
      <RealEstateDatum isDark={isDark} phases={phases} />
    </group>
  );
}
