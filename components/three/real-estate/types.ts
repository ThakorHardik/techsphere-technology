/**
 * Curated Material Palette for 3D Real Estate Architectural Environment
 * Grounded in TechSphere's architectural warm cream, bronze, and teak design system.
 * Faithfully matches the contemporary mixed-use architecture in public/industries/real-estate.jpg.
 */
export const REAL_ESTATE_PALETTE = {
  // Architectural Concrete (Warm board-formed / smooth limestone-cast tone)
  concreteLight: "#C6C0B5",      // Sunlit exposed concrete facade & slabs
  concreteMedium: "#ACA69B",     // Mid-tone structural concrete facade
  concreteDark: "#868075",       // Deep structural concrete, slab soffits & recesses
  concretePanelJoint: "#6A645C", // Tie-rod panel reveal joint lines
  concreteColumn: "#BDB7AC",     // Ground-floor circular pilotis columns

  // Warm Timber Louver Screens (TechSphere Signature Architectural Teak)
  timberLouver: "#B67A42",       // Warm golden-brown teak slats
  timberLouverDark: "#8F5B2C",   // Shadowed teak slats
  timberAccent: "#C88A4E",       // Sun-grazed teak edge accent
  timberFrame: "#654120",        // Louver panel perimeter metal track

  // Glazing & Metalwork
  glassSky: "#CDE0EA",           // Daylight window glass with subtle sky reflection
  glassBalustrade: "#C8D9E6",    // Laminated clear balcony safety glass
  steelDark: "#221E1B",          // Architectural dark bronze / charcoal mullions
  steelCanopy: "#181513",        // Ground-floor storefront continuous canopy fascia beam
  steelHardware: "#3A332D",      // Balcony top rail & stanchion fixings

  // Streetscape & Ground (Confined pedestrian realm)
  sidewalkPaver: "#D5CFBE",      // Light granite pedestrian plaza pavers
  curbStone: "#A8A095",          // Chiseled granite street curb
  boundaryDatum: "#9C9286",      // Site boundary datum line
  contactShadow: "#231F1C",      // Ambient occlusion contact shadow plane

  // Vegetation (Refined architectural foliage)
  foliageOlive: "#586838",       // Deep natural olive green
  foliageSage: "#6E7C4A",        // Mid natural sage green
  foliageGolden: "#7E8A4C",      // Muted warm golden-olive highlight
  foliageDark: "#445028",        // Deep shadow canopy
  treeBark: "#332B24",           // Slender dark bronze bark
  treeGrate: "#221D19",          // Cast-iron sidewalk tree grate
  planterSoil: "#2C241E",        // Moist planter soil

  // Interior Life & Lighting
  interiorWall: "#EBE3D7",       // Warm off-white interior partitions
  interiorPartition: "#E5DDD2",  // Secondary interior depth plane
  interiorWarmGlow: "#FFE2B3",   // Café & lobby warm ambient pendant lighting
  interiorCeiling: "#DAD2C5",    // Recessed ceiling plane
  nodeBeaconAccent: "#B88E68",   // Node 08 telemetry bridge & docked interface
} as const;

/**
 * Architectural Dimensions (Three.js units, calibrated to scene scale)
 */
export const ARCHITECTURAL_SCALE = {
  // Building origin in Three.js world space — calibrated so left edge starts at screen X >= 46%
  buildingPos: [1.55, -0.55, -2.85] as const,
  buildingRotationY: -0.42, // ~-24 deg architectural perspective angle

  // Building Volumes (Proportions matching reference photo)
  totalWidth: 3.10,
  totalDepth: 2.10,
  coreWidth: 0.85,
  facadeWidth: 2.25,
  groundHeight: 0.58,
  upperFloorHeight: 0.38,
  numUpperFloors: 3,         // Levels 2, 3, 4 (residential/office)
  penthouseHeight: 0.32,     // Level 5 (penthouse + flat roof slab)
  slabThickness: 0.024,      // Slender realistic architectural slab
  slabOverhang: 0.14,        // Cantilever projection beyond glass line
  columnRadius: 0.040,       // Exposed ground pilotis columns

  // Streetscape (Sized tightly to frame the building without sprawling into left typography)
  plazaWidth: 2.70,
  plazaDepth: 2.00,
  plazaCenterX: 0.85,
  plazaCenterZ: 1.40,
  sidewalkHeight: 0.035,

  // Node 08 Anchor Coordinate (Locked Invariant from technology-system-types.ts)
  node08Coordinate: [-0.04, 0.90, -1.70] as const,
  // Building Entrance Interface Anchor Coordinate (World Space)
  buildingInterfacePoint: [0.85, -0.22, -2.15] as const,
  // Next Industry Technology Handoff Dot (World Space)
  handoffDotCoordinate: [2.10, -0.30, -1.80] as const,
};

/**
 * Progressive Construction Phases (0.00 to 1.00 for each layer)
 * Modeled after real architectural build sequences:
 * Ground/Plinth -> Core -> Columns -> Slabs -> Balconies -> Glazing -> Screens -> Storefront -> Entrance -> Streetscape
 */
export interface ConstructionPhases {
  node08Handoff: number;     // Phase 1: Node 08 transforms into architectural marker
  propertyEntry: number;     // Phase 2: Ground boundary datum & site reveals
  ground: number;            // Step 1: Foundation plinth, footing & contact shadow
  core: number;              // Step 2: Structural concrete circulation core rising
  columns: number;           // Step 3: Vertical pilotis columns on ground floor
  floorL2: number;           // Step 4a: Level 2 slab
  floorL3: number;           // Step 4b: Level 3 slab
  floorL4: number;           // Step 4c: Level 4 slab
  floorL5: number;           // Step 4d: Level 5 slab & penthouse roof
  balconies: number;         // Step 5: Cantilevered corner balconies, balustrades & planters
  glazing: number;           // Step 6: Window curtain walls & interior depth
  timberScreens: number;     // Step 7: Vertical teak timber louver screens
  storefront: number;        // Step 8: Commercial storefront café, canopy & lighting
  entrance: number;          // Step 9: Residential entry portal, canopy hood & wall sconce
  streetscape: number;       // Step 10: Sidewalk plaza pavers, curb, street trees
  dockingNode: number;       // Node 08 docked into smart interface
  handoffDot: number;        // Next industry handoff dot
}

/**
 * Pure deterministic helper computing all construction phases from progress p
 */
export function computeConstructionPhases(p: number): ConstructionPhases {
  const smooth = (pVal: number, s: number, e: number) => {
    if (pVal <= s) return 0;
    if (pVal >= e) return 1;
    const t = (pVal - s) / (e - s);
    return t * t * (3 - 2 * t);
  };

  return {
    node08Handoff: smooth(p, 9.00, 9.14),
    propertyEntry: smooth(p, 9.12, 9.26),
    ground: smooth(p, 9.24, 9.34),
    core: smooth(p, 9.32, 9.42),
    columns: smooth(p, 9.38, 9.46),
    floorL2: smooth(p, 9.42, 9.49),
    floorL3: smooth(p, 9.47, 9.53),
    floorL4: smooth(p, 9.51, 9.57),
    floorL5: smooth(p, 9.55, 9.61),
    balconies: smooth(p, 9.58, 9.66),
    glazing: smooth(p, 9.64, 9.71),
    timberScreens: smooth(p, 9.69, 9.76),
    storefront: smooth(p, 9.74, 9.80),
    entrance: smooth(p, 9.78, 9.83),
    streetscape: smooth(p, 9.81, 9.87),
    dockingNode: smooth(p, 9.78, 9.85),
    handoffDot: smooth(p, 9.96, 10.00),
  };
}

export interface RealEstateEnvironmentProps {
  readonly progressRef?: React.RefObject<number>;
  readonly progress?: number;
  readonly isDark?: boolean;
}
