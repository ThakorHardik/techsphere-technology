# TechSphere Technology — 3D System Design (The Dotted Sphere)

> [!IMPORTANT]
> **Status:** REVISED & APPROVED (September 20, 2026).
> * **Desktop:** Full WebGL TechSphere dotted-sphere 3D experience with cursor interaction and all 4 transformation states.
> * **Tablet:** Optimized WebGL with reduced rendering complexity, touch interaction, and all 4 transformation states.
> * **Mobile:** Adaptive WebGL on mobile by default with optimized quality, touch drag interaction, all 4 transformation states, and 2D fallback only when WebGL is unavailable or unsuitable.
> * **Fallback:** Official 2D logo fallback (`/public/brand/logo-mark.png`) activated ONLY when WebGL is unsupported or context initialization fails.
> * **Reduced Motion:** Static or minimally animated representation with zero ambient rotation or parallax.
> * **Content Parity:** The website must remain visually complete, legible, and understandable without 3D.

---

## 1. Core 3D Concept & Brand Geometry

The signature 3D visual for TechSphere Technology is the **Dotted Halftone Sphere**. It is a direct spatial evolution of the brand mark.

> [!WARNING]
> Under no circumstances will this 3D system use:
> * A generic 3D Earth / spinning textured globe
> * A generic digital wireframe sphere
> * A floating futuristic cube or crystal
> * A spaceship, robot, or sci-fi archetype

The system represents **Connected Technology**: thousands of individual discrete coordinate points that coalesce into a cohesive, intelligent sphere.

---

## 2. Mathematical & Geometric Foundation

### 2.1 Point Distribution (Fibonacci Spiral on a Sphere)
To achieve an impeccably uniform distribution of dots across the sphere surface without clustering at the poles, the geometry utilizes the **Fibonacci Spiral Algorithm**:

$$\phi = \frac{1 + \sqrt{5}}{2} \quad (\text{Golden Ratio})$$
$$y_i = 1 - \left(\frac{i}{N - 1}\right) \cdot 2 \quad \text{for } i \in [0, N-1]$$
$$r_i = \sqrt{1 - y_i^2}$$
$$\theta_i = 2\pi \cdot \frac{i}{\phi}$$
$$x_i = r_i \cdot \cos(\theta_i), \quad z_i = r_i \cdot \sin(\theta_i)$$

Where $N$ represents the target particle count (e.g., $6,000$ on desktop).

### 2.2 Halftone Size Variation
To capture the distinctive halftone aesthetic of the TechSphere logo, dot radiuses vary along a gradient or directional vector, creating visual depth and light play across the curvature.

---

## 3. Particle State Machine

The 3D system transitions through five distinct phases synchronized with page storytelling and scroll position:

```
[State 1: SPHERE]
       │  (Initial cohesive equilibrium in Hero)
       ▼
[State 2: PARTICLES]
       │  (Expansion & dispersion representing business fragmentation)
       ▼
[State 3: CONNECTIONS]
       │  (Dynamic lines bridge proximity pairs, representing integration)
       ▼
[State 4: SYSTEM]
       │  (Arrayed grid structure representing scalable architecture)
       ▼
[State 5: SPHERE]
       │  (Harmonious re-convergence representing business forward momentum)
```

| State | Geometric Configuration | Interactive Behavior | Narrative Meaning |
| :--- | :--- | :--- | :--- |
| **01. Sphere** | Uniform Fibonacci distribution ($R = 2.5$) | Subtle pointer rotation, gentle ambient spin | Complete, unified technology partner |
| **02. Particles** | Radial displacement outwards ($R \to 4.5$) | Points scatter with noise-based turbulence | Isolated tools, fragmented systems |
| **03. Connections** | Points slow down; line segments bridge points | Proximity lines render when $d < \text{threshold}$ | Protocols, APIs, integrated workflows |
| **04. System** | Coordinates interpolate toward cubic/planar matrix | Nodes align into orthogonal enterprise grids | Scalable, structured digital infrastructure |
| **05. Sphere** | Points smoothly return to spherical coordinates | Responsive mouse repulsion, cohesive glow | Forward momentum and long-term stability |

---

## 4. Technical Architecture (React Three Fiber & Three.js)

### 4.1 Stack
* `@react-three/fiber` `^9.7.0` (Declarative Three.js scene graph)
* `@react-three/drei` `^10.7.8` (Helpers, performance profiling, float controls)
* `three` `^0.186.0` (Core WebGL math & rendering engine)

### 4.2 Shader Implementation (`RawShaderMaterial` / `PointsMaterial`)
To maintain high performance and sharp, circular dots on high-DPI (Retina) screens, the system uses custom vertex and fragment shaders:

* **Vertex Shader:** Calculates screen-space point size based on camera distance, device pixel ratio, and halftone weight.
* **Fragment Shader:** Employs `length(gl_PointCoord - vec2(0.5))` to generate a perfectly smooth, anti-aliased circular disc with zero texture overhead:
  ```glsl
  precision mediump float;
  uniform vec3 uColor;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.45, dist);
    gl_FragColor = vec4(uColor, alpha);
  }
  ```

---

## 5. Device-Tier Strategy (Adaptive WebGL)

| Device Tier | Rendering Target | Particle Budget | Interaction & Capabilities |
| :--- | :--- | :--- | :--- |
| **Desktop ($\ge 1024\text{px}$)** | Full WebGL Canvas | 183 master dots + 183 particles secondary | Full shader pipeline, cursor parallax, drag orientation, all 4 states |
| **Tablet ($768 - 1023\text{px}$)** | Optimized WebGL Canvas | 183 master dots + 120 particles secondary | Touch/pointer interaction, reduced secondary geometry, all 4 states |
| **Mobile ($< 768\text{px}$)** | **Adaptive WebGL Canvas (Default)** | 183 master dots + 100 particles secondary | Touch drag with smooth return to resting position, all 4 states, no post-processing |
| **Fallback (Unsupported WebGL)** | Official 2D Logo Mark | N/A | High-resolution `/public/brand/logo-mark.png` fallback with brand theme inversion |
| **Reduced Motion (`prefers-reduced-motion`)** | Static WebGL / Fallback | 183 master dots | Zero ambient rotation, zero parallax, instant state transitions |

### 5.1 Optimization & Mobile Rules
1. **Adaptive Mobile Quality:** Mobile renders interactive WebGL by default with DPR capped at 1.5 and powerPreference set to "default" to maximize battery life and maintain 60 FPS.
2. **Touch-First Interaction:** Mobile uses touch-drag orientation with bounded low-amplitude deflection (max $\pm 0.10$ rad yaw, $\pm 0.05$ rad pitch) and smooth spring return to resting position when touch is released.
3. **Graceful Fallback:** The 2D logo fallback is activated ONLY when WebGL context creation fails or WebGL is unsupported.
4. **Viewport Culling (IntersectionObserver):** When the 3D canvas is scrolled out of the active viewport, rendering is suspended (`frameloop="demand"`).
5. **Context Loss Management:** Listen for `webglcontextlost` and `webglcontextrestored` to gracefully switch to 2D fallback without throwing unhandled runtime exceptions.
