"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TechnologySystemScene } from "@/components/three/TechnologySystemScene";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Verified Service 01 Content — Strictly derived from official brand source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Sections 1, 2, 6 & 7)
 */
const SERVICE_01 = {
  number: "01",
  titleLine1: "CUSTOM SOFTWARE",
  titleLine2: "SOLUTIONS",
  supportingCopy:
    "Bespoke business applications and enterprise software engineered to simplify workflows, integrate systems, and build scalable digital infrastructure.",
  capabilities: [
    "Business Applications",
    "Workflow Automation",
    "Enterprise Software",
    "API & Integrations",
  ],
} as const;

/**
 * Verified Service 02 Content — Strictly derived from official brand source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Sections 1, 2, 6 & 7)
 */
const SERVICE_02 = {
  number: "02",
  titleLine1: "AI INTEGRATION &",
  titleLine2: "AUTOMATION",
  supportingCopy:
    "Intelligent automation and AI-powered workflows engineered to optimize operations, enhance decision-making, and transform business processes.",
  capabilities: [
    "Intelligent Automation",
    "AI-Powered Workflows",
    "Decision Systems",
    "Process Optimization",
  ],
} as const;

/**
 * Verified Service 03 Content — Strictly derived from official brand source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Sections 1, 2, 6 & 7)
 * and verified requirements:
 */
const SERVICE_03 = {
  number: "03",
  titleLine1: "WEB & APPLICATION",
  titleLine2: "DEVELOPMENT",
  supportingCopy:
    "Modern web applications, robust client portals, and scalable digital platforms engineered for speed, security, and exceptional user experience.",
  capabilities: [
    "Modern Web Applications",
    "Client Portals",
    "Digital Platforms",
    "Interactive Experiences",
  ],
} as const;

/**
 * Verified Service 04 Content — Strictly derived from official brand source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Section 7)
 * and /docs/CONTENT.md (Section 2.2):
 */
const SERVICE_04 = {
  number: "04",
  titleLine1: "E-COMMERCE",
  titleLine2: "SOLUTION",
  supportingCopy:
    "High-conversion digital storefronts, multi-vendor marketplaces, and secure payment infrastructure engineered to streamline order management and scale retail operations.",
  capabilities: [
    "Custom E-Commerce",
    "Marketplace Platforms",
    "Payment Integrations",
    "Inventory & Order Systems",
  ],
} as const;

/**
 * Verified Service 05 Content — Strictly derived from official brand source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Section 7)
 * and /components/sections/Solutions.tsx:
 */
const SERVICE_05 = {
  number: "05",
  titleLine1: "CYBERSECURITY",
  titleLine2: "SOLUTIONS",
  supportingCopy:
    "Enterprise-grade security architectures, vulnerability assessment protocols, and continuous risk monitoring engineered to protect critical business assets and data integrity.",
  capabilities: [
    "Security Assessments",
    "Threat Protection",
    "Compliance & Governance",
    "Incident Management",
  ],
} as const;

/**
 * Verified Service 06 Content — Strictly derived from official brand source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Section 7)
 * and /components/sections/Solutions.tsx:
 */
const SERVICE_06 = {
  number: "06",
  titleLine1: "CLOUD & IT",
  titleLine2: "SOLUTIONS",
  supportingCopy:
    "Enterprise cloud migration, scalable infrastructure deployment, and reliable ongoing technology management engineered to optimize performance and ensure business continuity.",
  capabilities: [
    "Cloud Migration",
    "Infrastructure Setup",
    "Optimization & Backup",
    "Ongoing Technology Support",
  ],
} as const;

/**
 * Verified Service 07 Content — Strictly derived from official brand source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Section 7)
 * and /components/sections/Solutions.tsx:
 */
const SERVICE_07 = {
  number: "07",
  titleLine1: "DATA & BUSINESS",
  titleLine2: "INTELLIGENCE",
  supportingCopy:
    "Data-driven decision systems, analytics pipelines, and business intelligence architectures engineered to transform enterprise data into actionable operational clarity.",
  capabilities: [
    "Data-Driven Decisions",
    "Analytics & Reporting",
    "Business Intelligence",
    "Unified Telemetry",
  ],
} as const;

/**
 * Verified Service 08 Content — Strictly derived from official brand source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Section 7)
 * and /components/sections/Solutions.tsx:
 */
const SERVICE_08 = {
  number: "08",
  titleLine1: "TECHNOLOGY",
  titleLine2: "CONSULTING",
  supportingCopy:
    "Strategic technology roadmapping, architecture strategy, and legacy system modernization engineered to guide enterprise evolution.",
  capabilities: [
    "Practical Consulting",
    "Architecture Strategy",
    "System Modernization",
    "Solutions Advisory",
  ],
} as const;

/**
 * Verified Section 03 Industries Content — Strictly derived from official brand source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Section 8: Industries We Serve)
 * and /docs/CONTENT.md (Section 2.3: Target Industry Verticals)
 */
const INDUSTRIES = [
  {
    id: "01",
    name: "REAL ESTATE",
    active: true,
    description:
      "Property management platforms, smart building automation, digital asset tracking, and transactional portals.",
    image: "/industries/real-estate.jpg",
    alt: "Documentary architectural photograph of contemporary real estate development",
  },
  { id: "02", name: "E-COMMERCE", active: false },
  { id: "03", name: "MANUFACTURING", active: false },
  { id: "04", name: "PROFESSIONAL SERVICES", active: false },
  { id: "05", name: "STARTUPS & SMEs", active: false },
  { id: "06", name: "HEALTHCARE", active: false },
] as const;

/**
 * TechnologySolutions — Continuous Hero Portal -> Node 01 -> Node 02 -> Node 03 -> Node 04 -> Node 05 -> Node 06 Journey.
 *
 * System Progress Timeline (p in [0.0, 6.0]):
 * [0.00–1.00] Node 01:
 * - 0.00–0.10: Portal handoff / Node 01 formation (Dot 80 alignment locked)
 * - 0.10–0.16: Node 01 faceted form completes
 * - 0.16–0.22: Short path seed extends from Node 01
 * - 0.22–0.28: Faint next node (Node 02) & path continuation
 * - 0.28–0.40: Corridor reveal & camera glide to establishing shot
 * - 0.40–0.85: Forward flight along corridor toward Node 01
 * - 0.85–1.00: Stable Node 01 arrival hold — Service 01 editorial resolves cleanly
 * [1.00–2.00] Node 02 Journey (t = p - 1.00 in [0.0, 1.0]):
 * - 0.00–0.10: Node 01 release hold & Service 01 dissolves
 * - 0.10–0.85: Continuous 3D flight along corridor to Node 02
 * - 0.85–1.00: Stable Node 02 arrival hold — Service 02 editorial resolves cleanly
 * [2.00–3.00] Node 03 Journey (t = p - 2.00 in [0.0, 1.0]):
 * - 0.00–0.10: Node 02 release hold & Service 02 dissolves
 * - 0.10–0.85: Continuous 3D flight along corridor to Node 03
 * - 0.85–1.00: Stable Node 03 arrival hold — Service 03 editorial resolves cleanly
 * [3.00–4.00] Node 04 Journey (t = p - 3.00 in [0.0, 1.0]):
 * - 0.00–0.10: Node 03 release hold & Service 03 dissolves
 * - 0.10–0.85: Continuous 3D flight along corridor to Node 04
 * - 0.85–1.00: Stable Node 04 arrival hold — Service 04 editorial resolves cleanly
 * [4.00–5.00] Node 05 Journey (t = p - 4.00 in [0.0, 1.0]):
 * - 0.00–0.10: Node 04 release hold & Service 04 dissolves
 * - 0.10–0.85: Continuous 3D flight along corridor to Node 05
 * - 0.85–1.00: Stable Node 05 arrival hold — Service 05 editorial resolves cleanly
 * [5.00–6.00] Node 06 Journey (t = p - 5.00 in [0.0, 1.0]):
 * - 0.00–0.10: Node 05 release hold & Service 05 dissolves
 * - 0.10–0.85: Continuous 3D flight along corridor to Node 06
 * - 0.85–1.00: Stable Node 06 arrival hold — Service 06 editorial resolves cleanly
 */
export function TechnologySolutions() {
  const trackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  // Service 01 Editorial Refs
  const wrap01Ref = useRef<HTMLDivElement>(null);
  const numeral01Ref = useRef<HTMLDivElement>(null);
  const title01Ref = useRef<HTMLHeadingElement>(null);
  const copy01Ref = useRef<HTMLParagraphElement>(null);
  const capabilities01Ref = useRef<HTMLDivElement>(null);
  const cta01Ref = useRef<HTMLAnchorElement>(null);

  // Service 02 Editorial Refs
  const wrap02Ref = useRef<HTMLDivElement>(null);
  const numeral02Ref = useRef<HTMLDivElement>(null);
  const title02Ref = useRef<HTMLHeadingElement>(null);
  const copy02Ref = useRef<HTMLParagraphElement>(null);
  const capabilities02Ref = useRef<HTMLDivElement>(null);
  const cta02Ref = useRef<HTMLAnchorElement>(null);

  // Service 03 Editorial Refs
  const wrap03Ref = useRef<HTMLDivElement>(null);
  const numeral03Ref = useRef<HTMLDivElement>(null);
  const title03Ref = useRef<HTMLHeadingElement>(null);
  const copy03Ref = useRef<HTMLParagraphElement>(null);
  const capabilities03Ref = useRef<HTMLDivElement>(null);
  const cta03Ref = useRef<HTMLAnchorElement>(null);

  // Service 04 Editorial Refs
  const wrap04Ref = useRef<HTMLDivElement>(null);
  const numeral04Ref = useRef<HTMLDivElement>(null);
  const title04Ref = useRef<HTMLHeadingElement>(null);
  const copy04Ref = useRef<HTMLParagraphElement>(null);
  const capabilities04Ref = useRef<HTMLDivElement>(null);
  const cta04Ref = useRef<HTMLAnchorElement>(null);

  // Service 05 Editorial Refs
  const wrap05Ref = useRef<HTMLDivElement>(null);
  const numeral05Ref = useRef<HTMLDivElement>(null);
  const title05Ref = useRef<HTMLHeadingElement>(null);
  const copy05Ref = useRef<HTMLParagraphElement>(null);
  const capabilities05Ref = useRef<HTMLDivElement>(null);
  const cta05Ref = useRef<HTMLAnchorElement>(null);

  // Service 06 Editorial Refs
  const wrap06Ref = useRef<HTMLDivElement>(null);
  const numeral06Ref = useRef<HTMLDivElement>(null);
  const title06Ref = useRef<HTMLHeadingElement>(null);
  const copy06Ref = useRef<HTMLParagraphElement>(null);
  const capabilities06Ref = useRef<HTMLDivElement>(null);
  const cta06Ref = useRef<HTMLAnchorElement>(null);

  // Service 07 Editorial Refs
  const wrap07Ref = useRef<HTMLDivElement>(null);
  const numeral07Ref = useRef<HTMLDivElement>(null);
  const title07Ref = useRef<HTMLHeadingElement>(null);
  const copy07Ref = useRef<HTMLParagraphElement>(null);
  const capabilities07Ref = useRef<HTMLDivElement>(null);
  const cta07Ref = useRef<HTMLAnchorElement>(null);

  // Service 08 Editorial Refs
  const wrap08Ref = useRef<HTMLDivElement>(null);
  const numeral08Ref = useRef<HTMLDivElement>(null);
  const title08Ref = useRef<HTMLHeadingElement>(null);
  const copy08Ref = useRef<HTMLParagraphElement>(null);
  const capabilities08Ref = useRef<HTMLDivElement>(null);
  const cta08Ref = useRef<HTMLAnchorElement>(null);

  // Section 03 Industries Refs (Phase A: Real Estate Environmental Master Composition)
  const industriesWrapRef = useRef<HTMLDivElement>(null);
  const industriesLabelRef = useRef<HTMLDivElement>(null);
  const industriesTitleRef = useRef<HTMLHeadingElement>(null);
  const industriesNavRef = useRef<HTMLDivElement>(null);
  const industriesContentRef = useRef<HTMLDivElement>(null);
  const industriesBridgeRef = useRef<HTMLDivElement>(null);
  const industriesPhotoCardRef = useRef<HTMLDivElement>(null);

  const statusLabelRef = useRef<HTMLDivElement>(null);
  const statusLeftRef = useRef<HTMLSpanElement>(null);
  const statusRightRef = useRef<HTMLSpanElement>(null);

  // Single deterministic progress source for entire Technology Solutions subsystem (zero React re-renders)
  const progressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;

    const trackEl = trackRef.current;
    const introEl = introRef.current;
    const statusEl = statusLabelRef.current;
    const wrap01El = wrap01Ref.current;
    const wrap02El = wrap02Ref.current;
    const wrap03El = wrap03Ref.current;
    const wrap04El = wrap04Ref.current;
    const wrap05El = wrap05Ref.current;
    const wrap06El = wrap06Ref.current;
    const wrap07El = wrap07Ref.current;
    const wrap08El = wrap08Ref.current;
    const industriesWrapEl = industriesWrapRef.current;
    const industriesBridgeEl = industriesBridgeRef.current;
    const industriesPhotoCardEl = industriesPhotoCardRef.current;
    if (!trackEl) return;

    const ctx = gsap.context(() => {
      const services = [
        { wrap: wrap01Ref, numeral: numeral01Ref, title: title01Ref, copy: copy01Ref, capabilities: capabilities01Ref, cta: cta01Ref },
        { wrap: wrap02Ref, numeral: numeral02Ref, title: title02Ref, copy: copy02Ref, capabilities: capabilities02Ref, cta: cta02Ref },
        { wrap: wrap03Ref, numeral: numeral03Ref, title: title03Ref, copy: copy03Ref, capabilities: capabilities03Ref, cta: cta03Ref },
        { wrap: wrap04Ref, numeral: numeral04Ref, title: title04Ref, copy: copy04Ref, capabilities: capabilities04Ref, cta: cta04Ref },
        { wrap: wrap05Ref, numeral: numeral05Ref, title: title05Ref, copy: copy05Ref, capabilities: capabilities05Ref, cta: cta05Ref },
        { wrap: wrap06Ref, numeral: numeral06Ref, title: title06Ref, copy: copy06Ref, capabilities: capabilities06Ref, cta: cta06Ref },
        { wrap: wrap07Ref, numeral: numeral07Ref, title: title07Ref, copy: copy07Ref, capabilities: capabilities07Ref, cta: cta07Ref },
        { wrap: wrap08Ref, numeral: numeral08Ref, title: title08Ref, copy: copy08Ref, capabilities: capabilities08Ref, cta: cta08Ref },
      ];

      const setServiceHidden = (s: typeof services[0]) => {
        if (s.wrap.current) {
          s.wrap.current.style.opacity = "0";
          s.wrap.current.style.pointerEvents = "none";
        }
        if (s.numeral.current) {
          s.numeral.current.style.opacity = "0";
          s.numeral.current.style.transform = "translateY(8px)";
        }
        if (s.title.current) {
          s.title.current.style.opacity = "0";
          s.title.current.style.transform = "translateY(8px)";
        }
        if (s.copy.current) {
          s.copy.current.style.opacity = "0";
          s.copy.current.style.transform = "translateY(8px)";
        }
        if (s.capabilities.current) {
          s.capabilities.current.style.opacity = "0";
          s.capabilities.current.style.transform = "translateY(8px)";
          s.capabilities.current.style.pointerEvents = "none";
        }
        if (s.cta.current) {
          s.cta.current.style.opacity = "0";
          s.cta.current.style.transform = "translateY(6px)";
          s.cta.current.style.pointerEvents = "none";
        }
      };

      const setServiceVisibleStable = (s: typeof services[0]) => {
        if (s.wrap.current) {
          s.wrap.current.style.opacity = "1";
          s.wrap.current.style.transform = "translateY(0px)";
          s.wrap.current.style.pointerEvents = "auto";
        }
        if (s.numeral.current) {
          s.numeral.current.style.opacity = "1";
          s.numeral.current.style.transform = "translateY(0px)";
        }
        if (s.title.current) {
          s.title.current.style.opacity = "1";
          s.title.current.style.transform = "translateY(0px)";
        }
        if (s.copy.current) {
          s.copy.current.style.opacity = "1";
          s.copy.current.style.transform = "translateY(0px)";
        }
        if (s.capabilities.current) {
          s.capabilities.current.style.opacity = "1";
          s.capabilities.current.style.transform = "translateY(0px)";
          s.capabilities.current.style.pointerEvents = "auto";
        }
        if (s.cta.current) {
          s.cta.current.style.opacity = "1";
          s.cta.current.style.transform = "translateY(0px)";
          s.cta.current.style.pointerEvents = "auto";
        }
      };

      const setIndustriesHidden = () => {
        if (industriesWrapRef.current) {
          industriesWrapRef.current.style.opacity = "0";
          industriesWrapRef.current.style.pointerEvents = "none";
        }
        if (industriesLabelRef.current) {
          industriesLabelRef.current.style.opacity = "0";
          industriesLabelRef.current.style.transform = "translateY(8px)";
        }
        if (industriesTitleRef.current) {
          industriesTitleRef.current.style.opacity = "0";
          industriesTitleRef.current.style.transform = "translateY(8px)";
        }
        if (industriesNavRef.current) {
          industriesNavRef.current.style.opacity = "0";
          industriesNavRef.current.style.transform = "translateY(8px)";
        }
        if (industriesContentRef.current) {
          industriesContentRef.current.style.opacity = "0";
          industriesContentRef.current.style.transform = "translateY(8px)";
          Array.from(industriesContentRef.current.children).forEach((child) => {
            (child as HTMLElement).style.opacity = "0";
            (child as HTMLElement).style.transform = "translateY(8px)";
          });
        }
        if (industriesBridgeRef.current) {
          industriesBridgeRef.current.style.opacity = "0";
          industriesBridgeRef.current.style.transform = "translateY(6px)";
        }
        if (industriesPhotoCardRef.current) {
          industriesPhotoCardRef.current.style.opacity = "0";
          industriesPhotoCardRef.current.style.transform = "translateY(8px)";
        }
      };

      const setIndustriesVisibleStable = () => {
        if (industriesWrapRef.current) {
          industriesWrapRef.current.style.opacity = "1";
          industriesWrapRef.current.style.pointerEvents = "auto";
        }
        if (industriesLabelRef.current) {
          industriesLabelRef.current.style.opacity = "1";
          industriesLabelRef.current.style.transform = "translateY(0px)";
        }
        if (industriesTitleRef.current) {
          industriesTitleRef.current.style.opacity = "1";
          industriesTitleRef.current.style.transform = "translateY(0px)";
        }
        if (industriesNavRef.current) {
          industriesNavRef.current.style.opacity = "1";
          industriesNavRef.current.style.transform = "translateY(0px)";
        }
        if (industriesContentRef.current) {
          industriesContentRef.current.style.opacity = "1";
          industriesContentRef.current.style.transform = "translateY(0px)";
          Array.from(industriesContentRef.current.children).forEach((child) => {
            (child as HTMLElement).style.opacity = "1";
            (child as HTMLElement).style.transform = "translateY(0px)";
          });
        }
        if (industriesBridgeRef.current) {
          industriesBridgeRef.current.style.opacity = "1";
          industriesBridgeRef.current.style.transform = "translateY(0px)";
        }
        if (industriesPhotoCardRef.current) {
          industriesPhotoCardRef.current.style.opacity = "1";
          industriesPhotoCardRef.current.style.transform = "translateY(0px)";
        }
      };

      const setServiceTransition = (prev: typeof services[0], next: typeof services[0], t: number) => {
        if (t <= 0.55) {
          // 0–55% PHYSICAL CAMERA TRAVEL
          // Current service content remains fully visible, stable, and readable
          setServiceVisibleStable(prev);
          setServiceHidden(next);
        } else if (t < 0.72) {
          // 55–72% APPROACH
          // Current editorial content gradually reduces opacity with subtle upward drift <= 8px
          const fadeT = (t - 0.55) / (0.72 - 0.55);
          const ease = fadeT * fadeT * (3 - 2 * fadeT);
          const opacity = (1 - ease).toString();
          const shiftY = (-8 * ease).toFixed(1);
          if (prev.wrap.current) {
            prev.wrap.current.style.opacity = opacity;
            prev.wrap.current.style.transform = `translateY(${shiftY}px)`;
            prev.wrap.current.style.pointerEvents = "none";
          }
          setServiceHidden(next);
        } else if (t < 0.82) {
          // 72–82% ARRIVAL
          // Next numeral and title resolve subtly with upward settling <= 8px
          setServiceHidden(prev);
          if (next.wrap.current) {
            next.wrap.current.style.opacity = "1";
            next.wrap.current.style.transform = "translateY(0px)";
            next.wrap.current.style.pointerEvents = "none";
          }
          const arriveT = (t - 0.72) / (0.82 - 0.72);
          const ease = arriveT * arriveT * (3 - 2 * arriveT);
          const numY = (6 * (1 - ease)).toFixed(1);
          const titleY = (8 * (1 - ease)).toFixed(1);
          if (next.numeral.current) {
            next.numeral.current.style.opacity = ease.toString();
            next.numeral.current.style.transform = `translateY(${numY}px)`;
          }
          if (next.title.current) {
            next.title.current.style.opacity = ease.toString();
            next.title.current.style.transform = `translateY(${titleY}px)`;
          }
          if (next.copy.current) {
            next.copy.current.style.opacity = "0";
            next.copy.current.style.transform = "translateY(8px)";
          }
          if (next.capabilities.current) {
            next.capabilities.current.style.opacity = "0";
            next.capabilities.current.style.transform = "translateY(8px)";
            next.capabilities.current.style.pointerEvents = "none";
          }
          if (next.cta.current) {
            next.cta.current.style.opacity = "0";
            next.cta.current.style.transform = "translateY(6px)";
            next.cta.current.style.pointerEvents = "none";
          }
        } else if (t < 0.92) {
          // 82–92% CONTENT RESOLVE
          // Description, capabilities, CTA appear
          setServiceHidden(prev);
          if (next.wrap.current) {
            next.wrap.current.style.opacity = "1";
            next.wrap.current.style.transform = "translateY(0px)";
            next.wrap.current.style.pointerEvents = "none";
          }
          if (next.numeral.current) {
            next.numeral.current.style.opacity = "1";
            next.numeral.current.style.transform = "translateY(0px)";
          }
          if (next.title.current) {
            next.title.current.style.opacity = "1";
            next.title.current.style.transform = "translateY(0px)";
          }
          const resolveT = (t - 0.82) / (0.92 - 0.82);
          const ease = resolveT * resolveT * (3 - 2 * resolveT);
          const copyY = (8 * (1 - ease)).toFixed(1);
          const ctaY = (6 * (1 - ease)).toFixed(1);
          if (next.copy.current) {
            next.copy.current.style.opacity = ease.toString();
            next.copy.current.style.transform = `translateY(${copyY}px)`;
          }
          if (next.capabilities.current) {
            next.capabilities.current.style.opacity = ease.toString();
            next.capabilities.current.style.transform = `translateY(${copyY}px)`;
            next.capabilities.current.style.pointerEvents = ease > 0.8 ? "auto" : "none";
          }
          if (next.cta.current) {
            next.cta.current.style.opacity = ease.toString();
            next.cta.current.style.transform = `translateY(${ctaY}px)`;
            next.cta.current.style.pointerEvents = ease > 0.8 ? "auto" : "none";
          }
        } else {
          // 92–100% READING HOLD
          // Everything is fully visible and stable. Zero additional animation.
          setServiceHidden(prev);
          setServiceVisibleStable(next);
        }
      };

      const applyProgress = (p: number) => {
        progressRef.current = p;
        if (typeof window !== "undefined") {
          (window as unknown as { __techProgress?: number }).__techProgress = p;
        }

        // Reset / Portal Formation Phase (p <= 0.28)
        if (p <= 0.28) {
          if (introEl) {
            introEl.style.opacity = "1";
            introEl.style.transform = "translateY(0px)";
          }
          services.forEach(setServiceHidden);
          setIndustriesHidden();
          if (wrap01Ref.current) {
            wrap01Ref.current.style.opacity = "1";
            wrap01Ref.current.style.transform = "translateY(0px)";
            wrap01Ref.current.style.pointerEvents = "none";
          }
          if (statusEl) {
            statusEl.style.opacity = "0";
          }
          return;
        }

        // 1. Section 02 Introduction Overlay (0.00 -> 0.40 hold, 0.40 -> 0.52 graceful fade out)
        if (introEl) {
          if (p <= 0.40) {
            introEl.style.opacity = "1";
            introEl.style.transform = "translateY(0px)";
          } else if (p >= 0.52) {
            introEl.style.opacity = "0";
            introEl.style.transform = "translateY(-14px)";
          } else {
            const norm = (p - 0.40) / (0.52 - 0.40);
            introEl.style.opacity = (1 - norm).toString();
            introEl.style.transform = `translateY(${(-14 * norm).toFixed(1)}px)`;
          }
        }

        // 2. Ambient Trajectory Indicator (0.35 -> 0.48 fade in as corridor reveals)
        if (statusEl) {
          if (p < 0.35) {
            statusEl.style.opacity = "0";
          } else {
            const labelOpacity = p >= 0.48 ? 1 : (p - 0.35) / (0.48 - 0.35);
            statusEl.style.opacity = labelOpacity.toString();
          }

          if (statusLeftRef.current && statusRightRef.current) {
            const isMobileViewport = typeof window !== "undefined" && window.innerWidth <= 768;
            if (p < 1.60) {
              statusLeftRef.current.textContent = "SYSTEM CORRIDOR // NODE 01 OF 08";
              statusRightRef.current.textContent = "CUSTOM SOFTWARE SOLUTIONS";
            } else if (p < 2.60) {
              statusLeftRef.current.textContent = "SYSTEM CORRIDOR // NODE 02 OF 08";
              statusRightRef.current.textContent = "AI INTEGRATION & AUTOMATION";
            } else if (p < 3.60) {
              statusLeftRef.current.textContent = "SYSTEM CORRIDOR // NODE 03 OF 08";
              statusRightRef.current.textContent = "WEB & APPLICATION DEVELOPMENT";
            } else if (p < 4.60) {
              statusLeftRef.current.textContent = "SYSTEM CORRIDOR // NODE 04 OF 08";
              statusRightRef.current.textContent = "E-COMMERCE SOLUTION";
            } else if (p < 5.60) {
              statusLeftRef.current.textContent = "SYSTEM CORRIDOR // NODE 05 OF 08";
              statusRightRef.current.textContent = "CYBERSECURITY SOLUTIONS";
            } else if (p < 6.60) {
              statusLeftRef.current.textContent = "SYSTEM CORRIDOR // NODE 06 OF 08";
              statusRightRef.current.textContent = "CLOUD & IT SOLUTIONS";
            } else if (p < 7.60) {
              statusLeftRef.current.textContent = "SYSTEM CORRIDOR // NODE 07 OF 08";
              statusRightRef.current.textContent = "DATA & BUSINESS INTELLIGENCE";
            } else if (p < 8.40) {
              statusLeftRef.current.textContent = "SYSTEM CORRIDOR // NODE 08 OF 08";
              statusRightRef.current.textContent = "TECHNOLOGY CONSULTING";
            } else if (p < 9.35) {
              statusLeftRef.current.textContent = isMobileViewport
                ? "COMPLETE SYSTEM // 08 OF 08"
                : "SYSTEM CORRIDOR // COMPLETE SYSTEM";
              statusRightRef.current.textContent = "08 OF 08 CONNECTED CAPABILITIES";
            } else {
              statusLeftRef.current.textContent = isMobileViewport
                ? "INDUSTRIES // 01 OF 06"
                : "03 // INDUSTRIES — 01 REAL ESTATE";
              statusRightRef.current.textContent = "ENVIRONMENTAL APPLICATION";
            }
          }
        }

        // 3. Editorial Choreography Across Nodes 01–08 and Section 03 Industries
        if (p <= 1.0) {
          setIndustriesHidden();
          // Node 01 Entry Special Case: Preserved Hero -> Node 01 formation & arrival choreography
          services.slice(1).forEach(setServiceHidden);

          if (wrap01Ref.current) {
            wrap01Ref.current.style.opacity = "1";
            wrap01Ref.current.style.transform = "translateY(0px)";
            wrap01Ref.current.style.pointerEvents = "auto";
          }

          // "01 // 08 CAPABILITY" numeral (0.62 -> 0.72)
          if (numeral01Ref.current) {
            if (p < 0.62) {
              numeral01Ref.current.style.opacity = "0";
              numeral01Ref.current.style.transform = "translateY(8px)";
            } else if (p >= 0.72) {
              numeral01Ref.current.style.opacity = "1";
              numeral01Ref.current.style.transform = "translateY(0px)";
            } else {
              const norm = (p - 0.62) / (0.72 - 0.62);
              numeral01Ref.current.style.opacity = norm.toString();
              numeral01Ref.current.style.transform = `translateY(${(8 * (1 - norm)).toFixed(1)}px)`;
            }
          }

          // "CUSTOM SOFTWARE SOLUTIONS" (0.72 -> 0.84)
          if (title01Ref.current) {
            if (p < 0.72) {
              title01Ref.current.style.opacity = "0";
              title01Ref.current.style.transform = "translateY(8px)";
            } else if (p >= 0.84) {
              title01Ref.current.style.opacity = "1";
              title01Ref.current.style.transform = "translateY(0px)";
            } else {
              const norm = (p - 0.72) / (0.84 - 0.72);
              title01Ref.current.style.opacity = norm.toString();
              title01Ref.current.style.transform = `translateY(${(8 * (1 - norm)).toFixed(1)}px)`;
            }
          }

          // Supporting copy (0.82 -> 0.90)
          if (copy01Ref.current) {
            if (p < 0.82) {
              copy01Ref.current.style.opacity = "0";
              copy01Ref.current.style.transform = "translateY(8px)";
            } else if (p >= 0.90) {
              copy01Ref.current.style.opacity = "1";
              copy01Ref.current.style.transform = "translateY(0px)";
            } else {
              const norm = (p - 0.82) / (0.90 - 0.82);
              copy01Ref.current.style.opacity = norm.toString();
              copy01Ref.current.style.transform = `translateY(${(8 * (1 - norm)).toFixed(1)}px)`;
            }
          }

          // Capabilities List (0.86 -> 0.94)
          if (capabilities01Ref.current) {
            if (p < 0.86) {
              capabilities01Ref.current.style.opacity = "0";
              capabilities01Ref.current.style.transform = "translateY(8px)";
              capabilities01Ref.current.style.pointerEvents = "none";
            } else if (p >= 0.94) {
              capabilities01Ref.current.style.opacity = "1";
              capabilities01Ref.current.style.transform = "translateY(0px)";
              capabilities01Ref.current.style.pointerEvents = "auto";
            } else {
              const norm = (p - 0.86) / (0.94 - 0.86);
              capabilities01Ref.current.style.opacity = norm.toString();
              capabilities01Ref.current.style.transform = `translateY(${(8 * (1 - norm)).toFixed(1)}px)`;
              capabilities01Ref.current.style.pointerEvents = norm > 0.8 ? "auto" : "none";
            }
          }

          // Action CTA (0.92 -> 0.98)
          if (cta01Ref.current) {
            if (p < 0.92) {
              cta01Ref.current.style.opacity = "0";
              cta01Ref.current.style.transform = "translateY(6px)";
              cta01Ref.current.style.pointerEvents = "none";
            } else if (p >= 0.98) {
              cta01Ref.current.style.opacity = "1";
              cta01Ref.current.style.transform = "translateY(0px)";
              cta01Ref.current.style.pointerEvents = "auto";
            } else {
              const norm = (p - 0.92) / (0.98 - 0.92);
              cta01Ref.current.style.opacity = norm.toString();
              cta01Ref.current.style.transform = `translateY(${(6 * (1 - norm)).toFixed(1)}px)`;
              cta01Ref.current.style.pointerEvents = norm > 0.8 ? "auto" : "none";
            }
          }
        } else if (p <= 8.0) {
          // Journeys for Nodes 02 through 08 (p in [1.0, 8.0])
          // Active segment index: 1 for Node 01->02, ... 7 for Node 07->08
          setIndustriesHidden();
          const segIndex = Math.min(7, Math.floor(p));
          const t = Math.min(1.0, p - segIndex);

          setServiceTransition(services[segIndex - 1], services[segIndex], t);

          for (let j = 0; j < services.length; j++) {
            if (j !== segIndex - 1 && j !== segIndex) {
              setServiceHidden(services[j]);
            }
          }
        } else if (p <= 9.0) {
          // Complete System Overview (p in [8.0, 9.0])
          // Node 08 editorial content remains visible and stable on the left
          // while the camera retreats to reveal the complete 8-node system
          setIndustriesHidden();
          setServiceVisibleStable(services[7]);
          for (let j = 0; j < 7; j++) {
            setServiceHidden(services[j]);
          }
        } else {
          // Section 03 Bridge & Industries Phase A Debut (p in [9.0, 10.0])
          for (let j = 0; j < 7; j++) {
            setServiceHidden(services[j]);
          }

          if (p <= 9.15) {
            // [9.00 - 9.15] Node 08 final state remains stable & complete system overview held
            setServiceVisibleStable(services[7]);
            setIndustriesHidden();
          } else if (p < 9.35) {
            // [9.15 - 9.35] Service 08 editorial dissolves decisively with subtle upward drift
            const norm = (p - 9.15) / (9.35 - 9.15);
            const ease = norm * norm * (3 - 2 * norm);
            if (services[7].wrap.current) {
              services[7].wrap.current.style.opacity = (1 - ease).toString();
              services[7].wrap.current.style.transform = `translateY(${(-8 * ease).toFixed(1)}px)`;
              services[7].wrap.current.style.pointerEvents = "none";
            }
            setIndustriesHidden();
          } else if (p < 9.50) {
            // [9.35 - 9.50] Decisive clearing: Service 08 completely gone, corridor contracting, camera retreating
            setServiceHidden(services[7]);
            setIndustriesHidden();
          } else if (p < 9.75) {
            // [9.50 - 9.75] Section 03 Industries (Phase A: Real Estate) enters naturally
            setServiceHidden(services[7]);

            if (industriesWrapRef.current) {
              industriesWrapRef.current.style.opacity = "1";
              industriesWrapRef.current.style.pointerEvents = "auto";
            }

            // Photo reveals calmly (9.50 -> 9.68)
            const photoNorm = Math.min(1.0, Math.max(0.0, (p - 9.50) / (9.68 - 9.50)));
            const photoEase = photoNorm * photoNorm * (3 - 2 * photoNorm);
            if (industriesPhotoCardRef.current) {
              industriesPhotoCardRef.current.style.opacity = photoEase.toString();
              const photoY = (8 * (1 - photoEase)).toFixed(1);
              industriesPhotoCardRef.current.style.transform = `translateY(${photoY}px)`;
            }

            // Bridge anchor reveals in sync with photo
            if (industriesBridgeRef.current) {
              industriesBridgeRef.current.style.opacity = photoEase.toString();
              const bridgeY = (6 * (1 - photoEase)).toFixed(1);
              industriesBridgeRef.current.style.transform = `translateY(${bridgeY}px)`;
            }

            // Editorial label resolves (9.52 -> 9.68)
            const labelNorm = Math.min(1.0, Math.max(0.0, (p - 9.52) / (9.68 - 9.52)));
            const labelEase = labelNorm * labelNorm * (3 - 2 * labelNorm);
            if (industriesLabelRef.current) {
              industriesLabelRef.current.style.opacity = labelEase.toString();
              industriesLabelRef.current.style.transform = `translateY(${(8 * (1 - labelEase)).toFixed(1)}px)`;
            }

            // Editorial title resolves (9.56 -> 9.72)
            const titleNorm = Math.min(1.0, Math.max(0.0, (p - 9.56) / (9.72 - 9.56)));
            const titleEase = titleNorm * titleNorm * (3 - 2 * titleNorm);
            if (industriesTitleRef.current) {
              industriesTitleRef.current.style.opacity = titleEase.toString();
              industriesTitleRef.current.style.transform = `translateY(${(8 * (1 - titleEase)).toFixed(1)}px)`;
            }

            // Nav selector resolves (9.60 -> 9.74)
            const navNorm = Math.min(1.0, Math.max(0.0, (p - 9.60) / (9.74 - 9.60)));
            const navEase = navNorm * navNorm * (3 - 2 * navNorm);
            if (industriesNavRef.current) {
              industriesNavRef.current.style.opacity = navEase.toString();
              industriesNavRef.current.style.transform = `translateY(${(8 * (1 - navEase)).toFixed(1)}px)`;
            }

            // Description paragraph and CTA resolve (9.64 -> 9.75)
            const contentNorm = Math.min(1.0, Math.max(0.0, (p - 9.64) / (9.75 - 9.64)));
            const contentEase = contentNorm * contentNorm * (3 - 2 * contentNorm);
            if (industriesContentRef.current) {
              const contentY = (8 * (1 - contentEase)).toFixed(1);
              industriesContentRef.current.style.opacity = contentEase.toString();
              industriesContentRef.current.style.transform = `translateY(${contentY}px)`;
              Array.from(industriesContentRef.current.children).forEach((child) => {
                (child as HTMLElement).style.opacity = contentEase.toString();
                (child as HTMLElement).style.transform = `translateY(${contentY}px)`;
              });
            }
          } else {
            // [9.75 - 10.00] Rock-solid stable reading hold of Section 03 Real Estate Master Composition
            setServiceHidden(services[7]);
            setIndustriesVisibleStable();
          }
        }
      };

      // Set initial styles immediately upon mount
      applyProgress(0);

      ScrollTrigger.create({
        trigger: trackEl,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onEnter: (self) => {
          applyProgress(self.progress * 10.0);
        },
        onLeaveBack: () => {
          applyProgress(0);
        },
        onLeave: () => {
          applyProgress(10.0);
        },
        onEnterBack: (self) => {
          applyProgress(self.progress * 10.0);
        },
        onUpdate: (self) => {
          applyProgress(self.progress * 10.0);
        },
      });
    }, trackRef);

    return () => {
      ctx.revert();
      progressRef.current = 0;
      if (introEl) {
        introEl.style.opacity = "";
        introEl.style.transform = "";
      }
      if (wrap01El) {
        wrap01El.style.opacity = "";
        wrap01El.style.transform = "";
      }
      if (wrap02El) {
        wrap02El.style.opacity = "";
        wrap02El.style.transform = "";
      }
      if (wrap03El) {
        wrap03El.style.opacity = "";
        wrap03El.style.transform = "";
      }
      if (wrap04El) {
        wrap04El.style.opacity = "";
        wrap04El.style.transform = "";
      }
      if (wrap05El) {
        wrap05El.style.opacity = "";
        wrap05El.style.transform = "";
      }
      if (wrap06El) {
        wrap06El.style.opacity = "";
        wrap06El.style.transform = "";
      }
      if (wrap07El) {
        wrap07El.style.opacity = "";
        wrap07El.style.transform = "";
      }
      if (wrap08El) {
        wrap08El.style.opacity = "";
        wrap08El.style.transform = "";
      }
      if (industriesWrapEl) {
        industriesWrapEl.style.opacity = "";
        industriesWrapEl.style.pointerEvents = "";
      }
      if (industriesBridgeEl) {
        industriesBridgeEl.style.opacity = "";
        industriesBridgeEl.style.transform = "";
      }
      if (industriesPhotoCardEl) {
        industriesPhotoCardEl.style.opacity = "";
        industriesPhotoCardEl.style.transform = "";
      }
      if (statusEl) {
        statusEl.style.opacity = "";
      }
    };
  }, [reducedMotion]);

  // Reduced Motion Fallback: Clean non-sticky editorial presentation
  if (reducedMotion) {
    return (
      <section
        id="technology-solutions"
        className="relative w-full bg-[#FFF6ED] text-[#111111] py-20 sm:py-28"
        aria-label="Technology Solutions"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B88E68] font-semibold">
                  01 // 08
                </span>
                <span className="h-px w-8 bg-[#B88E68]/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#7A6B5D]">
                  02 // Technology Solutions
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#35261A] uppercase leading-[0.98] mb-6">
                {SERVICE_01.titleLine1}
                <br />
                {SERVICE_01.titleLine2}
              </h2>
              <p className="text-base text-[#5C4A38] leading-relaxed max-w-md mb-6">
                {SERVICE_01.supportingCopy}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8 font-mono text-xs uppercase tracking-wider text-[#7A624E]">
                {SERVICE_01.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#B88E68]" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group"
              >
                <span>Explore Service</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div className="pt-8 border-t border-[#35261A]/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B88E68] font-semibold">
                  02 // 08
                </span>
                <span className="h-px w-8 bg-[#B88E68]/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#7A6B5D]">
                  CAPABILITY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#35261A] uppercase leading-[0.98] mb-6">
                {SERVICE_02.titleLine1}
                <br />
                {SERVICE_02.titleLine2}
              </h2>
              <p className="text-base text-[#5C4A38] leading-relaxed max-w-md mb-6">
                {SERVICE_02.supportingCopy}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8 font-mono text-xs uppercase tracking-wider text-[#7A624E]">
                {SERVICE_02.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#B88E68]" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group"
              >
                <span>Explore Service</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div className="pt-8 border-t border-[#35261A]/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B88E68] font-semibold">
                  03 // 08
                </span>
                <span className="h-px w-8 bg-[#B88E68]/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#7A6B5D]">
                  CAPABILITY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#35261A] uppercase leading-[0.98] mb-6">
                {SERVICE_03.titleLine1}
                <br />
                {SERVICE_03.titleLine2}
              </h2>
              <p className="text-base text-[#5C4A38] leading-relaxed max-w-md mb-6">
                {SERVICE_03.supportingCopy}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8 font-mono text-xs uppercase tracking-wider text-[#7A624E]">
                {SERVICE_03.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#B88E68]" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group"
              >
                <span>Explore Service</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div className="pt-8 border-t border-[#35261A]/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B88E68] font-semibold">
                  04 // 08
                </span>
                <span className="h-px w-8 bg-[#B88E68]/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#7A6B5D]">
                  CAPABILITY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#35261A] uppercase leading-[0.98] mb-6">
                {SERVICE_04.titleLine1}
                <br />
                {SERVICE_04.titleLine2}
              </h2>
              <p className="text-base text-[#5C4A38] leading-relaxed max-w-md mb-6">
                {SERVICE_04.supportingCopy}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8 font-mono text-xs uppercase tracking-wider text-[#7A624E]">
                {SERVICE_04.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#B88E68]" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group"
              >
                <span>Explore Service</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div className="pt-8 border-t border-[#35261A]/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B88E68] font-semibold">
                  05 // 08
                </span>
                <span className="h-px w-8 bg-[#B88E68]/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#7A6B5D]">
                  CAPABILITY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#35261A] uppercase leading-[0.98] mb-6">
                {SERVICE_05.titleLine1}
                <br />
                {SERVICE_05.titleLine2}
              </h2>
              <p className="text-base text-[#5C4A38] leading-relaxed max-w-md mb-6">
                {SERVICE_05.supportingCopy}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8 font-mono text-xs uppercase tracking-wider text-[#7A624E]">
                {SERVICE_05.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#B88E68]" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group"
              >
                <span>Explore Service</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B88E68] font-semibold">
                  06 // 08
                </span>
                <span className="h-px w-8 bg-[#B88E68]/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#7A6B5D]">
                  CAPABILITY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#35261A] uppercase leading-[0.98] mb-6">
                {SERVICE_06.titleLine1}
                <br />
                {SERVICE_06.titleLine2}
              </h2>
              <p className="text-base text-[#5C4A38] leading-relaxed max-w-md mb-6">
                {SERVICE_06.supportingCopy}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8 font-mono text-xs uppercase tracking-wider text-[#7A624E]">
                {SERVICE_06.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#B88E68]" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group"
              >
                <span>Explore Service</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div className="pt-8 border-t border-[#35261A]/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B88E68] font-semibold">
                  07 // 08
                </span>
                <span className="h-px w-8 bg-[#B88E68]/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#7A6B5D]">
                  CAPABILITY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#35261A] uppercase leading-[0.98] mb-6">
                {SERVICE_07.titleLine1}
                <br />
                {SERVICE_07.titleLine2}
              </h2>
              <p className="text-base text-[#5C4A38] leading-relaxed max-w-md mb-6">
                {SERVICE_07.supportingCopy}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8 font-mono text-xs uppercase tracking-wider text-[#7A624E]">
                {SERVICE_07.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#B88E68]" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group"
              >
                <span>Explore Service</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            <div className="pt-8 border-t border-[#35261A]/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#B88E68] font-semibold">
                  08 // 08
                </span>
                <span className="h-px w-8 bg-[#B88E68]/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#7A6B5D]">
                  CAPABILITY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#35261A] uppercase leading-[0.98] mb-6">
                {SERVICE_08.titleLine1}
                <br />
                {SERVICE_08.titleLine2}
              </h2>
              <p className="text-base text-[#5C4A38] leading-relaxed max-w-md mb-6">
                {SERVICE_08.supportingCopy}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-8 font-mono text-xs uppercase tracking-wider text-[#7A624E]">
                {SERVICE_08.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#B88E68]" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group"
              >
                <span>Explore Service</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FFF6ED]">
            <TechnologySystemScene
              theme="light"
              interactive={false}
              autoRotate={false}
              className="size-full"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={trackRef}
      id="technology-solutions-track"
      className="relative w-full min-h-[3500vh] bg-[#FFF6ED] text-[#111111]"
      aria-label="02 Technology Solutions Journey"
    >
      {/* Pinned Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#FFF6ED]">
        {/* Full-Bleed 3D Technology Corridor Canvas (Seamless warm-cream integration) */}
        <div className="absolute inset-0 size-full z-0 pointer-events-auto">
          <TechnologySystemScene
            progressRef={progressRef}
            isStoryMode={true}
            theme="light"
            interactive={true}
            autoRotate={false}
            className="size-full"
          />
        </div>

        {/* Section 02 Introduction Overlay */}
        <div
          ref={introRef}
          style={{ opacity: 1 }}
          className="absolute inset-x-6 sm:inset-x-12 lg:inset-x-16 top-16 sm:top-24 md:top-28 max-w-2xl z-10 pointer-events-none will-change-transform"
        >
          <div className="flex items-center gap-3 mb-2.5 sm:mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B88E68] font-semibold">
              02 // Technology Solutions
            </span>
            <span className="h-px w-8 bg-[#B88E68]/40" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[3rem] font-semibold tracking-[-0.03em] text-[#35261A] uppercase leading-[0.98]">
            Technology Built Around The Business.
          </h2>
        </div>

        {/* Editorial Composition: Mobile UPPER ~45% Safe-Zone / Desktop LEFT 40–45% Safe-Zone */}
        <div className="relative z-10 size-full flex items-start pt-16 sm:pt-20 lg:pt-0 lg:items-center pointer-events-none">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-center">
            {/* Editorial Safe-Zone Container */}
            <div className="lg:col-span-5 xl:col-span-5 text-left pointer-events-none max-w-lg relative">
              {/* Service 01 Editorial Block */}
              <div ref={wrap01Ref} className="w-full will-change-transform">
                <div
                  ref={numeral01Ref}
                  style={{ opacity: 0 }}
                  className="will-change-transform mb-2.5 sm:mb-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#B88E68] uppercase">
                      01 // 08
                    </span>
                    <span className="h-px w-6 sm:w-8 bg-[#B88E68]/40" />
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#7A6B5D] uppercase">
                      CAPABILITY
                    </span>
                  </div>
                </div>

                <h2
                  ref={title01Ref}
                  id="node01-service-title"
                  style={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold uppercase tracking-tight text-[#35261A] leading-[1.0] lg:leading-[0.96] will-change-transform mb-3 sm:mb-5"
                >
                  {SERVICE_01.titleLine1}
                  <br />
                  {SERVICE_01.titleLine2}
                </h2>

                <p
                  ref={copy01Ref}
                  id="node01-service-description"
                  style={{ opacity: 0 }}
                  className="text-xs sm:text-sm text-[#5C4A38] leading-[1.65] sm:leading-relaxed font-normal will-change-transform mb-3 sm:mb-6 select-text max-w-md"
                >
                  {SERVICE_01.supportingCopy}
                </p>

                <div
                  ref={capabilities01Ref}
                  id="node01-service-capabilities"
                  style={{ opacity: 0 }}
                  className="will-change-transform"
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-7 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider text-[#7A624E]">
                    {SERVICE_01.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#B88E68] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center pt-0.5 sm:pt-1">
                    <a
                      ref={cta01Ref}
                      id="node01-service-cta"
                      href="#contact"
                      className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group pointer-events-auto"
                    >
                      <span>Explore Service</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Service 02 Editorial Block (Layered in same space) */}
              <div
                ref={wrap02Ref}
                style={{ opacity: 0 }}
                className="w-full will-change-transform pointer-events-none absolute top-0 left-0"
              >
                <div
                  ref={numeral02Ref}
                  style={{ opacity: 0 }}
                  className="will-change-transform mb-2.5 sm:mb-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#B88E68] uppercase">
                      02 // 08
                    </span>
                    <span className="h-px w-6 sm:w-8 bg-[#B88E68]/40" />
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#7A6B5D] uppercase">
                      CAPABILITY
                    </span>
                  </div>
                </div>

                <h2
                  ref={title02Ref}
                  id="node02-service-title"
                  style={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold uppercase tracking-tight text-[#35261A] leading-[1.0] lg:leading-[0.96] will-change-transform mb-3 sm:mb-5"
                >
                  {SERVICE_02.titleLine1}
                  <br />
                  {SERVICE_02.titleLine2}
                </h2>

                <p
                  ref={copy02Ref}
                  id="node02-service-description"
                  style={{ opacity: 0 }}
                  className="text-xs sm:text-sm text-[#5C4A38] leading-[1.65] sm:leading-relaxed font-normal will-change-transform mb-3 sm:mb-6 select-text max-w-md"
                >
                  {SERVICE_02.supportingCopy}
                </p>

                <div
                  ref={capabilities02Ref}
                  id="node02-service-capabilities"
                  style={{ opacity: 0 }}
                  className="will-change-transform"
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-7 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider text-[#7A624E]">
                    {SERVICE_02.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#B88E68] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center pt-0.5 sm:pt-1">
                    <a
                      ref={cta02Ref}
                      id="node02-service-cta"
                      href="#contact"
                      className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group pointer-events-auto"
                    >
                      <span>Explore Service</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Service 03 Editorial Block (Layered in same space) */}
              <div
                ref={wrap03Ref}
                style={{ opacity: 0 }}
                className="w-full will-change-transform pointer-events-none absolute top-0 left-0"
              >
                <div
                  ref={numeral03Ref}
                  style={{ opacity: 0 }}
                  className="will-change-transform mb-2.5 sm:mb-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#B88E68] uppercase">
                      03 // 08
                    </span>
                    <span className="h-px w-6 sm:w-8 bg-[#B88E68]/40" />
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#7A6B5D] uppercase">
                      CAPABILITY
                    </span>
                  </div>
                </div>

                <h2
                  ref={title03Ref}
                  id="node03-service-title"
                  style={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold uppercase tracking-tight text-[#35261A] leading-[1.0] lg:leading-[0.96] will-change-transform mb-3 sm:mb-5"
                >
                  {SERVICE_03.titleLine1}
                  <br />
                  {SERVICE_03.titleLine2}
                </h2>

                <p
                  ref={copy03Ref}
                  id="node03-service-description"
                  style={{ opacity: 0 }}
                  className="text-xs sm:text-sm text-[#5C4A38] leading-[1.65] sm:leading-relaxed font-normal will-change-transform mb-3 sm:mb-6 select-text max-w-md"
                >
                  {SERVICE_03.supportingCopy}
                </p>

                <div
                  ref={capabilities03Ref}
                  id="node03-service-capabilities"
                  style={{ opacity: 0 }}
                  className="will-change-transform"
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-7 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider text-[#7A624E]">
                    {SERVICE_03.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#B88E68] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center pt-0.5 sm:pt-1">
                    <a
                      ref={cta03Ref}
                      id="node03-service-cta"
                      href="#contact"
                      className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group pointer-events-auto"
                    >
                      <span>Explore Service</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Service 04 Editorial Block (Layered in same space) */}
              <div
                ref={wrap04Ref}
                style={{ opacity: 0 }}
                className="w-full will-change-transform pointer-events-none absolute top-0 left-0"
              >
                <div
                  ref={numeral04Ref}
                  style={{ opacity: 0 }}
                  className="will-change-transform mb-2.5 sm:mb-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#B88E68] uppercase">
                      04 // 08
                    </span>
                    <span className="h-px w-6 sm:w-8 bg-[#B88E68]/40" />
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#7A6B5D] uppercase">
                      CAPABILITY
                    </span>
                  </div>
                </div>

                <h2
                  ref={title04Ref}
                  id="node04-service-title"
                  style={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold uppercase tracking-tight text-[#35261A] leading-[1.0] lg:leading-[0.96] will-change-transform mb-3 sm:mb-5"
                >
                  {SERVICE_04.titleLine1}
                  <br />
                  {SERVICE_04.titleLine2}
                </h2>

                <p
                  ref={copy04Ref}
                  id="node04-service-description"
                  style={{ opacity: 0 }}
                  className="text-xs sm:text-sm text-[#5C4A38] leading-[1.65] sm:leading-relaxed font-normal will-change-transform mb-3 sm:mb-6 select-text max-w-md"
                >
                  {SERVICE_04.supportingCopy}
                </p>

                <div
                  ref={capabilities04Ref}
                  id="node04-service-capabilities"
                  style={{ opacity: 0 }}
                  className="will-change-transform"
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-7 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider text-[#7A624E]">
                    {SERVICE_04.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#B88E68] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center pt-0.5 sm:pt-1">
                    <a
                      ref={cta04Ref}
                      id="node04-service-cta"
                      href="#contact"
                      className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group pointer-events-auto"
                    >
                      <span>Explore Service</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Service 05 Editorial Block (Layered in same space) */}
              <div
                ref={wrap05Ref}
                style={{ opacity: 0 }}
                className="w-full will-change-transform pointer-events-none absolute top-0 left-0"
              >
                <div
                  ref={numeral05Ref}
                  style={{ opacity: 0 }}
                  className="will-change-transform mb-2.5 sm:mb-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#B88E68] uppercase">
                      05 // 08
                    </span>
                    <span className="h-px w-6 sm:w-8 bg-[#B88E68]/40" />
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#7A6B5D] uppercase">
                      CAPABILITY
                    </span>
                  </div>
                </div>

                <h2
                  ref={title05Ref}
                  id="node05-service-title"
                  style={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold uppercase tracking-tight text-[#35261A] leading-[1.0] lg:leading-[0.96] will-change-transform mb-3 sm:mb-5"
                >
                  {SERVICE_05.titleLine1}
                  <br />
                  {SERVICE_05.titleLine2}
                </h2>

                <p
                  ref={copy05Ref}
                  id="node05-service-description"
                  style={{ opacity: 0 }}
                  className="text-xs sm:text-sm text-[#5C4A38] leading-[1.65] sm:leading-relaxed font-normal will-change-transform mb-3 sm:mb-6 select-text max-w-md"
                >
                  {SERVICE_05.supportingCopy}
                </p>

                <div
                  ref={capabilities05Ref}
                  id="node05-service-capabilities"
                  style={{ opacity: 0 }}
                  className="will-change-transform"
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-7 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider text-[#7A624E]">
                    {SERVICE_05.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#B88E68] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center pt-0.5 sm:pt-1">
                    <a
                      ref={cta05Ref}
                      id="node05-service-cta"
                      href="#contact"
                      className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group pointer-events-auto"
                    >
                      <span>Explore Service</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Service 06 Editorial Block (Layered in same space) */}
              <div
                ref={wrap06Ref}
                style={{ opacity: 0 }}
                className="w-full will-change-transform pointer-events-none absolute top-0 left-0"
              >
                <div
                  ref={numeral06Ref}
                  style={{ opacity: 0 }}
                  className="will-change-transform mb-2.5 sm:mb-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#B88E68] uppercase">
                      06 // 08
                    </span>
                    <span className="h-px w-6 sm:w-8 bg-[#B88E68]/40" />
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#7A6B5D] uppercase">
                      CAPABILITY
                    </span>
                  </div>
                </div>

                <h2
                  ref={title06Ref}
                  id="node06-service-title"
                  style={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold uppercase tracking-tight text-[#35261A] leading-[1.0] lg:leading-[0.96] will-change-transform mb-3 sm:mb-5"
                >
                  {SERVICE_06.titleLine1}
                  <br />
                  {SERVICE_06.titleLine2}
                </h2>

                <p
                  ref={copy06Ref}
                  id="node06-service-description"
                  style={{ opacity: 0 }}
                  className="text-xs sm:text-sm text-[#5C4A38] leading-[1.65] sm:leading-relaxed font-normal will-change-transform mb-3 sm:mb-6 select-text max-w-md"
                >
                  {SERVICE_06.supportingCopy}
                </p>

                <div
                  ref={capabilities06Ref}
                  id="node06-service-capabilities"
                  style={{ opacity: 0 }}
                  className="will-change-transform"
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-7 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider text-[#7A624E]">
                    {SERVICE_06.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#B88E68] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center pt-0.5 sm:pt-1">
                    <a
                      ref={cta06Ref}
                      id="node06-service-cta"
                      href="#contact"
                      className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group pointer-events-auto"
                    >
                      <span>Explore Service</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Service 07 Editorial Block */}
              <div
                ref={wrap07Ref}
                style={{ opacity: 0 }}
                className="w-full will-change-transform pointer-events-none absolute top-0 left-0"
              >
                <div
                  ref={numeral07Ref}
                  style={{ opacity: 0 }}
                  className="will-change-transform mb-2.5 sm:mb-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#B88E68] uppercase">
                      07 // 08
                    </span>
                    <span className="h-px w-6 sm:w-8 bg-[#B88E68]/40" />
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#7A6B5D] uppercase">
                      CAPABILITY
                    </span>
                  </div>
                </div>

                <h2
                  ref={title07Ref}
                  id="node07-service-title"
                  style={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold uppercase tracking-tight text-[#35261A] leading-[1.0] lg:leading-[0.96] will-change-transform mb-3 sm:mb-5"
                >
                  {SERVICE_07.titleLine1}
                  <br />
                  {SERVICE_07.titleLine2}
                </h2>

                <p
                  ref={copy07Ref}
                  id="node07-service-description"
                  style={{ opacity: 0 }}
                  className="text-xs sm:text-sm text-[#5C4A38] leading-[1.65] sm:leading-relaxed font-normal will-change-transform mb-3 sm:mb-6 select-text max-w-md"
                >
                  {SERVICE_07.supportingCopy}
                </p>

                <div
                  ref={capabilities07Ref}
                  id="node07-service-capabilities"
                  style={{ opacity: 0 }}
                  className="will-change-transform"
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-7 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider text-[#7A624E]">
                    {SERVICE_07.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#B88E68] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center pt-0.5 sm:pt-1">
                    <a
                      ref={cta07Ref}
                      id="node07-service-cta"
                      href="#contact"
                      className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group pointer-events-auto"
                    >
                      <span>Explore Service</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Service 08 Editorial Block (Final Capability & Complete System Anchor) */}
              <div
                ref={wrap08Ref}
                style={{ opacity: 0 }}
                className="w-full will-change-transform pointer-events-none absolute top-0 left-0"
              >
                <div
                  ref={numeral08Ref}
                  style={{ opacity: 0 }}
                  className="will-change-transform mb-2.5 sm:mb-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#B88E68] uppercase">
                      08 // 08
                    </span>
                    <span className="h-px w-6 sm:w-8 bg-[#B88E68]/40" />
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#7A6B5D] uppercase">
                      CAPABILITY
                    </span>
                  </div>
                </div>

                <h2
                  ref={title08Ref}
                  id="node08-service-title"
                  style={{ opacity: 0 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold uppercase tracking-tight text-[#35261A] leading-[1.0] lg:leading-[0.96] will-change-transform mb-3 sm:mb-5"
                >
                  {SERVICE_08.titleLine1}
                  <br />
                  {SERVICE_08.titleLine2}
                </h2>

                <p
                  ref={copy08Ref}
                  id="node08-service-description"
                  style={{ opacity: 0 }}
                  className="text-xs sm:text-sm text-[#5C4A38] leading-[1.65] sm:leading-relaxed font-normal will-change-transform mb-3 sm:mb-6 select-text max-w-md"
                >
                  {SERVICE_08.supportingCopy}
                </p>

                <div
                  ref={capabilities08Ref}
                  id="node08-service-capabilities"
                  style={{ opacity: 0 }}
                  className="will-change-transform"
                >
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2.5 mb-4 sm:mb-7 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider text-[#7A624E]">
                    {SERVICE_08.capabilities.map((cap) => (
                      <li key={cap} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#B88E68] shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center pt-0.5 sm:pt-1">
                    <a
                      ref={cta08Ref}
                      id="node08-service-cta"
                      href="#contact"
                      className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#4A3725] transition-colors group pointer-events-auto"
                    >
                      <span>Explore Service</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 55–60% 3D Landmark Space */}
            <div className="hidden lg:block lg:col-span-7 xl:col-span-7 pointer-events-none" />
          </div>
        </div>

        {/* Section 03 Industries — Phase A: Real Estate Environmental Master Composition */}
        <div
          ref={industriesWrapRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 size-full z-20 flex items-center pointer-events-none"
        >
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center min-h-[72vh] pt-20 sm:pt-24 lg:pt-0">
            {/* Left Editorial Safe-Zone (~42%, Desktop lg:col-span-5) */}
            <div className="contents lg:block lg:col-span-5 text-left pointer-events-none max-w-xl relative">
              {/* Section Numeral / Subtitle (Mobile order-1) */}
              <div
                ref={industriesLabelRef}
                style={{ opacity: 0 }}
                className="order-1 will-change-transform mb-2.5 sm:mb-4"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#B88E68] uppercase">
                    03 // 06
                  </span>
                  <span className="h-px w-6 sm:w-8 bg-[#B88E68]/40" />
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#7A6B5D] uppercase">
                    INDUSTRIES WE SERVE
                  </span>
                </div>
              </div>

              {/* Editorial Title (Mobile order-2) */}
              <h2
                ref={industriesTitleRef}
                id="industry-01-title"
                style={{ opacity: 0 }}
                className="order-2 text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-semibold uppercase tracking-tight text-[#35261A] leading-[1.0] lg:leading-[0.96] will-change-transform mb-3 sm:mb-5"
              >
                REAL ESTATE &amp; <br className="hidden sm:inline" />
                PROPERTY TECH
              </h2>

              {/* Vertical / Horizontal Industry Directory (01 Real Estate active, 02–06 restrained) */}
              <div
                ref={industriesNavRef}
                style={{ opacity: 0 }}
                className="hidden lg:block will-change-transform mb-4 sm:mb-6"
              >
                <div className="flex flex-wrap gap-2 sm:gap-2.5 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider">
                  {INDUSTRIES.map((ind) => (
                    <span
                      key={ind.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors ${
                        ind.active
                          ? "bg-[#35261A] text-[#FFF6ED] border-[#35261A] font-semibold shadow-sm"
                          : "bg-transparent text-[#7A6B5D]/60 border-[#7A6B5D]/20 font-normal"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          ind.active ? "bg-[#B88E68]" : "bg-[#7A6B5D]/40"
                        }`}
                      />
                      <span>
                        {ind.id} {ind.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Industry Narrative & CTA (Mobile order-3 & order-6) */}
              <div
                ref={industriesContentRef}
                style={{ opacity: 0 }}
                className="contents lg:block will-change-transform"
              >
                <p
                  id="industry-01-description"
                  className="order-3 text-xs sm:text-sm lg:text-base text-[#5C4A38] leading-[1.65] sm:leading-relaxed font-normal will-change-transform mb-4 sm:mb-6 select-text max-w-md"
                >
                  {INDUSTRIES[0].description}
                </p>

                <div className="order-3 flex items-center pt-1 sm:pt-2 mb-3 lg:mb-0">
                  <a
                    id="industry-01-cta"
                    href="#contact"
                    className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#35261A] font-semibold hover:text-[#B88E68] transition-colors group pointer-events-auto"
                  >
                    <span>Discover Solutions</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right ~58% Spatial Physical Environment (Desktop lg:col-span-7, Mobile order-4 & order-5) */}
            <div className="contents lg:block lg:col-span-7 relative pointer-events-none">
              <div className="contents lg:flex lg:flex-col lg:justify-center lg:items-end w-full relative">
                {/* 3D Architectural Spatial Viewport (Clean transparent window to persistent 3D Canvas, zero clutter) */}
                <div
                  ref={industriesPhotoCardRef}
                  style={{ opacity: 0 }}
                  className="order-4 relative w-full h-[32vh] sm:h-[40vh] lg:h-[62vh] max-h-[620px] will-change-transform pointer-events-none"
                />

                {/* Quiet structural ref preserving GSAP hook without visual clutter */}
                <div
                  ref={industriesBridgeRef}
                  style={{ opacity: 0 }}
                  className="order-5 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Trajectory Indicator (Zero dividers, pure whitespace) */}
        <div
          ref={statusLabelRef}
          style={{ opacity: 0 }}
          className="absolute bottom-6 inset-x-6 sm:inset-x-12 flex items-center justify-between z-10 pointer-events-none font-mono text-[11px] text-[#7A6B5D]/60 tracking-wider select-none will-change-[opacity]"
        >
          <span ref={statusLeftRef} className="pl-12 sm:pl-0">SYSTEM CORRIDOR // NODE 01 OF 08</span>
          <span ref={statusRightRef} className="hidden sm:inline">CUSTOM SOFTWARE SOLUTIONS</span>
        </div>
      </div>
    </section>
  );
}
