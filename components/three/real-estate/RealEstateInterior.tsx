"use client";

import * as React from "react";
import * as THREE from "three";
import { ArchitecturalRevealPhases } from "./types";

interface RealEstateInteriorProps {
  readonly isDark?: boolean;
  readonly phases?: ArchitecturalRevealPhases;
}

/**
 * RealEstateInterior — Photorealistic Contemporary Architectural Interior
 * 
 * Provides authentic interior life for the Section 03 Real Estate glazed pavilion:
 * - Exactly ONE properly proportioned contemporary sofa:
 *   - Rounded upholstered seat shell
 *   - Separate seat cushions with center shadow seam
 *   - Separate back cushions with subtle angle & piping
 *   - Softened armrests with rounded profiles
 *   - Warm off-white / ivory bouclé fabric (roughness 0.95)
 *   - Grounded contact shadow on floor plane
 * - Minimalist architectural side table:
 *   - Ultra-thin disc with bevel, slender column, weighted base disc, contact shadow
 * - Architectural floor lamp:
 *   - Slender bronze stem, weighted base, conical linen shade, hidden internal bulb
 *   - Soft downward light distribution (no glowing white sphere, no harsh hotspot)
 * - Volumetric room material differentiation:
 *   - Warm timber/micro-cement floor with subtle specular sheen
 *   - Matte off-white plaster ceiling
 *   - Tactile limestone rear wall with bronze baseboard reveal
 * - Performance guard: 0 cost when glazing is invisible
 */
export function RealEstateInterior({ isDark = false, phases }: RealEstateInteriorProps) {
  const fGlazing = phases ? phases.glazing : 1.0;
  const isTransitioning = fGlazing < 0.98;

  // 1. Procedural Soft Contact Shadow Texture for Furniture Grounding
  const contactShadowTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(16, 12, 8, 0.72)");
    gradient.addColorStop(0.35, "rgba(16, 12, 8, 0.38)");
    gradient.addColorStop(0.70, "rgba(16, 12, 8, 0.10)");
    gradient.addColorStop(1.0, "rgba(16, 12, 8, 0.0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const contactShadowMat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: contactShadowTexture ?? undefined,
        transparent: true,
        opacity: Math.min(0.65, fGlazing * 0.70),
        depthWrite: false,
      }),
    [contactShadowTexture, fGlazing]
  );

  // 2. Curated Bouclé Upholstery Materials with Subtle Cushion Differentiation
  const sofaShellMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#342E27" : "#DDD6CB",
        roughness: 0.94,
        metalness: 0.01,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  const sofaCushionMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#3A332C" : "#E8E2D7",
        roughness: 0.95,
        metalness: 0.01,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  const sofaPipingMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#241D17" : "#B8ADA0",
        roughness: 0.96,
        metalness: 0.01,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  const sofaPlinthMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#17120E" : "#241D17",
        roughness: 0.50,
        metalness: 0.40,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  // 3. Dark Satin Bronze Metalwork (Side table, lamp stem, baseboard)
  const interiorBronzeMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#18130F" : "#282018",
        roughness: 0.38,
        metalness: 0.52,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  // Side Table Finish: Dark Satin Bronze / Smoked Walnut
  const sideTableMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#1C1713" : "#2B231C",
        roughness: 0.44,
        metalness: 0.35,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  // 4. Floor Lamp Materials (Linen shade & satin brass reflector)
  const lampShadeMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#9E9282" : "#EFE9DF",
        roughness: 0.85,
        metalness: 0.01,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  const lampBrassMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#B28C52" : "#DFC288",
        roughness: 0.30,
        metalness: 0.65,
        emissive: isDark ? "#553818" : "#7A5222",
        emissiveIntensity: 0.30 * fGlazing,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  // 5. Volumetric Room Enclosure Materials (Clear roughness separation)
  const floorMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#28211A" : "#C4B6A5",
        roughness: 0.46, // Soft satin sheen showing window light response
        metalness: 0.03,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  const ceilingMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#241E19" : "#ECE7DE",
        roughness: 0.92, // Diffuse matte plaster
        metalness: 0.01,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  const rearWallMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#2A231C" : "#CCC2B3",
        roughness: 0.86, // Tactile limestone plaster
        metalness: 0.02,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  // Performance guard: completely inactive when glazing is hidden
  if (fGlazing <= 0.01) return null;

  // Clear room dimensions:
  // Floor Y = -0.518, Ceiling Y = +0.512
  // Front glass is at Z = 0.01, Rear wall is at Z = -0.50
  const floorY = -0.518;
  const ceilingY = 0.512;
  const roomDepth = 0.50;
  const roomCenterZ = -roomDepth / 2; // -0.25

  return (
    <group name="real-estate-contemporary-interior">
      {/* ─────────────────────────────────────────────────────────────
          1. VOLUMETRIC ROOM ENCLOSURE (Floor, Ceiling, Rear Wall & Baseboard)
          Clear material differentiation through roughness & tone:
          Floor (0.46 satin) | Ceiling (0.92 matte) | Wall (0.86 limestone plaster)
          ───────────────────────────────────────────────────────────── */}
      {/* Interior Floor Plane (Warm natural timber/micro-cement with soft specular sheen) */}
      <mesh
        position={[0, floorY + 0.001, roomCenterZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={floorMat}
        receiveShadow
      >
        <planeGeometry args={[1.98, roomDepth]} />
      </mesh>

      {/* Interior Ceiling Plane (Smooth recessed off-white architectural plaster) */}
      <mesh
        position={[0, ceilingY - 0.001, roomCenterZ]}
        rotation={[Math.PI / 2, 0, 0]}
        material={ceilingMat}
      >
        <planeGeometry args={[1.98, roomDepth]} />
      </mesh>

      {/* Recessed Rear Enclosure Wall (Set back at Z = -0.50 with genuine spatial depth) */}
      <mesh
        position={[0, (floorY + ceilingY) / 2, -roomDepth]}
        material={rearWallMat}
        receiveShadow
      >
        <planeGeometry args={[1.98, ceilingY - floorY]} />
      </mesh>

      {/* Architectural Bronze Perimeter Baseboard / Shadow Reveal */}
      <mesh
        position={[0, floorY + 0.010, -roomDepth + 0.004]}
        material={interiorBronzeMat}
      >
        <boxGeometry args={[1.98, 0.018, 0.008]} />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          2. UPGRADED CONTEMPORARY ARCHITECTURAL SOFA
          High-end Italian contemporary profile:
          - Ground contact shadow plane
          - Recessed dark bronze plinth
          - Upholstered seat shell with softened fillet
          - Separate left & right seat cushions with center welt shadow seam
          - Separate left & right back cushions angled back with piping
          - Softened low armrests with rounded top profiles
          - Positioned at X = 0.08, Z = -0.22 (set back 7cm from glass facade)
          ───────────────────────────────────────────────────────────── */}
      <group position={[0.08, floorY, -0.22]}>
        {/* Ground Contact Shadow (Soft ambient occlusion grounding the sofa) */}
        <mesh
          position={[0, 0.0015, 0.01]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={contactShadowMat}
        >
          <planeGeometry args={[0.96, 0.44]} />
        </mesh>

        {/* Recessed Shadow Plinth Base (Dark bronze architectural reveal) */}
        <mesh position={[0, 0.012, 0]} material={sofaPlinthMat} castShadow receiveShadow>
          <boxGeometry args={[0.84, 0.024, 0.31]} />
        </mesh>

        {/* Upholstered Seat Shell / Chassis (Low-profile upholstered platform) */}
        <mesh position={[0, 0.060, 0]} material={sofaShellMat} castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.072, 0.34]} />
        </mesh>

        {/* Front Rounded Shell Fillet (Soft organic curvature) */}
        <mesh
          position={[0, 0.060, 0.34 / 2]}
          rotation={[0, 0, Math.PI / 2]}
          material={sofaShellMat}
        >
          <cylinderGeometry args={[0.036, 0.036, 0.88, 16]} />
        </mesh>

        {/* ── Separate Seat Cushions (Left & Right with Center Shadow Seam) ── */}
        {/* Left Seat Cushion */}
        <group position={[-0.210, 0.126, 0.01]}>
          <mesh material={sofaCushionMat} castShadow receiveShadow>
            <boxGeometry args={[0.395, 0.060, 0.30]} />
          </mesh>
          <mesh position={[0, 0, 0.15]} rotation={[0, 0, Math.PI / 2]} material={sofaCushionMat}>
            <cylinderGeometry args={[0.030, 0.030, 0.395, 16]} />
          </mesh>
        </group>

        {/* Right Seat Cushion */}
        <group position={[0.210, 0.126, 0.01]}>
          <mesh material={sofaCushionMat} castShadow receiveShadow>
            <boxGeometry args={[0.395, 0.060, 0.30]} />
          </mesh>
          <mesh position={[0, 0, 0.15]} rotation={[0, 0, Math.PI / 2]} material={sofaCushionMat}>
            <cylinderGeometry args={[0.030, 0.030, 0.395, 16]} />
          </mesh>
        </group>

        {/* Center Seat Cushion Shadow Seam / Welt */}
        <mesh position={[0, 0.128, 0.01]} material={sofaPipingMat}>
          <boxGeometry args={[0.008, 0.054, 0.30]} />
        </mesh>

        {/* ── Low Contemporary Backrest & Separate Cushions ── */}
        {/* Upholstered Backrest Shell */}
        <mesh position={[0, 0.205, -0.125]} material={sofaShellMat} castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.150, 0.080]} />
        </mesh>
        <mesh
          position={[0, 0.280, -0.125]}
          rotation={[0, 0, Math.PI / 2]}
          material={sofaShellMat}
        >
          <cylinderGeometry args={[0.040, 0.040, 0.88, 16]} />
        </mesh>

        {/* Left Back Cushion (Softly angled back with realistic depth) */}
        <mesh
          position={[-0.210, 0.215, -0.068]}
          rotation={[-0.14, 0, 0.015]}
          material={sofaCushionMat}
          castShadow
        >
          <boxGeometry args={[0.390, 0.155, 0.060]} />
        </mesh>

        {/* Right Back Cushion (Softly angled back with realistic depth) */}
        <mesh
          position={[0.210, 0.215, -0.068]}
          rotation={[-0.14, 0, -0.015]}
          material={sofaCushionMat}
          castShadow
        >
          <boxGeometry args={[0.390, 0.155, 0.060]} />
        </mesh>

        {/* Center Back Cushion Vertical Shadow Seam */}
        <mesh position={[0, 0.215, -0.068]} material={sofaPipingMat}>
          <boxGeometry args={[0.008, 0.150, 0.050]} />
        </mesh>

        {/* ── Softened Armrests (Left & Right) ── */}
        {/* Left Armrest */}
        <group position={[-0.400, 0.165, 0]}>
          <mesh material={sofaShellMat} castShadow receiveShadow>
            <boxGeometry args={[0.082, 0.142, 0.34]} />
          </mesh>
          <mesh position={[0, 0.071, 0]} rotation={[Math.PI / 2, 0, 0]} material={sofaShellMat}>
            <cylinderGeometry args={[0.041, 0.041, 0.34, 16]} />
          </mesh>
        </group>

        {/* Right Armrest */}
        <group position={[0.400, 0.165, 0]}>
          <mesh material={sofaShellMat} castShadow receiveShadow>
            <boxGeometry args={[0.082, 0.142, 0.34]} />
          </mesh>
          <mesh position={[0, 0.071, 0]} rotation={[Math.PI / 2, 0, 0]} material={sofaShellMat}>
            <cylinderGeometry args={[0.041, 0.041, 0.34, 16]} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. REFINED MINIMALIST ARCHITECTURAL SIDE TABLE
          Placed beside the right arm of the sofa (X = 0.58, Z = -0.20):
          - Ground contact shadow plane
          - Thin circular tabletop disc with subtle chamfer
          - Slender central support column
          - Weighted base disc
          ───────────────────────────────────────────────────────────── */}
      <group position={[0.58, floorY, -0.20]}>
        {/* Ground Contact Shadow */}
        <mesh
          position={[0, 0.0015, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={contactShadowMat}
        >
          <planeGeometry args={[0.18, 0.18]} />
        </mesh>

        {/* Weighted Bronze Base Disc */}
        <mesh position={[0, 0.003, 0]} material={sideTableMat}>
          <cylinderGeometry args={[0.062, 0.062, 0.006, 24]} />
        </mesh>

        {/* Slender Central Stem */}
        <mesh position={[0, 0.114, 0]} material={sideTableMat}>
          <cylinderGeometry args={[0.006, 0.006, 0.222, 16]} />
        </mesh>

        {/* Thin Tabletop Disc with Chamfer */}
        <mesh position={[0, 0.226, 0]} material={sideTableMat} castShadow receiveShadow>
          <cylinderGeometry args={[0.092, 0.092, 0.004, 24]} />
        </mesh>
        <mesh position={[0, 0.224, 0]} material={sideTableMat}>
          <cylinderGeometry args={[0.088, 0.092, 0.003, 24]} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. REFINED ELEGANT ARCHITECTURAL FLOOR LAMP
          Positioned slightly behind side table (X = 0.68, Z = -0.32):
          - Ground contact shadow
          - Physical weighted base disc
          - Slender dark bronze stem
          - Believable conical fabric / architectural shade in matte linen
          - Hidden bulb recessed inside the shade (NO glowing white sphere!)
          - Soft downward light distribution
          ───────────────────────────────────────────────────────────── */}
      <group position={[0.68, floorY, -0.32]}>
        {/* Ground Contact Shadow */}
        <mesh
          position={[0, 0.0015, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={contactShadowMat}
        >
          <planeGeometry args={[0.16, 0.16]} />
        </mesh>

        {/* Heavy Weighted Base Disc */}
        <mesh position={[0, 0.004, 0]} material={interiorBronzeMat}>
          <cylinderGeometry args={[0.052, 0.052, 0.008, 24]} />
        </mesh>

        {/* Slender Architectural Stem */}
        <mesh position={[0, 0.274, 0]} material={interiorBronzeMat}>
          <cylinderGeometry args={[0.004, 0.004, 0.540, 16]} />
        </mesh>

        {/* Angled Architectural Conical Shade (Tilted gently downward toward sofa/table) */}
        <group position={[-0.035, 0.520, 0.035]} rotation={[0.38, 0, -0.30]}>
          {/* Outer Conical Linen / Architectural Shade */}
          <mesh material={lampShadeMat} castShadow>
            <cylinderGeometry args={[0.022, 0.058, 0.070, 24, 1, true]} />
          </mesh>
          {/* Inner Brass Reflector Ring */}
          <mesh scale={[0.97, 0.97, 0.97]} material={lampBrassMat}>
            <cylinderGeometry args={[0.021, 0.056, 0.068, 24, 1, true]} />
          </mesh>
          {/* Hidden Bulb Fitting (Deeply recessed up inside the shade apex — invisible from exterior) */}
          <mesh position={[0, 0.022, 0]} material={lampBrassMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.016, 12]} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. SOFT WARM OCCUPANCY ILLUMINATION (NO HARSH HOTSPOTS, NO NEON)
          - Localized floor lamp downward wash on side table & sofa arm
          - Subtle interior ambient bounce
          ───────────────────────────────────────────────────────────── */}
      {/* Downward Floor Lamp Pool (Soft illumination grazing side table & sofa cushion) */}
      <pointLight
        position={[0.64, floorY + 0.46, -0.26]}
        intensity={0.48 * fGlazing}
        distance={1.50}
        color="#FFA858"
        decay={2}
      />

      {/* Soft Ambient Interior Bounce (Subtle 2800K room occupancy) */}
      <pointLight
        position={[0.10, floorY + 0.55, -0.28]}
        intensity={0.28 * fGlazing}
        distance={3.50}
        color="#FFE8CF"
        decay={2}
      />
    </group>
  );
}
