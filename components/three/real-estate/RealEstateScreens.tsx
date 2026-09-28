"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ArchitecturalRevealPhases } from "./types";

interface RealEstateScreensProps {
  readonly isDark?: boolean;
  readonly phases?: ArchitecturalRevealPhases;
}

/**
 * RealEstateScreens — Slim Recessed Architectural Bronze Mullions
 * 
 * Provides rhythmic architectural facade division and solar protection:
 * - Slim architectural bronze sightlines (0.016m width, 0.036m depth)
 * - Recessed safely behind slab edges into the glazing envelope
 * - Warm satin bronze finish with subtle arris daylight specular catch
 * - Replaces heavy black bars with refined, constructed architectural joinery
 */
export function RealEstateScreens({ isDark = false, phases }: RealEstateScreensProps) {
  const { podiumSlabY, roofSlabY, roofSlabX } = ARCHITECTURAL_SCALE;
  const fScreen = phases ? phases.screen : 1.0;

  // Warm Satin Bronze Material for Architectural Mullions
  const bronzeMullionMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#2A221A" : REAL_ESTATE_PALETTE.bronzeSatin,
        roughness: 0.40,
        metalness: 0.46,
        transparent: true,
        opacity: Math.min(1.0, fScreen * 1.5),
      }),
    [isDark, fScreen]
  );

  // Soft Arris Highlight Material (Daylight specular reflection on mullion edges)
  const bronzeHighlightMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#483B2E" : REAL_ESTATE_PALETTE.bronzeHighlight,
        roughness: 0.32,
        metalness: 0.54,
        transparent: true,
        opacity: Math.min(1.0, fScreen * 1.5),
      }),
    [isDark, fScreen]
  );

  const screenHeight = (roofSlabY - podiumSlabY) - 0.12;
  const screenY = (podiumSlabY + roofSlabY) / 2;
  const mullionWidth = 0.016;
  const mullionDepth = 0.036;

  // 3 Slim, elegant architectural bronze mullions spaced across the left bay of the gallery
  // Leaves the center and right bay (sofa, side table, floor lamp) open and clearly visible
  const mullionOffsets = [-0.62, -0.38, -0.14];

  if (fScreen <= 0.02) return null;

  return (
    <group name="real-estate-bronze-mullions" position={[roofSlabX, screenY, 0.025]}>
      {/* Upper & Lower Recessed Bronze Guide Tracks */}
      <mesh position={[-0.38, screenHeight / 2 - 0.006, 0]} material={bronzeMullionMat}>
        <boxGeometry args={[0.58, 0.012, mullionDepth + 0.008]} />
      </mesh>
      <mesh position={[-0.38, -screenHeight / 2 + 0.006, 0]} material={bronzeMullionMat}>
        <boxGeometry args={[0.58, 0.012, mullionDepth + 0.008]} />
      </mesh>

      {/* Slim Recessed Architectural Bronze Mullions */}
      {mullionOffsets.map((xPos, i) => (
        <group key={`mullion-${i}`} position={[xPos, 0, 0]}>
          {/* Main Mullion Profile */}
          <mesh material={bronzeMullionMat} castShadow receiveShadow>
            <boxGeometry args={[mullionWidth, screenHeight - 0.012, mullionDepth]} />
          </mesh>
          {/* Exposed Edge Specular Arris Catch */}
          <mesh position={[0, 0, mullionDepth / 2 + 0.001]} material={bronzeHighlightMat}>
            <boxGeometry args={[0.003, screenHeight - 0.014, 0.002]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
