"use client";

import * as React from "react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ConstructionPhases } from "./types";

interface BridgeProps {
  readonly progressRef?: React.RefObject<number>;
  readonly progress?: number;
  readonly phases?: ConstructionPhases;
}

/**
 * RealEstateBridge — Property Boundary Datum, Entrance Interface Totem & Continuation Handoff
 * 
 * - Phase 2 (p in [9.12, 9.26]): Establishes clear physical relationship between technology system
 *   and real-world property through a refined architectural ground datum line
 * - Phase 3 & 9: Refined brushed-bronze property interface totem at building entrance [0.85, -0.22, -2.15]
 * - Phase 6: Continuation technology handoff dot at [2.10, -0.30, -1.80] for smooth section continuation
 */
export function RealEstateBridge({ progressRef, progress: externalProgress, phases }: BridgeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const conduitMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const datumMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const totemMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const handoffDotRef = useRef<THREE.Group>(null);
  const handoffMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const { buildingInterfacePoint, handoffDotCoordinate, node08Coordinate } = ARCHITECTURAL_SCALE;

  // Property boundary datum line connecting Node 08 initial location across to the entrance datum
  const boundaryDatumGeometry = useMemo(() => {
    const start = new THREE.Vector3(node08Coordinate[0], -0.22, node08Coordinate[2]);
    const end = new THREE.Vector3(buildingInterfacePoint[0], -0.22, buildingInterfacePoint[2]);
    const curve = new THREE.LineCurve3(start, end);
    return new THREE.TubeGeometry(curve, 16, 0.003, 6, false);
  }, [node08Coordinate, buildingInterfacePoint]);

  // Short restrained conduit connecting docked Node 08 [0.85, -0.22, -2.15] to totem junction [0.85, -0.06, -2.15]
  const conduitGeometry = useMemo(() => {
    const start = new THREE.Vector3(0.85, -0.16, -2.15);
    const end = new THREE.Vector3(0.85, -0.06, -2.15);
    const curve = new THREE.LineCurve3(start, end);
    return new THREE.TubeGeometry(curve, 12, 0.004, 8, false);
  }, []);

  const totemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.steelDark,
        roughness: 0.40,
        metalness: 0.50,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: REAL_ESTATE_PALETTE.nodeBeaconAccent,
        emissive: REAL_ESTATE_PALETTE.nodeBeaconAccent,
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.30,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  useFrame(({ clock }) => {
    const p = progressRef ? progressRef.current : typeof externalProgress === "number" ? externalProgress : 0;

    // Activation window: p in [9.10, 10.00]
    if (p < 9.10) {
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }

    if (groupRef.current) groupRef.current.visible = true;

    // Phase 2: Site boundary datum reveal
    const fProperty = phases ? phases.propertyEntry : Math.min(1, Math.max(0, (p - 9.12) / 0.14));
    if (datumMatRef.current) {
      datumMatRef.current.opacity = fProperty * 0.50;
    }

    // Totem and short conduit reveal: phases.entrance / docking
    const fTotem = phases ? phases.entrance : Math.min(1, Math.max(0, (p - 9.30) / 0.45));
    if (conduitMatRef.current) {
      conduitMatRef.current.opacity = fTotem * 0.85;
    }
    if (totemMatRef.current) {
      totemMatRef.current.opacity = fTotem;
    }

    // Phase 6: Continuation Handoff Dot emergence (p in [9.96, 10.00])
    const fHandoff = phases ? phases.handoffDot : Math.min(1, Math.max(0, (p - 9.96) / 0.04));
    if (handoffDotRef.current && handoffMatRef.current) {
      if (fHandoff <= 0.01) {
        handoffDotRef.current.visible = false;
        handoffMatRef.current.opacity = 0;
      } else {
        handoffDotRef.current.visible = true;
        handoffMatRef.current.opacity = fHandoff * 0.95;

        // Subtle gentle breathing pulse
        const t = clock.getElapsedTime();
        const pulse = 0.94 + Math.sin(t * 2.0) * 0.06;
        handoffDotRef.current.scale.set(fHandoff * pulse, fHandoff * pulse, fHandoff * pulse);
      }
    }
  });

  return (
    <group ref={groupRef} name="real-estate-node08-bridge" visible={false}>
      {/* 1. Property Boundary Alignment Datum Line (Technology Enters Real-World Property) */}
      <mesh geometry={boundaryDatumGeometry}>
        <meshStandardMaterial
          ref={datumMatRef}
          color={REAL_ESTATE_PALETTE.boundaryDatum}
          roughness={0.60}
          metalness={0.20}
          transparent
          opacity={0}
        />
      </mesh>

      {/* 2. Restrained Architectural Conduit connecting Node 08 to Entrance Totem */}
      <mesh geometry={conduitGeometry}>
        <meshStandardMaterial
          ref={conduitMatRef}
          color={REAL_ESTATE_PALETTE.nodeBeaconAccent}
          emissive={REAL_ESTATE_PALETTE.nodeBeaconAccent}
          emissiveIntensity={0.35}
          roughness={0.30}
          metalness={0.40}
          transparent
          opacity={0}
        />
      </mesh>

      {/* 3. Smart Property Interface Totem on the Entrance Plaza */}
      <group position={buildingInterfacePoint}>
        {/* Slender Architectural Totem Column */}
        <mesh position={[0, 0.12, 0]} material={totemMat} castShadow>
          <boxGeometry args={[0.040, 0.24, 0.026]} />
        </mesh>
        {/* Subtle Status Indicator Inset */}
        <mesh position={[0, 0.18, 0.014]} material={accentMat}>
          <boxGeometry args={[0.020, 0.06, 0.004]} />
        </mesh>
        {/* Ground Anchor Flange Plate */}
        <mesh position={[0, 0.004, 0]} material={totemMat}>
          <boxGeometry args={[0.08, 0.008, 0.07]} />
        </mesh>
      </group>

      {/* 4. Continuation Handoff Dot (Presents subtle technology seed for next section) */}
      <group ref={handoffDotRef} position={handoffDotCoordinate} visible={false}>
        {/* Outer Faceted Seed Bead */}
        <mesh castShadow>
          <icosahedronGeometry args={[0.038, 1]} />
          <meshStandardMaterial
            ref={handoffMatRef}
            color={REAL_ESTATE_PALETTE.nodeBeaconAccent}
            emissive={REAL_ESTATE_PALETTE.nodeBeaconAccent}
            emissiveIntensity={0.50}
            roughness={0.24}
            metalness={0.35}
            transparent
            opacity={0}
            flatShading
          />
        </mesh>
        {/* Inner Specular Core */}
        <mesh>
          <sphereGeometry args={[0.016, 16, 16]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.15}
            metalness={0.20}
          />
        </mesh>
      </group>
    </group>
  );
}
