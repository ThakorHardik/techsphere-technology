"use client";

import * as React from "react";
import * as THREE from "three";
import { ArchitecturalRevealPhases } from "./types";

interface RealEstateInteriorProps {
  readonly isDark?: boolean;
  readonly phases?: ArchitecturalRevealPhases;
}

/**
 * Helper to construct a mathematically smooth 2D rounded rectangle
 */
function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  const radius = Math.min(r, w / 2, h / 2);
  shape.moveTo(x + radius, y);
  shape.lineTo(x + w - radius, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + radius);
  shape.lineTo(x + w, y + h - radius);
  shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  shape.lineTo(x + radius, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

/**
 * RealEstateInterior — Photorealistic Contemporary Architectural Interior
 * 
 * Provides authentic interior life for the Section 03 Real Estate glazed pavilion:
 * - Exactly ONE properly proportioned contemporary Italian sofa:
 *   - Recessed dark bronze plinth
 *   - Softened beveled upholstered chassis deck
 *   - Separate left & right crowned seat cushions with center welt shadow seam
 *   - Separate left & right back cushions angled back with authentic pillow crown
 *   - Softened low contemporary armrests
 *   - Warm off-white / ivory bouclé fabric (roughness 0.94)
 *   - Soft grounded contact shadow on floor plane
 * - Minimalist architectural side table:
 *   - Slender bronze stem, weighted base disc, beveled tabletop disc
 * - Architectural floor lamp:
 *   - Slender bronze stem, angled connector neck, conical linen shade, hidden internal bulb
 *   - Soft downward 2800K light distribution (no glowing hotspot, no flat orange box)
 * - Volumetric room material differentiation:
 *   - Warm timber/micro-cement floor with subtle satin sheen
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
    gradient.addColorStop(0, "rgba(16, 12, 8, 0.76)");
    gradient.addColorStop(0.35, "rgba(16, 12, 8, 0.40)");
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
        opacity: Math.min(0.68, fGlazing * 0.72),
        depthWrite: false,
      }),
    [contactShadowTexture, fGlazing]
  );

  // 2. Procedural Subtle Timber Floor Texture (Natural plank sheen under glazing)
  const timberFloorTexture = React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#BEB2A0";
    ctx.fillRect(0, 0, 128, 128);
    const imgData = ctx.getImageData(0, 0, 128, 128);
    const d = imgData.data;
    for (let y = 0; y < 128; y++) {
      const plankTone = (Math.sin(y * 0.15) > 0.94 ? -16 : 0) + (Math.random() - 0.5) * 6;
      for (let x = 0; x < 128; x++) {
        const i = (y * 128 + x) * 4;
        const v = Math.max(140, Math.min(210, 185 + plankTone + (Math.random() - 0.5) * 4));
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 2);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // 3. Curated Bouclé Upholstery Materials with Subtle Cushion Differentiation
  const sofaShellMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#342E27" : "#DDD6CB",
        roughness: 0.93,
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
        roughness: 0.94,
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
        roughness: 0.44,
        metalness: 0.42,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  // 4. Dark Satin Bronze Metalwork (Side table, lamp stem, baseboard)
  const interiorBronzeMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#18130F" : "#282018",
        roughness: 0.38,
        metalness: 0.50,
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
        metalness: 0.36,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  // 5. Floor Lamp Materials (Linen shade & satin brass reflector)
  const lampShadeMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#9E9282" : "#EFE9DF",
        roughness: 0.86,
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
        roughness: 0.32,
        metalness: 0.62,
        emissive: isDark ? "#553818" : "#7A5222",
        emissiveIntensity: 0.22 * fGlazing,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  // 6. Volumetric Room Enclosure Materials (Clear roughness separation)
  const floorMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#28211A" : "#C4B6A5",
        roughness: 0.48,
        roughnessMap: timberFloorTexture ?? undefined,
        metalness: 0.02,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning, timberFloorTexture]
  );

  const ceilingMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? "#241E19" : "#ECE7DE",
        roughness: 0.94,
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
        roughness: 0.84,
        metalness: 0.02,
        transparent: isTransitioning,
        opacity: Math.min(1.0, fGlazing * 1.25),
        depthWrite: true,
      }),
    [isDark, fGlazing, isTransitioning]
  );

  // 7. Custom Soft Upholstery Geometries with Smooth Beveled Crowns
  const seatDeckGeo = React.useMemo(() => {
    const shape = createRoundedRectShape(0.86, 0.32, 0.020);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.046,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    });
    geo.rotateX(-Math.PI / 2);
    geo.center();
    return geo;
  }, []);

  const seatCushionGeo = React.useMemo(() => {
    const shape = createRoundedRectShape(0.395, 0.285, 0.024);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.046,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.010,
      bevelThickness: 0.010,
    });
    geo.rotateX(-Math.PI / 2);
    geo.center();
    return geo;
  }, []);

  const backCushionGeo = React.useMemo(() => {
    const shape = createRoundedRectShape(0.390, 0.142, 0.022);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.034,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.009,
      bevelThickness: 0.009,
    });
    geo.center();
    return geo;
  }, []);

  const backrestShellGeo = React.useMemo(() => {
    const shape = createRoundedRectShape(0.86, 0.145, 0.018);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.052,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    });
    geo.center();
    return geo;
  }, []);

  const armrestGeo = React.useMemo(() => {
    const shape = createRoundedRectShape(0.32, 0.122, 0.020);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.064,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    });
    geo.rotateY(Math.PI / 2);
    geo.center();
    return geo;
  }, []);

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
          Floor (0.48 satin) | Ceiling (0.94 matte) | Wall (0.84 limestone plaster)
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
          High-end Italian contemporary profile (smooth beveled upholstery crowns):
          - Ground contact shadow plane
          - Recessed dark bronze plinth
          - Upholstered seat chassis with soft perimeter fillets
          - Separate left & right seat cushions with center welt shadow seam
          - Separate left & right back cushions angled back with authentic pillow crown
          - Softened low armrests with rounded profiles
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
        <mesh position={[0, 0.009, 0]} material={sofaPlinthMat} castShadow receiveShadow>
          <boxGeometry args={[0.84, 0.018, 0.31]} />
        </mesh>

        {/* Upholstered Seat Chassis Deck (Soft beveled perimeter) */}
        <mesh
          position={[0, 0.048, 0]}
          geometry={seatDeckGeo}
          material={sofaShellMat}
          castShadow
          receiveShadow
        />

        {/* ── Separate Seat Cushions (Left & Right with Center Shadow Seam) ── */}
        {/* Left Seat Cushion */}
        <mesh
          position={[-0.208, 0.108, 0.005]}
          geometry={seatCushionGeo}
          material={sofaCushionMat}
          castShadow
          receiveShadow
        />

        {/* Right Seat Cushion */}
        <mesh
          position={[0.208, 0.108, 0.005]}
          geometry={seatCushionGeo}
          material={sofaCushionMat}
          castShadow
          receiveShadow
        />

        {/* Center Seat Cushion Shadow Seam / Welt */}
        <mesh position={[0, 0.108, 0.005]} material={sofaPipingMat}>
          <boxGeometry args={[0.006, 0.060, 0.29]} />
        </mesh>

        {/* ── Low Contemporary Backrest & Separate Cushions ── */}
        {/* Upholstered Backrest Shell */}
        <mesh
          position={[0, 0.198, -0.125]}
          geometry={backrestShellGeo}
          material={sofaShellMat}
          castShadow
          receiveShadow
        />

        {/* Left Back Cushion (Softly angled back with realistic depth) */}
        <mesh
          position={[-0.208, 0.205, -0.068]}
          rotation={[-0.14, 0, 0.015]}
          geometry={backCushionGeo}
          material={sofaCushionMat}
          castShadow
        />

        {/* Right Back Cushion (Softly angled back with realistic depth) */}
        <mesh
          position={[0.208, 0.205, -0.068]}
          rotation={[-0.14, 0, -0.015]}
          geometry={backCushionGeo}
          material={sofaCushionMat}
          castShadow
        />

        {/* Center Back Cushion Vertical Shadow Seam */}
        <mesh position={[0, 0.205, -0.068]} rotation={[-0.14, 0, 0]} material={sofaPipingMat}>
          <boxGeometry args={[0.006, 0.142, 0.040]} />
        </mesh>

        {/* ── Softened Armrests (Left & Right) ── */}
        {/* Left Armrest */}
        <mesh
          position={[-0.400, 0.146, 0]}
          geometry={armrestGeo}
          material={sofaShellMat}
          castShadow
          receiveShadow
        />

        {/* Right Armrest */}
        <mesh
          position={[0.400, 0.146, 0]}
          geometry={armrestGeo}
          material={sofaShellMat}
          castShadow
          receiveShadow
        />
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
          - Believable cantilevered connector neck & knurled brass joint
          - Conical fabric / architectural shade in matte linen with brass reflector
          - Hidden bulb recessed inside shade (NO glowing white sphere, NO harsh hotspot)
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

        {/* Slender Architectural Vertical Stem */}
        <mesh position={[0, 0.250, 0]} material={interiorBronzeMat}>
          <cylinderGeometry args={[0.004, 0.004, 0.490, 16]} />
        </mesh>

        {/* Architectural Angled Neck Connector */}
        <mesh position={[-0.016, 0.505, 0.016]} rotation={[0.40, 0, -0.35]} material={interiorBronzeMat}>
          <cylinderGeometry args={[0.0035, 0.0035, 0.045, 12]} />
        </mesh>

        {/* Brass Swivel Joint Detail */}
        <mesh position={[-0.030, 0.522, 0.030]} material={lampBrassMat}>
          <sphereGeometry args={[0.006, 12, 12]} />
        </mesh>

        {/* Angled Architectural Conical Shade (Tilted gently downward toward sofa/table) */}
        <group position={[-0.038, 0.518, 0.038]} rotation={[0.36, 0, -0.28]}>
          {/* Outer Conical Linen / Architectural Shade */}
          <mesh material={lampShadeMat} castShadow>
            <cylinderGeometry args={[0.024, 0.060, 0.072, 28, 1, true]} />
          </mesh>
          {/* Inner Brass Reflector Ring */}
          <mesh scale={[0.97, 0.97, 0.97]} material={lampBrassMat}>
            <cylinderGeometry args={[0.023, 0.058, 0.070, 28, 1, true]} />
          </mesh>
          {/* Top Shade Cap / Finial */}
          <mesh position={[0, 0.036, 0]} material={lampBrassMat}>
            <cylinderGeometry args={[0.025, 0.025, 0.004, 20]} />
          </mesh>
          {/* Hidden Bulb Fitting (Deeply recessed up inside the shade apex — invisible from exterior) */}
          <mesh position={[0, 0.020, 0]} material={lampBrassMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.016, 12]} />
          </mesh>
        </group>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. SOFT WARM OCCUPANCY ILLUMINATION (NO HARSH HOTSPOTS, NO NEON)
          - Localized floor lamp downward wash on side table & sofa arm
          - Subtle interior ambient cove bounce
          ───────────────────────────────────────────────────────────── */}
      {/* Downward Floor Lamp Pool (Soft 2800K illumination grazing side table & sofa arm) */}
      <pointLight
        position={[0.64, floorY + 0.46, -0.26]}
        intensity={0.28 * fGlazing}
        distance={1.45}
        color="#FFE2BE"
        decay={2}
      />

      {/* Soft Ambient Interior Bounce (Subtle 2800K architectural occupancy wash) */}
      <pointLight
        position={[0.10, floorY + 0.52, -0.28]}
        intensity={0.16 * fGlazing}
        distance={3.20}
        color="#FFF1E2"
        decay={2}
      />
    </group>
  );
}
