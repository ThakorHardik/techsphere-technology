"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ArchitecturalRevealPhases } from "./types";

interface RealEstateScreensProps {
  readonly isDark?: boolean;
  readonly phases?: ArchitecturalRevealPhases;
}

/**
 * RealEstateScreens — Deliberate Natural Architectural Timber Louvers
 * 
 * Provides tactile warmth and human scale against the limestone monolith:
 * - Exactly 5 deliberate, well-spaced vertical teak/walnut architectural fins
 * - Natural warm wood materiality with subtle matte diffuse finish (no repetitive orange bars)
 * - Clean architectural bronze guide tracks top and bottom
 */
export function RealEstateScreens({ isDark = false, phases }: RealEstateScreensProps) {
  const { podiumSlabY, roofSlabY } = ARCHITECTURAL_SCALE;
  const fScreen = phases ? phases.screen : 1.0;

  // Natural roasted teak timber tones with subtle grain/roughness variation across individual slats
  const timberMaterials = React.useMemo(() => {
    const finTonesLight = ["#492B15", "#4E3019", "#452712", "#4B2D16"];
    const finTonesDark = ["#331E0F", "#372212", "#2F1B0D", "#352010"];
    const finRoughness = [0.68, 0.72, 0.70, 0.74];

    return Array.from({ length: 4 }, (_, i) =>
      new THREE.MeshStandardMaterial({
        color: isDark ? finTonesDark[i] : finTonesLight[i],
        roughness: finRoughness[i],
        metalness: 0.02,
        transparent: true,
        opacity: Math.min(1.0, fScreen * 1.5),
      })
    );
  }, [isDark, fScreen]);

  // Material: Integrated Architectural Bronze Louver Tracks
  const trackMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#1C1611" : REAL_ESTATE_PALETTE.timberTrack,
        roughness: 0.42,
        metalness: 0.46,
        transparent: true,
        opacity: Math.min(1.0, fScreen * 1.5),
      }),
    [isDark, fScreen]
  );

  // Louver screen dimensions (4 substantial architectural vertical solar fins)
  const screenHeight = (roofSlabY - podiumSlabY) - 0.10;
  const screenY = (podiumSlabY + roofSlabY) / 2;
  const louverWidth = 0.064;
  const louverDepth = 0.12;
  const count = 4;
  const startX = 0.15;
  const endX = 0.58;
  const stepX = (endX - startX) / (count - 1);

  if (fScreen <= 0.02) return null;

  return (
    <group name="real-estate-timber-screens" position={[0, screenY, 0.44]}>
      {/* Upper & Lower Integrated Architectural Bronze Guide Runners */}
      <mesh position={[(startX + endX) / 2, screenHeight / 2 - 0.010, 0]} material={trackMat}>
        <boxGeometry args={[endX - startX + 0.14, 0.022, louverDepth + 0.02]} />
      </mesh>
      <mesh position={[(startX + endX) / 2, -screenHeight / 2 + 0.010, 0]} material={trackMat}>
        <boxGeometry args={[endX - startX + 0.14, 0.022, louverDepth + 0.02]} />
      </mesh>

      {/* 4 Substantial Architectural Timber Solar Fins with Natural Micro-Variation */}
      {Array.from({ length: count }, (_, i) => {
        const xPos = startX + i * stepX;
        return (
          <mesh
            key={`louver-${i}`}
            position={[xPos, 0, 0]}
            material={timberMaterials[i]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[louverWidth, screenHeight - 0.020, louverDepth]} />
          </mesh>
        );
      })}
    </group>
  );
}
