"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { TechSphereScene } from "@/components/three/TechSphereScene";
import { ArrowRight, ArrowDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  (window as any).ScrollTrigger = ScrollTrigger;
}

/**
 * Architectural Editorial Hero Section for TechSphere Technology.
 * 
 * Target-Dot Entry & Circular Reveal Architecture:
 * - Phase 1 (0.00 → 0.20) — Hero Rest:
 *   Authentic halftone mark is stable and recognizable. Subtle ambient breathing.
 * - Phase 2 (0.20 → 0.40) — Hero Departure:
 *   Headline lifts slightly, supporting copy softens, camera begins moving forward.
 * - Phase A (0.40 → 0.58) — Dot Approach:
 *   Camera locks onto Master Dot 80 (cx: -0.0068, cy: -0.0270, cz: 1.5652).
 * - Phase B (0.58 → 0.76) — Dot Entry:
 *   Camera moves directly up to Dot 80; dot expands substantially via 3D perspective;
 *   non-target dots fade out and drift outward; Dot 80 dominates.
 * - Phase C (0.76 → 0.90) — Dot → Reveal:
 *   Dot 80 visually expands into circular reveal originating from Dot 80's screen coordinates;
 *   the actual <BusinessChallenge /> DOM begins becoming visible underneath.
 * - Phase D (0.90 → 1.00) — Full Reveal:
 *   Circular mask expands beyond the viewport; BusinessChallenge becomes fully visible;
 *   normal document scrolling continues naturally with zero layout jumps.
 */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Authoritative master progress source for entire Hero subsystem (zero React re-renders)
  const progressRef = useRef(0);

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;

    const heroEl = heroRef.current;
    const pinnedEl = pinnedRef.current;
    if (!heroEl || !pinnedEl) return;

    const challengeWrapper = document.getElementById(
      "business-challenge-reveal-wrapper"
    );

    // Dynamic helper to compute exact screen coordinates of Dot 80
    // Uses live 3D camera projection from Three.js; falls back to anchor center
    const getDotScreenOrigin = () => {
      if (typeof window !== "undefined" && window.__techSphereDot80Screen) {
        return window.__techSphereDot80Screen;
      }
      const anchor = heroEl.querySelector(".hero-sphere-anchor");
      if (!anchor) {
        return {
          pxX: window.innerWidth / 2,
          pxY: window.innerHeight / 2,
        };
      }
      const rect = anchor.getBoundingClientRect();
      return {
        pxX: rect.left + rect.width / 2,
        pxY: rect.top + rect.height / 2,
      };
    };

    // Helper: Restore Hero to its deterministic resting state (identical to page load)
    const resetHeroToRestingState = () => {
      progressRef.current = 0;
      if (challengeWrapper) {
        challengeWrapper.style.visibility = "hidden";
        challengeWrapper.style.pointerEvents = "none";
        const initialOrigin = getDotScreenOrigin();
        challengeWrapper.style.clipPath = `circle(0px at ${initialOrigin.pxX.toFixed(1)}px ${initialOrigin.pxY.toFixed(1)}px)`;
        const remainingDistance = heroEl.offsetHeight - window.innerHeight;
        challengeWrapper.style.transform = `translate3d(0, -${remainingDistance.toFixed(1)}px, 0)`;
      }
      gsap.set(
        [
          ".hero-eyebrow",
          ".hero-headline-line",
          ".hero-supporting-copy",
          ".hero-cta-group",
        ],
        {
          opacity: 1,
          y: 0,
          clearProps: "transform",
        }
      );
      gsap.set(".hero-editorial-content", {
        opacity: 1,
        pointerEvents: "auto",
      });
      gsap.set(".hero-atmospheric-veil", {
        opacity: 0,
      });
      gsap.set(".hero-scroll-cue", {
        opacity: 1,
        y: 0,
      });
    };

    // Initial state setup for reveal wrapper
    if (challengeWrapper) {
      challengeWrapper.style.visibility = "hidden";
      challengeWrapper.style.pointerEvents = "none";
      const initialOrigin = getDotScreenOrigin();
      challengeWrapper.style.clipPath = `circle(0px at ${initialOrigin.pxX.toFixed(1)}px ${initialOrigin.pxY.toFixed(1)}px)`;
    }

    const ctx = gsap.context(() => {
      // 1. Refined Entrance Sequence (restrained, premium, zero overshoot)
      const entranceTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Clear temporary inline styles from entrance sequence so scrollTl owns them cleanly
          gsap.set(
            [
              ".hero-eyebrow",
              ".hero-headline-line",
              ".hero-supporting-copy",
              ".hero-cta-group",
              ".hero-sphere-canvas-wrap",
              ".hero-scroll-cue",
            ],
            { clearProps: "transform,opacity" }
          );
        },
      });

      entranceTl
        .from(".hero-eyebrow", {
          opacity: 0,
          y: 8,
          duration: 0.8,
          delay: 0.15,
        })
        .from(
          ".hero-headline-line",
          {
            opacity: 0,
            y: 20,
            duration: 0.9,
            stagger: 0.12,
          },
          "-=0.5"
        )
        .from(
          ".hero-supporting-copy",
          {
            opacity: 0,
            y: 14,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".hero-cta-group",
          {
            opacity: 0,
            y: 12,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".hero-sphere-canvas-wrap",
          {
            opacity: 0,
            scale: 0.96,
            duration: 1.2,
          },
          "-=0.9"
        )
        .from(
          ".hero-scroll-cue",
          {
            opacity: 0,
            y: 6,
            duration: 0.8,
          },
          "-=0.4"
        );

      // 2. Authoritative Master Scroll Timeline across the pinned hero track
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: () =>
            "top " + (document.querySelector("header")?.offsetHeight || 0) + "px",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onEnter: () => {
            if (entranceTl.isActive()) {
              entranceTl.progress(1);
            }
          },
          onLeave: () => {
            progressRef.current = 1.0;
            if (challengeWrapper) {
              challengeWrapper.style.visibility = "visible";
              challengeWrapper.style.clipPath = "none";
              challengeWrapper.style.transform = "translate3d(0, 0, 0)";
              challengeWrapper.style.pointerEvents = "auto";
            }
            gsap.set(
              [
                ".hero-eyebrow",
                ".hero-headline-line",
                ".hero-supporting-copy",
                ".hero-cta-group",
                ".hero-editorial-content",
                ".hero-scroll-cue",
                ".hero-atmospheric-veil",
              ],
              { opacity: 0 }
            );
            gsap.set(".hero-editorial-content", { pointerEvents: "none" });
          },
          onEnterBack: () => {
            if (entranceTl.isActive()) {
              entranceTl.progress(1);
            }
            gsap.set(".hero-editorial-content", { pointerEvents: "auto" });
          },
          onLeaveBack: () => {
            resetHeroToRestingState();
          },
          onUpdate: (self) => {
            const p = self.progress;
            progressRef.current = p;

            if (p <= 0.001) {
              resetHeroToRestingState();
              return;
            }

            if (!challengeWrapper) return;
            const remainingDistance = heroEl.offsetHeight - window.innerHeight;

            if (p < 0.85) {
              // Before Phase 6: completely hidden, pointer events disabled
              challengeWrapper.style.visibility = "hidden";
              const origin = getDotScreenOrigin();
              challengeWrapper.style.clipPath = `circle(0px at ${origin.pxX.toFixed(1)}px ${origin.pxY.toFixed(1)}px)`;
              challengeWrapper.style.pointerEvents = "none";
              const naturalTop = (1 - p) * remainingDistance;
              challengeWrapper.style.transform = `translate3d(0, -${naturalTop.toFixed(1)}px, 0)`;
            } else if (p < 0.995) {
              // Phase 6 (0.85 -> 0.995):
              // Circular portal expands smoothly from Dot 80's exact screen position
              challengeWrapper.style.visibility = "visible";
              challengeWrapper.style.pointerEvents = "auto";
              const revealProgress = (p - 0.85) / 0.145; // 0.0 to 1.0

              // Clean, premium eased expansion originating from Dot 80's exact screen coordinates
              const maxDim = Math.max(window.innerWidth, window.innerHeight);
              const targetRadius = maxDim * 1.5;
              const easeFactor = gsap.parseEase("power2.inOut")(revealProgress);
              const currentRadius = easeFactor * targetRadius;

              const origin = getDotScreenOrigin();
              challengeWrapper.style.clipPath = `circle(${currentRadius.toFixed(1)}px at ${origin.pxX.toFixed(1)}px ${origin.pxY.toFixed(1)}px)`;

              // Counter-translate so top stays anchored at top: 0 during reveal
              const naturalTop = (1 - p) * remainingDistance;
              challengeWrapper.style.transform = `translate3d(0, -${naturalTop.toFixed(1)}px, 0)`;
            } else {
              // Phase 6 complete (p >= 0.995):
              // BusinessChallenge fully occupies viewport, normal scrolling takes over
              challengeWrapper.style.visibility = "visible";
              challengeWrapper.style.clipPath = "none";
              challengeWrapper.style.transform = "translate3d(0, 0, 0)";
              challengeWrapper.style.pointerEvents = "auto";
            }
          },
        },
      });

      // A. Scroll cue fades out immediately (0.00 -> 0.15)
      scrollTl.fromTo(
        ".hero-scroll-cue",
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -10,
          duration: 0.15,
          ease: "none",
        },
        0
      );

      // B. Soft Atmospheric Separation Veil (0.20 -> 0.80):
      // - 0.00–0.20: Completely invisible (clean resting Hero)
      // - 0.20–0.45: Smoothly fades in as particle field expands into editorial region
      // - 0.45–0.65: Maximum subtle atmospheric separation behind headline & paragraph
      // - 0.65–0.80: Smoothly fades out in unison with departing typography
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReducedMotion) {
        scrollTl
          .fromTo(
            ".hero-atmospheric-veil",
            { opacity: 0 },
            {
              opacity: () =>
                window.innerWidth < 640 ? 0.6 : window.innerWidth < 1024 ? 0.78 : 0.95,
              duration: 0.25,
              ease: "power1.out",
            },
            0.20
          )
          .to(
            ".hero-atmospheric-veil",
            {
              opacity: 0,
              duration: 0.15,
              ease: "power1.in",
            },
            0.65
          );
      }

      // C. Editorial content departure (0.58 -> 0.80):
      // Uses explicit .fromTo() so reversing to p = 0 ALWAYS restores 100% resting opacity and y = 0
      scrollTl
        .fromTo(
          [".hero-supporting-copy", ".hero-cta-group"],
          { y: 0, opacity: 1 },
          {
            y: -20,
            opacity: 0,
            duration: 0.16,
            ease: "power2.in",
          },
          0.58
        )
        .fromTo(
          ".hero-headline-line",
          { y: 0, opacity: 1 },
          {
            y: -30,
            opacity: 0,
            duration: 0.16,
            stagger: 0.04,
            ease: "power2.in",
          },
          0.60
        )
        .fromTo(
          ".hero-eyebrow",
          { y: 0, opacity: 1 },
          {
            y: -15,
            opacity: 0,
            duration: 0.16,
            ease: "power2.in",
          },
          0.62
        )
        .fromTo(
          ".hero-editorial-content",
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.18,
            ease: "power2.in",
          },
          0.62
        );

      // D. Spacer tween to normalize scrollTl total duration to exactly 1.00
      scrollTl.to({}, { duration: 0.16 }, 0.84);

      // 3D visual anchor translation and expansion are now handled natively
      // in full-viewport WebGL (Three.js) without rectangular container clipping.
    }, heroEl);

    return () => {
      ctx.revert();
      if (typeof window !== "undefined") {
        delete window.__techSphereDot80Screen;
      }
      if (challengeWrapper) {
        challengeWrapper.style.visibility = "";
        challengeWrapper.style.clipPath = "";
        challengeWrapper.style.transform = "";
        challengeWrapper.style.pointerEvents = "";
      }
    };
  }, [reducedMotion]);

  return (
    <section
      ref={heroRef}
      id="hero-story-track"
      data-section="hero"
      className={cn(
        "relative w-full",
        reducedMotion
          ? "min-h-[calc(100svh-var(--header-height,5rem))]"
          : "h-[220vh]"
      )}
      aria-label="Introduction and Overview"
    >
      {/* Pinned Viewport Container for Scroll Storytelling */}
      <div
        ref={pinnedRef}
        className={cn(
          "w-full overflow-hidden relative flex flex-col justify-between pt-[clamp(0.5rem,1.5vh,1.5rem)] pb-[clamp(0.25rem,1vh,1rem)] bg-[#FFF6ED]",
          reducedMotion
            ? "relative min-h-[calc(100svh-var(--header-height,5rem))]"
            : "sticky top-[var(--header-height,5rem)] h-[calc(100svh-var(--header-height,5rem))] max-h-[calc(100dvh-var(--header-height,5rem))]"
        )}
      >
        {/* ========================================================= */}
        {/* FULL-VIEWPORT WEBGL CANVAS STAGE (Zero clipping)          */}
        {/* ========================================================= */}
        <div
          className="hero-sphere-canvas-wrap absolute inset-0 size-full z-0 pointer-events-auto"
          aria-hidden="true"
        >
          <TechSphereScene
            state="sphere"
            targetState="sphere"
            progressRef={progressRef}
            triggerId="hero-story-track"
            theme="light"
            interactive={true}
            autoRotate={true}
            className="size-full"
          />
        </div>

        {/* Main Architectural Hero Body */}
        <div className="flex-1 flex items-center justify-center relative z-10 w-full min-h-0 pointer-events-none">
          <Container size="lg" className="relative w-full pointer-events-none">
            {/* Asymmetric Editorial Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 xl:gap-8 items-center pointer-events-none">
              {/* ========================================================= */}
              {/* PRIMARY EDITORIAL REGION: Typography & Action CTAs        */}
              {/* ========================================================= */}
              <div className="hero-editorial-content relative lg:col-span-7 xl:col-span-7 flex flex-col justify-center text-left pointer-events-auto">
                {/* Soft Atmospheric Separation Veil (dissolves into #FFF6ED with feathered radial falloff) */}
                <div
                  className="hero-atmospheric-veil absolute -inset-x-6 sm:-inset-x-10 lg:-inset-x-16 -inset-y-8 sm:-inset-y-12 lg:-inset-y-16 z-0 pointer-events-none opacity-0 select-none will-change-[opacity] backdrop-blur-[3px] sm:backdrop-blur-[5px] md:backdrop-blur-[6px] lg:backdrop-blur-[8px] motion-reduce:hidden"
                  aria-hidden="true"
                  style={{
                    background:
                      "radial-gradient(ellipse 65% 60% at 42% 48%, rgba(255, 246, 237, 0.72) 0%, rgba(255, 246, 237, 0.50) 42%, rgba(255, 246, 237, 0.15) 70%, rgba(255, 246, 237, 0) 100%)",
                    maskImage:
                      "radial-gradient(ellipse 65% 60% at 42% 48%, black 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 65% 60% at 42% 48%, black 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)",
                  }}
                />

                {/* 1. Subtle Editorial Marker */}
                <div className="hero-eyebrow relative z-10 mb-2.5 sm:mb-3 lg:mb-3 xl:mb-4">
                  <span className="text-xs sm:text-xs xl:text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground">
                    Technology Solutions Partner
                  </span>
                </div>

                {/* 2. Monumental Architectural 3-Line Headline */}
                <h1 className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(2.1rem,2.2vw+1.6vh,3.8rem)] xl:text-[clamp(2.5rem,2.7vw+1.8vh,4.4rem)] 2xl:text-[clamp(2.9rem,3.2vw+2vh,5.2rem)] font-semibold tracking-[-0.035em] leading-[0.98] sm:leading-[0.96] text-foreground uppercase mb-3 sm:mb-4 lg:mb-3 xl:mb-5 select-text">
                  <span className="hero-headline-line block">
                    Building Technology
                  </span>
                  <span className="hero-headline-line block text-foreground/90">
                    That Moves
                  </span>
                  <span className="hero-headline-line block">
                    Businesses Forward.
                  </span>
                </h1>

                {/* 3. Verified Supporting Paragraph */}
                <p className="hero-supporting-copy relative z-10 text-sm sm:text-base lg:text-[clamp(0.92rem,0.6vw+0.7vh,1.18rem)] text-muted-foreground leading-relaxed max-w-[32rem] sm:max-w-[35rem] lg:max-w-[38rem] font-normal mb-4 sm:mb-5 lg:mb-4 xl:mb-6">
                  We partner with businesses to solve complex technology challenges
                  through practical, secure, and future-ready solutions across
                  software, cloud, and intelligent systems.
                </p>

                {/* 4. Action CTA Group */}
                <div className="hero-cta-group relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Link
                    href="/services"
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "min-h-[46px] sm:min-h-[48px] xl:min-h-[52px] px-7 xl:px-9 text-xs sm:text-xs xl:text-sm font-semibold tracking-wider uppercase justify-center hover:no-underline shadow-xs w-full sm:w-auto rounded-none"
                    )}
                  >
                    Explore Solutions
                    <ArrowRight
                      className="size-4 ml-2 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>

                  <Link
                    href="/contact"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "min-h-[46px] sm:min-h-[48px] xl:min-h-[52px] px-7 xl:px-9 text-xs sm:text-xs xl:text-sm font-semibold tracking-wider uppercase justify-center hover:no-underline w-full sm:w-auto rounded-none border-border/80 hover:bg-muted/40"
                    )}
                  >
                    Start a Conversation
                  </Link>
                </div>
              </div>

              {/* ========================================================= */}
              {/* VISUAL ANCHOR: Layout Spacer in Grid                      */}
              {/* ========================================================= */}
              <div
                className="hero-sphere-anchor lg:col-span-5 xl:col-span-5 flex items-center justify-center relative min-h-0 h-[320px] sm:h-[400px] md:h-[460px] lg:h-[clamp(320px,min(42vw,calc(100svh-var(--header-height,5rem)-3.5rem)),560px)] xl:h-[clamp(380px,min(44vw,calc(100svh-var(--header-height,5rem)-4rem)),660px)] 2xl:h-[clamp(440px,min(46vw,calc(100svh-var(--header-height,5rem)-4.5rem)),760px)] lg:ml-3 xl:ml-6 bg-transparent border-0 shadow-none outline-none overflow-visible pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </Container>
        </div>

        {/* ========================================================= */}
        {/* UNDERSTATED SCROLL CUE                                    */}
        {/* ========================================================= */}
        <div className="hero-scroll-cue relative z-10 w-full pt-1 pb-1.5 sm:pb-2 text-center select-none pointer-events-none">
          <div className="inline-flex flex-col items-center gap-1 text-muted-foreground/70">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em]">
              Scroll to explore
            </span>
            <ArrowDown className="size-3 animate-bounce motion-reduce:animate-none opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
}
