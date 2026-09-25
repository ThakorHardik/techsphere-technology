"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ConstructionPhases } from "./types";

interface ScreensProps {
  readonly isDark?: boolean;
  readonly phases?: ConstructionPhases;
}

/**
 * RealEstateScreens — Instanced Architectural Teak Timber Louver Screens
 * 
 * Recreates the rhythmic sliding timber louver screens from public/industries/real-estate.jpg:
 * - Alternating rhythm across Levels 2, 3, and 4
 * - Fine vertical teak battens enclosed in subtle dark bronze sliding perimeter frames
 * - Rendered using an InstancedMesh for 1 single draw call and 60fps performance
 * - Beautiful warm golden teak contrast against concrete and glass
 * - Materials are mutated in-place to avoid GPU thrashing on phase transitions
 */
export function RealEstateScreens({ isDark = false, phases }: ScreensProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timberMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const trackMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const { totalWidth, totalDepth, groundHeight, upperFloorHeight } = ARCHITECTURAL_SCALE;

  const fScreens = phases ? phases.timberScreens : 1.0;

  // Slat geometry parameters
  const slatWidth = 0.008; // Delicate architectural timber batten
  const slatHeight = upperFloorHeight - 0.055;
  const slatDepth = 0.012;
  const slatSpacing = 0.024;

  // Define screen panels across the building facade matching the reference photograph
  const panels = React.useMemo(() => {
    const list: { level: number; xCenter: number; z: number; width: number; isSide?: boolean }[] = [];

    // Front facade panels (facing positive Z):
    // Level 2 (residential lower floor): 2 sliding screen bays
    list.push({ level: 1, xCenter: 0.18, z: totalDepth / 2 + 0.018, width: 0.48 });
    list.push({ level: 1, xCenter: 0.90, z: totalDepth / 2 + 0.018, width: 0.44 });

    // Level 3 (residential mid floor): 3 alternating screen bays
    list.push({ level: 2, xCenter: -0.16, z: totalDepth / 2 + 0.018, width: 0.42 });
    list.push({ level: 2, xCenter: 0.52, z: totalDepth / 2 + 0.018, width: 0.46 });
    list.push({ level: 2, xCenter: 1.18, z: totalDepth / 2 + 0.018, width: 0.40 });

    // Level 4 (residential upper floor): 2 staggered screen bays
    list.push({ level: 3, xCenter: 0.22, z: totalDepth / 2 + 0.018, width: 0.48 });
    list.push({ level: 3, xCenter: 0.88, z: totalDepth / 2 + 0.018, width: 0.46 });

    // Side facade panels (facing positive X, street corner)
    list.push({ level: 2, xCenter: totalWidth / 2 + 0.015, z: 0.08, width: 0.44, isSide: true });
    list.push({ level: 3, xCenter: totalWidth / 2 + 0.015, z: -0.38, width: 0.44, isSide: true });

    return list;
  }, [totalWidth, totalDepth]);

  // Compute all batten matrix coordinates
  const slatPositions = React.useMemo(() => {
    const items: { x: number; y: number; z: number; rotY: number }[] = [];

    panels.forEach((p) => {
      const y = groundHeight + (p.level - 1) * upperFloorHeight + upperFloorHeight / 2 + 0.015;
      const numSlats = Math.floor(p.width / slatSpacing);
      const halfW = (numSlats * slatSpacing) / 2;

      for (let i = 0; i < numSlats; i++) {
        const offset = -halfW + i * slatSpacing + slatSpacing / 2;
        if (p.isSide) {
          items.push({
            x: p.xCenter,
            y,
            z: p.z + offset,
            rotY: Math.PI / 2,
          });
        } else {
          items.push({
            x: p.xCenter + offset,
            y,
            z: p.z,
            rotY: 0,
          });
        }
      }
    });

    return items;
  }, [panels, groundHeight, upperFloorHeight, slatSpacing]);

  // Update instanced mesh transforms when fScreens or slatPositions change
  useEffect(() => {
    if (!meshRef.current || fScreens <= 0.01) return;

    const dummy = new THREE.Object3D();
    const ySettle = (1.0 - fScreens) * 0.06;

    slatPositions.forEach((pos, idx) => {
      dummy.position.set(pos.x, pos.y + ySettle, pos.z);
      dummy.rotation.set(0, pos.rotY, 0);
      dummy.scale.set(1, fScreens, 1);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(idx, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [slatPositions, fScreens]);

  // Mutate material opacity in-place rather than recreating materials
  useEffect(() => {
    if (timberMatRef.current) {
      timberMatRef.current.opacity = fScreens;
      timberMatRef.current.needsUpdate = true;
    }
    if (trackMatRef.current) {
      trackMatRef.current.opacity = Math.min(1, fScreens * 1.2);
      trackMatRef.current.needsUpdate = true;
    }
  }, [fScreens]);

  // Stable material color update when isDark changes
  useEffect(() => {
    if (timberMatRef.current) {
      timberMatRef.current.color.set(isDark ? REAL_ESTATE_PALETTE.timberLouverDark : REAL_ESTATE_PALETTE.timberLouver);
      timberMatRef.current.needsUpdate = true;
    }
  }, [isDark]);

  if (fScreens <= 0.01) return null;

  return (
    <group name="real-estate-timber-louvers">
      {/* 1. Instanced Vertical Teak Slat Battens */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, slatPositions.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[slatWidth, slatHeight, slatDepth]} />
        <meshStandardMaterial
          ref={timberMatRef}
          color={isDark ? REAL_ESTATE_PALETTE.timberLouverDark : REAL_ESTATE_PALETTE.timberLouver}
          roughness={0.55}
          metalness={0.06}
          transparent
          opacity={fScreens}
        />
      </instancedMesh>

      {/* 2. Top & Bottom Sliding Screen Mounting Runner Tracks */}
      {panels.map((p, idx) => {
        const yBase = groundHeight + (p.level - 1) * upperFloorHeight + upperFloorHeight / 2 + 0.015;
        const trackYTop = yBase + slatHeight / 2 + 0.005;
        const trackYBot = yBase - slatHeight / 2 - 0.005;

        return (
          <group key={`track-${idx}`}>
            {/* Top runner track */}
            <mesh
              position={[p.xCenter, trackYTop, p.z]}
              rotation={[0, p.isSide ? Math.PI / 2 : 0, 0]}
            >
              <boxGeometry args={[p.width + 0.01, 0.008, 0.016]} />
              <meshStandardMaterial
                ref={idx === 0 ? trackMatRef : undefined}
                color={REAL_ESTATE_PALETTE.steelDark}
                roughness={0.40}
                metalness={0.50}
                transparent
                opacity={Math.min(1, fScreens * 1.2)}
              />
            </mesh>
            {/* Bottom runner track */}
            <mesh
              position={[p.xCenter, trackYBot, p.z]}
              rotation={[0, p.isSide ? Math.PI / 2 : 0, 0]}
            >
              <boxGeometry args={[p.width + 0.01, 0.008, 0.016]} />
              <meshStandardMaterial
                color={REAL_ESTATE_PALETTE.steelDark}
                roughness={0.40}
                metalness={0.50}
                transparent
                opacity={Math.min(1, fScreens * 1.2)}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
