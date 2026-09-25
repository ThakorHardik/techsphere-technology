"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  ARCHITECTURAL_SCALE,
  RealEstateEnvironmentProps,
  ConstructionPhases,
  computeConstructionPhases,
} from "./types";
import { RealEstateBuilding } from "./RealEstateBuilding";
import { RealEstateScreens } from "./RealEstateScreens";
import { RealEstateFacade } from "./RealEstateFacade";
import { RealEstateBalconies } from "./RealEstateBalconies";
import { RealEstateStorefront } from "./RealEstateStorefront";
import { RealEstateStreetscape } from "./RealEstateStreetscape";
import { RealEstateVegetation } from "./RealEstateVegetation";
import { RealEstateBridge } from "./RealEstateBridge";

/**
 * RealEstateEnvironment — Master 3D Architectural Scene for Section 03 (Phase A)
 * 
 * Embeds directly inside the existing persistent TechnologySystemScene Canvas:
 * - Exactly 2 homepage Canvases (zero remounts, zero duplicate WebGL contexts)
 * - 100% idle/invisible for Nodes 01-08 (p < 9.10), consuming zero GPU render time
 * - Progressively constructs across 10 physical phases from p = 9.15 to p = 9.95:
 *   Phase 1 (9.00–9.15): Node 08 final overview hold
 *   Phase 2 (9.15–9.25): Foundation plinth forms beneath/behind Node 08
 *   Phase 3 (9.25–9.35): Ground floor pilotis & concrete core rise
 *   Phase 4 (9.35–9.50): Upper floors L2–L5 stack upward sequentially
 *   Phase 5 (9.50–9.60): Balconies and slabs resolve
 *   Phase 6 (9.60–9.68): Glazing panels slide into mullions
 *   Phase 7 (9.68–9.75): Vertical timber facade screens resolve
 *   Phase 8 (9.75–9.82): Ground-floor commercial frontage resolves
 *   Phase 9 (9.82–9.88): Minimal landscaping and plaza resolve
 *   Phase 10 (9.88–9.95): Entire architectural environment settles
 *   Handoff (9.95–10.00): Subtle technology handoff dot emerges along continuation trajectory
 */
export function RealEstateEnvironment({
  progressRef,
  progress: externalProgress,
  isDark = false,
}: RealEstateEnvironmentProps) {
  const masterGroupRef = useRef<THREE.Group>(null);
  const buildingGroupRef = useRef<THREE.Group>(null);
  const lastPRef = useRef<number>(-1);
  const isVisibleRef = useRef<boolean>(false);

  const [phases, setPhases] = useState<ConstructionPhases>(() => computeConstructionPhases(0));

  const { buildingPos, buildingRotationY } = ARCHITECTURAL_SCALE;

  // Set master scale once on mount — it never changes
  useEffect(() => {
    if (masterGroupRef.current) {
      masterGroupRef.current.scale.set(0.80, 0.80, 0.80);
    }
  }, []);

  useFrame(() => {
    if (!masterGroupRef.current) return;

    const p = progressRef ? progressRef.current : typeof externalProgress === "number" ? externalProgress : 0;

    // Strict performance optimization: invisible when viewing Nodes 01 through 08 corridor
    if (p < 9.10) {
      if (isVisibleRef.current) {
        masterGroupRef.current.visible = false;
        isVisibleRef.current = false;
      }
      return;
    }

    if (!isVisibleRef.current) {
      masterGroupRef.current.visible = true;
      isVisibleRef.current = true;
    }

    // Update phases state with minimum delta threshold to prevent unnecessary re-renders
    const delta = Math.abs(p - lastPRef.current);
    if (delta >= 0.003 || (p >= 9.95 && lastPRef.current < 9.95)) {
      lastPRef.current = p;
      setPhases(computeConstructionPhases(p));
    }

    // Subtle vertical settling: building rises 3cm into final ground position
    if (buildingGroupRef.current) {
      const ph = computeConstructionPhases(p);
      const settleEase = ph.streetscape;
      const ySettle = THREE.MathUtils.lerp(buildingPos[1] - 0.03, buildingPos[1], settleEase);
      buildingGroupRef.current.position.set(buildingPos[0], ySettle, buildingPos[2]);
    }
  });

  return (
    <group ref={masterGroupRef} name="real-estate-3d-environment" visible={false}>
      {/* Main Architectural Building Complex */}
      <group
        ref={buildingGroupRef}
        position={buildingPos}
        rotation={[0, buildingRotationY, 0]}
      >
        {/* 1. Structural Concrete Foundation, Core, Columns & Sequential Slabs */}
        <RealEstateBuilding isDark={isDark} phases={phases} />

        {/* 2. Instanced Warm Timber Louver Facade Panels (Phase 7) */}
        <RealEstateScreens isDark={isDark} phases={phases} />

        {/* 3. Glass Curtain Walls, Window Mullions & Interior Depth (Phase 6) */}
        <RealEstateFacade isDark={isDark} phases={phases} />

        {/* 4. Cantilevered Balconies, Glass Railings & Planters (Phase 5) */}
        <RealEstateBalconies isDark={isDark} phases={phases} />

        {/* 5. Ground Floor Commercial Storefront, Café & Signage (Phase 8) */}
        <RealEstateStorefront isDark={isDark} phases={phases} />

        {/* 6. Confined Sidewalk Plaza, Curb & Street Context (Phase 9) */}
        <RealEstateStreetscape isDark={isDark} phases={phases} />

        {/* 7. Refined Sidewalk Trees, Foliage & Landscaping (Phase 9) */}
        <RealEstateVegetation isDark={isDark} phases={phases} />
      </group>

      {/* 8. Intentional Node 08 Physical Bridge Conduit & Continuation Handoff Dot */}
      <RealEstateBridge
        progressRef={progressRef}
        progress={externalProgress}
        phases={phases}
      />
    </group>
  );
}
