# Implementation Plan: Section 03 — Real Estate & Property Tech (Bespoke Architectural Scene)

> **Branch:** `redesign/real-estate-v2`  
> **Status:** Planning Only — No implementation files modified.

---

## 1. Current Section 03 Diagnosis

The existing Section 03 implementation on this clean baseline (`redesign/real-estate-v2`) contains 10 component files in `components/three/real-estate/`:
- `types.ts`: Defines `REAL_ESTATE_PALETTE`, `ARCHITECTURAL_SCALE`, and a 10-step `computeConstructionPhases` mapping across progress $p \in [9.00, 10.00]$.
- `RealEstateBuilding.tsx`: Structural concrete core, ground pilotis columns, rear wall, and 5 sequential floor slabs.
- `RealEstateFacade.tsx`: Glass curtain walls, mullions, and interior partition depth.
- `RealEstateBalconies.tsx`: Cantilevered glass balustrades and trough planters.
- `RealEstateScreens.tsx`: Instanced vertical teak timber louver screens.
- `RealEstateStorefront.tsx`: Ground-floor commercial frontage, steel canopy, café counter, bistro tables, and entrance doors.
- `RealEstateStreetscape.tsx`: Raised pedestrian sidewalk slab, chiseled curb stones, and granite plinth border.
- `RealEstateVegetation.tsx`: Two street trees with stacked spherical foliage clouds and tree grates.
- `RealEstateBridge.tsx`: Boundary datum tube, conduit tube, entrance totem box, and pulsating handoff dot.
- `RealEstateEnvironment.tsx`: Master group mounting and visibility gating ($p < 8.25$ invisible).

### Key Architectural & Visual Flaws in Baseline:
1. **Procedural CAD Appearance:** The building looks like an assembly of raw geometric boxes rather than an intentional architectural design.
2. **Elevated "3D Stage" Platform:** The streetscape is a thick floating rectangular slab (`plazaWidth: 2.70, plazaDepth: 2.00, sidewalkHeight: 0.035`) with heavy curb borders, reading as a detached diorama or toy base instead of blending into the warm cream background.
3. **Cartoon-like Vegetation:** The street trees use squished spheres stacked on top of cylinders (`sphereGeometry` scaled horizontally), creating a mushroom/game-disc aesthetic.
4. **Intermediate Disconnected Assembly:** Slabs and columns scale and appear independently with gaps during scroll, producing isolated sticks and floating fragments.
5. **Leftover Helper Artifacts:** The entrance totem box, conduit tube, and pulsating handoff dot linger in the scene, cluttering the final frame.

---

## 2. Why the Previous Visual Approach Failed

1. **Literal Reproduction Fallacy:** The team attempted to convert a high-resolution architectural photograph (`public/industries/real-estate.jpg`) into a literal 1:1 procedural 3D model. In real-time WebGL, attempting to proceduralize every mullion bar, bistro stool, and tie-rod hole creates the "uncanny valley" of architecture: it looks like a CAD wireframe or construction simulation rather than a finished building.
2. **Loss of Photographic Atmospheric Quality:** A photograph has atmospheric haze, ambient occlusion, complex daylight falloff, and subtle micro-imperfections. Translating that literally into Three.js primitives without bespoke art-direction resulted in harsh, flat, toy-like geometric blocks.
3. **Disjointed Object Spawning:** Breaking the building into 10 separate sub-objects with independent scale and positional animations caused intermediate states (around $p \approx 8.4 - 9.2$) to expose floating sticks, detached slabs, and disjointed fragments.
4. **Diorama "Stage" Isolation:** Placing the building on an elevated rectangular box severed it from the website's layout, making it feel like an embedded 3D widget rather than an integrated editorial photograph.

---

## 3. New Architectural Concept: "The Monolith & The Terraces"

Rather than a literal procedural replica, we design a **bespoke contemporary architectural hero scene** created specifically for TechSphere's editorial layout.

### Architectural Narrative:
- **The Core Monolith (Left Anchor):** A monolithic precast limestone/board-formed concrete volume anchoring the building's left flank. It features clean vertical massing, deep shadow reveals, an architectural parapet crown, and an integrated full-height vertical glass ribbon with interior landings.
- **The Stepped Terraces (Right Dynamic Wing):** Slender, crisp cantilevered precast floor slabs wrapping around the street corner. Each level features floor-to-ceiling high-clarity daylight glazing recessed deeply beneath the slab overhangs.
- **Selective Teak Louver Screens:** Warm golden-brown vertical teak battens arranged in sliding rectangular screens between slabs, providing tactile warmth, human scale, and an organic balance to the concrete and glass.
- **Prestige Technology Entrance:** An architectural entry portal recessed into the base of the concrete tower with a dark bronze surround, double-height glass doors, slim bronze pull handles, a sleek cantilevered canopy with an integrated downward light wash, and a warm backlit lobby interior.

---

## 4. Building Composition & Proportions

| Architectural Element | Dimension / Specification | Rationale & Proportion |
| :--- | :--- | :--- |
| **Total Footprint** | Width: 3.10, Depth: 2.10 | Calibrated to occupy ~54% of viewport width on desktop |
| **Levels Hierarchy** | 5 total levels: Ground (0.58) + 3 Upper (0.38 ea) + Penthouse (0.32) | Total height ~2.04 units; comfortably fits with 25% sky headroom |
| **Left Core Monolith** | Width: 0.85, Depth: 1.95, Full Height | Anchors composition; creates a solid architectural backbone |
| **Cantilever Slabs** | Thickness: 0.018 (ultra-thin visible profile), Overhang: 0.14 | Slender contemporary profile with 0.008 recessed underside shadow reveal |
| **Ground Pilotis** | Radius: 0.038, Height: 0.58 | Structural concrete pilotis set back 0.12 behind facade glass |
| **Penthouse Setback** | Width: 2.20, Depth: 1.65, Setback: 0.20 | Recessed rooftop terrace creating an elegant stepped silhouette |
| **Roof Parapet** | Height: 0.024 upstand with thin coping cap | Crowns the building cleanly, preventing flat unfinished geometry |

---

## 5. Materials Language & Palette

The palette is strictly architectural, natural, and restrained — harmonizing seamlessly with TechSphere's warm cream design system (`#FBF8F3` / `#F8F4EE`):

```typescript
export const REAL_ESTATE_PALETTE = {
  // Concrete & Stone (Limestone & Board-formed finish)
  concreteLight: "#D2CCC2",      // Sunlit exposed limestone facade & slabs
  concreteMedium: "#AEA69B",     // Structural shear walls and side elevations
  concreteDark: "#685F54",       // Recessed slab soffits, reveals, and deep shadows
  concreteParapet: "#BCB5AA",    // Crisp roof coping and parapet cap
  concreteColumn: "#C8C2B7",     // Ground pilotis circular columns

  // Signature Architectural Teak (Warm natural timber)
  timberLouver: "#BA7B3E",       // Warm golden-brown teak slats
  timberLouverDark: "#8C5726",   // Shadowed teak slats
  timberAccent: "#D38F4E",       // Sunlit edge highlights
  timberFrame: "#362B22",        // Louver perimeter runner tracks

  // Glazing & Metalwork
  glassSky: "#6A8696",           // Low-iron daylight glass with sky reflectivity (translucent, NOT opaque)
  glassBalustrade: "#A8C0CE",    // Laminated clear balcony safety glass
  steelDark: "#1F1B18",          // Charcoal architectural bronze mullions and portal trim
  steelCanopy: "#181412",        // Continuous horizontal canopy fascia beam
  steelHardware: "#2C2621",      // Balustrade rails and door handles

  // Ground & Pedestrian Realm
  sidewalkPaver: "#DDD7CC",      // Light limestone pedestrian pavers
  curbStone: "#BBB4A8",          // Chiseled granite curb edge step
  boundaryDatum: "#A69C90",      // Transient site alignment line
  contactShadow: "#14100D",      // Multi-layered feathered ambient contact shadow

  // Organic Botanical Foliage
  foliageOlive: "#505E36",       // Deep natural olive green
  foliageSage: "#657344",        // Mid natural sage green
  foliageGolden: "#748248",      // Muted warm golden-olive highlight
  treeBark: "#2A221C",           // Slender dark bronze trunk
  treeGrate: "#221C18",          // Flush cast-iron tree grate

  // Interior Atmosphere
  interiorWall: "#ECE5DA",       // Warm off-white interior partitions
  interiorWarmGlow: "#FFE8C4",   // Warm pendant & lobby ambient illumination
};
```

---

## 6. Ground Treatment & Streetscape

### Eliminating the "3D Stage":
- **No Floating Box:** Replace the heavy 35mm platform and thick curb borders with an ultra-thin 12mm sidewalk paver slab (`#DDD7CC`).
- **Low-Profile Curb:** A subtle 8mm chiseled curb step (`#BBB4A8`) framing the corner sidewalk without forming a giant perimeter block.
- **Feathered Contact Shadow:** A multi-layered ground shadow plane:
  - *Core Shadow:* Crisp, restrained contact shadow directly beneath the building footprint (`opacity: 0.16`).
  - *Ambient Halo:* Soft, wide feathered shadow (`opacity: 0.08`) that smoothly dissolves into the warm cream page background (`#FBF8F3`).
- **No Road Clutter:** Eliminate asphalt roadway blocks, cobblestone gutters, white dashed road lines, and stainless steel bicycle racks.

---

## 7. Vegetation & Specimen Trees

- **Count:** Strictly 1–2 architectural specimen street trees (Tree 1 at the front-right curb corner, Tree 2 along the side promenade).
- **Trunk & Branching:** Slender, tapered dark-bronze trunks (`radius: 0.011`) with 2 natural, understated branch forks extending upward at realistic angles.
- **Canopy Masses:** Natural, organic, low-poly foliage clusters utilizing varied dodecahedron geometry with soft faceted shading. Foliage uses muted natural olive and sage tones (`#505E36`, `#657344`), avoiding uniform spheres, stacked discs, or cartoon shapes.
- **Base Integration:** Embedded flush into the granite sidewalk with a subtle square cast-iron tree grate (`#221C18`).

---

## 8. Camera Composition & Viewport Balancing

```
+-------------------------------------------------------------------------------+
| TOP NAVIGATION BAR                                                            |
+------------------------------------+------------------------------------------+
| LEFT EDITORIAL COLUMN (46%-48%)    | RIGHT ARCHITECTURAL HERO (52%-54%)       |
|                                    |                                          |
| 03 // 06                           |            [Roof Parapet]                |
| INDUSTRIES WE SERVE                |          +-----------------+             |
|                                    |   [Core] |  Penthouse L5   |             |
| REAL ESTATE &                      |   +----+ +-----------------+             |
| PROPERTY TECH                      |   |    | |  Terrace L4     | [Teak]     |
|                                    |   |    | +-----------------+             |
| [01 REAL ESTATE] [02 HEALTHCARE]   |   |    | |  Terrace L3     |             |
| [03 FINANCIAL]   [04 LOGISTICS]    |   |    | +-----------------+             |
|                                    |   |    | | Wrap Terrace L2 |             |
| Narrative copy explaining Tech-    |   +----+ +-----------------+             |
| Sphere's PropTech & smart build-   |   [Entry]| Storefront Lobby|             |
| ing enterprise platforms...        |   =======+=================+             |
|                                    |   --------------------------------       |
| [EXPLORE CAPABILITY ->]            |      (Soft Feathered Contact Shadow)     |
+------------------------------------+------------------------------------------+
```

- **Protected Safe Zone:** The entire left 46%–48% of the viewport is protected. No 3D geometry overlaps headings, pills, narrative copy, or CTAs.
- **Elevated 3/4 Perspective:** Camera positioned at `[-0.70, 0.38, 3.32]`, looking at `[0.68, 0.38, -2.85]` with `fov: 38°` on desktop.
- **Vertical Grounding:** Ground line sits comfortably in the lower third; roof has generous headroom (25% sky margin).

---

## 9. Node 08 → Real Estate Transition

```
Technology Consulting (Node 08)
  |  [p = 8.00 - 8.25]: Rock-solid reading hold at Node 08 arrival state
  v
Camera Glides & Pivots
  |  [p = 8.25 - 8.65]: Camera travels forward along continuous 3D corridor
  |  Node 08 glides toward the property entrance plinth
  v
Node 08 Integrates & Dissolves
  |  [p = 8.45 - 8.70]: Node 08 fades gracefully into warm entrance sconce illumination
  |  Transient ground alignment datum guides the eye to the site
  v
Architectural Cohesion
  |  [p = 8.50 - 9.40]: Building structure and facade resolve in lockstep
  v
Real Estate Reading Hold
  |  [p = 9.60 - 10.00]: Completely finished scene; ZERO helper lines, totems, or dots
```

- **Reverse Scroll Determinism:** When scrolling backward ($p \le 8.25$), Node 08 returns to its canonical coordinates `[-0.04, 0.90, -1.70]`, scale `1.18`, and full opacity with 100% mathematical precision.

---

## 10. Construction Animation Sequence

| Progress Range ($p$) | Architectural Event | Visual Experience |
| :--- | :--- | :--- |
| **8.00 – 8.25** | Service 08 Stable Hold | Technology Consulting active on left; corridor stable |
| **8.25 – 8.45** | Corridor Transition Begins | Node 08 glides toward entrance; Service 08 text dissolves upward |
| **8.35 – 8.75** | Site Foundation Settles | Sidewalk plinth and soft contact shadow ground into the cream plane |
| **8.50 – 8.90** | Structural Core & Columns | Monolithic core and ground pilotis rise cohesively |
| **8.55 – 9.15** | Cantilever Slabs Stack Upward | Levels 2, 3, 4, and penthouse slabs materialize in vertical sequence |
| **8.95 – 9.35** | Glazing Curtain Walls Slide In | High-specular daylight glass panels and dark slim mullions resolve |
| **9.05 – 9.45** | Balconies & Planters Form | Laminated glass railings and bronze planter troughs settle on slabs |
| **9.15 – 9.50** | Teak Louver Screens Mount | Warm golden timber slats resolve in sliding tracks between slabs |
| **9.20 – 9.55** | Storefront & Main Entrance | Double-height lobby, entrance doors, canopy, and warm light wash activate |
| **9.30 – 9.62** | Landscaping & Specimen Trees | Two delicate specimen trees and sidewalk grates feather in |
| **9.60 – 10.00** | **Final Client-Ready State** | Section 03 text fully visible; building 100% complete and rock-solid |

---

## 11. Final Reading-State Composition

At $p \ge 9.65$, the scene is in its client-ready, production state:
- **No Artifacts:** Zero floating fragments, zero detached slabs, zero construction indicators, zero leftover conduits or totems.
- **Editorial Hierarchy:** Left typography is crisp, readable, and completely unoccluded.
- **Architectural Credibility:** The building reads as a real contemporary mixed-use property with believable cantilever depth, realistic floor heights, subtle interior parallax, and organic material warmth.

---

## 12. Mobile Strategy

- **Vertical Hierarchy:** On mobile viewports ($< 768\text{px}$), editorial typography stacks cleanly at the top (`order-1` label, `order-2` title, `order-3` description, `order-6` CTA).
- **Responsive 3D Positioning:**
  - Mobile Camera: Position `[1.72, 0.05, 3.90]`, Look Target `[1.72, 0.48, -2.85]`, `fov: 44°`.
  - Tablet Camera: Position `[-0.40, 0.45, 3.75]`, Look Target `[0.70, 0.32, -2.85]`, `fov: 40°`.
- **Performance:** Reduced motion mode locks camera immediately at the final reading position with zero jitter.

---

## 13. Files That Should Be Replaced

| File Path | Replacement Scope |
| :--- | :--- |
| `components/three/real-estate/RealEstateBuilding.tsx` | Replace procedural massing with monolithic limestone core, 18mm cantilever slabs, and structural pilotis. |
| `components/three/real-estate/RealEstateStorefront.tsx` | Replace bistro tables and block letters with prestige entrance portal, glass doors, canopy, and clean retail glass. |
| `components/three/real-estate/RealEstateStreetscape.tsx` | Replace 3D stage block, asphalt road, and bike racks with slim 12mm sidewalk and soft feathered shadow. |
| `components/three/real-estate/RealEstateVegetation.tsx` | Replace stacked spherical disc trees with 2 slender specimen trees using organic low-poly foliage clusters. |
| `components/three/real-estate/RealEstateBridge.tsx` | Remove totem box, conduit, and handoff dot; provide transient alignment datum only during transition. |
| `components/three/real-estate/types.ts` | Update palette tokens, scale dimensions, and cohesive construction phase formulas. |

---

## 14. Files That Can Be Retained

| File Path | Retained Aspect |
| :--- | :--- |
| `components/three/real-estate/RealEstateScreens.tsx` | Retain instanced mesh performance pattern; refine batten dimensions and teak wood material. |
| `components/three/real-estate/RealEstateFacade.tsx` | Retain curtain wall bays and interior parallax; refine daylight reflectivity and slim mullions. |
| `components/three/real-estate/RealEstateBalconies.tsx` | Retain balcony geometry structure; refine laminated glass transparency and bronze planter troughs. |
| `components/three/real-estate/RealEstateEnvironment.tsx` | Retain master group, scale (0.80), and visibility optimization ($p < 8.25$ invisible). |
| `components/sections/TechnologySolutions.tsx` | Retain 2-canvas architecture, editorial text, numbering (`03 // 06`), and ScrollTrigger setup. |

---

## 15. How to Preserve the Existing Architecture

1. **Strictly 2 Canvases:** 
   - Canvas 1: Hero section.
   - Canvas 2: `TechnologySystemScene` pinned inside `TechnologySolutions`.
   - Section 03 remains embedded directly inside Canvas 2. No new canvas is introduced.
2. **Strictly 2 ScrollTriggers:**
   - ScrollTrigger 1: Hero to Technology corridor handoff.
   - ScrollTrigger 2: Master Technology Solutions pinned corridor ($p \in [0.00, 10.00]$).
3. **No Component Remounts:** The WebGL context stays continuously mounted throughout the scroll.
4. **Untouched Systems:** Hero, Hero Dot 80, Nodes 01–08 geometry, path curves, header, and global CSS remain completely untouched.

---

## 16. Validation Strategy

1. **Type Checking:** Execute `npx tsc --noEmit` and confirm **0 errors**.
2. **Production Build:** Execute `npm run build` and confirm **0 build errors**.
3. **Waypoint Inspection:**
   - $p = 8.00$: Node 08 stable hold.
   - $p = 8.40$: Node 08 corridor glide and site plinth settling.
   - $p = 8.80$: Structural core and columns rising.
   - $p = 9.30$: Slabs, glazing, and teak screens resolving.
   - $p = 9.75 - 10.00$: Final client-ready Section 03 reading hold.
4. **Reverse Scroll Check:** Scroll backward from $p = 10.00$ to $p = 8.00$ to verify deterministic restoration of Node 08.

---

## 17. Explicit Scope Boundaries

- **In Scope:** `components/three/real-estate/*` and Section 03 camera waypoint/progress hookup.
- **Strictly Out of Scope:**
  - Hero section & Hero Dot 80
  - Technology corridor Nodes 01–08 geometry & coordinates
  - Header & site navigation
  - Global CSS & typography system
  - Subsequent industry sections (Industries 02–06)
