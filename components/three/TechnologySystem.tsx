"use client";

import * as React from "react";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TechnologySystemPath } from "./TechnologySystemPath";
import { TechnologySystemNodes } from "./TechnologySystemNodes";
import { TechnologySystemProps } from "./technology-system-types";

/**
 * TechnologySystem — 3D Technology Corridor.
 * 
 * Entire visual system consists strictly of:
 * 1. One continuous open spatial trajectory (Node 01 -> Node 08)
 * 2. Eight refined 3D geometric capability nodes
 * 
 * Absolutely NO central hub, NO mechanical core, NO enclosing rings, NO orbital loop.
 * 
 * Supports:
 * - Theme switching (light / dark)
 * - activeNode dominant scaling & highlighting (1.5x with #B88E68 accent)
 * - Dignified idle motion (very slow, graceful whole-system breathing)
 */
export function TechnologySystem({
  theme = "light",
  activeNode = null,
  progress,
  progressRef,
  autoRotate = true,
}: TechnologySystemProps) {
  const masterGroupRef = useRef<THREE.Group>(null);

  // Dignified, restrained idle movement (suppressed during story scroll to keep camera alignment pure)
  useFrame(({ clock }) => {
    if (!masterGroupRef.current) return;

    const p = progressRef ? progressRef.current : typeof progress === "number" ? progress : 0;
    const isStoryMode = progressRef !== undefined || p > 0;

    if (autoRotate && !isStoryMode) {
      const t = clock.getElapsedTime();
      // Very slow dignified whole-system breathing drift (subtle yaw oscillation ±3.5°)
      masterGroupRef.current.rotation.y = Math.sin(t * 0.15) * 0.06;
      masterGroupRef.current.rotation.x = Math.sin(t * 0.12) * 0.012;
      masterGroupRef.current.rotation.z = Math.cos(t * 0.14) * 0.008;
    } else {
      masterGroupRef.current.rotation.set(0, 0, 0);
    }
  });

  return (
    <group ref={masterGroupRef} name="technology-corridor-system">
      {/* 1. Refined Open 3D Spatial Trajectory Filament */}
      <TechnologySystemPath
        theme={theme}
        activeNode={activeNode}
        progress={progress}
        progressRef={progressRef}
      />

      {/* 2. Exactly 8 Refined Geometric Capability Nodes */}
      <TechnologySystemNodes
        theme={theme}
        activeNode={activeNode}
        progress={progress}
        progressRef={progressRef}
      />
    </group>
  );
}


