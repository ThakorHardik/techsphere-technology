# TechSphere Technology — Motion & Animation Architecture

## 1. Motion Philosophy

Motion at TechSphere is an engineering discipline, not decoration. Every transition, reveal, and state change must serve one of three functions:
1. **Direct Attention:** Guide the user's eye to primary hierarchy and sequential reading order.
2. **Explain Relationship:** Clarify how discrete technologies interconnect into scalable systems.
3. **Provide Immediate Tactile Feedback:** Confirm user input with crisp, deterministic responses.

> [!IMPORTANT]
> Never animate simply because an animation library is available. The website must remain visually complete, legible, and structurally sound when all motion is disabled.

---

## 2. Technology Stack & Integration

* **Primary Engine:** GSAP (GreenSock Animation Platform) `^3.15.0`
* **Scroll Engine:** GSAP `ScrollTrigger`
* **React Integration:** `@gsap/react` (`useGSAP` hook for scoped lifecycle and automatic cleanup in React 19)

### 2.1 React 19 & Next.js App Router Lifecycle Contract
To ensure memory safety and prevent hydration mismatches or zombie event listeners:
1. **SSR Safety:** All GSAP and ScrollTrigger initializations must execute exclusively inside client components (`'use client'`) within `useGSAP()` or `useEffect()`.
2. **Context Cleanup:** Every animation must use `useGSAP({ scope: containerRef })` to ensure automatic teardown when components unmount or route transitions trigger.
3. **ScrollTrigger Refreshing:** Trigger `ScrollTrigger.refresh()` only after layout shifts (e.g., font loading, dynamic content hydration) have finalized.

---

## 3. Motion System Tokens & Timing

To ensure visual consistency across the entire application, animations must use standardized duration and easing tokens:

### 3.1 Duration Tokens
* **Instant / Micro (`duration-micro`):** `150ms` (hover states, toggle switches, active button press)
* **Standard (`duration-std`):** `300ms` (dropdown reveals, modal transitions, card hover elevation)
* **Narrative (`duration-narrative`):** `600ms - 800ms` (section content reveals, staggered list entrances)
* **Ambient / Continuous (`duration-ambient`):** `3000ms - 8000ms` (slow ambient 3D sphere rotation, particle drift)

### 3.2 Easing Curves
* **Exit / Entrances (Decelerated):** `power3.out` (`cubic-bezier(0.215, 0.61, 0.355, 1)`) — Provides a crisp start with a gentle, premium deceleration.
* **Micro-interactions:** `power2.out` (`cubic-bezier(0.25, 1, 0.5, 1)`) — Responsive, immediate feel.
* **Linear (Ambient Only):** `none` (continuous 3D particle orbit).

---

## 4. Scroll-Driven Orchestration (ScrollTrigger)

ScrollTrigger powers the storytelling mechanics of the website, synchronizing scroll position with section reveals and 3D canvas states.

### 4.1 Section Content Reveals
* **Pattern:** Staggered upward fade.
* **Specification:**
  ```javascript
  gsap.from(cardElements, {
    y: 24,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.08,
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
  ```

### 4.2 3D Canvas Scroll Synchronization
* **Pattern:** Scroll scrubbing linked to the Dotted Sphere state machine.
* **Phases:**
  * **Phase 1 (Hero):** Cohesive Dotted Sphere rotating gently.
  * **Phase 2 (Problem Section):** Scrubbing disperses dots outward into loose particles.
  * **Phase 3 (Connected Systems):** Scrubbing connects particles with dynamic vector lines.
  * **Phase 4 (Services):** Particles assemble into structured grid arrays.
  * **Phase 5 (CTA):** Particles re-coalesce into the unified TechSphere sphere.

---

## 5. Micro-Interactions & Hover States

1. **Button Hover:**
   * Gentle scale transition (`scale: 1.02`), subtle upward translateY (`-1px`), 150ms `power2.out`.
   * Never use aggressive spring or bounce physics.
2. **Card Hover:**
   * Subtle border contrast increase (from `#E3D2C0` to `#4A3725`/40%).
   * Subtle surface shift, 200ms `power2.out`.
3. **Link Underline:**
   * Origin-left scaleX expansion from 0 to 1 on hover; origin-right collapse on blur.

---

## 6. Accessibility & Reduced Motion Handling

All motion must respect user system preferences:

```typescript
// hooks/use-prefers-reduced-motion.ts
import { useEffect, useState } from "react";

export function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reducedMotion;
}
```

### Fallback Behavior When Reduced Motion is Active
* ScrollTrigger scrubbers for 3D particles are disabled; the 3D scene renders in its final, resting cohesive state.
* Parallax effects are locked to `y: 0`.
* Section reveals switch from animated translations (`y: 24 -> 0`) to simple, instantaneous visibility (`opacity: 1`).
* All continuous rotational loops are paused.
