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

  // 1a. Procedural Tactile Fine-Grained Limestone Bump Texture
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
        const fineGrain = (Math.random() - 0.5) * 14;
        const lowFreq = Math.sin(x * 0.04) * Math.cos(y * 0.04) * 4;
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
    tex.repeat.set(4, 4);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // 1b. Procedural Limestone Roughness Map (Micro-variation in specular sheen without visual noise)
  const stoneRoughnessTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#BEBEBE"; // baseline ~0.75 roughness
    ctx.fillRect(0, 0, 256, 256);
    const imgData = ctx.getImageData(0, 0, 256, 256);
    const d = imgData.data;
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const i = (y * 256 + x) * 4;
        // Subtle soft sedimentary undulation (±12) + micro-pores
        const wave = Math.sin(x * 0.035 + y * 0.02) * 8 + Math.cos(x * 0.02 - y * 0.03) * 6;
        const grain = (Math.random() - 0.5) * 6;
        const v = Math.max(170, Math.min(218, 194 + wave + grain));
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // 1c. Procedural Bronze Satin Micro-Roughness Texture (Restrained satin grain along extrusion axis)
  const bronzeRoughnessTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#6E6E6E"; // ~0.43 roughness
    ctx.fillRect(0, 0, 128, 128);
    const imgData = ctx.getImageData(0, 0, 128, 128);
    const d = imgData.data;
    for (let y = 0; y < 128; y++) {
      // Fine vertical striation along the Y axis
      const lineGrain = (Math.random() - 0.5) * 12;
      for (let x = 0; x < 128; x++) {
        const i = (y * 128 + x) * 4;
        const v = Math.max(95, Math.min(130, 110 + lineGrain + (Math.random() - 0.5) * 4));
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 6);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // 1d. Procedural Sky / Horizon Equirectangular Reflection Texture
  // Soft atmospheric panorama: soft zenith daylight, bright horizon band, warm architectural ground reflection
  const skyReflectionTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Architectural daylight reflection gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, "#A4BCD2");  // soft zenith daylight
    grad.addColorStop(0.36, "#D6E4EE"); // soft upper sky
    grad.addColorStop(0.48, "#F0F5F9"); // crisp bright horizon
    grad.addColorStop(0.53, "#ECE5DC"); // warm architectural ground bounce rim
    grad.addColorStop(0.72, "#C0B4A2"); // warm terrace/stone reflection
    grad.addColorStop(1.0, "#7D7264");  // deep ground tone
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Subtle soft architectural specular catch (diffused, no harsh stripes)
    const radial = ctx.createRadialGradient(210, 115, 0, 210, 115, 140);
    radial.addColorStop(0.0, "rgba(255, 255, 255, 0.14)");
    radial.addColorStop(0.6, "rgba(255, 255, 255, 0.05)");
    radial.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 512, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }, []);

  // Tactile Limestone Materials with Micro-Roughness Variation
  const limestoneMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#484138" : REAL_ESTATE_PALETTE.limestoneLight,
        roughness: 0.76,
        roughnessMap: stoneRoughnessTexture ?? undefined,
        metalness: 0.02,
        bumpMap: stoneBumpTexture ?? undefined,
        bumpScale: 0.0015,
        transparent: true,
        opacity: Math.min(1.0, fMonolith * 1.2),
      }),
    [isDark, fMonolith, stoneBumpTexture, stoneRoughnessTexture]
  );

  // Subtly differentiated side flank tone for natural 3/4 depth
  const limestoneFlankMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#3F3830" : REAL_ESTATE_PALETTE.limestoneFlank,
        roughness: 0.80,
        roughnessMap: stoneRoughnessTexture ?? undefined,
        metalness: 0.02,
        bumpMap: stoneBumpTexture ?? undefined,
        bumpScale: 0.0015,
        transparent: true,
        opacity: Math.min(1.0, fMonolith * 1.2),
      }),
    [isDark, fMonolith, stoneBumpTexture, stoneRoughnessTexture]
  );

  const limestoneMediumMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#3C362F" : REAL_ESTATE_PALETTE.limestoneMedium,
        roughness: 0.81,
        roughnessMap: stoneRoughnessTexture ?? undefined,
        metalness: 0.02,
        bumpMap: stoneBumpTexture ?? undefined,
        bumpScale: 0.0018,
        transparent: true,
        opacity: Math.min(1.0, fMonolith * 1.2),
      }),
    [isDark, fMonolith, stoneBumpTexture, stoneRoughnessTexture]
  );

  // Crisp arris corner highlight reflecting daylight
  const limestoneArrisMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#554D42" : REAL_ESTATE_PALETTE.limestoneArris,
        roughness: 0.52,
        metalness: 0.03,
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
        roughness: 0.84,
        roughnessMap: stoneRoughnessTexture ?? undefined,
        metalness: 0.02,
        transparent: true,
        opacity: Math.min(1.0, fVoid * 1.2),
      }),
    [isDark, fVoid, stoneRoughnessTexture]
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
        roughness: 0.70,
        roughnessMap: stoneRoughnessTexture ?? undefined,
        metalness: 0.03,
        transparent: true,
        opacity: Math.min(1.0, fCantilever * 1.2),
      }),
    [isDark, fCantilever, stoneRoughnessTexture]
  );

  // 2. Architectural Bronze Metalwork with Restrained Satin Grain
  const bronzeMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#1E1813" : REAL_ESTATE_PALETTE.bronzeDark,
        roughness: 0.42,
        roughnessMap: bronzeRoughnessTexture ?? undefined,
        metalness: 0.46,
        transparent: true,
        opacity: Math.min(1.0, fVoid * 1.5),
      }),
    [isDark, fVoid, bronzeRoughnessTexture]
  );

  const bronzeSatinMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#2A221A" : REAL_ESTATE_PALETTE.bronzeSatin,
        roughness: 0.44,
        roughnessMap: bronzeRoughnessTexture ?? undefined,
        metalness: 0.40,
        transparent: true,
        opacity: Math.min(1.0, fVoid * 1.5),
      }),
    [isDark, fVoid, bronzeRoughnessTexture]
  );

  // 3. Physically Based Architectural Float Glazing (MeshPhysicalMaterial)
  // Low-iron float glass: standard IOR 1.52, clearcoat 1.0 for true Fresnel reflection at grazing angles,
  // high transmission and calibrated transparency for crisp interior clarity, subtle sky reflection
  const glassMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: isDark ? "#A0B5C4" : "#EAF0F5",
        transmission: 0.65 * fGlazing,
        ior: 1.52,
        reflectivity: 0.90,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        roughness: 0.025,
        metalness: 0.02,
        thickness: 0.024,
        attenuationColor: isDark ? "#A4BAC9" : "#EAF2F7",
        attenuationDistance: 3.5,
        specularIntensity: 1.0,
        specularColor: new THREE.Color("#FFFFFF"),
        envMap: skyReflectionTexture ?? undefined,
        envMapIntensity: 0.65,
        transparent: true,
        opacity: Math.min(0.36, fGlazing * 0.38),
        depthWrite: false,
      }),
    [isDark, fGlazing, skyReflectionTexture]
  );

  // 4. Subtle Interior Architectural Ambiance (Refined 2800K occupancy, NO flat orange glowing plane)
  const interiorGlowMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#3A2E22" : "#D4C4B0",
        roughness: 0.80,
        metalness: 0.02,
        emissive: isDark ? "#483218" : "#6E4C24",
        emissiveIntensity: 0.16 * fGlazing,
        transparent: true,
        opacity: Math.min(1.0, fGlazing * 0.95),
      }),
    [isDark, fGlazing]
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

  // Procedural Broad Soft Radial Contact Shadow Texture with Crisp AO Core & Feathered Penumbra
  const contactShadowTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(20, 15, 10, 0.90)");
    gradient.addColorStop(0.18, "rgba(20, 15, 10, 0.55)");
    gradient.addColorStop(0.42, "rgba(20, 15, 10, 0.18)");
    gradient.addColorStop(0.72, "rgba(20, 15, 10, 0.03)");
    gradient.addColorStop(1, "rgba(20, 15, 10, 0)");
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
        opacity: 0.32 * fGround,
        depthWrite: false,
      }),
    [contactShadowTexture, fGround]
  );

  // Tighter inner ambient occlusion core shadow directly under footprint
  const coreShadowMat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: contactShadowTexture ?? undefined,
        transparent: true,
        opacity: 0.70 * fGround,
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
          {/* Monolith Tight Ambient Occlusion Footprint Core */}
          <mesh position={[monolithX, 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]} material={coreShadowMat}>
            <planeGeometry args={[monolithWidth * 1.04, monolithDepth * 1.04]} />
          </mesh>
          {/* Monolith Base Footprint Feathered Shadow */}
          <mesh position={[monolithX + 0.08, 0, -0.06]} rotation={[-Math.PI / 2, 0, 0]} material={contactShadowMat}>
            <planeGeometry args={[monolithWidth * 1.75, monolithDepth * 1.65]} />
          </mesh>
          {/* Pilotis Base Footprint Tight AO (Accurate circular column contact) */}
          <mesh position={[pilotisX, 0.0015, pilotisZ]} rotation={[-Math.PI / 2, 0, 0]} material={coreShadowMat}>
            <planeGeometry args={[0.22, 0.22]} />
          </mesh>
          {/* Deep Void & Slabs Ground Shadow Core */}
          <mesh position={[podiumSlabX - 0.06, 0.0015, 0.04]} rotation={[-Math.PI / 2, 0, 0]} material={coreShadowMat}>
            <planeGeometry args={[podiumSlabWidth * 0.95, 1.80]} />
          </mesh>
          {/* Deep Void & Slabs Ground Shadow Feathered Penumbra */}
          <mesh position={[podiumSlabX + 0.12, 0, -0.06]} rotation={[-Math.PI / 2, 0, 0]} material={contactShadowMat}>
            <planeGeometry args={[podiumSlabWidth * 1.20, 2.30]} />
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

          {/* Monolith Architectural Ground Base Reveal Reglet (Crisp stone-to-grade shadow joint) */}
          <mesh position={[0, -monolithHeight / 2 + 0.005, 0]} material={bronzeMat}>
            <boxGeometry args={[monolithWidth + 0.004, 0.010, monolithDepth + 0.004]} />
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

          {/* Pilotis Column Base Contact AO on Terrace Slab */}
          <mesh position={[pilotisX, 0.0185, pilotisZ]} rotation={[-Math.PI / 2, 0, 0]} material={coreShadowMat}>
            <planeGeometry args={[0.16, 0.16]} />
          </mesh>

          {/* Paved Ground Floor Terrace Slab extending deep under the void */}
          <mesh position={[podiumSlabX - 0.10, 0.009, -0.22]} material={limestoneMediumMat} receiveShadow>
            <boxGeometry args={[podiumSlabWidth - 0.20, 0.018, 1.15]} />
          </mesh>
          {/* Terrace Slab Front Edge Sunlit Arris Catch */}
          <mesh position={[podiumSlabX - 0.10, 0.0175, -0.22 + 1.15 / 2 - 0.001]} material={limestoneArrisMat}>
            <boxGeometry args={[podiumSlabWidth - 0.20, 0.002, 0.003]} />
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
          Solid architectural slabs projecting from the monolith with stone soffits,
          authentic drip groove reveals, arris highlights, and structural anchor reglets.
          ───────────────────────────────────────────────────────────── */}
      {fCantilever > 0.02 && (
        <group name="cantilever-slabs">
          {/* Level 2 Substantial Cantilevered Podium Terrace Slab */}
          <group position={[podiumSlabX, podiumSlabY, 0.05]}>
            {/* Massive Warm Limestone Slab Profile */}
            <mesh material={limestoneMat} castShadow receiveShadow>
              <boxGeometry args={[podiumSlabWidth, podiumSlabThickness, podiumSlabDepth]} />
            </mesh>
            {/* Front-Top Sunlit Arris Highlight Line (Captures raking sun along primary leading edge) */}
            <mesh position={[0, podiumSlabThickness / 2 - 0.001, podiumSlabDepth / 2 - 0.002]} material={limestoneArrisMat}>
              <boxGeometry args={[podiumSlabWidth, 0.003, 0.003]} />
            </mesh>
            {/* Underside Stone Soffit with Recessed Drip Reveal */}
            <mesh position={[0, -podiumSlabThickness / 2 - 0.005, 0]} material={limestoneSoffitMat}>
              <boxGeometry args={[podiumSlabWidth - 0.03, 0.010, podiumSlabDepth - 0.03]} />
            </mesh>
            {/* Recessed Architectural Stone Reglet Joint (Structural expansion reveal into monolith) */}
            <mesh position={[-podiumSlabWidth / 2 + 0.37, 0, 0]} material={limestoneJointMat}>
              <boxGeometry args={[0.012, podiumSlabThickness + 0.002, podiumSlabDepth - 0.02]} />
            </mesh>
          </group>

          {/* Level 3 Substantial Cantilevered Floating Roof Canopy Slab */}
          <group position={[roofSlabX, roofSlabY, 0.10]}>
            {/* Massive Upper Roof Limestone Canopy Profile */}
            <mesh material={limestoneMat} castShadow receiveShadow>
              <boxGeometry args={[roofSlabWidth, roofSlabThickness, roofSlabDepth]} />
            </mesh>
            {/* Front-Top Sunlit Arris Highlight Line */}
            <mesh position={[0, roofSlabThickness / 2 - 0.001, roofSlabDepth / 2 - 0.002]} material={limestoneArrisMat}>
              <boxGeometry args={[roofSlabWidth, 0.003, 0.003]} />
            </mesh>
            {/* Underside Stone Soffit with Recessed Drip Reveal */}
            <mesh position={[0, -roofSlabThickness / 2 - 0.005, 0]} material={limestoneSoffitMat}>
              <boxGeometry args={[roofSlabWidth - 0.03, 0.010, roofSlabDepth - 0.03]} />
            </mesh>
            {/* Upper Roof Parapet Coping Cap with Crisp Arris Edge */}
            <mesh position={[0, roofSlabThickness / 2 + 0.015, 0]} material={copingMat} castShadow receiveShadow>
              <boxGeometry args={[roofSlabWidth + 0.04, 0.030, roofSlabDepth + 0.04]} />
            </mesh>
            {/* Recessed Architectural Stone Reglet Joint (Structural expansion reveal into monolith) */}
            <mesh position={[-roofSlabWidth / 2 + 0.38, 0, 0]} material={limestoneJointMat}>
              <boxGeometry args={[0.012, roofSlabThickness + 0.002, roofSlabDepth - 0.02]} />
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
          {/* Subtle Warm Downward Architectural Wash (Ground Floor Entry Threshold) */}
          <pointLight
            position={[0.55, pilotisHeight / 2 + 0.04, -0.36]}
            intensity={0.24 * fGlazing}
            distance={2.4}
            color="#FFE4C4"
            decay={2}
          />

          {/* Ground Floor Deep Recessed Entry Embrasure (Deep chiaroscuro void pocket at Z = -0.32) */}
          <group position={[0.60, pilotisHeight / 2, -0.32]}>
            {/* Finished Stone Entry Threshold Floor Slab */}
            <mesh position={[0, -(pilotisHeight - 0.04) / 2 + 0.010, -0.10]} material={limestoneMediumMat} receiveShadow>
              <boxGeometry args={[1.72, 0.024, 0.45]} />
            </mesh>

            {/* Recessed Stone Ceiling Soffit over Entrance Lobby */}
            <mesh position={[0, (pilotisHeight - 0.04) / 2 - 0.004, -0.10]} material={limestoneSoffitMat}>
              <boxGeometry args={[1.72, 0.016, 0.45]} />
            </mesh>

            {/* Left Masonry Return Wall Enclosing Entrance Void */}
            <mesh position={[-1.72 / 2 + 0.015, 0, -0.10]} material={limestoneMediumMat} receiveShadow>
              <boxGeometry args={[0.030, pilotisHeight - 0.04, 0.45]} />
            </mesh>

            {/* Recessed Rear Entrance Wall in Shadowed Stone (Physical enclosure, NO flat glowing plane) */}
            <mesh position={[0, 0, -0.28]} material={limestoneSoffitMat} receiveShadow>
              <boxGeometry args={[1.72, pilotisHeight - 0.04, 0.06]} />
            </mesh>

            {/* Slender Architectural Bronze Entry Portal Frame */}
            <mesh position={[0, (pilotisHeight - 0.04) / 2 - 0.008, 0.04]} material={bronzeMat}>
              <boxGeometry args={[1.68, 0.016, 0.070]} />
            </mesh>
            <mesh position={[0, -(pilotisHeight - 0.04) / 2 + 0.010, 0.04]} material={bronzeMat}>
              <boxGeometry args={[1.68, 0.020, 0.080]} />
            </mesh>
            <mesh position={[-1.68 / 2 + 0.008, 0, 0.04]} material={bronzeMat}>
              <boxGeometry args={[0.016, pilotisHeight - 0.04, 0.070]} />
            </mesh>
            <mesh position={[1.68 / 2 - 0.008, 0, 0.04]} material={bronzeMat}>
              <boxGeometry args={[0.016, pilotisHeight - 0.04, 0.070]} />
            </mesh>

            {/* Architectural Bronze Door Division Mullion */}
            <mesh position={[0.15, 0, 0.035]} material={bronzeSatinMat}>
              <boxGeometry args={[0.014, pilotisHeight - 0.06, 0.045]} />
            </mesh>

            {/* Recessed Ground Floor Float Glazing Pane */}
            <mesh position={[0, 0, 0.01]} material={glassMat}>
              <boxGeometry args={[1.64, pilotisHeight - 0.08, 0.012]} />
            </mesh>

            {/* Interior Depth Architectural Partition Pillar */}
            <mesh position={[0.30, 0, -0.16]} material={interiorPartitionMat}>
              <boxGeometry args={[0.85, pilotisHeight - 0.08, 0.06]} />
            </mesh>
          </group>

          {/* Upper Gallery Cantilevered Glazed Pavilion (Recessed deep beneath roof canopy) */}
          <group position={[roofSlabX, (podiumSlabY + roofSlabY) / 2, 0.02]}>
            {/* ── Masonry Stone Window Reveals (Authentic Head, Sill Curb & Jamb Returns) ── */}
            {/* Stone Head Lintel Reveal (Underside pocket beneath roof canopy) */}
            <mesh position={[0, ((roofSlabY - podiumSlabY) - 0.08) / 2, 0.06]} material={limestoneSoffitMat}>
              <boxGeometry args={[2.08, 0.040, 0.16]} />
            </mesh>
            {/* Stone Sill Masonry Curb (Crisp architectural sill reveal in front of glazing) */}
            <mesh position={[0, -((roofSlabY - podiumSlabY) - 0.07) / 2, 0.06]} material={limestoneMediumMat}>
              <boxGeometry args={[2.08, 0.035, 0.18]} />
            </mesh>
            {/* Left Masonry Jamb Return (Connects window envelope naturally to monolith shear wall) */}
            <mesh position={[-2.08 / 2 - 0.015, 0, 0.03]} material={limestoneMediumMat} castShadow receiveShadow>
              <boxGeometry args={[0.036, (roofSlabY - podiumSlabY) - 0.08, 0.22]} />
            </mesh>
            {/* Right Masonry Jamb Return (Crisp stone stop framing the glass envelope) */}
            <mesh position={[2.08 / 2 + 0.015, 0, 0.03]} material={limestoneMediumMat} castShadow receiveShadow>
              <boxGeometry args={[0.036, (roofSlabY - podiumSlabY) - 0.08, 0.22]} />
            </mesh>

            {/* ── Slender Architectural Bronze Perimeter Frame (Reduced Sightlines) ── */}
            {/* Head Channel */}
            <mesh position={[0, 1.05 / 2 - 0.007, 0.01]} material={bronzeMat}>
              <boxGeometry args={[2.02, 0.014, 0.060]} />
            </mesh>
            {/* Sill Channel */}
            <mesh position={[0, -1.05 / 2 + 0.007, 0.01]} material={bronzeMat}>
              <boxGeometry args={[2.02, 0.014, 0.068]} />
            </mesh>
            {/* Left Jamb */}
            <mesh position={[-2.02 / 2 + 0.007, 0, 0.01]} material={bronzeMat}>
              <boxGeometry args={[0.014, 1.05, 0.060]} />
            </mesh>
            {/* Right Jamb */}
            <mesh position={[2.02 / 2 - 0.007, 0, 0.01]} material={bronzeMat}>
              <boxGeometry args={[0.014, 1.05, 0.060]} />
            </mesh>

            {/* Subtle Bronze Sill Arris Specular Highlight Catch */}
            <mesh position={[0, -1.05 / 2 + 0.014, 0.042]} material={limestoneArrisMat}>
              <boxGeometry args={[2.02, 0.003, 0.003]} />
            </mesh>

            {/* Visible Architectural Glass Perimeter Spacer Seals (Framing pane perimeter) */}
            <mesh position={[0, 1.02 / 2 - 0.003, -0.022]} material={bronzeMat}>
              <boxGeometry args={[1.98, 0.006, 0.010]} />
            </mesh>
            <mesh position={[0, -1.02 / 2 + 0.003, -0.022]} material={bronzeMat}>
              <boxGeometry args={[1.98, 0.006, 0.010]} />
            </mesh>
            <mesh position={[-1.98 / 2 + 0.003, 0, -0.022]} material={bronzeMat}>
              <boxGeometry args={[0.006, 1.02, 0.010]} />
            </mesh>
            <mesh position={[1.98 / 2 - 0.003, 0, -0.022]} material={bronzeMat}>
              <boxGeometry args={[0.006, 1.02, 0.010]} />
            </mesh>

            {/* Deeply Recessed Physically Based Float Glazing (Sitting deep inside the bronze pocket) */}
            <mesh position={[0, 0, -0.022]} material={glassMat}>
              <boxGeometry args={[1.98, 1.02, 0.012]} />
            </mesh>

            {/* Left Shadow Recess Return (Deep architectural shadow between stone monolith and glazing) */}
            <mesh position={[-2.04 / 2 - 0.02, 0, -0.06]} material={bronzeMat}>
              <boxGeometry args={[0.04, (roofSlabY - podiumSlabY) - 0.14, 0.20]} />
            </mesh>

            {/* Curated Contemporary Architectural Interior (Sofa, side table, floor lamp & volumetric room) */}
            <RealEstateInterior isDark={isDark} phases={phases} />
          </group>
        </group>
      )}
    </group>
  );
}
