"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ArchitecturalRevealPhases } from "./types";

interface RealEstateDatumProps {
  readonly isDark?: boolean;
  readonly phases?: ArchitecturalRevealPhases;
}

/**
 * RealEstateDatum — Subtle Architectural Structural Axis
 * 
 * Provides the restrained architectural bridge connecting Node 08 to Real Estate:
 * - A single, precise warm-bronze alignment datum linking Node 08 to the site foundation axis
 * - Active strictly during the transition (p in [9.00, 9.35])
 * - Completely dissolves to 0.00 at final Real Estate frame (p >= 9.50)
 * - Zero floating helper lines or construction guides at final state
 */
export function RealEstateDatum({ isDark = false, phases }: RealEstateDatumProps) {
  const { node08Coordinate, datumAnchorPoint } = ARCHITECTURAL_SCALE;
  const fDatum = phases ? phases.datum : 0.0;
  const fMonolith = phases ? phases.monolith : 1.0;

  // Active opacity: peaks as datum establishes, strictly 0 as monolith solidifies
  const datumOpacity = Math.max(0, fDatum * (1.0 - Math.min(1.0, fMonolith * 1.25)));

  // Material: Restrained Warm-Bronze Architectural Datum Line
  const datumMat = React.useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: isDark ? "#DFC19C" : REAL_ESTATE_PALETTE.datumLine,
        transparent: true,
        opacity: datumOpacity * 0.70,
        linewidth: 1,
      }),
    [isDark, datumOpacity]
  );

  // Material: Datum Foundation Anchor Point
  const anchorMat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: isDark ? "#FFE4BA" : REAL_ESTATE_PALETTE.datumCore,
        transparent: true,
        opacity: datumOpacity * 0.80,
      }),
    [isDark, datumOpacity]
  );

  // Geometry: Single straight architectural trajectory from Node 08 to site anchor
  const lineGeometry = React.useMemo(() => {
    const points = [
      new THREE.Vector3(...node08Coordinate),
      new THREE.Vector3(
        (node08Coordinate[0] + datumAnchorPoint[0]) / 2,
        (node08Coordinate[1] + datumAnchorPoint[1]) / 2 + 0.10,
        (node08Coordinate[2] + datumAnchorPoint[2]) / 2
      ),
      new THREE.Vector3(...datumAnchorPoint),
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(24);
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [node08Coordinate, datumAnchorPoint]);

  if (datumOpacity <= 0.005) return null;

  return (
    <group name="real-estate-structural-datum">
      {/* 1. Single Architectural Trajectory Line */}
      <primitive object={new THREE.Line(lineGeometry, datumMat)} />

      {/* 2. Site Ground Alignment Anchor Bead */}
      <mesh position={[...datumAnchorPoint]} material={anchorMat}>
        <sphereGeometry args={[0.022, 16, 16]} />
      </mesh>

      {/* 3. Subtle Floor Alignment Axis on Ground Datum */}
      <mesh
        position={[datumAnchorPoint[0], datumAnchorPoint[1] + 0.002, datumAnchorPoint[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={anchorMat}
      >
        <planeGeometry args={[1.00, 0.004]} />
      </mesh>
    </group>
  );
}
