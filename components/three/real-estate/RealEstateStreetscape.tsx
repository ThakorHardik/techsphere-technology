"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ConstructionPhases } from "./types";

interface StreetscapeProps {
  readonly isDark?: boolean;
  readonly phases?: ConstructionPhases;
}

/**
 * RealEstateStreetscape — Confined Architectural Sidewalk Plaza & Granite Curb
 * 
 * Recreates the physical ground context from the reference photograph:
 * - Phase 9: Confined pedestrian plaza and chiseled curb settle
 * - Raised pedestrian sidewalk with light granite paving pavers
 * - Chiseled stone curb edge with restrained architectural stone street border
 * - Zero sprawling roads or clutter invading the left editorial typography safe zone
 */
export function RealEstateStreetscape({ isDark = false, phases }: StreetscapeProps) {
  const { totalDepth, sidewalkHeight } = ARCHITECTURAL_SCALE;

  const fPlaza = phases ? phases.streetscape : 1.0;

  const sidewalkMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#484139" : REAL_ESTATE_PALETTE.sidewalkPaver,
        roughness: 0.82,
        metalness: 0.02,
        transparent: true,
        opacity: fPlaza,
      }),
    [isDark, fPlaza]
  );

  const curbMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#3E3730" : REAL_ESTATE_PALETTE.curbStone,
        roughness: 0.72,
        metalness: 0.04,
        transparent: true,
        opacity: fPlaza,
      }),
    [isDark, fPlaza]
  );


  // Confined plaza dimensions tightly framing building without encroaching left editorial space
  const plazaWidth = 2.70;
  const plazaDepth = 2.00;
  const plazaCenterX = 0.85;
  const plazaCenterZ = totalDepth / 2 + 0.35;

  if (fPlaza <= 0.02) return null;

  const ySettle = (1.0 - fPlaza) * -0.06;

  return (
    <group name="real-estate-streetscape" position={[0, ySettle, 0]}>
      {/* 1. Raised Pedestrian Sidewalk Slab */}
      <mesh
        position={[plazaCenterX, -sidewalkHeight / 2, plazaCenterZ]}
        material={sidewalkMat}
        receiveShadow
      >
        <boxGeometry args={[plazaWidth, sidewalkHeight, plazaDepth]} />
      </mesh>

      {/* 2. Chiseled Stone Curb Edges */}
      {/* Front Curb Line */}
      <mesh
        position={[plazaCenterX, -sidewalkHeight / 2, plazaCenterZ + plazaDepth / 2 - 0.025]}
        material={curbMat}
        receiveShadow
      >
        <boxGeometry args={[plazaWidth + 0.02, sidewalkHeight + 0.005, 0.05]} />
      </mesh>

      {/* Side Curb Line (Right Corner) */}
      <mesh
        position={[
          plazaCenterX + plazaWidth / 2 - 0.025,
          -sidewalkHeight / 2,
          plazaCenterZ,
        ]}
        material={curbMat}
        receiveShadow
      >
        <boxGeometry args={[0.05, sidewalkHeight + 0.005, plazaDepth]} />
      </mesh>

      {/* Side Curb Line (Left Corner) */}
      <mesh
        position={[
          plazaCenterX - plazaWidth / 2 + 0.025,
          -sidewalkHeight / 2,
          plazaCenterZ,
        ]}
        material={curbMat}
        receiveShadow
      >
        <boxGeometry args={[0.05, sidewalkHeight + 0.005, plazaDepth]} />
      </mesh>

      {/* 3. Granite Bevel Plinth Border */}
      <mesh
        position={[plazaCenterX, -sidewalkHeight - 0.005, plazaCenterZ]}
        material={curbMat}
        receiveShadow
      >
        <boxGeometry args={[plazaWidth + 0.04, 0.010, plazaDepth + 0.04]} />
      </mesh>
    </group>
  );
}
