"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ConstructionPhases } from "./types";

interface FacadeProps {
  readonly isDark?: boolean;
  readonly phases?: ConstructionPhases;
}

/**
 * RealEstateFacade — Glass Curtain Walls, Window Mullions, and Interior Parallax Depth
 * 
 * Recreates the clean daylight reflections and glazed facade modules matching real-estate.jpg:
 * - 4-bay floor-to-ceiling sliding window glazing on Levels 2, 3, 4
 * - Corner side facade glazing wrapping the street corner
 * - Level 5 penthouse setback clerestory ribbon
 * - High-specular daylight reflection with dark bronze architectural mullions
 * - Layered interior depth partitions and ceiling planes visible through the glass
 */
export function RealEstateFacade({ isDark = false, phases }: FacadeProps) {
  const {
    totalWidth,
    totalDepth,
    groundHeight,
    upperFloorHeight,
    penthouseHeight,
  } = ARCHITECTURAL_SCALE;

  const fGlazing = phases ? phases.glazing : 1.0;

  // Daylight sky reflection glass material
  const glassMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#485868" : REAL_ESTATE_PALETTE.glassSky,
        roughness: 0.06,
        metalness: 0.22,
        transparent: true,
        opacity: 0.70 * fGlazing,
      }),
    [isDark, fGlazing]
  );

  // Dark Bronze Steel Mullion Material
  const steelMullionMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.steelDark,
        roughness: 0.40,
        metalness: 0.50,
      }),
    []
  );

  // Interior Wall Material (creates authentic parallax depth behind glass)
  const interiorWallMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#453B32" : REAL_ESTATE_PALETTE.interiorWall,
        roughness: 0.85,
        metalness: 0.02,
        transparent: true,
        opacity: fGlazing,
      }),
    [isDark, fGlazing]
  );

  // Interior Ceiling Material
  const interiorCeilingMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#38312B" : REAL_ESTATE_PALETTE.interiorCeiling,
        roughness: 0.88,
        metalness: 0.02,
        transparent: true,
        opacity: fGlazing,
      }),
    [isDark, fGlazing]
  );

  // 3 Upper Residential Floors (Levels 2, 3, 4)
  const upperLevels = [1, 2, 3];
  const windowBayWidth = totalWidth * 0.68;
  const windowBayX = 0.44;

  if (fGlazing <= 0.02) return null;

  const zSlide = (1.0 - fGlazing) * -0.05;

  return (
    <group name="real-estate-facade" position={[0, 0, zSlide]}>
      {/* 1. Upper Levels (L2, L3, L4) Main Facade Glazing & Mullion Grids */}
      {upperLevels.map((lvl) => {
        const yCenter = groundHeight + (lvl - 1) * upperFloorHeight + upperFloorHeight / 2;
        const glassHeight = upperFloorHeight - 0.035;

        return (
          <group key={`facade-lvl-${lvl}`} position={[windowBayX, yCenter, totalDepth / 2 - 0.015]}>
            {/* Main Front Glass Pane */}
            <mesh material={glassMat}>
              <boxGeometry args={[windowBayWidth, glassHeight, 0.010]} />
            </mesh>

            {/* 4-Bay Vertical Mullions */}
            {[-0.75, -0.25, 0.25, 0.75].map((xOffset, mIdx) => (
              <mesh key={`mullion-${mIdx}`} position={[xOffset, 0, 0.008]} material={steelMullionMat}>
                <boxGeometry args={[0.014, glassHeight, 0.020]} />
              </mesh>
            ))}

            {/* Horizontal Head & Sill Profiles */}
            <mesh position={[0, glassHeight / 2 - 0.006, 0.008]} material={steelMullionMat}>
              <boxGeometry args={[windowBayWidth, 0.012, 0.018]} />
            </mesh>
            <mesh position={[0, -glassHeight / 2 + 0.006, 0.008]} material={steelMullionMat}>
              <boxGeometry args={[windowBayWidth, 0.012, 0.018]} />
            </mesh>

            {/* Recessed Interior Partition Depth Wall */}
            <mesh position={[0, 0, -0.18]} material={interiorWallMat}>
              <boxGeometry args={[windowBayWidth - 0.06, glassHeight - 0.02, 0.01]} />
            </mesh>

            {/* Recessed Interior Ceiling Plane */}
            <mesh position={[0, glassHeight / 2 - 0.01, -0.10]} material={interiorCeilingMat}>
              <boxGeometry args={[windowBayWidth - 0.06, 0.01, 0.18]} />
            </mesh>
          </group>
        );
      })}

      {/* 2. Side Street Corner Glazing (Facing positive X) */}
      {upperLevels.map((lvl) => {
        const yCenter = groundHeight + (lvl - 1) * upperFloorHeight + upperFloorHeight / 2;
        const glassHeight = upperFloorHeight - 0.035;
        const sideGlassDepth = totalDepth * 0.72;

        return (
          <group key={`side-facade-${lvl}`} position={[totalWidth / 2 - 0.015, yCenter, -0.08]}>
            <mesh material={glassMat} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[sideGlassDepth, glassHeight, 0.010]} />
            </mesh>
            {[-0.45, 0, 0.45].map((zOffset, smIdx) => (
              <mesh key={`side-mullion-${smIdx}`} position={[0.008, 0, zOffset]} material={steelMullionMat}>
                <boxGeometry args={[0.018, glassHeight, 0.014]} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* 3. Level 5 Penthouse Clerestory Glazing Ribbon */}
      <group
        position={[
          0.26,
          groundHeight + 3 * upperFloorHeight + penthouseHeight / 2,
          totalDepth * 0.16,
        ]}
      >
        <mesh material={glassMat}>
          <boxGeometry args={[totalWidth * 0.65, penthouseHeight - 0.04, 0.010]} />
        </mesh>
        {[-0.60, -0.20, 0.20, 0.60].map((xOffset, pIdx) => (
          <mesh key={`pent-mullion-${pIdx}`} position={[xOffset, 0, 0.008]} material={steelMullionMat}>
            <boxGeometry args={[0.012, penthouseHeight - 0.04, 0.018]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
