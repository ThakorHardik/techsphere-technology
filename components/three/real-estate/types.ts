/**
 * Real Estate v3 — Curated Architectural Material Palette & Types
 * Governed by the core principle: MASS + VOID + LIGHT + SHADOW
 * Grounded in TechSphere's architectural warm cream, bronze, and teak design system.
 */

export const REAL_ESTATE_PALETTE = {
  // 1. Tactile Fine-Grained Limestone / Architectural Precast (Monolith & Slabs)
  limestoneLight: "#EAE4DC",     // Sunlit warm honed limestone precast surface
  limestoneFlank: "#D5CCC0",     // Subtly differentiated side flank tone for 3/4 depth
  limestoneMedium: "#D8D1C5",    // Secondary facade planes & window jambs
  limestoneSoffit: "#9B8F80",    // Slab undersides, recessed cavity walls (warm medium architectural stone, NOT black)
  limestoneJoint: "#ABA192",     // Subtle 14mm expansion joint reveals (soft stone shadow)
  limestoneArris: "#F2ECE3",     // Soft limestone arris / corner highlight
  limestoneParapet: "#DFD8CE",   // Roof coping and crisp parapet profile

  // 2. Architectural Bronze Metalwork (Structural Pilotis, Encasements & Reveal Trims)
  bronzeDark: "#302720",         // Slender structural pilotis, perimeter window frames (deep architectural bronze, NOT pure black)
  bronzeSatin: "#40352B",        // Slim mullions, sill drip edge profile
  bronzeHighlight: "#554739",    // Subtle rim specular highlight

  // 3. Selective Natural Architectural Timber (Substantial solar-shading louvers)
  timberTeak: "#4A2B15",         // Rich, dark, warm natural roasted walnut/teak
  timberTeakDark: "#321D0E",     // Shadowed teak recesses
  timberTrack: "#282019",        // Louver guide channels (architectural bronze)

  // 4. Architectural Solar Glazing (Translucent, Reflective Daylight Glass)
  glassDaylight: "#2E4252",      // Low-iron solar control glass with subtle specular sheen & sky reflection
  glassShadow: "#233340",        // Inset shaded window plane

  // 5. Interior Luminous Volume (2800K Warm Ambient Occupancy)
  interiorAmber: "#FFCA88",      // Warm interior ambient wash (2800K occupancy)
  interiorAmberCore: "#FFAF55",  // Deeper internal core illumination
  interiorPartition: "#CBC1B2",  // Internal depth structural core wall

  // 6. Ground & Alignment Datum
  groundShadow: "#100D0A",       // Rich, feathered ambient contact shadow on floor datum
  datumLine: "#C29B72",          // Restrained warm-bronze alignment datum from Node 08
  datumCore: "#DFC19C",          // Luminous datum anchor point
} as const;

/**
 * Architectural Dimensions & World Space Anchor (Three.js units)
 * Calibrated specifically for the right side of the desktop editorial layout (X: 45%–92%, Y: 25%–80%)
 */
export const ARCHITECTURAL_SCALE = {
  // Architectural origin in Three.js world space
  buildingPos: [1.06, -0.62, -2.85] as const,
  buildingRotationY: 0.10, // ~+5.7 deg: restrained architectural 3/4 view revealing left monolith flank, front facade & void depth

  // Monolithic Shear Mass (Left Anchor - reduced dominance by ~10% to frame the architecture)
  monolithWidth: 0.86,
  monolithHeight: 2.48,
  monolithDepth: 2.05,
  monolithX: -0.43,

  // Deep Two-Story Architectural Void
  voidWidth: 2.15,
  voidHeight: 1.20,
  voidDepth: 1.85,
  voidX: 0.88,

  // Cantilevered Horizontal Terraces (Slightly reduced visual length for structural believability)
  podiumSlabWidth: 2.50,
  podiumSlabThickness: 0.16,
  podiumSlabDepth: 2.05,
  podiumSlabX: 0.88,
  podiumSlabY: 0.75,

  roofSlabWidth: 2.58,
  roofSlabThickness: 0.17,
  roofSlabDepth: 2.25,
  roofSlabX: 0.90,
  roofSlabY: 1.95,

  // Structural Bronze Pilotis Column
  pilotisRadius: 0.050,
  pilotisHeight: 0.75,
  pilotisX: 1.62,
  pilotisZ: 0.65,

  // Node 08 Reference Anchor (Locked Invariant from technology-system-types.ts)
  node08Coordinate: [-0.04, 0.90, -1.70] as const,
  // Building Ground Alignment Datum Anchor (World Space)
  datumAnchorPoint: [0.70, -0.62, -2.85] as const,
};

/**
 * Poetic Architectural Reveal Sequence
 * Paced smoothly across scroll progress p in [8.20, 10.00].
 */
export interface ArchitecturalRevealPhases {
  readonly datum: number;             // Phase 1 (8.20–8.70): Node 08 datum trajectory leads toward site
  readonly ground: number;            // Phase 2 (8.45–8.85): Ground presence & soft contact shadow
  readonly monolith: number;          // Phase 2 (8.55–9.10): Monolith anchor appears in distance, rising
  readonly void: number;              // Phase 3A (8.75–9.30): Two-story recessed architectural void opens
  readonly cantilever: number;        // Phase 3B (8.90–9.45): Cantilevered solid stone slabs project
  readonly glazing: number;           // Phase 4A (9.10–9.60): Recessed solar glazing & interior depth emerge
  readonly screen: number;            // Phase 4B (9.35–9.70): Integrated timber fins & bronze details resolve
  readonly finalIntegration: number;  // Phase 5 (9.70–10.00): Daylight sweep, warm 2800K glow, rock-solid rest
}

/**
 * Pure deterministic helper computing the 8 architectural reveal phases from progress p
 * At p >= 9.70, all phases are strictly resolved into the finished client-ready frame.
 */
export function computeArchitecturalPhases(p: number): ArchitecturalRevealPhases {
  const smooth = (pVal: number, s: number, e: number) => {
    if (pVal <= s) return 0;
    if (pVal >= e) return 1;
    const t = (pVal - s) / (e - s);
    return t * t * (3 - 2 * t);
  };

  return {
    datum: smooth(p, 8.20, 8.75),
    ground: smooth(p, 8.35, 8.85),
    monolith: smooth(p, 8.40, 9.05),
    void: smooth(p, 8.70, 9.30),
    cantilever: smooth(p, 8.85, 9.45),
    glazing: smooth(p, 9.10, 9.65),
    screen: smooth(p, 9.35, 9.80),
    finalIntegration: smooth(p, 9.70, 10.00),
  };
}

export interface RealEstateEnvironmentProps {
  readonly progressRef?: React.RefObject<number>;
  readonly progress?: number;
  readonly isDark?: boolean;
  readonly isMobile?: boolean;
}
