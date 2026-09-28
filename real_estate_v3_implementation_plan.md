# Real Estate v3 — Architectural Implementation Plan
**Section 03: 03 // 06 Industries We Serve — Real Estate & Property Tech**

---

## 1. Final Architectural Concept: "The Monolithic Pavilion & The Deep Void"

The design moves away from the multi-story apartment block with glued-on balconies and transitions to a **contemporary architectural pavilion** rooted in the language of international architectural masters (Peter Zumthor, David Chipperfield, Herzog & de Meuron, Olson Kundig).

### Core Philosophy: MASS + VOID + LIGHT + SHADOW
The design is anchored in four architectural fundamentals:
1. **The Monolith (Mass):** A primary vertical anchor in warm, tactile limestone/concrete providing structural gravitas and permanence.
2. **The Deep Void (Space):** A generous two-story covered architectural void carved into the lower and mid-levels, creating dramatic pools of natural shadow (chiaroscuro) rather than flat surfaces.
3. **The Terraces (Cantilever):** Restrained horizontal roof and podium slabs with substantial structural thickness ($40\text{–}50\text{cm}$ architectural profile, subtle shadow reveals), cantilevering cleanly into space.
4. **The Screen & Glazing (Light):** Floor-to-ceiling recessed solar glass set deep within structural reveals, reflecting daylight while revealing warm, amber-lit interior space beneath selective, fine bronze and timber architectural louvers.

```
       ┌───────────────────────────────┐
       │   Cantilevered Roof Canopy    │
   ┌───┴───────────┬───────────────────┴───┐
   │               │   Upper Terrace       │
   │   MONOLITH    │   Recessed Glazing    │
   │   (Tactile    ├───────────────────────┤
   │    Limestone  │                       │
   │    Shear      │   DEEP VOID           │
   │    Mass)      │   (Covered Colonnade  │
   │               │    & Bronze Pilotis)  │
   └───┬───────────┴───────────────────┬───┘
═══════╧═══════════════════════════════╧════════ (Ground Datum)
```

---

## 2. Silhouette & Massing Strategy

### A. Asymmetrical Tension
- **Left Anchor (The Monolith):** A vertical limestone volume ($X \approx -0.85$ to $-0.25$, $Y \approx 0.0$ to $2.1$, $Z \approx -0.8$ to $+0.8$). Solid, monolithic, punctured only by a single vertical reveal/recess.
- **Center-Right Span (The Terraces & Void):** Extending rightward ($X \approx -0.25$ to $+1.55$). A two-story open void on the ground/mezzanine floor supported by a single, slender architectural bronze pilotis column ($r = 0.045$), topped by a bold cantilevered upper gallery and floating roof plane.
- **Horizontal Datum:** The primary cantilevered terrace slab runs continuously, establishing a clean horizontal baseline that visually echoes the typography grid on the left.

### B. Realistic Structural Proportions (No CAD Thinness)
- **Slab Profiles:** $0.12\text{–}0.16$ scene units ($40\text{–}50\text{cm}$ real-world scale) with a $0.02$ recessed shadow gap above and below the glazing line.
- **Window Reveals:** Glass is recessed $0.25\text{–}0.35$ units deep into the structural walls. This ensures the thickness of the stone catches deep, raking daylight shadows.
- **Zero Micro-Clutter:** No tiny furniture cubes, no low-poly tree spheres, no floating curbs, no dense mullion grids.

---

## 3. Camera Position & Perspective Strategy

### Abandoning the Oblique CAD Tabletop Angle
The previous camera was positioned high at $Y \approx 0.60$ looking down at $Y \approx 0.15$ into $Z \approx -2.85$, creating an axonometric, toy-like tabletop view.

### The New Architectural Two-Point Perspective
- **Camera Height:** Low, human-scale architectural vantage point ($Y \approx -0.05$ to $+0.05$), looking nearly horizontal ($lookAt.Y \approx 0.00$).
- **Strictly Parallel Verticals:** By keeping camera pitch close to zero, all vertical building lines remain vertical on screen (tilt-shift architectural photography standard).
- **Subtle Lens Compression:** Calibrated distance and field-of-view (equivalent to a $45\text{mm}\text{–}50\text{mm}$ architectural tilt-shift lens), eliminating extreme corner distortion.
- **Target Coordinates (Desktop Final Hold, $p \ge 9.75$):**
  - `camera.position`: `[-0.75, 0.02, 3.45]`
  - `camera.lookAt`: `[0.55, 0.00, -2.50]`
  - This frames the building firmly on the right ($X: 46\% \text{ to } 96\%$), with its cantilever reaching toward the center and its vertical lines straight and imposing.

---

## 4. Final Desktop Composition

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│ LEFT EDITORIAL ZONE (44% Width)       │ RIGHT ARCHITECTURAL HERO (56% Width)  │
│                                       │                                       │
│ 03 // 06                              │             [Deep Sky Tone]           │
│ INDUSTRIES WE SERVE                   │                                       │
│                                       │             ┌──────────────────┐      │
│ REAL ESTATE &                         │      ┌──────┴──┐               │      │
│ PROPERTY TECH                         │      │         │ Upper Terrace │      │
│                                       │      │MONOLITH │ Recessed Glass│      │
│ [01 Real Estate] [02 Financial] ...   │      │         ├───────────────┤      │
│                                       │      │Tactile  │   DEEP        │      │
│ Physical permanence meets living      │      │Stone    │   ARCH.       │      │
│ spatial intelligence. We engineer     │      │Mass     │   VOID        │      │
│ digital twins, asset telemetry...     │      │         │               │      │
│                                       │      └──┬──────┴─────────────┬─┘      │
│ [ EXPLORE PLATFORM → ]                │         │   Bronze Pilotis   │        │
│                                       │ ════════╧════════════════════╧═══════ │
│                                       │ [Ground Datum with Contact Shadow]    │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

- **Guaranteed Text Protection:** The entire building massing, including roof overhangs, is confined to $X \ge 46\%$ of viewport width.
- **Baseline Alignment:** The cantilevered terrace slab aligns with the baseline rule of the section title or category selector.
- **Seamless Ground Datum:** No floating sidewalk boxes. The ground plane is an infinite, subtle gradient floor with soft ambient contact shadow directly beneath the structural footprints.

---

## 5. Mobile Composition (< 768px)

- **Vertical Stacking:**
  - **Upper 42% (Y: 0% to 42%):** Editorial content (`03 // 06`, `REAL ESTATE & PROPERTY TECH`, concise 2-line description, CTA button).
  - **Lower 58% (Y: 42% to 100%):** Architectural hero composition, centered horizontally at $X \approx 50\%$.
- **Mobile Camera Vantage:**
  - `camera.position`: `[0.35, -0.65, 4.35]`
  - `camera.lookAt`: `[0.35, 0.40, -2.50]`
  - Looking slightly upward from low ground level, giving the cantilevered canopy a monumental, heroic scale in the lower half of the screen with zero text collision.

---

## 6. Material Hierarchy (Strictly Restrained)

The scene uses exactly 4 curated, tactile architectural materials:

| Material | Architectural Role | Visual Specifications | Shader / PBR Settings |
| :--- | :--- | :--- | :--- |
| **1. Tactile Limestone / Precast** | Monolithic shear wall, floor slabs, structural roof canopy | Warm limestone cream (`#D8D2C6` light / `#38332D` dark). Subtle stone warmth, matte texture. | `roughness: 0.85`, `metalness: 0.02`. Receives raking daylight and crisp cast shadows. |
| **2. Architectural Bronze / Metalwork** | Slender pilotis column, canopy fascia edges, recessed window frames | Deep warm charcoal-bronze (`#1F1A16` light / `#14110F` dark). Crisp arris definition. | `roughness: 0.35`, `metalness: 0.65`. Catches subtle specular edge highlights. |
| **3. Selective Architectural Timber** | Recessed vertical louver screen on one terrace zone | Warm natural teak/cedar (`#B6743A` light / `#8A5222` dark). Human-scale warmth. | `roughness: 0.72`, `metalness: 0.04`. Soft diffuse highlights. |
| **4. Architectural Solar Glazing** | Deep recessed window planes, structural ribbon | Dual-tone daylight glass (`#556F7E`, translucent). Reflects sky while revealing interior depth. | `roughness: 0.08`, `metalness: 0.42`, `opacity: 0.60`, `transparent: true`. |
| **5. Interior Luminous Volume** | Internal depth plane behind glazing | Warm ambient interior glow (`#FFE4BA`, 2800K amber). Subtle gradient volume. | `MeshBasicMaterial`, soft emissive gradient, `opacity: 0.45`. Replaces all miniature furniture. |

---

## 7. Lighting Strategy

### Realistic Architectural Daylight (Zero Cyberpunk / Neon / Oversaturated VFX)
1. **Key Sunlight (Direct Directional):**
   - Position: Upper-left / front (`position: [-4.5, 6.2, 5.0]`).
   - Color: Warm crisp daylight (`#FFF6EB`, intensity: $2.4$).
   - Direction: Rakes diagonally across the limestone facade at ~42°, carving deep, sharp diagonal shadows into the two-story void and beneath the cantilevered terrace.
2. **Atmospheric Sky Fill (Ambient):**
   - Color: Soft cool skylight tone (`#D6E4EE`, intensity: $0.65$).
   - Role: Ensures shadowed areas are never pitch-black voids, maintaining luminous clarity with subtle warm/cool temperature contrast.
3. **Ground Bounce Light:**
   - Position: Low angled bounce (`position: [2.0, -3.0, 1.0]`).
   - Color: Muted warm earth/limestone bounce (`#4A3B2C`, intensity: $0.30$).
   - Role: Illuminates the undersides of the cantilevered slabs (soffits) naturally.
4. **Interior Luminous Volume:**
   - Soft amber glow ($2800\text{K}$) radiating from within the deep glass reveals, creating depth and life without toy furniture.

---

## 8. Node 08 Transition: Physical & Architectural Datum

The transition transforms **Living Technology Data $\rightarrow$ Physical Architectural Structure**:

```
[Node 08 Active in Technology Solutions]
  Position: [-0.04, 0.90, -1.70]
  Role: The final data beacon (Technology Consulting)
       │
       ▼ (p in [9.00, 9.15])
[Subtle Architectural Trajectory]
  Node 08 glides smoothly toward the site's primary structural coordinate [0.65, 0.00, -2.50].
       │
       ▼ (p in [9.15, 9.30])
[Restrained Technological Datum Line]
  Node 08 establishes a single, laser-precise architectural datum:
  a fine, warm-bronze horizontal axis along the site ground line and vertical structural line.
  (NO holographic HUDs, NO multi-layer grids, NO sci-fi VFX).
       │
       ▼ (p in [9.30, 9.55])
[Materialization of Structural Mass]
  The monolithic limestone core crystallizes along this vertical datum;
  the datum grounds the structure into the site.
       │
       ▼ (p in [9.55, 9.75])
[Dissolve into Finished Property]
  Node 08's luminous nucleus dissolves gracefully into the warm entrance portal of the building.
  The technological origin is now fully embodied in the built architectural form.
```

---

## 9. Architectural Reveal Sequence (Pacing across Scroll Progress)

Replaces the 4D Navisworks construction schedule with an artistic, filmic reveal across $p \in [9.00, 10.00]$:

| Scroll Range | Phase Name | Visual Action & Pacing |
| :--- | :--- | :--- |
| **$p \in [9.00, 9.15]$** | **Datum Arrival** | Camera transitions from overview into architectural eye-level. Node 08 glides to site anchor point. |
| **$p \in [9.15, 9.32]$** | **Ground & Monolith Emergence** | Ground datum settles with soft feathered contact shadow. The monolithic limestone shear mass emerges with absolute physical permanence. |
| **$p \in [9.32, 9.58]$** | **Deep Void & Cantilevers** | The two-story architectural void opens. Horizontal cantilevered terrace slabs extend outward, casting sharp diagonal shadows. Slender bronze pilotis resolves. |
| **$p \in [9.58, 9.76]$** | **Glazing & Timber Awakening** | Recessed solar glass planes appear within deep reveals. Selective warm teak timber screening resolves on the upper terrace. |
| **$p \in [9.76, 10.00]$** | **Final Daylight & Living Integration** | Daylight sweep settles. Warm amber glow illuminates interior volumes. Scene reaches rock-solid, client-ready stillness. |

---

## 10. Components & Files to Discard Completely

The following files and geometries from v1/v2 are **permanently eliminated**:

1. `RealEstateStreetscape.tsx` $\rightarrow$ **DISCARD.** Eliminates the floating sidewalk tile, curbs, granite steps, and bike racks.
2. `RealEstateVegetation.tsx` $\rightarrow$ **DISCARD.** Eliminates the low-poly sphere trees, tree grates, and potted greenery.
3. `RealEstateStorefront.tsx` $\rightarrow$ **DISCARD.** Eliminates the miniature furniture, desks, tables, and hanging sphere pendants.
4. `RealEstateBalconies.tsx` $\rightarrow$ **DISCARD.** Eliminates the glued-on corner boxes, glass railings, and planter boxes.
5. `RealEstateFacade.tsx` $\rightarrow$ **DISCARD.** Eliminates the dense 20-box black wireframe mullion loops.
6. `RealEstateBridge.tsx` $\rightarrow$ **DISCARD.** Eliminates the dotted 2D diagram connector line.

---

## 11. Components & Files to Rewrite / Create

1. **`components/three/real-estate/types.ts` (REWRITE):**
   - Discard the 15-phase construction timeline interface (`floorL2`, `floorL3`, `columns`, `mullions`, etc.).
   - Define a streamlined 5-phase architectural state: `datum`, `monolith`, `voidAndTerraces`, `glazingAndScreen`, `finalIntegration`.
   - Update `ARCHITECTURAL_SCALE` with the new monumental proportions and coordinates.
2. **`components/three/real-estate/RealEstateStructure.tsx` (NEW — Replaces `RealEstateBuilding.tsx`):**
   - Single unified architectural massing component.
   - Contains:
     - The Limestone Monolith (shear anchor).
     - The Deep Two-Story Covered Void with recessed architectural ground reveal.
     - Cantilevered Terrace & Floating Roof Slabs with substantial structural profiles.
     - Single slender bronze pilotis column.
     - Deep recessed window openings with solar glass.
     - Warm interior luminous gradient planes behind glazing.
3. **`components/three/real-estate/RealEstateScreens.tsx` (REWRITE):**
   - Selective, high-precision architectural timber & bronze screening louvers applied strictly to the upper terrace recess (warmth without geometric clutter).
4. **`components/three/real-estate/RealEstateDatum.tsx` (NEW — Replaces `RealEstateBridge.tsx`):**
   - Minimalist, elegant structural alignment line connecting Node 08’s trajectory to the building’s foundation axis. Dissolves cleanly as the monolith solidifies.
5. **`components/three/real-estate/RealEstateEnvironment.tsx` (REWRITE):**
   - Master architectural container.
   - Hosts refined daylight illumination (key sun, sky ambient, ground bounce, interior warmth).
   - Feathered ground contact plane (infinite, borderless).
   - Mounts `RealEstateStructure`, `RealEstateScreens`, and `RealEstateDatum`.
6. **`components/three/TechnologySystemCamera.tsx` (UPDATE Stage 13):**
   - Calibrate Stage 13 waypoints for eye-level, strictly vertical two-point perspective.

---

## 12. Components & Files to Retain

- **`components/three/TechnologySystemScene.tsx`:** Retained 100%. Clean mount of `RealEstateEnvironment` inside the persistent canvas.
- **Hero & Hero Dot 80 (`HeroCanvas.tsx`, `Hero.tsx`):** Retained 100% untouched.
- **Technology Solutions Nodes 01–08 (`TechnologySystemNodes.tsx`, `TechnologySystemRig.tsx`):** Retained 100% untouched.
- **Editorial Section Layout (`IndustriesShowcase.tsx`):** Retained 100%. Typography, badge selectors, copy, and layout remain completely intact.

---

## 13. How the Scene Stays Lightweight

- **Drastic Mesh Reduction:** Mesh count drops from ~180 individual primitive boxes in v2 to **under 25 total high-impact architectural elements** in v3.
- **Shared Geometries & Materials:** Box and cylinder geometries are shared; materials are created once via `useMemo`.
- **Zero Heavy Texture Downloads:** Clean PBR materials with calculated roughness, specular sheen, and daylight chiaroscuro achieve photo-editorial quality with 0KB texture overhead.
- **Draw Calls:** Reduced by over 65%, guaranteeing fluid 60fps on mobile, laptops, and 4K displays.

---

## 14. Preservation of 2-Canvas & 2-ScrollTrigger Architecture

- **Canvas 1:** `HeroCanvas.tsx` (Hero Dot 80).
- **Canvas 2:** `TechnologySystemScene.tsx` (Nodes 01–08 and Section 03 `RealEstateEnvironment`).
- **ScrollTrigger 1:** `#hero-pinned-container` (Hero section).
- **ScrollTrigger 2:** `#tech-system-pinned-container` (Scroll progress $p \in [0.00, 10.00]$).
- **Scroll Progress Contract:**
  - $p \in [0.00, 8.00]$: Nodes 01 through 08.
  - $p \in [8.00, 9.00]$: Complete 8-node system pull-back overview.
  - $p \in [9.00, 10.00]$: Section 03 Real Estate & Property Tech architectural reveal.
  - Settle hold at $p \ge 9.75$: Completely stable, finished architectural frame.
- **Deterministic Scrolling:** Forward and backward scrub behaves seamlessly with zero layout shifts or state desyncs.

---

## 15. Validation Checkpoints

1. **Camera Alignment:** Verify that vertical building lines are strictly parallel (no CAD tabletop tilt).
2. **Editorial Protection:** Verify in browser that the entire structure sits at $X \ge 46\%$ on desktop with zero typography overlap.
3. **Mobile Separation:** Verify that mobile viewport shows clean top editorial text and lower architectural composition.
4. **Light & Shadow:** Verify that key sunlight casts crisp diagonal shadows into the deep void, revealing true architectural depth.
5. **Static Integrity:** Pause scroll at $p = 9.85$ and $p = 10.00$; verify the frame looks like a client-ready architectural photograph.
6. **Code Health:** Run `npx tsc --noEmit` and `npm run build` with zero errors.

---

## 16. Explicit Anti-CAD & Anti-Sci-Fi Guardrails

| Forbidden Pattern | Reason for Rejection | Approved Architectural Replacement |
| :--- | :--- | :--- |
| ❌ **Floating sidewalk tile / curb box** | Looks like a CAD toy baseplate. | Seamless feathered ground plane with soft ambient contact shadow. |
| ❌ **Low-poly trees & spherical foliage** | Mobile-game asset aesthetic. | None. Pure architectural composition (mass + void). |
| ❌ **Miniature furniture / cafe tables** | Dollhouse detailing. | Warm, luminous interior gradient planes ($2800\text{K}$) behind tinted glass. |
| ❌ **Dense black mullion grids** | Wireframe CAD clutter / moiré. | Large-format recessed solar glass panes with minimal bronze edge trims. |
| ❌ **Holographic HUDs, lasers, neon** | Sci-fi / cyberpunk cliché. | Single restrained warm-bronze architectural alignment datum line. |
| ❌ **4D piece-by-piece construction** | Navisworks contractor schedule. | Filmic reveal: Datum $\rightarrow$ Monolith $\rightarrow$ Void $\rightarrow$ Light/Glass integration. |
| ❌ **Razor-sharp 90° digital knife edges** | Unrealistic CGI look. | Substantial slab profiles with recessed shadow reveals catching specular glints. |

---

### End of Implementation Plan
*Ready for user review and approval before any implementation begins.*
