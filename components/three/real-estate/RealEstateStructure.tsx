"use client";

import * as React from "react";
import * as THREE from "three";
import { REAL_ESTATE_PALETTE, ARCHITECTURAL_SCALE, ArchitecturalRevealPhases } from "./types";
import { RealEstateInterior } from "./RealEstateInterior";

interface RealEstateStructureProps {
  readonly isDark?: boolean;
  readonly phases?: ArchitecturalRevealPhases;
}

/**
 * RealEstateStructure — Monolithic Mass, Deep Void, Cantilevered Slabs & Layered Glazing
 * 
 * Implements the core principle: MASS + VOID + LIGHT + SHADOW
 * - Monolithic warm limestone shear wall with authentic recessed precast expansion joints and stepped pilaster relief
 * - Genuinely deep two-story covered architectural void (colonnade) with slender bronze pilotis and recessed rear wall
 * - Substantial architectural slabs with realistic stone thickness, crisp top stone paving, and natural stone soffits
 * - Deeply recessed solar control glazing with high specular sheen and layered internal structural volumes
 * - Soft, broad feathered ambient contact shadows firmly anchoring the architecture to the page
 */
export function RealEstateStructure({ isDark = false, phases }: RealEstateStructureProps) {
  const {
    monolithWidth,
    monolithHeight,
    monolithDepth,
    monolithX,
    podiumSlabWidth,
    podiumSlabThickness,
    podiumSlabDepth,
    podiumSlabX,
    podiumSlabY,
    roofSlabWidth,
    roofSlabThickness,
    roofSlabDepth,
    roofSlabX,
    roofSlabY,
    pilotisRadius,
    pilotisHeight,
    pilotisX,
    pilotisZ,
  } = ARCHITECTURAL_SCALE;

  // Active phase factors (p in [9.00, 10.00])
  const fGround = phases ? phases.ground : 1.0;
  const fMonolith = phases ? phases.monolith : 1.0;
  const fVoid = phases ? phases.void : 1.0;
  const fCantilever = phases ? phases.cantilever : 1.0;
  const fGlazing = phases ? phases.glazing : 1.0;
  const fFinal = phases ? phases.finalIntegration : 1.0;

  // 1. Procedural Tactile Fine-Grained Limestone Bump Texture
  const stoneBumpTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    const imgData = ctx.getImageData(0, 0, 256, 256);
    const d = imgData.data;
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const i = (y * 256 + x) * 4;
        // Fine micro-pore limestone grain
        const fineGrain = (Math.random() - 0.5) * 16;
        // Low-frequency soft natural sedimentary variation
        const lowFreq = Math.sin(x * 0.04) * Math.cos(y * 0.04) * 5;
        const v = Math.max(0, Math.min(255, 128 + fineGrain + lowFreq));
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // 1b. Procedural Sky / Horizon Equirectangular Reflection Texture with Subtle 3/4 Sheen
  const skyReflectionTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Architectural daylight reflection gradient: soft zenith daylight, bright horizon, warm ground bounce
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, "#A0BCD8"); // soft zenith daylight
    grad.addColorStop(0.38, "#DCE8F0"); // bright upper sky
    grad.addColorStop(0.48, "#F2F6F9"); // bright horizon band
    grad.addColorStop(0.52, "#EDE7DD"); // warm horizon rim
    grad.addColorStop(0.68, "#C2B6A6"); // warm architectural ground bounce
    grad.addColorStop(1.0, "#887D6F"); // deep ground tone
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Subtle soft vertical daylight sheen (catches on glass from 3/4 architectural viewpoint)
    const vertGrad = ctx.createLinearGradient(140, 0, 260, 0);
    vertGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
    vertGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.16)");
    vertGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
    ctx.fillStyle = vertGrad;
    ctx.fillRect(140, 0, 120, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }, []);

  // Tactile Limestone Materials
  const limestoneMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#484138" : REAL_ESTATE_PALETTE.limestoneLight,
        roughness: 0.76,
        metalness: 0.02,
        bumpMap: stoneBumpTexture ?? undefined,
        bumpScale: 0.0016,
        transparent: true,
        opacity: Math.min(1.0, fMonolith * 1.2),
      }),
    [isDark, fMonolith, stoneBumpTexture]
  );

  // Subtly differentiated side flank tone for natural 3/4 depth
  const limestoneFlankMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#3F3830" : REAL_ESTATE_PALETTE.limestoneFlank,
        roughness: 0.80,
        metalness: 0.02,
        bumpMap: stoneBumpTexture ?? undefined,
        bumpScale: 0.0016,
        transparent: true,
        opacity: Math.min(1.0, fMonolith * 1.2),
      }),
    [isDark, fMonolith, stoneBumpTexture]
  );

  const limestoneMediumMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#3C362F" : REAL_ESTATE_PALETTE.limestoneMedium,
        roughness: 0.82,
        metalness: 0.02,
        bumpMap: stoneBumpTexture ?? undefined,
        bumpScale: 0.002,
        transparent: true,
        opacity: Math.min(1.0, fMonolith * 1.2),
      }),
    [isDark, fMonolith, stoneBumpTexture]
  );

  // Crisp arris corner highlight reflecting daylight
  const limestoneArrisMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#554D42" : REAL_ESTATE_PALETTE.limestoneArris,
        roughness: 0.55,
        metalness: 0.04,
        transparent: true,
        opacity: Math.min(1.0, fMonolith * 1.2),
      }),
    [isDark, fMonolith]
  );

  // Slab soffits and recessed cavity walls: genuine architectural stone, NOT black painted
  const limestoneSoffitMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#2C261F" : REAL_ESTATE_PALETTE.limestoneSoffit,
        roughness: 0.85,
        metalness: 0.02,
        transparent: true,
        opacity: Math.min(1.0, fVoid * 1.2),
      }),
    [isDark, fVoid]
  );

  // Subtle 14mm expansion joint reveals
  const limestoneJointMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#302820" : REAL_ESTATE_PALETTE.limestoneJoint,
        roughness: 0.86,
        metalness: 0.02,
        transparent: true,
        opacity: Math.min(1.0, fMonolith * 1.2),
      }),
    [isDark, fMonolith]
  );

  const copingMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#423B33" : REAL_ESTATE_PALETTE.limestoneParapet,
        roughness: 0.72,
        metalness: 0.03,
        transparent: true,
        opacity: Math.min(1.0, fCantilever * 1.2),
      }),
    [isDark, fCantilever]
  );

  // 2. Architectural Bronze Metalwork (Deep bronze/charcoal, NOT pure black)
  const bronzeMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#1E1813" : REAL_ESTATE_PALETTE.bronzeDark,
        roughness: 0.44,
        metalness: 0.48,
        transparent: true,
        opacity: Math.min(1.0, fVoid * 1.5),
      }),
    [isDark, fVoid]
  );

  const bronzeSatinMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#282018" : REAL_ESTATE_PALETTE.bronzeSatin,
        roughness: 0.45,
        metalness: 0.42,
        transparent: true,
        opacity: Math.min(1.0, fVoid * 1.5),
      }),
    [isDark, fVoid]
  );

  // 3. Physically Based Architectural Low-Iron Glazing (MeshPhysicalMaterial)
  // Physical thickness (0.18), transmission (0.93), realistic IOR (1.51), roughness (0.065), metalness 0, Fresnel & envMap
  const glassMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: isDark ? "#8DA4B6" : "#EAF2F6",
        transmission: 0.93 * fGlazing,
        ior: 1.51,
        roughness: 0.065,
        metalness: 0.0,
        thickness: 0.18,
        attenuationColor: isDark ? "#A2BACB" : "#D6E8F2",
        attenuationDistance: 0.9,
        specularIntensity: 0.95,
        envMap: skyReflectionTexture ?? undefined,
        envMapIntensity: 0.88,
        transparent: true,
        opacity: Math.min(1.0, fGlazing * 1.05),
        depthWrite: false,
      }),
    [isDark, fGlazing, skyReflectionTexture]
  );

  // 4. Interior Architectural Room Depth & Warm 2800K Radiance (Real occupied ambiance)
  const interiorGlowMat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: isDark ? "#FFB060" : REAL_ESTATE_PALETTE.interiorAmber,
        transparent: true,
        opacity: (0.38 + 0.22 * fFinal) * fGlazing,
      }),
    [isDark, fFinal, fGlazing]
  );

  const interiorPartitionMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#322C24" : REAL_ESTATE_PALETTE.interiorPartition,
        roughness: 0.74,
        metalness: 0.02,
        transparent: true,
        opacity: Math.min(1.0, fGlazing * 1.2),
      }),
    [isDark, fGlazing]
  );

  // Procedural Broad Soft Radial Contact Shadow Texture
  const contactShadowTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(16, 13, 10, 0.94)");
    gradient.addColorStop(0.32, "rgba(16, 13, 10, 0.62)");
    gradient.addColorStop(0.65, "rgba(16, 13, 10, 0.24)");
    gradient.addColorStop(0.88, "rgba(16, 13, 10, 0.05)");
    gradient.addColorStop(1, "rgba(16, 13, 10, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const contactShadowMat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: contactShadowTexture ?? undefined,
        transparent: true,
        opacity: 0.85 * fGround,
        depthWrite: false,
      }),
    [contactShadowTexture, fGround]
  );

  // Monolith Multi-Material Face Array (Subtle tonal differentiation: front vs flank vs top)
  const monolithMaterials = React.useMemo(
    () => [
      limestoneMediumMat, // +X: Right internal junction face
      limestoneFlankMat,  // -X: Left flank face visible in 3/4 view
      copingMat,          // +Y: Top surface
      limestoneSoffitMat, // -Y: Bottom surface
      limestoneMat,       // +Z: Front facade face
      limestoneMediumMat, // -Z: Back face
    ],
    [limestoneMediumMat, limestoneFlankMat, copingMat, limestoneSoffitMat, limestoneMat]
  );

  if (fGround <= 0.01 && fMonolith <= 0.01) return null;

  return (
    <group name="real-estate-monolithic-structure">
      {/* ─────────────────────────────────────────────────────────────
          1. BROAD FEATHERED CONTACT SHADOWS
          Anchors the building firmly to the ground surface with zero stage polygons.
          ───────────────────────────────────────────────────────────── */}
      {fGround > 0.02 && (
        <group position={[0, 0.001, 0]}>
          {/* Monolith Base Footprint Shadow */}
          <mesh position={[monolithX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={contactShadowMat}>
            <planeGeometry args={[monolithWidth * 2.5, monolithDepth * 2.3]} />
          </mesh>
          {/* Pilotis Base Footprint Shadow */}
          <mesh position={[pilotisX, 0, pilotisZ]} rotation={[-Math.PI / 2, 0, 0]} material={contactShadowMat}>
            <planeGeometry args={[0.95, 0.95]} />
          </mesh>
          {/* Deep Void & Slabs Ground Shadow */}
          <mesh position={[podiumSlabX - 0.08, 0, 0.10]} rotation={[-Math.PI / 2, 0, 0]} material={contactShadowMat}>
            <planeGeometry args={[podiumSlabWidth * 1.45, 3.10]} />
          </mesh>
        </group>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. THE MONOLITH (Left Structural Limestone Shear Mass)
          Substantial shear wall with authentic precast expansion joint reveals
          wrapping both front and side flank, stepped pilaster relief, and flank window.
          ───────────────────────────────────────────────────────────── */}
      {fMonolith > 0.02 && (
        <group position={[monolithX, monolithHeight / 2, 0]}>
          {/* Primary Solid Limestone Shear Mass with Front vs Flank Tonal Separation */}
          <mesh material={monolithMaterials} castShadow receiveShadow>
            <boxGeometry args={[monolithWidth, monolithHeight, monolithDepth]} />
          </mesh>

          {/* Crisp Arris Corner Highlight Line (Captures delicate daylight sheen along front-left corner) */}
          <mesh position={[-monolithWidth / 2 + 0.003, 0, monolithDepth / 2 - 0.003]} material={limestoneArrisMat}>
            <boxGeometry args={[0.006, monolithHeight, 0.006]} />
          </mesh>

          {/* Stepped Forward Limestone Pilaster Relief (Catches raking sun, casts sharp shadow) */}
          <mesh position={[monolithWidth / 2 - 0.16, 0, monolithDepth / 2 + 0.03]} material={limestoneMediumMat} castShadow receiveShadow>
            <boxGeometry args={[0.32, monolithHeight, 0.06]} />
          </mesh>

          {/* Vertical Architectural Junction Reveal (Clean recessed relationship where monolith meets terraces) */}
          <mesh position={[monolithWidth / 2 - 0.006, 0, monolithDepth / 2 - 0.20]} material={bronzeMat}>
            <boxGeometry args={[0.016, monolithHeight, 0.45]} />
          </mesh>

          {/* Front Horizontal Expansion Joints (Authentic 14mm precast panel reveals) */}
          {[-0.45, 0.45].map((yOffset, i) => (
            <mesh key={`h-joint-${i}`} position={[0, yOffset, monolithDepth / 2 + 0.006]} material={limestoneJointMat}>
              <boxGeometry args={[monolithWidth + 0.01, 0.014, 0.02]} />
            </mesh>
          ))}

          {/* Front Vertical Expansion Joint (Divides monolith into precast stone bays) */}
          <mesh position={[-0.10, 0, monolithDepth / 2 + 0.006]} material={limestoneJointMat}>
            <boxGeometry args={[0.014, monolithHeight + 0.01, 0.02]} />
          </mesh>

          {/* Side Flank Horizontal Expansion Joints (Wrap around the flank for 3/4 view masonry authenticity) */}
          {[-0.45, 0.45].map((yOffset, i) => (
            <mesh key={`side-joint-${i}`} position={[-monolithWidth / 2 - 0.006, yOffset, 0]} material={limestoneJointMat}>
              <boxGeometry args={[0.02, 0.014, monolithDepth + 0.01]} />
            </mesh>
          ))}

          {/* Flank Window with Visible Masonry Jamb Reveals & Warm Interior Depth */}
          <group position={[-monolithWidth / 2 - 0.01, 0.15, 0.20]}>
            {/* Masonry Stone Reveal Head & Sill */}
            <mesh position={[0, 0.60, 0]} material={limestoneMediumMat}>
              <boxGeometry args={[0.10, 0.06, 0.26]} />
            </mesh>
            <mesh position={[0, -0.60, 0]} material={limestoneMediumMat}>
              <boxGeometry args={[0.10, 0.06, 0.26]} />
            </mesh>
            {/* Bronze Encasement Frame */}
            <mesh material={bronzeMat}>
              <boxGeometry args={[0.04, 1.14, 0.20]} />
            </mesh>
            {/* Warm Interior Amber Glow peeking out */}
            <mesh position={[-0.02, 0, 0]} material={interiorGlowMat}>
              <planeGeometry args={[0.18, 1.08]} />
            </mesh>
          </group>

          {/* Monolith Architectural Parapet Coping Cap with Drip Reveal */}
          <mesh position={[0, monolithHeight / 2 + 0.016, 0]} material={copingMat} castShadow receiveShadow>
            <boxGeometry args={[monolithWidth + 0.04, 0.032, monolithDepth + 0.04]} />
          </mesh>
        </group>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. THE DEEP TWO-STORY VOID (Recessed Architectural Space)
          Enclosing left return wall, paved terrace ground floor,
          recessed back wall, and structural bronze pilotis column.
          ───────────────────────────────────────────────────────────── */}
      {fVoid > 0.02 && (
        <group name="deep-architectural-void">
          {/* Slender Structural Architectural Bronze Pilotis Column */}
          <mesh
            position={[pilotisX, pilotisHeight / 2, pilotisZ]}
            material={bronzeMat}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[pilotisRadius, pilotisRadius, pilotisHeight, 32]} />
          </mesh>

          {/* Paved Ground Floor Terrace Slab extending deep under the void */}
          <mesh position={[podiumSlabX - 0.10, 0.015, -0.22]} material={limestoneMediumMat} receiveShadow>
            <boxGeometry args={[podiumSlabWidth - 0.20, 0.030, 1.15]} />
          </mesh>

          {/* Deep Void Enclosing Left Return Wall (Connects monolith to rear cavity in shadow) */}
          <mesh position={[monolithX + monolithWidth / 2 + 0.04, pilotisHeight / 2, -0.32]} material={limestoneMediumMat} castShadow receiveShadow>
            <boxGeometry args={[0.08, pilotisHeight, 0.88]} />
          </mesh>

          {/* Deep Void Rear Architectural Cavity Wall (Set back at Z = -0.78, naturally shadowed) */}
          <mesh position={[podiumSlabX - 0.10, pilotisHeight / 2, -0.78]} material={limestoneSoffitMat} castShadow receiveShadow>
            <boxGeometry args={[podiumSlabWidth - 0.25, pilotisHeight, 0.22]} />
          </mesh>
        </group>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. SUBSTANTIAL CANTILEVERED HORIZONTAL SLABS
          Solid architectural slabs projecting from the monolith with stone soffits.
          ───────────────────────────────────────────────────────────── */}
      {fCantilever > 0.02 && (
        <group name="cantilever-slabs">
          {/* Level 2 Substantial Cantilevered Podium Terrace Slab */}
          <group position={[podiumSlabX, podiumSlabY, 0.05]}>
            {/* Massive Warm Limestone Slab Profile */}
            <mesh material={limestoneMat} castShadow receiveShadow>
              <boxGeometry args={[podiumSlabWidth, podiumSlabThickness, podiumSlabDepth]} />
            </mesh>
            {/* Underside Stone Soffit (Receives natural deep chiaroscuro shadow from void) */}
            <mesh position={[0, -podiumSlabThickness / 2 - 0.005, 0]} material={limestoneSoffitMat}>
              <boxGeometry args={[podiumSlabWidth - 0.04, 0.010, podiumSlabDepth - 0.04]} />
            </mesh>
          </group>

          {/* Level 3 Substantial Cantilevered Floating Roof Canopy Slab */}
          <group position={[roofSlabX, roofSlabY, 0.10]}>
            {/* Massive Upper Roof Limestone Canopy Profile */}
            <mesh material={limestoneMat} castShadow receiveShadow>
              <boxGeometry args={[roofSlabWidth, roofSlabThickness, roofSlabDepth]} />
            </mesh>
            {/* Underside Stone Soffit (In natural shade) */}
            <mesh position={[0, -roofSlabThickness / 2 - 0.005, 0]} material={limestoneSoffitMat}>
              <boxGeometry args={[roofSlabWidth - 0.04, 0.010, roofSlabDepth - 0.04]} />
            </mesh>
            {/* Upper Roof Parapet Coping Cap with Crisp Arris Edge */}
            <mesh position={[0, roofSlabThickness / 2 + 0.015, 0]} material={copingMat} castShadow receiveShadow>
              <boxGeometry args={[roofSlabWidth + 0.04, 0.030, roofSlabDepth + 0.04]} />
            </mesh>
          </group>
        </group>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. PHYSICALLY BASED ARCHITECTURAL GLAZING & CONTEMPORARY INTERIOR LIFE
          Glazing set physically deeper into bronze perimeter frame with recessed jambs,
          authentic contemporary furniture (sofa, side table, floor lamp), volumetric room definition,
          and localized warm 2800K occupancy illumination.
          ───────────────────────────────────────────────────────────── */}
      {fGlazing > 0.02 && (
        <group name="glazing-and-interior">
          {/* Subtle Warm Interior Architectural Light (Ground Floor Entry) */}
          <pointLight
            position={[0.60, pilotisHeight / 2 + 0.08, -0.45]}
            intensity={0.80 * fGlazing}
            distance={3.0}
            color="#FFCA88"
            decay={2}
          />

          {/* Ground Floor Deep Recessed Entry Embrasure (Set back into void shadow pocket at Z = -0.28) */}
          <group position={[0.60, pilotisHeight / 2, -0.28]}>
            {/* Hollow Architectural Bronze Perimeter Frame (Head, Sill, Jambs) */}
            <mesh position={[0, (pilotisHeight - 0.04) / 2 - 0.010, 0.06]} material={bronzeMat}>
              <boxGeometry args={[1.68, 0.020, 0.08]} />
            </mesh>
            <mesh position={[0, -(pilotisHeight - 0.04) / 2 + 0.012, 0.06]} material={bronzeMat}>
              <boxGeometry args={[1.68, 0.024, 0.10]} />
            </mesh>
            <mesh position={[-1.68 / 2 + 0.010, 0, 0.06]} material={bronzeMat}>
              <boxGeometry args={[0.020, pilotisHeight - 0.04, 0.08]} />
            </mesh>
            <mesh position={[1.68 / 2 - 0.010, 0, 0.06]} material={bronzeMat}>
              <boxGeometry args={[0.020, pilotisHeight - 0.04, 0.08]} />
            </mesh>

            {/* Recessed Solar Glass Pane (Physical 12mm Glass Pane) */}
            <mesh position={[0, 0, 0.02]} material={glassMat}>
              <boxGeometry args={[1.62, pilotisHeight - 0.10, 0.012]} />
            </mesh>
            {/* Interior Depth Partition Wall */}
            <mesh position={[0.25, 0, -0.22]} material={interiorPartitionMat}>
              <boxGeometry args={[0.95, pilotisHeight - 0.12, 0.05]} />
            </mesh>
            {/* Warm Amber Interior Luminous Glow Plane (2800K occupancy) */}
            <mesh position={[0, 0, -0.28]} material={interiorGlowMat}>
              <planeGeometry args={[1.56, pilotisHeight - 0.12]} />
            </mesh>
          </group>

          {/* Upper Gallery Cantilevered Glazed Pavilion (Recessed deep beneath roof canopy) */}
          <group position={[roofSlabX, (podiumSlabY + roofSlabY) / 2, 0.02]}>
            {/* Hollow Architectural Bronze Encasement Frame with Recessed Jambs */}
            <mesh position={[0, ((roofSlabY - podiumSlabY) - 0.18) / 2 - 0.010, 0.07]} material={bronzeMat}>
              <boxGeometry args={[2.04, 0.020, 0.12]} />
            </mesh>
            <mesh position={[0, -((roofSlabY - podiumSlabY) - 0.18) / 2 + 0.012, 0.07]} material={bronzeMat}>
              <boxGeometry args={[2.04, 0.024, 0.14]} />
            </mesh>
            <mesh position={[-2.04 / 2 + 0.010, 0, 0.07]} material={bronzeMat}>
              <boxGeometry args={[0.020, (roofSlabY - podiumSlabY) - 0.18, 0.14]} />
            </mesh>
            <mesh position={[2.04 / 2 - 0.010, 0, 0.07]} material={bronzeMat}>
              <boxGeometry args={[0.020, (roofSlabY - podiumSlabY) - 0.18, 0.14]} />
            </mesh>

            {/* Architectural Vertical Bronze Mullion (Clean 1/3 structural bay ratio) */}
            <mesh position={[-0.32, 0, 0.05]} material={bronzeSatinMat}>
              <boxGeometry args={[0.018, (roofSlabY - podiumSlabY) - 0.18, 0.05]} />
            </mesh>

            {/* Deeply Recessed Physically Based Architectural Glazing (Physical 12mm Glass Pane) */}
            <mesh position={[0, 0, 0.01]} material={glassMat}>
              <boxGeometry args={[1.98, (roofSlabY - podiumSlabY) - 0.24, 0.012]} />
            </mesh>

            {/* Left Shadow Recess Return (Deep shadow pocket between stone outer edge and bronze frame) */}
            <mesh position={[-2.04 / 2 - 0.02, 0, -0.04]} material={bronzeMat}>
              <boxGeometry args={[0.04, (roofSlabY - podiumSlabY) - 0.18, 0.24]} />
            </mesh>

            {/* Curated Contemporary Architectural Interior (Sofa, side table, floor lamp & volumetric room) */}
            <RealEstateInterior isDark={isDark} phases={phases} />
          </group>
        </group>
      )}
    </group>
  );
}
