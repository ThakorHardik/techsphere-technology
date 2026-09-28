"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ArchitecturalRevealPhases } from "./types";

interface RealEstateLandscapeProps {
  readonly isDark?: boolean;
  readonly phases?: ArchitecturalRevealPhases;
}

/**
 * RealEstateLandscape — Restrained Contemporary Architectural Ground & Entrance Approach
 * 
 * FINAL MICRO-POLISH PASS:
 * - Extremely low-profile lawn and warm mineral aggregate bedding
 * - Organically shaped planting areas with subtle irregular edges
 * - Visually merges completely into TechSphere's warm cream (#F9F6F0) background
 * - No raised platform, no garden tray, no game-style clutter, no decorative island
 * - Continuous entrance approach path leading seamlessly from surrounding ground into entrance threshold
 * - Slender, sparse natural fescue blades and flat river pebble accents embedded in the site
 */
export function RealEstateLandscape({ isDark = false, phases }: RealEstateLandscapeProps) {
  const fGround = phases ? phases.ground : 1.0;
  const fFade = Math.min(1.0, fGround * 1.25);

  // 1. High-Resolution Procedural Architectural Site Ground Wash Texture
  // Exact coordinate-mapped site wash: warm crushed limestone bedding, path corridor gravel, and pale sage lawn
  const siteWashTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 1024, 1024);

    // Coordinate mapping:
    // Plane is [5.00, 4.00] centered at World [X=0.35, Z=0.20]
    // Mapping: World X ∈ [-2.15, 2.85] -> Canvas [0, 1024]
    //          World Z ∈ [-1.80, 2.20] -> Canvas [0, 1024]
    const toCanvasX = (wx: number) => 512 + ((wx - 0.35) / 5.00) * 1024;
    const toCanvasY = (wz: number) => 512 + ((wz - 0.20) / 4.00) * 1024;

    // A. Main Organic Multi-Harmonic Site Base Wash (Warm crushed limestone aggregate & earth)
    const baseCenterX = toCanvasX(0.35);
    const baseCenterY = toCanvasY(0.15);
    const baseGrad = ctx.createRadialGradient(baseCenterX, baseCenterY, 50, baseCenterX, baseCenterY, 440);
    if (isDark) {
      baseGrad.addColorStop(0.0, "rgba(38, 32, 26, 0.52)");
      baseGrad.addColorStop(0.35, "rgba(32, 27, 22, 0.30)");
      baseGrad.addColorStop(0.68, "rgba(26, 22, 18, 0.12)");
      baseGrad.addColorStop(0.92, "rgba(18, 15, 12, 0.02)");
      baseGrad.addColorStop(1.0, "rgba(18, 15, 12, 0.0)");
    } else {
      baseGrad.addColorStop(0.0, "rgba(215, 208, 196, 0.40)");
      baseGrad.addColorStop(0.32, "rgba(224, 220, 210, 0.26)");
      baseGrad.addColorStop(0.66, "rgba(238, 235, 228, 0.12)");
      baseGrad.addColorStop(0.90, "rgba(249, 246, 240, 0.02)");
      baseGrad.addColorStop(1.0, "rgba(249, 246, 240, 0.0)");
    }

    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    const pts = 48;
    for (let i = 0; i <= pts; i++) {
      const theta = (i / pts) * Math.PI * 2;
      const rMod =
        1.0 +
        Math.sin(theta * 3 + 0.4) * 0.09 +
        Math.cos(theta * 5 - 0.2) * 0.06 +
        Math.sin(theta * 2 + 1.2) * 0.07;
      const rx = 440 * rMod;
      const ry = 370 * rMod;
      const x = baseCenterX + Math.cos(theta) * rx;
      const y = baseCenterY + Math.sin(theta) * ry;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // B. Dedicated Compacted Crushed Limestone Bedding Corridor Under Path
    // Extends from foreground (wz=1.35) straight into building entrance threshold (wz=-0.05)
    const pStartX = toCanvasX(0.39);
    const pStartY = toCanvasY(1.35);
    const pEndX = toCanvasX(0.55);
    const pEndY = toCanvasY(-0.05);

    const pathGrad = ctx.createLinearGradient(pStartX, pStartY, pEndX, pEndY);
    if (isDark) {
      pathGrad.addColorStop(0.0, "rgba(42, 36, 30, 0.0)");
      pathGrad.addColorStop(0.12, "rgba(42, 36, 30, 0.32)");
      pathGrad.addColorStop(0.75, "rgba(42, 36, 30, 0.42)");
      pathGrad.addColorStop(1.0, "rgba(42, 36, 30, 0.0)");
    } else {
      pathGrad.addColorStop(0.0, "rgba(220, 214, 204, 0.0)");
      pathGrad.addColorStop(0.12, "rgba(220, 214, 204, 0.35)");
      pathGrad.addColorStop(0.75, "rgba(215, 208, 198, 0.42)");
      pathGrad.addColorStop(1.0, "rgba(220, 214, 204, 0.0)");
    }

    ctx.save();
    ctx.strokeStyle = pathGrad;
    ctx.lineWidth = 140;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(pStartX, pStartY);
    ctx.lineTo(pEndX, pEndY);
    ctx.stroke();
    ctx.restore();

    // C. Soft Architectural Pale Sage Lawn & Groundcover Washes
    // Soft patch 1: Entrance foreground to the left of the approach path
    const lawn1X = toCanvasX(0.08);
    const lawn1Y = toCanvasY(0.88);
    const lawn1 = ctx.createRadialGradient(lawn1X, lawn1Y, 20, lawn1X, lawn1Y, 190);
    if (isDark) {
      lawn1.addColorStop(0.0, "rgba(35, 42, 32, 0.30)");
      lawn1.addColorStop(0.60, "rgba(35, 42, 32, 0.12)");
      lawn1.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    } else {
      lawn1.addColorStop(0.0, "rgba(182, 192, 174, 0.28)");
      lawn1.addColorStop(0.60, "rgba(195, 205, 188, 0.12)");
      lawn1.addColorStop(1.0, "rgba(249, 246, 240, 0.0)");
    }
    ctx.fillStyle = lawn1;
    ctx.beginPath();
    ctx.ellipse(lawn1X, lawn1Y, 180, 130, 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Soft patch 2: Base of the monolith wall and flank
    const lawn2X = toCanvasX(-0.55);
    const lawn2Y = toCanvasY(0.40);
    const lawn2 = ctx.createRadialGradient(lawn2X, lawn2Y, 20, lawn2X, lawn2Y, 180);
    if (isDark) {
      lawn2.addColorStop(0.0, "rgba(36, 44, 34, 0.28)");
      lawn2.addColorStop(0.65, "rgba(36, 44, 34, 0.10)");
      lawn2.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    } else {
      lawn2.addColorStop(0.0, "rgba(180, 190, 172, 0.26)");
      lawn2.addColorStop(0.65, "rgba(196, 204, 190, 0.10)");
      lawn2.addColorStop(1.0, "rgba(249, 246, 240, 0.0)");
    }
    ctx.fillStyle = lawn2;
    ctx.beginPath();
    ctx.ellipse(lawn2X, lawn2Y, 160, 120, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // D. Tactile Mineral / Soil Stipples
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 280;
      const x = baseCenterX + Math.cos(angle) * dist;
      const y = baseCenterY + Math.sin(angle) * (dist * 0.78);
      const rad = 22 + Math.random() * 45;
      const patchGrad = ctx.createRadialGradient(x, y, 0, x, y, rad);
      const isGreen = Math.random() > 0.45;
      if (isDark) {
        patchGrad.addColorStop(0, isGreen ? "rgba(42, 50, 38, 0.15)" : "rgba(46, 40, 32, 0.16)");
        patchGrad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
      } else {
        patchGrad.addColorStop(0, isGreen ? "rgba(178, 188, 170, 0.14)" : "rgba(202, 194, 182, 0.15)");
        patchGrad.addColorStop(1, "rgba(249, 246, 240, 0.0)");
      }
      ctx.fillStyle = patchGrad;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [isDark]);

  // 2. Procedural Contact Shadow for Individual Pavers (Embeds them visually into gravel)
  const paverShadowTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const grad = ctx.createRadialGradient(32, 32, 6, 32, 32, 30);
    grad.addColorStop(0.0, "rgba(25, 20, 15, 0.65)");
    grad.addColorStop(0.35, "rgba(25, 20, 15, 0.28)");
    grad.addColorStop(0.75, "rgba(25, 20, 15, 0.06)");
    grad.addColorStop(1.0, "rgba(25, 20, 15, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // 3. Materials
  // Soft Ground Wash Surface Material (Completely flat, seamless alpha dissolution)
  const siteWashMat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: siteWashTexture ?? undefined,
        transparent: true,
        opacity: Math.min(1.0, fFade * 1.0),
        depthWrite: false,
      }),
    [siteWashTexture, fFade]
  );

  // Paver Contact AO Material
  const paverShadowMat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: paverShadowTexture ?? undefined,
        transparent: true,
        opacity: Math.min(0.42, fFade * 0.42),
        depthWrite: false,
      }),
    [paverShadowTexture, fFade]
  );

  // Honed Limestone Precast Approach Pavers (Matches building precast, ultra-thin 4mm profile)
  const paverMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#3A332C" : REAL_ESTATE_PALETTE.limestoneLight,
        roughness: 0.68,
        metalness: 0.02,
        transparent: true,
        opacity: Math.min(1.0, fFade * 1.2),
      }),
    [isDark, fFade]
  );

  // Paver Arris Edge Highlight (Sunlit edge catch)
  const paverArrisMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#4E443A" : REAL_ESTATE_PALETTE.limestoneArris,
        roughness: 0.42,
        metalness: 0.03,
        transparent: true,
        opacity: Math.min(1.0, fFade * 1.2),
      }),
    [isDark, fFade]
  );

  // Muted Natural Olive / Sage Green for Ornamental Grasses (Natural botanical variation)
  const grassMaterials = React.useMemo(() => {
    const tonesLight = ["#8A967E", "#9AA68E", "#A8B49C", "#7E8A72"];
    const tonesDark = ["#353D2F", "#3E4636", "#485040", "#30372A"];
    return tonesLight.map((tone, i) =>
      new THREE.MeshStandardMaterial({
        color: isDark ? tonesDark[i] : tone,
        roughness: 0.90,
        metalness: 0.0,
        transparent: true,
        opacity: Math.min(1.0, fFade * 1.25),
        side: THREE.DoubleSide,
      })
    );
  }, [isDark, fFade]);

  // Flat Creeping Architectural Groundcover (Pale dusty sage, completely flat 2D profile)
  const groundcoverMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#283023" : "#727E6C",
        roughness: 0.95,
        metalness: 0.0,
        transparent: true,
        opacity: Math.min(0.85, fFade * 1.1),
        side: THREE.DoubleSide,
      }),
    [isDark, fFade]
  );

  // Natural River Stone Accent Material
  const stoneAccentMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#322C24" : "#8A8074",
        roughness: 0.78,
        metalness: 0.02,
        transparent: true,
        opacity: Math.min(1.0, fFade * 1.2),
      }),
    [isDark, fFade]
  );

  // Flat Organic Groundcover Patch Geometry (Flat 2D crawling shape, NOT a 3D ball)
  const groundcoverGeo = React.useMemo(() => {
    const shape = new THREE.Shape();
    const points = 16;
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const radius = 0.22 + Math.sin(angle * 3) * 0.045 + Math.cos(angle * 2) * 0.035;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.68;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const geo = new THREE.ShapeGeometry(shape);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // Performance guard: completely inactive during corridor scroll
  if (fFade <= 0.01) return null;

  // 6 Staggered Approach Pavers Leading Continuously from Foreground into Entrance Threshold
  // Subtle human-scale walking spacing (~24-25cm) with graceful perspective taper and threshold transition
  const pavers = [
    { x: 0.39, z: 1.28, w: 0.38, d: 0.20, rot: 0.05, y: 0.003 },
    { x: 0.42, z: 1.03, w: 0.40, d: 0.20, rot: 0.07, y: 0.006 },
    { x: 0.45, z: 0.78, w: 0.42, d: 0.21, rot: 0.08, y: 0.009 },
    { x: 0.48, z: 0.54, w: 0.44, d: 0.21, rot: 0.09, y: 0.013 },
    { x: 0.51, z: 0.30, w: 0.46, d: 0.22, rot: 0.10, y: 0.017 },
    { x: 0.54, z: 0.06, w: 0.48, d: 0.22, rot: 0.11, y: 0.021 },
  ];

  // Natural Arching Feather Grass Tuft generator (Slender, restrained botanical blades)
  const entranceGrasses = [
    { x: -0.08, z: 0.04, count: 4, spread: 0.035, hBase: 0.075, matIdx: 0 },
    { x: -0.14, z: -0.06, count: 3, spread: 0.030, hBase: 0.065, matIdx: 1 },
    { x: 0.06, z: 0.06, count: 3, spread: 0.030, hBase: 0.070, matIdx: 2 },
  ];

  return (
    <group name="real-estate-contemporary-landscape" position={[0, 0.001, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. SEAMLESS ARCHITECTURAL SITE GROUND WASH
          Zero raised platform, zero thick slab, zero visible polygon borders.
          Smoothly dissolves into TechSphere's warm cream (#F9F6F0) background.
          ───────────────────────────────────────────────────────────── */}
      <mesh position={[0.35, 0.0012, 0.20]} rotation={[-Math.PI / 2, 0, 0]} material={siteWashMat}>
        <planeGeometry args={[5.00, 4.00]} />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          2. NARROW ARCHITECTURAL PRECAST LIMESTONE APPROACH PATH
          6 thin precast flagstones leading continuously from foreground
          across the threshold and onto the entrance terrace.
          ───────────────────────────────────────────────────────────── */}
      <group name="approach-path">
        {pavers.map((p, i) => (
          <group key={`paver-${i}`} position={[p.x, p.y, p.z]} rotation={[0, p.rot, 0]}>
            {/* Embedded Contact AO Shadow (Embeds stone into gravel bed) */}
            <mesh position={[0, -0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]} material={paverShadowMat}>
              <planeGeometry args={[p.w * 1.25, p.d * 1.35]} />
            </mesh>

            {/* Precast Stone Slab Profile (Ultra-thin 4mm) */}
            <mesh material={paverMat} receiveShadow castShadow>
              <boxGeometry args={[p.w, 0.004, p.d]} />
            </mesh>

            {/* Front Sunlit Arris Highlight Catch */}
            <mesh position={[0, 0.002, p.d / 2 - 0.001]} material={paverArrisMat}>
              <boxGeometry args={[p.w, 0.002, 0.003]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. RESTRAINED PLANTING GROUP: NEAR ENTRANCE
          Flat creeping groundcover patch + low arching fescue grasses + river pebbles
          Nestled naturally to the left of the approach path
          ───────────────────────────────────────────────────────────── */}
      <group name="planting-entrance-cluster" position={[0.08, 0.0025, 0.88]}>
        {/* Flat Creeping Groundcover Patch (Completely flat 2D shape, NOT a 3D ball) */}
        <mesh position={[0.02, 0.001, 0.02]} geometry={groundcoverGeo} material={groundcoverMat} receiveShadow />

        {/* Slender Low Ornamental Fescue Grass Tufts */}
        {entranceGrasses.map((tuft, tIdx) => (
          <group key={`ent-tuft-${tIdx}`} position={[tuft.x, 0, tuft.z]}>
            {Array.from({ length: tuft.count }).map((_, bIdx) => {
              const angle = (bIdx / tuft.count) * Math.PI * 2 + tIdx * 0.6;
              const h = tuft.hBase + Math.sin(bIdx * 1.8) * 0.010;
              const outwardTilt = 0.10 + Math.sin(bIdx * 2.1) * 0.035;
              const dx = Math.cos(angle) * (tuft.spread * 0.45);
              const dz = Math.sin(angle) * (tuft.spread * 0.45);
              return (
                <mesh
                  key={`blade-${tIdx}-${bIdx}`}
                  position={[dx, h / 2, dz]}
                  rotation={[Math.sin(angle) * outwardTilt, angle, Math.cos(angle) * outwardTilt]}
                  material={grassMaterials[(tuft.matIdx + bIdx) % 4]}
                >
                  <planeGeometry args={[0.011, h]} />
                </mesh>
              );
            })}
          </group>
        ))}

        {/* Flat Smooth River Stone Pebbles */}
        <mesh position={[0.10, 0.003, -0.02]} scale={[1.2, 0.25, 0.9]} material={stoneAccentMat}>
          <sphereGeometry args={[0.018, 8, 6]} />
        </mesh>
        <mesh position={[0.14, 0.0025, 0.01]} scale={[1.1, 0.22, 0.8]} material={stoneAccentMat}>
          <sphereGeometry args={[0.014, 8, 6]} />
        </mesh>
      </group>
    </group>
  );
}
