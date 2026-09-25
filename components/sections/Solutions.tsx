"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import {
  MotionSection,
  Reveal,
  SlideUp,
  Stagger,
  FadeIn,
} from "@/components/motion";
import { TechSphereScene } from "@/components/three/TechSphereScene";
import { cn } from "@/lib/utils";

interface SolutionItem {
  id: string;
  number: string;
  code: string;
  title: string;
  capabilities: string[];
}

/**
 * 8 Confirmed Technology Solutions from verified source material:
 * /docs/source-material/TECHSPHERE-BRAND-CONTENT.md (Sections 6 & 7)
 */
const SOLUTIONS: SolutionItem[] = [
  {
    id: "custom-software",
    number: "01",
    code: "SOL.01",
    title: "Custom Software Solutions",
    capabilities: [
      "Enterprise Software",
      "Workflow Automation",
      "CRM & ERP Solutions",
      "API & System Integrations",
    ],
  },
  {
    id: "ai-automation",
    number: "02",
    code: "SOL.02",
    title: "AI Integration & Automation",
    capabilities: [
      "Intelligent Automation",
      "AI-Powered Workflows",
      "Decision Systems",
      "Process Optimization",
    ],
  },
  {
    id: "web-app-dev",
    number: "03",
    code: "SOL.03",
    title: "Web & Application Development",
    capabilities: [
      "Web Applications",
      "Custom Applications",
      "Digital Products",
      "System Architecture",
    ],
  },
  {
    id: "ecommerce",
    number: "04",
    code: "SOL.04",
    title: "E-Commerce Solution",
    capabilities: [
      "Custom E-Commerce",
      "Marketplace Platforms",
      "Payment Integrations",
      "Inventory & Order Systems",
    ],
  },
  {
    id: "cybersecurity",
    number: "05",
    code: "SOL.05",
    title: "Cybersecurity Solutions",
    capabilities: [
      "Security Assessment",
      "Vulnerability Management",
      "Data Protection",
      "Application Security",
    ],
  },
  {
    id: "cloud-it",
    number: "06",
    code: "SOL.06",
    title: "Cloud & IT Solutions",
    capabilities: [
      "Cloud Migration",
      "Infrastructure Setup",
      "Optimization & Backup",
      "Ongoing Technology Support",
    ],
  },
  {
    id: "data-bi",
    number: "07",
    code: "SOL.07",
    title: "Data & Business Intelligence",
    capabilities: [
      "Data-Driven Decisions",
      "Analytics & Reporting",
      "Business Intelligence",
      "Unified Telemetry",
    ],
  },
  {
    id: "tech-consulting",
    number: "08",
    code: "SOL.08",
    title: "Technology Consulting",
    capabilities: [
      "Practical Consulting",
      "Architecture Strategy",
      "System Modernization",
      "Solutions Advisory",
    ],
  },
];

/**
 * Solutions Section
 *
 * Transitions the visitor from the problem (fragmented systems, disconnected data)
 * into TechSphere's connected capability architecture.
 *
 * Architectural Editorial Composition:
 * - Left / Upper Region:
 *   - Technical Eyebrow: `02 // TECHNOLOGY SOLUTIONS`
 *   - Dominant Architectural Heading: `TECHNOLOGY BUILT AROUND THE BUSINESS.`
 *   - Source-supported narrative: practical, secure, future-ready solutions
 *   - Integrated TechSphere 3D companion scene:
 *     Smoothly transforms from PARTICLES (0.00) through reconnecting particles (0.50)
 *     to full CONNECTIONS (1.00) driven by section scroll progress.
 * - Right / Central Region:
 *   - 8 Confirmed Solutions arranged as a unified capability architecture
 *   - Restrained hairline connections, node markers, and verified capability tags
 */
export function Solutions() {
  return (
    <MotionSection
      id="solutions-section"
      as="section"
      className="relative w-full overflow-hidden bg-background py-20 sm:py-28 lg:py-36 border-b border-border/40"
      aria-label="Technology Solutions"
    >
      <Container size="lg" className="relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 items-start">
          {/* ========================================================= */}
          {/* LEFT / UPPER REGION: Editorial Capability Anchor            */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-start text-left z-10">
            {/* 1. Technical Eyebrow */}
            <Reveal direction="up" distance={16} delay={0.05}>
              <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4 sm:mb-5">
                <span
                  className="inline-block size-1.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span>02 // Technology Solutions</span>
              </div>
            </Reveal>

            {/* 2. Dominant Architectural Editorial Heading */}
            <SlideUp distance={24} delay={0.12}>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.15rem] font-semibold tracking-[-0.035em] leading-[1.04] uppercase text-foreground mb-6 sm:mb-8 select-text">
                Technology Built
                <br />
                Around The Business.
              </h2>
            </SlideUp>

            {/* 3. Supporting Source-Based Narrative */}
            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[28rem] font-normal mb-8 select-text">
                We deliver practical, secure, and future-ready solutions designed
                to solve complex challenges, simplify operations, and build
                scalable digital infrastructure.
              </p>
            </FadeIn>

            {/* 4. Technical System Metadata Callout */}
            <FadeIn delay={0.28}>
              <div className="pt-6 border-t border-border/40 font-mono text-xs text-muted-foreground flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider">
                  <span>Architecture State:</span>
                  <span className="text-foreground font-semibold">
                    Unified Capabilities
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider">
                  <span>Active System Nodes:</span>
                  <span className="text-foreground font-semibold">
                    08 Connected Solutions
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider">
                  <span>Deployment Model:</span>
                  <span className="text-foreground font-semibold">
                    Modular &amp; Scalable
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ========================================================= */}
          {/* RIGHT / CENTRAL REGION: Connected Capability Architecture   */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-7 relative flex flex-col justify-start">
            {/* Ambient TechSphere 3D Companion Layer (Scroll-Driven PARTICLES -> CONNECTIONS) */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-[560px] h-[440px] sm:h-[520px] lg:h-[600px] opacity-25 sm:opacity-35 lg:opacity-40 pointer-events-none z-0"
              aria-hidden="true"
            >
              <TechSphereScene
                state="particles"
                targetState="connections"
                triggerId="solutions-section"
                theme="light"
                interactive={false}
                autoRotate={true}
                className="size-full"
              />
            </div>

            {/* Architecture Section Header */}
            <div className="relative z-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground pb-4 mb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block size-1.5 rounded-full bg-primary/60"
                  aria-hidden="true"
                />
                <span>Capability Matrix // 08 Core Solutions</span>
              </div>
              <span className="hidden sm:inline-block">Status: Interoperable</span>
            </div>

            {/* The 8 Confirmed Solutions as a Connected Capability System */}
            <Stagger
              staggerDelay={0.05}
              childSelector=".solution-node"
              className="relative z-10 flex flex-col gap-3"
            >
              {SOLUTIONS.map((solution) => (
                <div
                  key={solution.id}
                  tabIndex={0}
                  role="article"
                  aria-label={`${solution.number} ${solution.title}`}
                  className={cn(
                    "solution-node group relative flex flex-col",
                    "p-4 sm:p-5 rounded-none bg-background/85 backdrop-blur-xs",
                    "border border-border/60 hover:border-primary/60 focus-visible:border-primary",
                    "transition-all duration-300 ease-out",
                    "hover:translate-x-1 sm:hover:translate-x-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                    "cursor-default select-text"
                  )}
                >
                  {/* Connected Line Marker (Visual representation of shared technology system) */}
                  <div
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-px bg-border/80 hidden lg:block group-hover:bg-primary/60 transition-colors"
                    aria-hidden="true"
                  />

                  {/* Halftone Node Indicator */}
                  <span
                    className="absolute -left-4 top-1/2 -translate-y-1/2 size-2 rounded-full border border-primary/40 bg-background hidden lg:block group-hover:border-primary group-hover:bg-primary transition-colors"
                    aria-hidden="true"
                  />

                  {/* Top Row: Numeric Index, Title, and System Code */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-2.5">
                    <div className="flex items-baseline gap-3 sm:gap-4">
                      <span className="font-mono text-xs sm:text-sm font-semibold text-primary/70 group-hover:text-primary transition-colors">
                        {solution.number}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {solution.title}
                      </h3>
                    </div>

                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground self-start sm:self-auto">
                      {solution.code}
                    </span>
                  </div>

                  {/* Bottom Row: Verified Capability Tags */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
                    {solution.capabilities.map((cap, capIndex) => (
                      <React.Fragment key={cap}>
                        <span className="group-hover:text-foreground/90 transition-colors">
                          {cap}
                        </span>
                        {capIndex < solution.capabilities.length - 1 && (
                          <span
                            className="text-border/60 select-none"
                            aria-hidden="true"
                          >
                            /
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </Stagger>

            {/* Bottom System Integration Footer */}
            <div className="relative z-10 mt-6 pt-4 border-t border-dashed border-border/60 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>System Interconnect: Unified</span>
              <span className="text-primary font-semibold">
                End-to-End Delivery //
              </span>
            </div>
          </div>
        </div>
      </Container>
    </MotionSection>
  );
}
