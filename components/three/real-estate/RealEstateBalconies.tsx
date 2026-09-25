"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ConstructionPhases } from "./types";

interface BalconiesProps {
  readonly isDark?: boolean;
  readonly phases?: ConstructionPhases;
}

/**
 * RealEstateBalconies — Cantilevered Balconies, Glass Balustrades, and Perimeter Planters
 * 
 * Recreates the wrapping corner balconies and planters from public/industries/real-estate.jpg:
 * - Level 2 continuous corner cantilever balcony wrapping the front and right facades
 * - Levels 3 & 4 rhythmic cantilevered balconies
 * - Level 5 rooftop garden setback planter
 * - Laminated clear safety glass balustrades with dark bronze handrail cap
 * - Weathered bronze trough planters with organic green foliage
 */
export function RealEstateBalconies({ isDark = false, phases }: BalconiesProps) {
  const { totalWidth, totalDepth, groundHeight, upperFloorHeight, slabOverhang } = ARCHITECTURAL_SCALE;

  const fBalconies = phases ? phases.balconies : 1.0;

  // Laminated clear balcony glass material
  const glassRailingMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#485866" : REAL_ESTATE_PALETTE.glassBalustrade,
        roughness: 0.10,
        metalness: 0.12,
        transparent: true,
        opacity: 0.62 * fBalconies,
      }),
    [isDark, fBalconies]
  );

  // Dark Bronze Handrail & Hardware Material
  const handrailMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.steelDark,
        roughness: 0.35,
        metalness: 0.50,
      }),
    []
  );

  // Architectural Planter Trough Material
  const planterBoxMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#38312B" : "#7A6E63",
        roughness: 0.80,
        metalness: 0.08,
      }),
    [isDark]
  );

  // Lush Balcony Greenery Foliage Material
  const foliageMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.foliageOlive,
        roughness: 0.75,
        metalness: 0.02,
      }),
    []
  );

  const foliageHighlightMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.foliageSage,
        roughness: 0.72,
        metalness: 0.02,
      }),
    []
  );

  // Balcony definitions matching the reference photo
  const balconies = React.useMemo(() => [
    // Level 2 (Continuous Corner Balcony wrapping front and right corner)
    {
      level: 1,
      x: 0.46,
      z: totalDepth / 2 + slabOverhang,
      width: totalWidth * 0.68,
      hasSideRailing: true,
      sideLength: 0.55,
      planters: [
        { x: -0.15, width: 0.42 },
        { x: 0.85, width: 0.38 },
      ],
    },
    // Level 3 (Cantilevered Left and Mid Balconies)
    {
      level: 2,
      x: 0.10,
      z: totalDepth / 2 + slabOverhang,
      width: totalWidth * 0.42,
      hasSideRailing: false,
      sideLength: 0,
      planters: [{ x: 0.05, width: 0.34 }],
    },
    // Level 4 (Cantilevered Corner and Mid Balcony)
    {
      level: 3,
      x: 0.70,
      z: totalDepth / 2 + slabOverhang,
      width: totalWidth * 0.50,
      hasSideRailing: true,
      sideLength: 0.45,
      planters: [
        { x: 0.55, width: 0.36 },
        { x: 0.95, width: 0.32 },
      ],
    },
    // Level 5 (Rooftop Setback Terrace Planter)
    {
      level: 4,
      x: 0.35,
      z: totalDepth * 0.22,
      width: totalWidth * 0.52,
      hasSideRailing: false,
      sideLength: 0,
      planters: [{ x: 0.30, width: 0.48 }],
    },
  ], [totalWidth, totalDepth, slabOverhang]);

  const railingHeight = 0.105;

  if (fBalconies <= 0.02) return null;

  // Gentle physical extension into place along Z
  const zExtension = (1.0 - fBalconies) * -0.05;

  return (
    <group name="real-estate-balconies">
      {balconies.map((b, bIdx) => {
        const yBase = groundHeight + (b.level - 1) * upperFloorHeight + 0.024;

        return (
          <group
            key={`balcony-${bIdx}`}
            position={[b.x, yBase, b.z + zExtension]}
            scale={[fBalconies, fBalconies, fBalconies]}
          >
            {/* Front Laminated Glass Balustrade */}
            <mesh position={[0, railingHeight / 2, 0]} material={glassRailingMat}>
              <boxGeometry args={[b.width, railingHeight, 0.008]} />
            </mesh>

            {/* Dark Bronze Top Handrail Cap */}
            <mesh position={[0, railingHeight + 0.004, 0]} material={handrailMat}>
              <boxGeometry args={[b.width + 0.01, 0.008, 0.014]} />
            </mesh>

            {/* Structural Stainless Posts / Spigots */}
            {[-b.width / 2 + 0.02, 0, b.width / 2 - 0.02].map((xPost, pIdx) => (
              <mesh key={`post-${pIdx}`} position={[xPost, railingHeight / 2, 0]} material={handrailMat}>
                <boxGeometry args={[0.008, railingHeight, 0.010]} />
              </mesh>
            ))}

            {/* Corner Wraparound Side Balustrade */}
            {b.hasSideRailing && (
              <group position={[b.width / 2, 0, -b.sideLength / 2]}>
                <mesh position={[0, railingHeight / 2, 0]} material={glassRailingMat}>
                  <boxGeometry args={[0.008, railingHeight, b.sideLength]} />
                </mesh>
                <mesh position={[0, railingHeight + 0.004, 0]} material={handrailMat}>
                  <boxGeometry args={[0.014, 0.008, b.sideLength + 0.01]} />
                </mesh>
              </group>
            )}

            {/* Architectural Integrated Planter Troughs */}
            {b.planters?.map((p, pIdx) => (
              <group key={`planter-${pIdx}`} position={[p.x - b.x, 0.02, 0.018]}>
                {/* Weathered Bronze Trough Box */}
                <mesh position={[0, 0.025, 0]} material={planterBoxMat} castShadow>
                  <boxGeometry args={[p.width, 0.050, 0.040]} />
                </mesh>
                {/* Organic Green Foliage Mound */}
                <mesh position={[0, 0.055, 0]} material={pIdx % 2 === 0 ? foliageMat : foliageHighlightMat}>
                  <boxGeometry args={[p.width - 0.01, 0.035, 0.036]} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
}
