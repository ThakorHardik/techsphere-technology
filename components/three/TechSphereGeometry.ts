import MASTER_DOTS_DATA from "@/lib/three/logo-dots-data.json";
import { DotPointData } from "./types";

export interface TechSphereBuffers {
  positionsSphere: Float32Array;
  positionsParticles: Float32Array;
  positionsConnections: Float32Array;
  positionsSystem: Float32Array;
  sizesSphere: Float32Array;
  sizesParticles: Float32Array;
  alphasSphere: Float32Array;
  alphasParticles: Float32Array;
  edgeFactors: Float32Array;
  connectionLinePositions: Float32Array;
  connectionLineDelays: Float32Array;
  systemLinePositions: Float32Array;
  count: number;
  masterCount: number;
  secondaryCount: number;
  connectionCount: number;
  systemLineCount: number;
}

const MASTER_DOTS = MASTER_DOTS_DATA as DotPointData[];

/**
 * Generates the multi-state 3D buffer arrays for the TechSphere Dotted Sphere system.
 * Directly derived from the official logo-mark.png halftone geometry (183 master dots).
 *
 * Guarantees:
 * 1. SPHERE: 183 master dots are the visual source of truth matching logo-mark.png.
 *    - Preserves silhouette, dot placement, dot size hierarchy (0.08–1.0), negative space,
 *      upper/lower tapers, and curved flow with authentic shallow 3D depth.
 * 2. PARTICLES: Controlled gentle expansion releasing outer particles — NOT an explosion.
 *    - 60–75% of visual mass firmly anchored near original positions (core moves 5–12%).
 *    - Outer/edge dots move 15–25% (slightly reduced on mobile: 4–15%).
 *    - Directional flow preserves right-side concave negative space.
 *    - Secondary particles: Desktop (96), Tablet (80), Mobile (60).
 * 3. CONNECTIONS: Intelligent local neighborhood graph connecting aligned halftone neighbors.
 *    - Desktop (120), Tablet (85), Mobile (55) lines.
 *    - Progressive staged reveal in 5 spatial groups.
 *    - Master dots remain stable; no large particle explosion.
 * 4. SYSTEM: Infrastructure transformation with subtle flow band organization.
 *    - 4 curvilinear flow bands subtly regularized by 3–8% of local neighbor spacing.
 *    - 20–35 structural accents along the organized bands (Desktop: 28, Tablet: 24, Mobile: 20).
 *    - Preserves silhouette, negative space, and dot hierarchy without forming a rigid grid.
 */
export function generateTechSphereBuffers(
  isMobile: boolean = false,
  isTablet: boolean = false,
  sphereRadius: number = 1.7
): TechSphereBuffers {
  const masterCount = MASTER_DOTS.length; // 183 master dots

  // Secondary particle count scaled by device tier (Desktop: 80–120, Mobile: 40–80)
  const secondaryCount = isMobile ? 60 : isTablet ? 80 : 96;
  const totalCount = masterCount + secondaryCount;

  const positionsSphere = new Float32Array(totalCount * 3);
  const positionsParticles = new Float32Array(totalCount * 3);
  const positionsConnections = new Float32Array(totalCount * 3);
  const positionsSystem = new Float32Array(totalCount * 3);
  const sizesSphere = new Float32Array(totalCount);
  const sizesParticles = new Float32Array(totalCount);
  const alphasSphere = new Float32Array(totalCount);
  const alphasParticles = new Float32Array(totalCount);
  const edgeFactors = new Float32Array(totalCount);

  // Center offset to center the crescent mark horizontally in the canvas
  // Original dots X spans [-0.9835, 0.2117], midpoint is -0.3859
  const centerOffsetX = 0.3859;

  // Shallow curved depth scale (span ±0.11 * sphereRadius, total 0.22 relative to object scale)
  const depthScale = 0.22;

  // 1. Calculate weighted Center of Mass and max distance to calibrate edgeFactors
  let sumX = 0;
  let sumY = 0;
  let sumW = 0;
  for (let i = 0; i < masterCount; i++) {
    const d = MASTER_DOTS[i];
    const cx = (d.x + centerOffsetX) * sphereRadius;
    const cy = d.y * sphereRadius;
    const w = d.size * d.size;
    sumX += cx * w;
    sumY += cy * w;
    sumW += w;
  }
  const comX = sumX / sumW;
  const comY = sumY / sumW;

  let maxDistFromCom = 0.001;
  for (let i = 0; i < masterCount; i++) {
    const d = MASTER_DOTS[i];
    const cx = (d.x + centerOffsetX) * sphereRadius;
    const cy = d.y * sphereRadius;
    const dist = Math.hypot(cx - comX, cy - comY);
    if (dist > maxDistFromCom) maxDistFromCom = dist;
  }

  // 2. Calculate local neighbor spacing for each master dot
  const localSpacings = new Float32Array(masterCount);
  for (let i = 0; i < masterCount; i++) {
    let closest = Infinity;
    for (let j = 0; j < masterCount; j++) {
      if (i === j) continue;
      const dx = (MASTER_DOTS[i].x - MASTER_DOTS[j].x) * sphereRadius;
      const dy = (MASTER_DOTS[i].y - MASTER_DOTS[j].y) * sphereRadius;
      const dist = Math.hypot(dx, dy);
      if (dist < closest) closest = dist;
    }
    localSpacings[i] = closest;
  }

  // Define 4 primary flow bands for SYSTEM state organization
  const bands = [
    { yMin: 0.18, yMax: 0.36, targetY: 0.27 },
    { yMin: -0.09, yMax: 0.09, targetY: 0.0 },
    { yMin: -0.38, yMax: -0.18, targetY: -0.28 },
    { yMin: -0.62, yMax: -0.45, targetY: -0.54 },
  ];

  // 3. Populate the 183 Master Logo Dots (Indices 0 to 182)
  for (let i = 0; i < masterCount; i++) {
    const dot = MASTER_DOTS[i];
    const idx = i * 3;
    const locSp = localSpacings[i];

    // Centered coordinates
    const cx = (dot.x + centerOffsetX) * sphereRadius;
    const cy = dot.y * sphereRadius;
    const cz = (dot.z - 0.5) * sphereRadius * depthScale;

    // Calculate edge factor: 0 for large core dots near COM, 1 for outer/taper dots
    const dist = Math.hypot(cx - comX, cy - comY);
    const distNorm = dist / maxDistFromCom;
    const sizeInv = 1.0 - Math.min(1.0, dot.size);
    const ef = Math.max(0, Math.min(1, distNorm * 0.65 + sizeInv * 0.35));
    edgeFactors[i] = ef;

    // --- State 1: Sphere (Faithful brand mark with authentic shallow Z-depth) ---
    positionsSphere[idx] = cx;
    positionsSphere[idx + 1] = cy;
    positionsSphere[idx + 2] = cz;

    sizesSphere[i] = Math.max(0.08, dot.size);
    alphasSphere[i] = 1.0;

    // --- State 2: Particles (Controlled gentle expansion: core 5–12%, outer 15–25%) ---
    // Preserves right-side concave negative space by redirecting inner-crescent flow along arc
    const dispMag = isMobile ? 0.04 + ef * 0.11 : 0.06 + ef * 0.14;

    let vx = cx - comX;
    let vy = cy - comY;
    const vLen = Math.hypot(vx, vy) || 1;
    vx /= vLen;
    vy /= vLen;

    // Protect right-side negative space from expansion into the void
    if (cx > comX + 0.1) {
      const arcDirY = cy >= comY ? 0.7 : -0.7;
      vx = Math.min(0.04, vx);
      vy = arcDirY;
      const len = Math.hypot(vx, vy) || 1;
      vx /= len;
      vy /= len;
    }

    positionsParticles[idx] = cx + vx * (dispMag * sphereRadius);
    positionsParticles[idx + 1] = cy + vy * (dispMag * sphereRadius);
    positionsParticles[idx + 2] = cz + (dot.z - 0.5) * (dispMag * 0.5 * sphereRadius);

    sizesParticles[i] = sizesSphere[i] * 0.96;
    alphasParticles[i] = 1.0;

    // --- State 3: Connections (Master dots remain stable, subtle 3D depth) ---
    positionsConnections[idx] = cx;
    positionsConnections[idx + 1] = cy;
    positionsConnections[idx + 2] = cz * 1.05;

    // --- State 4: System (Infrastructure transformation: organized flow bands) ---
    let bandIndex = -1;
    for (let b = 0; b < bands.length; b++) {
      if (dot.y >= bands[b].yMin && dot.y <= bands[b].yMax) {
        bandIndex = b;
        break;
      }
    }

    if (bandIndex !== -1) {
      // In organized bands: subtly align dot along the band's flow track by 3–8% of neighbor spacing
      const targetBandY = bands[bandIndex].targetY * sphereRadius;
      const dy = targetBandY - cy;
      const maxAllowed = locSp * 0.07; // 7.0% of local neighbor spacing
      const actualDy = Math.max(-maxAllowed, Math.min(maxAllowed, dy * 0.45));

      positionsSystem[idx] = cx;
      positionsSystem[idx + 1] = cy + actualDy;
      positionsSystem[idx + 2] = cz * 0.7; // Blueprint architectural planar depth
    } else {
      // Outside bands (tapers, outer boundary): dots remain anchored to preserve silhouette
      positionsSystem[idx] = cx;
      positionsSystem[idx + 1] = cy;
      positionsSystem[idx + 2] = cz * 0.7;
    }
  }

  // 4. Populate Secondary Points for PARTICLES State Only (Indices 183 to totalCount - 1)
  // Find master dots with highest edge factors (outer/taper dots that release particles)
  const outerIndices: number[] = [];
  for (let i = 0; i < masterCount; i++) {
    if (edgeFactors[i] > 0.4) {
      outerIndices.push(i);
    }
  }
  outerIndices.sort((a, b) => edgeFactors[b] - edgeFactors[a]);

  for (let s = 0; s < secondaryCount; s++) {
    const parentIdx = outerIndices[s % outerIndices.length];
    const parentDot = MASTER_DOTS[parentIdx];
    const sIdx = masterCount + s;
    const idx = sIdx * 3;
    const pIdx = parentIdx * 3;

    // In SPHERE, CONNECTIONS, SYSTEM: coincident with parent dot, invisible
    positionsSphere[idx] = positionsSphere[pIdx];
    positionsSphere[idx + 1] = positionsSphere[pIdx + 1];
    positionsSphere[idx + 2] = positionsSphere[pIdx + 2];

    positionsConnections[idx] = positionsConnections[pIdx];
    positionsConnections[idx + 1] = positionsConnections[pIdx + 1];
    positionsConnections[idx + 2] = positionsConnections[pIdx + 2];

    positionsSystem[idx] = positionsSystem[pIdx];
    positionsSystem[idx + 1] = positionsSystem[pIdx + 1];
    positionsSystem[idx + 2] = positionsSystem[pIdx + 2];

    sizesSphere[sIdx] = 0.0;
    alphasSphere[sIdx] = 0.0;
    edgeFactors[sIdx] = 1.0;

    // In PARTICLES: secondary points drift gently outward beyond parent (18–24% expansion)
    const sDispMag = isMobile
      ? 0.14 + (s % 5) * 0.012
      : 0.19 + (s % 5) * 0.014;

    const pcx = positionsSphere[pIdx];
    const pcy = positionsSphere[pIdx + 1];
    const pcz = positionsSphere[pIdx + 2];

    let svx = pcx - comX;
    let svy = pcy - comY;
    const svLen = Math.hypot(svx, svy) || 1;
    svx /= svLen;
    svy /= svLen;

    if (pcx > comX + 0.1) {
      const arcDirY = pcy >= comY ? 0.7 : -0.7;
      svx = Math.min(0.03, svx);
      svy = arcDirY;
      const len = Math.hypot(svx, svy) || 1;
      svx /= len;
      svy /= len;
    }

    positionsParticles[idx] = pcx + svx * (sDispMag * sphereRadius);
    positionsParticles[idx + 1] = pcy + svy * (sDispMag * sphereRadius);
    positionsParticles[idx + 2] = pcz + (parentDot.z - 0.5) * (sDispMag * 0.6 * sphereRadius);

    sizesParticles[sIdx] = Math.max(0.04, parentDot.size * 0.35);
    alphasParticles[sIdx] = 0.40; // Soft supporting opacity
  }

  // 5. Generate Intelligent Local Neighborhood Graph (CONNECTIONS state)
  // Target: Desktop (120), Tablet (85), Mobile (55)
  const targetConnCount = isMobile ? 55 : isTablet ? 85 : 120;
  const allConnCandidates: {
    i: number;
    j: number;
    dist: number;
    score: number;
    midY: number;
  }[] = [];

  for (let i = 0; i < masterCount; i++) {
    const a = MASTER_DOTS[i];
    const ax = (a.x + centerOffsetX) * sphereRadius;
    const ay = a.y * sphereRadius;
    const az = (a.z - 0.5) * sphereRadius * depthScale;

    for (let j = i + 1; j < masterCount; j++) {
      const b = MASTER_DOTS[j];
      const bx = (b.x + centerOffsetX) * sphereRadius;
      const by = b.y * sphereRadius;
      const bz = (b.z - 0.5) * sphereRadius * depthScale;

      const dx = bx - ax;
      const dy = by - ay;
      const dz = bz - az;
      const dist = Math.hypot(dx, dy, dz);

      // Local neighborhood distance constraint
      if (dist >= 0.075 && dist <= 0.22) {
        const isRow = Math.abs(dy) < 0.06;
        const angle = Math.atan2(Math.abs(dy), Math.abs(dx));
        const isLattice =
          Math.abs(angle - Math.PI / 3) < 0.25 ||
          Math.abs(angle - Math.PI / 6) < 0.25;

        let score = dist;
        if (isRow) score *= 0.75;
        else if (isLattice) score *= 0.85;
        else score *= 1.25;

        allConnCandidates.push({ i, j, dist, score, midY: (ay + by) / 2 });
      }
    }
  }

  allConnCandidates.sort((c1, c2) => c1.score - c2.score);

  const connLineCoords: number[] = [];
  const connLineDelays: number[] = [];
  const connDegree = new Array(masterCount).fill(0);
  let connCount = 0;

  for (const c of allConnCandidates) {
    if (connCount >= targetConnCount) break;
    if (connDegree[c.i] < 3 && connDegree[c.j] < 3) {
      const aIdx = c.i * 3;
      const bIdx = c.j * 3;

      connLineCoords.push(
        positionsConnections[aIdx],
        positionsConnections[aIdx + 1],
        positionsConnections[aIdx + 2],
        positionsConnections[bIdx],
        positionsConnections[bIdx + 1],
        positionsConnections[bIdx + 2]
      );

      // Assign staged delay based on spatial position / group (5 groups: 0 to 4)
      // Group 0: Core / belly (|midY| < 0.25) -> delay 0.0
      // Group 1: Upper-mid (midY in [0.25, 0.7]) -> delay 0.22
      // Group 2: Lower-mid (midY in [-0.7, -0.25]) -> delay 0.44
      // Group 3: Outer perimeter -> delay 0.66
      // Group 4: Tapers / tips (|midY| > 0.7) -> delay 0.88
      let delay = 0.0;
      if (Math.abs(c.midY) > 0.7 * sphereRadius) {
        delay = 0.88;
      } else if (edgeFactors[c.i] > 0.5 || edgeFactors[c.j] > 0.5) {
        delay = 0.66;
      } else if (c.midY < -0.25 * sphereRadius) {
        delay = 0.44;
      } else if (c.midY > 0.25 * sphereRadius) {
        delay = 0.22;
      } else {
        delay = 0.0;
      }

      // Both vertices of the line segment receive the delay
      connLineDelays.push(delay, delay);

      connDegree[c.i]++;
      connDegree[c.j]++;
      connCount++;
    }
  }

  const connectionLinePositions = new Float32Array(connLineCoords);
  const connectionLineDelaysArray = new Float32Array(connLineDelays);

  // 6. Generate Structural Alignment Accents along Flow Bands (SYSTEM state)
  // Target: Desktop (28), Tablet (24), Mobile (20)
  const targetSysCount = isMobile ? 20 : isTablet ? 24 : 28;
  const dotBands = new Array(masterCount).fill(-1);
  for (let i = 0; i < masterCount; i++) {
    for (let b = 0; b < bands.length; b++) {
      if (MASTER_DOTS[i].y >= bands[b].yMin && MASTER_DOTS[i].y <= bands[b].yMax) {
        dotBands[i] = b;
        break;
      }
    }
  }

  const sysCandidates: { i: number; j: number; dist: number }[] = [];
  for (let b = 0; b < bands.length; b++) {
    const bandDots = MASTER_DOTS.map((d, idx) => ({ idx, ...d }))
      .filter((d) => dotBands[d.idx] === b)
      .sort((a, b) => a.x - b.x);

    for (let k = 0; k < bandDots.length - 1; k++) {
      const p1 = bandDots[k];
      const p2 = bandDots[k + 1];
      const dist = Math.hypot(
        (p1.x - p2.x) * sphereRadius,
        (p1.y - p2.y) * sphereRadius
      );
      if (dist < 0.26) {
        sysCandidates.push({ i: p1.idx, j: p2.idx, dist });
      }
    }
  }

  sysCandidates.sort((a, b) => a.dist - b.dist);
  const selectedSysPairs = sysCandidates.slice(0, targetSysCount);

  const sysLineCoords: number[] = [];
  for (const pair of selectedSysPairs) {
    const aIdx = pair.i * 3;
    const bIdx = pair.j * 3;
    sysLineCoords.push(
      positionsSystem[aIdx],
      positionsSystem[aIdx + 1],
      positionsSystem[aIdx + 2],
      positionsSystem[bIdx],
      positionsSystem[bIdx + 1],
      positionsSystem[bIdx + 2]
    );
  }

  const systemLinePositions = new Float32Array(sysLineCoords);
  const systemLineCount = sysLineCoords.length / 6;

  return {
    positionsSphere,
    positionsParticles,
    positionsConnections,
    positionsSystem,
    sizesSphere,
    sizesParticles,
    alphasSphere,
    alphasParticles,
    edgeFactors,
    connectionLinePositions,
    connectionLineDelays: connectionLineDelaysArray,
    systemLinePositions,
    count: totalCount,
    masterCount,
    secondaryCount,
    connectionCount: connCount,
    systemLineCount,
  };
}
