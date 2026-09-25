/**
 * TechSphere Technology — 3D System Types
 * 
 * Defines state models, theme modes, and component contracts for the
 * TechSphere Dotted Sphere 3D system.
 */

export type TechSphereState = "sphere" | "particles" | "connections" | "system";

export type TechSphereTheme = "light" | "dark";

export interface TechSphereSceneProps {
  /**
   * Current transformation state of the 3D sphere.
   * Default: "sphere"
   */
  state?: TechSphereState;

  /**
   * Future scroll storytelling contract:
   * Target transformation state to interpolate towards as scroll progress advances.
   */
  targetState?: TechSphereState;

  /**
   * Normalized scroll progress within the controlling scene [0.0, 1.0].
   * Used for future scroll-driven sphere morphing and narrative pacing.
   */
  scrollProgress?: number;

  /**
   * Optional DOM ID or selector of the section driving scroll progress via GSAP ScrollTrigger.
   * Enables zero-render-thrashing direct progress telemetry.
   */
  triggerId?: string;

  /**
   * Whether mouse/pointer parallax and subtle deflection are active.
   * Default: true
   */
  interactive?: boolean;

  /**
   * Visual theme:
   * - "light": Warm Cream (#FFF6ED) canvas with TechSphere Brown (#4A3725) points
   * - "dark": Deep Brown (#35261A) canvas with Soft Cream (#F6EDE3) points
   * Default: "light"
   */
  theme?: TechSphereTheme;

  /**
   * Target point count (scaled down on mobile/tablet).
   * Desktop: ~5,000 | Tablet: ~2,500
   */
  pointCount?: number;

  /**
   * Whether slow ambient rotation is enabled when idle.
   * Default: true
   */
  autoRotate?: boolean;

  /**
   * Additional container CSS class names.
   */
  className?: string;

  /**
   * Optional authoritative scroll progress ref for zero-render-thrashing updates.
   * When provided, duplicate ScrollTriggers are bypassed.
   */
  progressRef?: React.RefObject<number>;

  /**
   * Optional callback when state transition completes.
   */
  onStateChange?: (state: TechSphereState) => void;
}

export interface TechSpherePointsProps {
  state: TechSphereState;
  targetState?: TechSphereState;
  scrollProgress?: number;
  progressRef?: React.RefObject<number>;
  triggerId?: string;
  targetDotIndex?: number;
  color: string;
  interactive: boolean;
  reducedMotion: boolean;
  pointCount: number;
  isMobile?: boolean;
  isTablet?: boolean;
  theme?: TechSphereTheme;
}

export interface TechSphereCameraProps {
  scrollProgress?: number;
  progressRef?: React.RefObject<number>;
  triggerId?: string;
  targetDotPos?: [number, number, number];
  interactive?: boolean;
  reducedMotion?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

/**
 * Deterministically selected master dot for the Hero scroll transition:
 * Index 80 in /lib/three/logo-dots-data.json
 * Source coordinates: x: -0.3899, y: -0.0159, z: 0.9207, size: 0.9212
 * 3D coordinates: cx: -0.0068, cy: -0.0270, cz: 1.5652
 */
export const TRANSITION_TARGET_DOT_INDEX = 80;
export const TRANSITION_TARGET_DOT_POS: [number, number, number] = [-0.0068, -0.0270, 1.5652];

export interface TechSphereFallbackProps {
  theme?: TechSphereTheme;
  className?: string;
  alt?: string;
}

export interface DotPointData {
  x: number;
  y: number;
  z: number;
  size: number;
  raw_r?: number;
}

declare global {
  interface Window {
    __techSphereDot80Screen?: { pxX: number; pxY: number };
  }
}

