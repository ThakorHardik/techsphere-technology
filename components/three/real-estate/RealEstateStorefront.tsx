"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ConstructionPhases } from "./types";

interface StorefrontProps {
  readonly isDark?: boolean;
  readonly phases?: ConstructionPhases;
}

/**
 * RealEstateStorefront — Ground Floor Commercial Frontage, Café, Steel Canopy & Signage
 * 
 * Recreates the active ground-level street interface from public/industries/real-estate.jpg:
 * - Continuous dark bronze steel canopy fascia wrapping the corner
 * - Floor-to-ceiling commercial display windows with dark metal frames
 * - Warm café interior with glowing pendant lights and service counter
 * - Outdoor sidewalk café seating (bistro tables & chairs)
 * - Residential lobby entry portal with warm architectural sconce
 */
export function RealEstateStorefront({ isDark = false, phases }: StorefrontProps) {
  const { totalWidth, totalDepth, groundHeight } = ARCHITECTURAL_SCALE;

  const fStorefront = phases ? phases.storefront : 1.0;

  // Dark Steel Canopy Fascia Material
  const steelCanopyMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.steelCanopy,
        roughness: 0.35,
        metalness: 0.60,
      }),
    []
  );

  // Storefront Glass Material with high transparency
  const storefrontGlassMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#485868" : REAL_ESTATE_PALETTE.glassSky,
        roughness: 0.05,
        metalness: 0.15,
        transparent: true,
        opacity: 0.65 * fStorefront,
      }),
    [isDark, fStorefront]
  );

  // Warm Wooden Café Counter
  const cafeCounterMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#4A3E34" : "#8A745D",
        roughness: 0.65,
        metalness: 0.10,
      }),
    [isDark]
  );

  // Dark Metal Bistro Furniture
  const furnitureSteelMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2C2622",
        roughness: 0.40,
        metalness: 0.50,
      }),
    []
  );

  // Warm Glowing Pendant Light Material
  const warmPendantMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.interiorWarmGlow,
        emissive: REAL_ESTATE_PALETTE.interiorWarmGlow,
        emissiveIntensity: 0.85 * fStorefront,
        roughness: 0.20,
      }),
    [fStorefront]
  );

  const storefrontWidth = totalWidth * 0.68;
  const storefrontX = 0.44;

  if (fStorefront <= 0.02) return null;

  // Rise from 4cm below into final structural position
  const ySettle = (1.0 - fStorefront) * -0.04;

  return (
    <group name="real-estate-storefront" position={[0, ySettle, 0]}>
      {/* 1. Continuous Structural Steel Header / Canopy Band */}
      <group position={[storefrontX, groundHeight - 0.035, totalDepth / 2 + 0.04]}>
        {/* Main Front Steel Fascia Beam */}
        <mesh material={steelCanopyMat} castShadow>
          <boxGeometry args={[storefrontWidth + 0.12, 0.07, 0.14]} />
        </mesh>
        {/* Architectural Signage Frieze Plate */}
        <mesh position={[0.20, 0, 0.075]} material={steelCanopyMat}>
          <boxGeometry args={[0.95, 0.045, 0.01]} />
        </mesh>
      </group>

      {/* Side Steel Canopy Beam wrapping around the corner */}
      <mesh
        position={[totalWidth / 2 + 0.04, groundHeight - 0.035, 0.10]}
        material={steelCanopyMat}
        castShadow
      >
        <boxGeometry args={[0.14, 0.07, totalDepth * 0.76]} />
      </mesh>

      {/* 2. Front Commercial Display Windows (Floor to Ceiling) */}
      <group position={[storefrontX, groundHeight / 2 - 0.035, totalDepth / 2 - 0.02]}>
        <mesh material={storefrontGlassMat}>
          <boxGeometry args={[storefrontWidth, groundHeight - 0.07, 0.015]} />
        </mesh>
        {/* Storefront Vertical Mullions */}
        {[-0.85, -0.35, 0.15, 0.65].map((xOffset, idx) => (
          <mesh key={`sf-mullion-${idx}`} position={[xOffset, 0, 0.01]} material={steelCanopyMat}>
            <boxGeometry args={[0.016, groundHeight - 0.07, 0.025]} />
          </mesh>
        ))}
      </group>

      {/* 3. Corner Commercial Display Windows (Facing positive X) */}
      <group position={[totalWidth / 2 - 0.02, groundHeight / 2 - 0.035, 0.10]}>
        <mesh material={storefrontGlassMat} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[totalDepth * 0.72, groundHeight - 0.07, 0.015]} />
        </mesh>
        {[-0.45, 0, 0.45].map((zOffset, idx) => (
          <mesh key={`sf-side-mullion-${idx}`} position={[0.01, 0, zOffset]} material={steelCanopyMat}>
            <boxGeometry args={[0.025, groundHeight - 0.07, 0.016]} />
          </mesh>
        ))}
      </group>

      {/* 4. Café Interior Life & Warm Pendant Lighting */}
      <group position={[0.55, 0, totalDepth / 2 - 0.35]}>
        {/* Service Counter Bar */}
        <mesh position={[0, 0.14, 0]} material={cafeCounterMat} castShadow receiveShadow>
          <boxGeometry args={[0.85, 0.28, 0.32]} />
        </mesh>

        {/* Suspended Glowing Pendant Light 1 */}
        <mesh position={[-0.22, groundHeight - 0.14, 0.08]} material={warmPendantMat}>
          <sphereGeometry args={[0.026, 16, 16]} />
        </mesh>
        <pointLight
          position={[-0.22, groundHeight - 0.14, 0.08]}
          color={REAL_ESTATE_PALETTE.interiorWarmGlow}
          intensity={0.65 * fStorefront}
          distance={1.6}
          decay={2}
        />

        {/* Suspended Glowing Pendant Light 2 */}
        <mesh position={[0.22, groundHeight - 0.14, 0.08]} material={warmPendantMat}>
          <sphereGeometry args={[0.026, 16, 16]} />
        </mesh>
        <pointLight
          position={[0.22, groundHeight - 0.14, 0.08]}
          color={REAL_ESTATE_PALETTE.interiorWarmGlow}
          intensity={0.65 * fStorefront}
          distance={1.6}
          decay={2}
        />
      </group>

      {/* 5. Outdoor Sidewalk Bistro Tables & Chairs */}
      {[
        { x: 0.35, z: totalDepth / 2 + 0.36 },
        { x: 0.90, z: totalDepth / 2 + 0.36 },
      ].map((bistro, idx) => (
        <group key={`bistro-${idx}`} position={[bistro.x, 0, bistro.z]} scale={[fStorefront, fStorefront, fStorefront]}>
          {/* Round Table Top */}
          <mesh position={[0, 0.12, 0]} material={furnitureSteelMat} castShadow>
            <cylinderGeometry args={[0.085, 0.085, 0.008, 16]} />
          </mesh>
          {/* Table Pedestal Leg & Base */}
          <mesh position={[0, 0.06, 0]} material={furnitureSteelMat} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />
          </mesh>
          <mesh position={[0, 0.004, 0]} material={furnitureSteelMat} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.008, 12]} />
          </mesh>

          {/* Minimalist Chairs */}
          {[-0.12, 0.12].map((xOffset, cIdx) => (
            <group key={`chair-${cIdx}`} position={[xOffset, 0, 0]}>
              <mesh position={[0, 0.07, 0]} material={furnitureSteelMat} castShadow>
                <boxGeometry args={[0.07, 0.008, 0.07]} />
              </mesh>
              <mesh position={[0, 0.12, cIdx === 0 ? -0.03 : 0.03]} material={furnitureSteelMat} castShadow>
                <boxGeometry args={[0.07, 0.09, 0.006]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* 6. Residential Lobby Entry Portal & Sconce Light */}
      <group position={[-totalWidth / 2 + 0.42, 0, totalDepth / 2]}>
        {/* Double Entrance Glass Door */}
        <mesh position={[0, groundHeight / 2 - 0.04, 0]} material={storefrontGlassMat}>
          <boxGeometry args={[0.42, groundHeight - 0.08, 0.02]} />
        </mesh>
        <mesh position={[0, groundHeight / 2 - 0.04, 0.012]} material={steelCanopyMat}>
          <boxGeometry args={[0.014, groundHeight - 0.08, 0.01]} />
        </mesh>

        {/* Architectural Entrance Sconce Light */}
        <mesh position={[0.26, groundHeight * 0.55, 0.04]} material={warmPendantMat}>
          <boxGeometry args={[0.018, 0.045, 0.018]} />
        </mesh>
        <pointLight
          position={[0.26, groundHeight * 0.55, 0.08]}
          color={REAL_ESTATE_PALETTE.nodeBeaconAccent}
          intensity={0.45 * fStorefront}
          distance={1.2}
          decay={2}
        />
      </group>
    </group>
  );
}
