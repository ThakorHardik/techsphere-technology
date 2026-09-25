"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { TechSphereScene } from "@/components/three/TechSphereScene";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ChallengeItem {
  readonly number: string;
  readonly title: string;
}

/**
 * Verified Six Business Challenges from authoritative brand content:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Section 5)
 */
const CHALLENGES: readonly ChallengeItem[] = [
  {
    number: "01",
    title: "Outdated Systems",
  },
  {
    number: "02",
    title: "Manual Processes",
  },
  {
    number: "03",
    title: "Disconnected Operations",
  },
  {
    number: "04",
    title: "Cybersecurity Risks",
  },
  {
    number: "05",
    title: "Limited AI Adoption",
  },
  {
    number: "06",
    title: "Scalability Challenges",
  },
] as const;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Business Challenge V4 — Calibrated 230vh Track with Zero Empty Tail.
 *
 * Requirements:
 * - Tightened 230vh physical scroll track (220–240vh).
 * - Single sticky viewport stage releasing immediately after Final Insight.
 * - Final Insight arrives around p = 0.86–0.90, holds at opacity: 1 through p = 1.00.
 * - Absolutely ZERO empty brown space or blank tail after content finishes.
 * - Next homepage section (Solutions) begins immediately after sticky release.
 */
export function BusinessChallenge() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const openingWrapRef = useRef<HTMLDivElement>(null);
  const openingLabelRef = useRef<HTMLDivElement>(null);
  const phrase1Ref = useRef<HTMLSpanElement>(null);
  const phrase2Ref = useRef<HTMLSpanElement>(null);
  const phrase3Ref = useRef<HTMLSpanElement>(null);
  const challengesWrapRef = useRef<HTMLDivElement>(null);
  const trackerWrapRef = useRef<HTMLDivElement>(null);
  const trackerNumberRef = useRef<HTMLSpanElement>(null);
  const insightWrapRef = useRef<HTMLDivElement>(null);
  const challengeItemsRef = useRef<(HTMLElement | null)[]>([]);

  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;

    const sectionEl = sectionRef.current;
    const openingEl = openingWrapRef.current;
    const labelEl = openingLabelRef.current;
    const p1El = phrase1Ref.current;
    const p2El = phrase2Ref.current;
    const p3El = phrase3Ref.current;
    const challengesEl = challengesWrapRef.current;
    const trackerEl = trackerWrapRef.current;
    const trackerNumEl = trackerNumberRef.current;
    const insightEl = insightWrapRef.current;
    const challengeItems = challengeItemsRef.current.filter(Boolean) as HTMLElement[];

    if (!sectionEl || !openingEl || !challengesEl || !insightEl) {
      return;
    }

    // Calibrated transition midpoints across 230vh track (step = 0.07, window = 0.04)
    const tCenters = [0.50, 0.57, 0.64, 0.71, 0.78];
    const halfWindow = 0.02;

    /**
     * Pure, deterministic frame renderer based on normalized scroll progress p (0.00 -> 1.00).
     * Final insight holds steadily at opacity 1 through p = 1.00 until the sticky stage releases.
     */
    const renderFrame = (p: number) => {
      const isMobile = window.innerWidth < 768;
      const maxDrift = isMobile ? 16 : 24;

      // =======================================================================
      // 1. OPENING STATEMENT LAYER (p: 0.00 -> 0.48)
      // =======================================================================
      if (openingEl) {
        if (p <= 0.40) {
          openingEl.style.opacity = "1";
          openingEl.style.transform = "translate3d(0, 0px, 0)";
          openingEl.style.display = "flex";
          openingEl.style.pointerEvents = "auto";
        } else if (p <= 0.48) {
          // Overlap crossfade: Opening statement fades as Challenge 01 becomes dominant
          const tOut = (p - 0.40) / 0.08;
          openingEl.style.opacity = String(Math.max(0, 1.0 - tOut));
          openingEl.style.transform = `translate3d(0, ${-maxDrift * tOut}px, 0)`;
          openingEl.style.display = "flex";
          openingEl.style.pointerEvents = tOut > 0.6 ? "none" : "auto";
        } else {
          openingEl.style.opacity = "0";
          openingEl.style.display = "none";
          openingEl.style.pointerEvents = "none";
        }

        // Opening Label: Always visible from first frame
        if (labelEl) {
          const lOp = p <= 0.10 ? clamp(0.70 + (p / 0.10) * 0.30, 0.70, 1.0) : 1.0;
          labelEl.style.opacity = String(lOp);
        }

        // Phrase 1: "FRAGMENTED SYSTEMS." (dominant from 0.00, reaches 1.0 at 0.10)
        if (p1El) {
          const p1Op = p <= 0.10 ? clamp(0.75 + (p / 0.10) * 0.25, 0.75, 1.0) : 1.0;
          p1El.style.opacity = String(p1Op);
          p1El.style.color = "#FFF6ED";
        }

        // Phrase 2: "DISCONNECTED DATA." (joins at 0.14–0.24)
        if (p2El) {
          if (p < 0.14) {
            p2El.style.opacity = "0.35";
            p2El.style.color = "#F6EDE3";
          } else if (p <= 0.24) {
            const t = (p - 0.14) / 0.10;
            p2El.style.opacity = String(0.35 + 0.65 * t);
            p2El.style.color = t > 0.5 ? "#FFF6ED" : "#F6EDE3";
          } else {
            p2El.style.opacity = "1";
            p2El.style.color = "#FFF6ED";
          }
        }

        // Phrase 3: "STALLED VELOCITY." (joins at 0.22–0.32)
        if (p3El) {
          if (p < 0.22) {
            p3El.style.opacity = "0.35";
            p3El.style.color = "#F6EDE3";
          } else if (p <= 0.32) {
            const t = (p - 0.22) / 0.10;
            p3El.style.opacity = String(0.35 + 0.65 * t);
            p3El.style.color = t > 0.5 ? "#FFF6ED" : "#F6EDE3";
          } else {
            p3El.style.opacity = "1";
            p3El.style.color = "#FFF6ED";
          }
        }
      }

      // =======================================================================
      // 2. THE SIX CHALLENGES CONTAINER (p: 0.38 -> 0.90)
      // =======================================================================
      if (challengesEl) {
        if (p < 0.38) {
          challengesEl.style.opacity = "0";
          challengesEl.style.display = "none";
          challengesEl.style.pointerEvents = "none";
        } else if (p <= 0.46) {
          // Overlap entry: Challenge 01 begins appearing while opening statement is still visible
          const tIn = (p - 0.38) / 0.08;
          challengesEl.style.opacity = String(clamp(tIn, 0, 1));
          challengesEl.style.transform = `translate3d(0, ${maxDrift * (1.0 - tIn)}px, 0)`;
          challengesEl.style.display = "flex";
          challengesEl.style.pointerEvents = tIn > 0.5 ? "auto" : "none";
        } else if (p <= 0.84) {
          challengesEl.style.opacity = "1";
          challengesEl.style.transform = "translate3d(0, 0px, 0)";
          challengesEl.style.display = "flex";
          challengesEl.style.pointerEvents = "auto";
        } else if (p <= 0.90) {
          // Direct overlap handoff into Final Insight
          const tOut = (p - 0.84) / 0.06;
          challengesEl.style.opacity = String(clamp(1.0 - tOut, 0, 1));
          challengesEl.style.transform = `translate3d(0, ${-maxDrift * tOut}px, 0)`;
          challengesEl.style.display = "flex";
          challengesEl.style.pointerEvents = tOut > 0.5 ? "none" : "auto";
        } else {
          challengesEl.style.opacity = "0";
          challengesEl.style.display = "none";
          challengesEl.style.pointerEvents = "none";
        }
      }

      // Tracker element visibility:
      if (trackerEl) {
        if (p < 0.38) {
          trackerEl.style.opacity = "0";
        } else if (p <= 0.46) {
          trackerEl.style.opacity = String(clamp((p - 0.38) / 0.08, 0, 1));
        } else if (p <= 0.84) {
          trackerEl.style.opacity = "1";
        } else if (p <= 0.90) {
          trackerEl.style.opacity = String(clamp(1.0 - (p - 0.84) / 0.06, 0, 1));
        } else {
          trackerEl.style.opacity = "0";
        }
      }

      // Tracker active number text:
      if (trackerNumEl) {
        if (p < 0.50) {
          trackerNumEl.textContent = "01";
        } else if (p < 0.57) {
          trackerNumEl.textContent = "02";
        } else if (p < 0.64) {
          trackerNumEl.textContent = "03";
        } else if (p < 0.71) {
          trackerNumEl.textContent = "04";
        } else if (p < 0.78) {
          trackerNumEl.textContent = "05";
        } else {
          trackerNumEl.textContent = "06";
        }
      }

      // =======================================================================
      // 3. INDIVIDUAL CHALLENGE CROSSFADES (0.44 -> 0.85)
      // =======================================================================
      let transIndex = -1;
      for (let k = 0; k < tCenters.length; k++) {
        if (p >= tCenters[k] - halfWindow && p <= tCenters[k] + halfWindow) {
          transIndex = k;
          break;
        }
      }

      let activeChallengeIdx = 0;
      if (p < tCenters[0] - halfWindow) {
        activeChallengeIdx = 0;
      } else if (p > tCenters[tCenters.length - 1] + halfWindow) {
        activeChallengeIdx = 5;
      } else {
        for (let k = 0; k < tCenters.length - 1; k++) {
          if (p > tCenters[k] + halfWindow && p < tCenters[k + 1] - halfWindow) {
            activeChallengeIdx = k + 1;
            break;
          }
        }
      }

      challengeItems.forEach((item, idx) => {
        if (!item) return;

        if (transIndex !== -1) {
          const tStart = tCenters[transIndex] - halfWindow;
          const progressInTrans = clamp((p - tStart) / (halfWindow * 2), 0, 1);

          if (idx === transIndex) {
            // Outgoing challenge: opacity 1.0 -> 0.20, y: 0 -> -maxDrift, scale: 1.0 -> 0.96
            const op = 1.0 - 0.80 * progressInTrans;
            const y = -maxDrift * progressInTrans;
            const s = 1.0 - 0.04 * progressInTrans;
            item.style.opacity = String(op);
            item.style.transform = `translate3d(0, ${y}px, 0) scale(${s})`;
            item.style.display = "flex";
          } else if (idx === transIndex + 1) {
            // Incoming challenge: opacity 0.15 -> 1.0, y: +maxDrift -> 0, scale: 0.96 -> 1.0
            const op = 0.15 + 0.85 * progressInTrans;
            const y = maxDrift * (1.0 - progressInTrans);
            const s = 0.96 + 0.04 * progressInTrans;
            item.style.opacity = String(op);
            item.style.transform = `translate3d(0, ${y}px, 0) scale(${s})`;
            item.style.display = "flex";
          } else if (idx === transIndex - 1 && progressInTrans < 0.5) {
            const op = 0.20 * (1.0 - progressInTrans * 2);
            item.style.opacity = String(op);
            item.style.transform = `translate3d(0, ${-maxDrift}px, 0) scale(0.96)`;
            item.style.display = "flex";
          } else if (idx === transIndex + 2) {
            item.style.opacity = "0.12";
            item.style.transform = `translate3d(0, ${maxDrift}px, 0) scale(0.96)`;
            item.style.display = "flex";
          } else {
            item.style.opacity = "0";
            item.style.display = "none";
          }
        } else {
          // Plateau state between transitions:
          if (idx === activeChallengeIdx) {
            item.style.opacity = "1";
            item.style.transform = "translate3d(0, 0px, 0) scale(1)";
            item.style.display = "flex";
          } else if (idx === activeChallengeIdx - 1) {
            item.style.opacity = "0.20";
            item.style.transform = `translate3d(0, ${-maxDrift}px, 0) scale(0.96)`;
            item.style.display = "flex";
          } else if (idx === activeChallengeIdx + 1) {
            item.style.opacity = "0.14";
            item.style.transform = `translate3d(0, ${maxDrift}px, 0) scale(0.96)`;
            item.style.display = "flex";
          } else {
            item.style.opacity = "0";
            item.style.display = "none";
          }
        }
      });

      // =======================================================================
      // 4. FINAL INSIGHT RESOLUTION (0.84 -> 1.00)
      // Enters 0.84 -> 0.90, then HOLDS at opacity 1 all the way through p = 1.00!
      // =======================================================================
      if (insightEl) {
        if (p < 0.84) {
          insightEl.style.opacity = "0";
          insightEl.style.transform = `translate3d(0, ${maxDrift}px, 0)`;
          insightEl.style.display = "none";
          insightEl.style.pointerEvents = "none";
        } else if (p <= 0.90) {
          const t = (p - 0.84) / 0.06;
          insightEl.style.opacity = String(clamp(t, 0, 1));
          insightEl.style.transform = `translate3d(0, ${maxDrift * (1.0 - t)}px, 0)`;
          insightEl.style.display = "flex";
          insightEl.style.pointerEvents = t > 0.5 ? "auto" : "none";
        } else {
          // HOLDS through end of section until sticky stage releases at p = 1.00
          insightEl.style.opacity = "1";
          insightEl.style.transform = "translate3d(0, 0px, 0)";
          insightEl.style.display = "flex";
          insightEl.style.pointerEvents = "auto";
        }
      }
    };

    // Render initial state immediately at p = 0
    renderFrame(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          renderFrame(self.progress);
        },
      });
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="business-challenge"
      data-section="business-challenge"
      aria-labelledby="business-challenge-title"
      className={cn(
        "relative w-full bg-[#35261A] text-[#FFF6ED] select-text overflow-x-hidden",
        reducedMotion ? "min-h-0 py-20 sm:py-28" : "h-[230vh]"
      )}
    >
      {/* =================================================================== */}
      {/* STICKY VIEWPORT STAGE (230vh scroll track)                          */}
      {/* Header height cleared: pt-[var(--header-height,5rem)]              */}
      {/* =================================================================== */}
      <div
        ref={stageRef}
        className={cn(
          "w-full flex items-center justify-center overflow-hidden",
          reducedMotion
            ? "relative min-h-0 pt-8 sm:pt-12"
            : "sticky top-0 h-screen max-h-[100dvh] pt-[var(--header-height,5rem)]"
        )}
      >
        {/* ================================================================= */}
        {/* RIGHT/CENTER: ACTIVE TECHSPHERE 3D SCENE                          */}
        {/* ================================================================= */}
        <div
          className={cn(
            "pointer-events-none z-10 flex items-center justify-center overflow-hidden select-none",
            reducedMotion
              ? "relative w-full h-[320px] sm:h-[400px] my-10"
              : "absolute inset-y-0 right-0 w-full lg:w-1/2 xl:w-7/12 h-full opacity-85 lg:opacity-95"
          )}
          aria-hidden="true"
          style={{
            maskImage:
              "radial-gradient(ellipse 65% 65% at 50% 50%, black 40%, transparent 95%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 65% 65% at 50% 50%, black 40%, transparent 95%)",
          }}
        >
          <TechSphereScene
            state="sphere"
            targetState="connections"
            triggerId="business-challenge"
            theme="dark"
            interactive={false}
            autoRotate={false}
            className="size-full"
          />
        </div>

        {/* ================================================================= */}
        {/* LEFT/CENTER: SHARED CINEMATIC EDITORIAL CONTENT STAGE             */}
        {/* ================================================================= */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pointer-events-none">
          <div className="w-full lg:w-7/12 xl:w-7/12 pointer-events-auto relative min-h-[380px] sm:min-h-[460px] flex items-center">
            {/* ============================================================= */}
            {/* LAYER A: OPENING STATEMENT (Monumental Declaration)           */}
            {/* ============================================================= */}
            <div
              ref={openingWrapRef}
              className={cn(
                "w-full select-text",
                reducedMotion
                  ? "relative mb-16"
                  : "absolute inset-0 flex flex-col justify-center will-change-transform will-change-opacity"
              )}
              style={reducedMotion ? undefined : { zIndex: 10 }}
            >
              {/* Subtle Editorial Label */}
              <div
                ref={openingLabelRef}
                className="bc-opening-label mb-5 sm:mb-7 select-none"
              >
                <span className="font-mono text-xs sm:text-xs xl:text-sm font-medium tracking-[0.25em] uppercase text-[#FFF6ED]/70">
                  The Business Challenge
                </span>
              </div>

              {/* Primary Architectural Statement */}
              <h2
                id="business-challenge-title"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[clamp(3.1rem,4.2vw,5.2rem)] xl:text-[clamp(3.7rem,4.8vw,6rem)] font-semibold tracking-[-0.035em] leading-[0.98] sm:leading-[0.94] text-[#FFF6ED] uppercase select-text"
              >
                <span
                  ref={phrase1Ref}
                  className="bc-phrase-1 block transition-colors"
                >
                  Fragmented Systems.
                </span>
                <span
                  ref={phrase2Ref}
                  className="bc-phrase-2 block transition-colors mt-1.5 sm:mt-2"
                >
                  Disconnected Data.
                </span>
                <span
                  ref={phrase3Ref}
                  className="bc-phrase-3 block transition-colors mt-1.5 sm:mt-2"
                >
                  Stalled Velocity.
                </span>
              </h2>
            </div>

            {/* ============================================================= */}
            {/* LAYER B: THE SIX CHALLENGES (Shared Stage Transitions)        */}
            {/* ============================================================= */}
            <div
              ref={challengesWrapRef}
              className={cn(
                "w-full select-text",
                reducedMotion
                  ? "relative flex flex-col gap-12 my-12"
                  : "absolute inset-0 flex flex-col justify-center will-change-transform will-change-opacity"
              )}
              style={reducedMotion ? undefined : { zIndex: 20 }}
            >
              {/* Stage Progress Index Tracker */}
              <div
                ref={trackerWrapRef}
                className="flex items-center gap-3 mb-6 sm:mb-8 font-mono text-xs sm:text-sm tracking-widest text-[#FFF6ED]/50 select-none"
              >
                <span
                  ref={trackerNumberRef}
                  className="text-[#FFF6ED] font-semibold text-sm sm:text-base"
                >
                  01
                </span>
                <span className="text-[#FFF6ED]/30">/</span>
                <span className="text-[#FFF6ED]/50">06</span>
                <span className="text-[#FFF6ED]/40 text-[11px] sm:text-xs ml-2 tracking-[0.2em] uppercase hidden sm:inline">
                  System Friction
                </span>
              </div>

              {/* Shared Challenge Stage Viewport */}
              <div className="relative w-full min-h-[180px] sm:min-h-[220px] lg:min-h-[260px] flex items-center">
                {CHALLENGES.map((item, idx) => (
                  <article
                    key={item.number}
                    ref={(el) => {
                      challengeItemsRef.current[idx] = el;
                    }}
                    className={cn(
                      "w-full flex flex-col justify-center select-text",
                      reducedMotion
                        ? "relative py-4 border-l-2 border-[#FFF6ED]/30 pl-6"
                        : "absolute inset-x-0 will-change-transform will-change-opacity"
                    )}
                    aria-label={`${item.number} ${item.title}`}
                  >
                    {/* Monolithic Number & Visual Node Line */}
                    <div className="flex items-center gap-3 mb-2 sm:mb-3 select-none">
                      <span className="font-mono text-xs sm:text-sm tracking-widest text-[#FFF6ED]/60 select-text">
                        {item.number}
                      </span>
                      <span className="h-px w-6 bg-[#FFF6ED]/25" aria-hidden="true" />
                    </div>

                    {/* Architectural Challenge Title */}
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2.6rem,3.6vw,4.4rem)] xl:text-[clamp(3rem,4.2vw,5rem)] font-semibold uppercase tracking-tight text-[#FFF6ED] leading-[1.06] select-text">
                      {item.title}
                    </h3>
                  </article>
                ))}
              </div>
            </div>

            {/* ============================================================= */}
            {/* LAYER C: THE KEY INSIGHT (Calmed Architectural Resolution)     */}
            {/* ============================================================= */}
            <div
              ref={insightWrapRef}
              className={cn(
                "w-full select-text",
                reducedMotion
                  ? "relative mt-16 pt-12 border-t border-[#FFF6ED]/15"
                  : "absolute inset-0 flex flex-col justify-center will-change-transform will-change-opacity"
              )}
              style={reducedMotion ? undefined : { zIndex: 30 }}
            >
              <div className="max-w-3xl">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[clamp(2.3rem,3vw,3.5rem)] xl:text-[clamp(2.6rem,3.4vw,4rem)] font-light leading-[1.22] sm:leading-[1.18] text-[#FFF6ED] select-text">
                  The challenge isn&apos;t simply having technology, it&apos;s having
                  the right technology working together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
