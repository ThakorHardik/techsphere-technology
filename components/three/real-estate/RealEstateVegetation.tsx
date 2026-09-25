"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ConstructionPhases } from "./types";

interface VegetationProps {
  readonly isDark?: boolean;
  readonly phases?: ConstructionPhases;
}

/**
 * RealEstateVegetation — Refined Architectural Sidewalk Trees & Planters
 * 
 * Recreates the delicate street trees from public/industries/real-estate.jpg:
 * - Slender dark-bronze tree trunks with graceful branching forks
 * - Dappled, organic foliage volumes (olive, sage, golden-olive)
 * - Cast-iron geometric tree grates embedded in granite sidewalk pavers
 * - Storefront base planter beds
 */
export function RealEstateVegetation({ isDark = false, phases }: VegetationProps) {
  const { totalWidth, totalDepth } = ARCHITECTURAL_SCALE;

  const fVeg = phases ? phases.streetscape : 1.0;

  const barkMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#28211A" : REAL_ESTATE_PALETTE.treeBark,
        roughness: 0.85,
        metalness: 0.04,
      }),
    [isDark]
  );

  const foliageOliveMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#485428" : REAL_ESTATE_PALETTE.foliageOlive,
        roughness: 0.78,
        metalness: 0.02,
      }),
    [isDark]
  );

  const foliageSageMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#5C6A3B" : REAL_ESTATE_PALETTE.foliageSage,
        roughness: 0.76,
        metalness: 0.02,
      }),
    [isDark]
  );

  const foliageGoldenMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#6E7A40" : REAL_ESTATE_PALETTE.foliageGolden,
        roughness: 0.74,
        metalness: 0.02,
      }),
    [isDark]
  );

  const grateMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.treeGrate,
        roughness: 0.60,
        metalness: 0.40,
      }),
    []
  );

  // Tree locations on the sidewalk — flanking entrance and framing corner, keeping café view clear
  const trees = React.useMemo(() => [
    // Tree 1: Left flanking street tree beside the residential entrance portal
    {
      x: -0.15,
      z: totalDepth / 2 + 0.42,
      trunkHeight: 0.74,
      trunkRadius: 0.022,
      scale: 0.95,
      primaryColor: foliageOliveMat,
      secondaryColor: foliageSageMat,
    },
    // Tree 2: Right corner street tree near the curb line
    {
      x: 1.60,
      z: totalDepth / 2 + 0.42,
      trunkHeight: 0.68,
      trunkRadius: 0.020,
      scale: 0.90,
      primaryColor: foliageSageMat,
      secondaryColor: foliageGoldenMat,
    },
    // Tree 3: Side-street promenade tree accentuating 3D corner depth
    {
      x: totalWidth / 2 + 0.12,
      z: 0.25,
      trunkHeight: 0.64,
      trunkRadius: 0.020,
      scale: 0.85,
      primaryColor: foliageOliveMat,
      secondaryColor: foliageGoldenMat,
    },
  ], [totalWidth, totalDepth, foliageOliveMat, foliageSageMat, foliageGoldenMat]);

  if (fVeg <= 0.02) return null;

  return (
    <group name="real-estate-vegetation">
      {trees.map((t, idx) => {
        const currentScale = t.scale * fVeg;

        return (
          <group key={`tree-${idx}`} position={[t.x, 0, t.z]} scale={[currentScale, currentScale, currentScale]}>
            {/* Cast-Iron Tree Grate on Sidewalk */}
            <mesh position={[0, 0.002, 0]} material={grateMat} receiveShadow>
              <boxGeometry args={[0.20, 0.004, 0.20]} />
            </mesh>

            {/* Slender Architectural Trunk */}
            <mesh
              position={[0, t.trunkHeight / 2, 0]}
              material={barkMat}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[t.trunkRadius * 0.65, t.trunkRadius, t.trunkHeight, 10]} />
            </mesh>

            {/* Graceful Branching Forks */}
            <mesh position={[0.020, t.trunkHeight * 0.82, 0.012]} rotation={[0.22, 0.25, 0.24]} material={barkMat} castShadow>
              <cylinderGeometry args={[t.trunkRadius * 0.40, t.trunkRadius * 0.60, 0.20, 8]} />
            </mesh>
            <mesh position={[-0.018, t.trunkHeight * 0.78, -0.015]} rotation={[-0.20, -0.22, -0.26]} material={barkMat} castShadow>
              <cylinderGeometry args={[t.trunkRadius * 0.35, t.trunkRadius * 0.55, 0.18, 8]} />
            </mesh>

            {/* Delicate Architectural Foliage Canopy (Airy, dappled clusters) */}
            <group position={[0, t.trunkHeight + 0.12, 0]}>
              {/* Center Core Foliage */}
              <mesh position={[0, 0.02, 0]} material={t.primaryColor} castShadow>
                <icosahedronGeometry args={[0.18, 2]} />
              </mesh>
              {/* Upper Crown Highlight */}
              <mesh position={[0.015, 0.12, 0.015]} scale={[0.80, 0.85, 0.80]} material={t.secondaryColor} castShadow>
                <icosahedronGeometry args={[0.14, 2]} />
              </mesh>
              {/* Left Airy Cluster */}
              <mesh position={[-0.09, -0.02, 0.03]} scale={[0.78, 0.75, 0.78]} material={t.primaryColor} castShadow>
                <icosahedronGeometry args={[0.13, 2]} />
              </mesh>
              {/* Right Airy Cluster */}
              <mesh position={[0.08, -0.01, -0.04]} scale={[0.80, 0.76, 0.80]} material={t.secondaryColor} castShadow>
                <icosahedronGeometry args={[0.13, 2]} />
              </mesh>
              {/* Front Dappled Cluster */}
              <mesh position={[0.02, -0.03, 0.08]} scale={[0.72, 0.70, 0.72]} material={t.primaryColor} castShadow>
                <icosahedronGeometry args={[0.11, 2]} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* Ground Planter Beds with Low Architectural Hedges along Storefront Base */}
      <group position={[0.40, 0, totalDepth / 2 + 0.10]} scale={[fVeg, fVeg, fVeg]}>
        {/* Bronze Planter Trough */}
        <mesh position={[0, 0.025, 0]} material={barkMat} castShadow>
          <boxGeometry args={[0.70, 0.05, 0.10]} />
        </mesh>
        {/* Manicured Boxwood Shrub */}
        <mesh position={[0, 0.065, 0]} material={foliageOliveMat} castShadow>
          <boxGeometry args={[0.66, 0.06, 0.08]} />
        </mesh>
      </group>
    </group>
  );
}
