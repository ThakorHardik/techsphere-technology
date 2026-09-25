"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ConstructionPhases } from "./types";

interface BuildingProps {
  readonly isDark?: boolean;
  readonly phases?: ConstructionPhases;
}

/**
 * RealEstateBuilding — Structural Concrete Massing, Foundation, Floor Slabs, and Columns
 * 
 * Recreates the architectural massing of the reference building (public/industries/real-estate.jpg):
 * - Left exposed concrete circulation core with panel reveal lines and vertical stairwell ribbon
 * - Round concrete ground-floor pilotis columns set back from the glazing
 * - Crisp cantilevered concrete floor slabs (Levels 2-5 & Penthouse roof overhang)
 * - Progressive civil construction assembly:
 *   Ground/Plinth -> Core -> Columns -> Sequential upward floor slabs & roof
 */
export function RealEstateBuilding({ isDark = false, phases }: BuildingProps) {
  const {
    totalWidth,
    totalDepth,
    groundHeight,
    upperFloorHeight,
    penthouseHeight,
    slabThickness,
    slabOverhang,
    columnRadius,
  } = ARCHITECTURAL_SCALE;

  // Active phase factors from 10-step construction model
  const fGround = phases ? phases.ground : 1.0;
  const fCore = phases ? phases.core : 1.0;
  const fColumns = phases ? phases.columns : 1.0;
  const fL2 = phases ? phases.floorL2 : 1.0;
  const fL3 = phases ? phases.floorL3 : 1.0;
  const fL4 = phases ? phases.floorL4 : 1.0;
  const fL5 = phases ? phases.floorL5 : 1.0;
  const fEntrance = phases ? phases.entrance : 1.0;

  // Concrete Materials (Warm limestone-cast architectural precast tone)
  const concreteLightMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? REAL_ESTATE_PALETTE.concreteDark : REAL_ESTATE_PALETTE.concreteLight,
        roughness: 0.74,
        metalness: 0.04,
      }),
    [isDark]
  );

  const concreteMediumMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#4E4841" : REAL_ESTATE_PALETTE.concreteMedium,
        roughness: 0.82,
        metalness: 0.03,
      }),
    [isDark]
  );

  const concreteDarkMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#35302B" : REAL_ESTATE_PALETTE.concreteDark,
        roughness: 0.88,
        metalness: 0.02,
      }),
    [isDark]
  );

  const panelJointMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#28231E" : REAL_ESTATE_PALETTE.concretePanelJoint,
        roughness: 0.95,
        metalness: 0.02,
      }),
    [isDark]
  );

  const columnMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#524B43" : REAL_ESTATE_PALETTE.concreteColumn,
        roughness: 0.76,
        metalness: 0.04,
      }),
    [isDark]
  );

  const stairGlassMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.glassSky,
        roughness: 0.08,
        metalness: 0.20,
        transparent: true,
        opacity: 0.65 * fCore,
      }),
    [fCore]
  );

  const stairMullionMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.steelDark,
        roughness: 0.45,
        metalness: 0.50,
      }),
    []
  );

  const contactShadowMat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: REAL_ESTATE_PALETTE.contactShadow,
        transparent: true,
        opacity: 0.32 * fGround,
      }),
    [fGround]
  );

  // Slab geometry dimensions
  const slabWidth = totalWidth * 0.76;
  const slabDepth = totalDepth + slabOverhang * 2;
  const slabCenterX = 0.38;

  // Total core height when fully constructed
  const totalTowerHeight = groundHeight + 3 * upperFloorHeight + penthouseHeight + 0.12;
  const currentCoreHeight = totalTowerHeight * fCore;

  // Rear concrete perimeter wall — the solid mass visible behind the facade
  // Emerges progressively with fL2 (the first upper floor slab), anchoring the building as a solid form
  const upperZoneHeight = (3 * upperFloorHeight + penthouseHeight) * fL2;
  const upperZoneY = groundHeight + upperZoneHeight / 2;

  // Floor Slabs configurations (Levels 2, 3, 4, 5, and Penthouse Roof Overhang)
  const slabs = React.useMemo(() => [
    {
      level: 2,
      y: groundHeight,
      width: slabWidth,
      depth: slabDepth,
      x: slabCenterX,
      z: 0,
      factor: fL2,
    },
    {
      level: 3,
      y: groundHeight + 1 * upperFloorHeight,
      width: slabWidth,
      depth: slabDepth,
      x: slabCenterX,
      z: 0,
      factor: fL3,
    },
    {
      level: 4,
      y: groundHeight + 2 * upperFloorHeight,
      width: slabWidth,
      depth: slabDepth,
      x: slabCenterX,
      z: 0,
      factor: fL4,
    },
    {
      level: 5,
      y: groundHeight + 3 * upperFloorHeight,
      width: slabWidth - 0.10,
      depth: slabDepth - 0.10,
      x: slabCenterX + 0.05,
      z: -0.05,
      factor: fL5,
    },
    {
      level: 6, // Cantilevered Penthouse Flat Roof Slab
      y: groundHeight + 3 * upperFloorHeight + penthouseHeight,
      width: slabWidth * 0.85,
      depth: slabDepth * 0.88,
      x: slabCenterX + 0.10,
      z: -0.06,
      factor: fL5,
    },
  ], [groundHeight, upperFloorHeight, penthouseHeight, slabWidth, slabDepth, slabCenterX, fL2, fL3, fL4, fL5]);

  // Ground pilotis circular columns
  const columns = React.useMemo(() => [
    { x: -0.10, z: totalDepth / 2 - 0.05 },
    { x: 0.60, z: totalDepth / 2 - 0.05 },
    { x: 1.30, z: totalDepth / 2 - 0.05 },
    { x: totalWidth / 2 - 0.08, z: 0.20 },
    { x: totalWidth / 2 - 0.08, z: -0.50 },
  ], [totalWidth, totalDepth]);

  return (
    <group name="real-estate-building-structure">
      {/* 1. Foundation Plinth & Subtle Ambient Contact Shadow */}
      {fGround > 0.02 && (
        <group position={[0.40, 0, 0]}>
          {/* Subtle Ground Contact Shadow Plane */}
          <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} material={contactShadowMat}>
            <planeGeometry args={[totalWidth + 0.35, totalDepth + 0.35]} />
          </mesh>
          {/* Main Structural Footing Slab */}
          <mesh position={[0, -0.04 * fGround, 0]} material={concreteDarkMat} receiveShadow>
            <boxGeometry args={[totalWidth + 0.16, 0.08 * fGround, totalDepth + 0.16]} />
          </mesh>
          {/* Recessed Plinth Edge Reveal */}
          <mesh position={[0, -0.085, 0]} material={concreteDarkMat}>
            <boxGeometry args={[totalWidth + 0.10, 0.03, totalDepth + 0.10]} />
          </mesh>
        </group>
      )}

      {/* 2. Left Exposed Concrete Circulation Core & Stairwell Atrium */}
      {fCore > 0.02 && (
        <group position={[-totalWidth / 2 + 0.42, currentCoreHeight / 2, 0]}>
          {/* Left Solid Concrete Flank Wall */}
          <mesh position={[-0.18, 0, -0.10]} material={concreteLightMat} castShadow receiveShadow>
            <boxGeometry args={[0.54, currentCoreHeight, totalDepth - 0.20]} />
          </mesh>

          {/* Front Corner Concrete Pier */}
          <mesh position={[-0.24, 0, totalDepth / 2 - 0.16]} material={concreteLightMat} castShadow receiveShadow>
            <boxGeometry args={[0.42, currentCoreHeight, 0.32]} />
          </mesh>

          {/* Right Concrete Pier Framing Stairwell Ribbon */}
          <mesh position={[0.22, 0, totalDepth / 2 - 0.16]} material={concreteLightMat} castShadow receiveShadow>
            <boxGeometry args={[0.34, currentCoreHeight, 0.32]} />
          </mesh>

          {/* Architectural Tie-Rod Panel Reveal Joints (Horizontal) */}
          {[0.25, 0.50, 0.75].map((hRatio, idx) => (
            <mesh
              key={`joint-h-${idx}`}
              position={[-0.24, (hRatio - 0.5) * currentCoreHeight, totalDepth / 2 - 0.002]}
              material={panelJointMat}
            >
              <boxGeometry args={[0.42, 0.006, 0.005]} />
            </mesh>
          ))}

          {/* Vertical Glass Stairwell Ribbon (between front piers) */}
          <mesh position={[-0.01, 0, totalDepth / 2 - 0.16]} material={stairGlassMat}>
            <boxGeometry args={[0.18, currentCoreHeight - 0.04, 0.02]} />
          </mesh>
          {/* Stairwell Dark Bronze Mullions */}
          {[-0.08, 0.08].map((xOff, idx) => (
            <mesh
              key={`stair-mull-${idx}`}
              position={[xOff, 0, totalDepth / 2 - 0.15]}
              material={stairMullionMat}
            >
              <boxGeometry args={[0.012, currentCoreHeight - 0.04, 0.024]} />
            </mesh>
          ))}

          {/* Residential Entrance Canopy Hood (Extends over entry portal) */}
          {fEntrance > 0.05 && (
            <mesh
              position={[0.00, -currentCoreHeight / 2 + groundHeight - 0.04, totalDepth / 2 + 0.14]}
              material={concreteDarkMat}
              castShadow
            >
              <boxGeometry args={[0.50, 0.024, 0.24]} />
            </mesh>
          )}
        </group>
      )}

      {/* 3. Structural Round Pilotis Columns */}
      {fColumns > 0.02 &&
        columns.map((col, idx) => {
          const colHeight = groundHeight * fColumns;
          return (
            <mesh
              key={`pilot-${idx}`}
              position={[col.x, colHeight / 2, col.z]}
              material={columnMat}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[columnRadius, columnRadius, colHeight, 16]} />
            </mesh>
          );
        })}

      {/* 3b. Solid Rear & Side Concrete Perimeter Wall (Structural Mass) */}
      {/* This gives the building its solid volume behind the facade glazing */}
      {fL2 > 0.02 && (
        <group position={[slabCenterX, upperZoneY, 0]}>
          {/* Rear wall (facing negative Z) — main concrete mass behind glazing */}
          <mesh position={[0, 0, -totalDepth / 2 + 0.04]} material={concreteMediumMat} castShadow receiveShadow>
            <boxGeometry args={[slabWidth - 0.04, upperZoneHeight, 0.12]} />
          </mesh>

          {/* Right side wall (facing positive X) — corner street elevation mass */}
          <mesh position={[slabWidth / 2 - 0.06, 0, -0.08]} material={concreteLightMat} castShadow receiveShadow>
            <boxGeometry args={[0.12, upperZoneHeight, totalDepth - 0.22]} />
          </mesh>
        </group>
      )}

      {/* 4. Sequential Upward Cantilevered Concrete Floor Slabs */}
      {slabs.map((slab, idx) => {
        if (slab.factor <= 0.01) return null;
        // Physical vertical rise into structural position from the floor level beneath
        const yOffset = (1.0 - slab.factor) * 0.05;

        return (
          <group
            key={`slab-${idx}`}
            position={[slab.x, slab.y - yOffset, slab.z]}
          >
            {/* Primary Cantilevered Floor Slab Plate */}
            <mesh material={concreteMediumMat} castShadow receiveShadow>
              <boxGeometry args={[slab.width, slabThickness, slab.depth]} />
            </mesh>

            {/* Recessed Underside Shadow Reveal / Drip Groove */}
            <mesh
              position={[0, -slabThickness / 2 - 0.003, 0]}
              material={concreteDarkMat}
            >
              <boxGeometry args={[slab.width - 0.06, 0.006, slab.depth - 0.06]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
