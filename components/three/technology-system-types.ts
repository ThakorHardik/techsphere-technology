import * as THREE from "three";

export type TechnologySystemTheme = "light" | "dark";

export interface TechnologySystemNodeData {
  readonly id: string; // "01", "02", ... "08"
  readonly index: number; // 0 to 7
  readonly position: [number, number, number];
  readonly u: number; // Normalized parameter [0, 1] along curve
}

export interface TechnologySystemProps {
  readonly theme?: TechnologySystemTheme;
  readonly activeNode?: number | null;
  readonly progress?: number;
  readonly progressRef?: React.RefObject<number>;
  readonly interactive?: boolean;
  readonly autoRotate?: boolean;
}

export interface TechnologySystemSceneProps extends TechnologySystemProps {
  readonly className?: string;
  readonly triggerId?: string;
  readonly isStoryMode?: boolean;
  readonly onProgressUpdate?: (progress: number) => void;
}

/**
 * Locked Brand Color Palette for Technology System
 */
export const TECH_SYSTEM_PALETTE = {
  techBrown: "#4A3725",
  deepBrown: "#35261A",
  warmCream: "#FFF6ED",
  softCream: "#F6EDE3",
  white: "#FFFFFF",
  charcoal: "#231812",
  accentWarm: "#B88E68",
  pathArchitectural: "#5A4533",
  pathMutedLight: "#7A624E",
  pathMutedDark: "#E3D2C0",
} as const;

/**
 * Deterministic 3D Coordinates for the 8 Technology Capability Nodes.
 * Configured as an open 3D Technology Corridor:
 * - One continuous forward spatial trajectory (01 -> 08)
 * - Strict monotonic Z-depth progression: Node 01 (+1.30) to Node 08 (-1.70)
 * - Strict monotonic Y-elevation: Node 01 (-0.30) to Node 08 (+0.90)
 * - Open upper reach (05 -> 06 -> 07 -> 08) free of tight folds, hooks, or doubling back
 * - Clear 2D separation with Node 01 protected above bottom controls and Node 08 protected below top edge
 */
export const SYSTEM_NODE_COORDINATES: readonly [number, number, number][] = [
  [-0.30, -0.30,  1.30], // Node 01: Foreground entry landmark (z=+1.30, protected bottom margin)
  [-0.72, -0.18,  0.88], // Node 02: Near-foreground lower-left sweep (z=+0.88)
  [-0.60, -0.04,  0.46], // Node 03: Ascending mid-left (z=+0.46)
  [-0.18,  0.10,  0.04], // Node 04: Central mid-crossing (z=+0.04)
  [ 0.28,  0.26, -0.38], // Node 05: Mid-depth rightward ascension (z=-0.38)
  [ 0.68,  0.44, -0.80], // Node 06: Upper-right open reach (z=-0.80)
  [ 0.42,  0.66, -1.25], // Node 07: High, sweeping open (z=-1.25, zero fold, open turn)
  [ 0.08,  0.90, -1.70], // Node 08: Distant horizon beacon (z=-1.70, protected top margin)
] as const;

/**
 * Factory to construct the continuous open 3D Catmull-Rom spline curve.
 * Parameter closed is FALSE — strictly an open path with Start (01) and End (08).
 */
export function createSystemPathCurve(): THREE.CatmullRomCurve3 {
  const points = SYSTEM_NODE_COORDINATES.map(
    (coord) => new THREE.Vector3(coord[0], coord[1], coord[2])
  );
  // Centripetal parameterization prevents cusps; closed = false guarantees an open spline
  return new THREE.CatmullRomCurve3(points, false, "centripetal");
}


