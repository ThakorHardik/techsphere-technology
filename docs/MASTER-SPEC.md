# TechSphere Technology — Website Master Specification

## 1. Executive Summary & Project Purpose

TechSphere Technology is establishing its premier digital presence. The website serves as the primary touchpoint for enterprise clients, partners, prospective talent, and industry stakeholders. 

The website's core purpose is to communicate TechSphere's capability as a trusted, scalable, and forward-looking technology partner that builds practical digital infrastructure. It translates the company's brand statement—*"Building Technology That Moves Businesses Forward"*—into a cohesive, high-performance web experience.

---

## 2. Core Brand Truth & Positioning

* **Company Name:** TechSphere Technology
* **Existing Positioning:** *"IT Solutions That Makes Business Forward"*
* **Existing Brand Statement:** *"Building Technology That Moves Businesses Forward."*
* **Mission:** TechSphere Technology exists to help businesses harness technology to solve complex challenges, improve efficiency, and build scalable digital infrastructure.
* **Core Value Proposition:** A technology solutions partner delivering practical, secure, and future-ready solutions across Web, Software, AI, Automation, Cloud, and Cybersecurity.
* **Core Creative Concept:** **Connected Technology**
  $$\text{Individual Points} \longrightarrow \text{Connection} \longrightarrow \text{System} \longrightarrow \text{Technology} \longrightarrow \text{Business Movement}$$
* **Visual Anchor:** The proprietary **dotted/halftone sphere mark** derived from the TechSphere identity, evolved into a dynamic 3D visual language.

---

## 3. Core Guiding Principles

1. **Content & Engineering Over Novelty:** Visual effects, 3D scenes, and animations exist strictly to support storytelling, clarify complex concepts, and guide user focus. No animation or 3D element will be added purely for spectacle.
2. **Graceful Degradation & Inclusivity:** The website must remain fully functional, legible, and visually refined when 3D rendering is disabled, WebGL is unavailable, or `prefers-reduced-motion` is active.
3. **Strict Truthfulness:** The site contains only confirmed information. No fictional case studies, synthetic testimonials, placeholder metrics, or unverified claims will ever be published.
4. **Performance as a Core Feature:** Target sub-second First Contentful Paint (FCP), 60 FPS rendering on modern displays, lightweight initial bundle sizes, and zero blocking 3D assets.
5. **Architectural Separation:** Strict decoupling between public presentation, interactive client systems, and protected administrative/CMS capabilities.

---

## 4. Master Sitemap & Route Hierarchy

### 4.1 Public Routes
* `/` — Primary Brand & Capability Experience (Homepage)
* `/services` — Comprehensive Solutions Overview
  * `/services/[slug]` — Deep-dive for each of the 8 core service categories
* `/industries` — Industry Focus Overview
  * `/industries/[slug]` — Tailored solutions per industry vertical
* `/work` — Project & Case Studies Index
  * `/work/[slug]` — In-depth Case Study Details
* `/company` — Mission, Core Values, Leadership, Growth Vision, and Culture
* `/insights` — Thought Leadership, Articles, and Engineering Updates
  * `/insights/[slug]` — Article Detail Page
* `/careers` — Culture, Opportunities, and Open Roles
  * `/careers/[slug]` — Role Specification & Application Portal
* `/contact` — Direct Inquiry & Consultation Intake
* `/privacy` — Privacy Policy & Data Governance
* `/terms` — Terms of Service

### 4.2 Administrative / Protected Routes (CMS)
* `/admin` — Authentication & Session Verification
* `/admin/dashboard` — Platform Telemetry & Content Overview
* `/admin/inquiries` — Contact Form Submissions & Lead Management
* `/admin/applications` — Career Applications & Resume Processing
* `/admin/services` — Service Catalog & Capabilities Management
* `/admin/industries` — Industry Verticals & Solution Matrices
* `/admin/case-studies` — Case Study Authoring & Technology Tagging
* `/admin/blog` — Editorial Workflow, Articles, Categories, and Tags
* `/admin/careers` — Job Requisitions & Role Status
* `/admin/team` — Leadership & Team Profiles
* `/admin/testimonials` — Client Testimonials & Verifications
* `/admin/media` — Central Asset & Media Library
* `/admin/settings` — Global Site Configuration & Social Channels

---

## 5. Homepage Information Architecture

The homepage is structured as a progressive narrative across 12 distinct sections:

| Index | Section Name | Strategic Purpose | Visual / Interactive Role |
| :--- | :--- | :--- | :--- |
| **01** | **Intro / Loading** | Graceful asset pre-buffering & brand anchor reveal | Subtle dot-formation transition; prevents layout shifts |
| **02** | **Hero** | Value proposition & brand statement | Interactive 3D Dotted Sphere; dynamic mouse/scroll reaction |
| **03** | **Business Problem** | Address modern enterprise friction & fragmentation | Content-focused typography with subtle particle dispersion |
| **04** | **What We Do** | Present 8 core technology solution categories | Structured grid with clean hover states and capability cues |
| **05** | **Connected Systems** | Demonstrate end-to-end technological integration | 3D Sphere transitions into interconnected network lines |
| **06** | **Industries** | Domain expertise across key sectors | Sector-specific tabs/cards with focused solutions |
| **07** | **Work / Case Studies** | Proof of execution and engineering rigor | High-contrast showcase cards with verified deliverables |
| **08** | **About TechSphere** | Mission, engineering philosophy, and identity | Clean editorial layout highlighting the "Connected" mindset |
| **09** | **Core Values** | Foundation of trust, security, and scalability | Minimalist typographic cards highlighting the 6 core values |
| **10** | **Growth Vision** | Strategic roadmap (India → UAE → USA → Global) | Linear visual trajectory demonstrating geographic expansion |
| **11** | **Final CTA** | Primary conversion point for enterprise consultation | High-contrast call-to-action with direct action triggers |
| **12** | **Footer** | Secondary navigation, legal, and company directory | Comprehensive semantic directory with copyright & links |

---

## 6. Multi-Phase Implementation Roadmap

```
[Phase 1: Architecture & Docs]  <-- CURRENT STAGE
       │
       ▼
[Phase 2: Design System & Primitives]
       │
       ▼
[Phase 3: 3D & Motion Core Engine]
       │
       ▼
[Phase 4: Public Pages & Content Integration]
       │
       ▼
[Phase 5: Supabase Backend & Admin CMS]
       │
       ▼
[Phase 6: A11y, Performance Tuning & Deployment]
```

* **Phase 1 (Current):** System architecture, directory structure, and foundational documentation across `/docs/`.
* **Phase 2:** Implement Tailwind CSS v4 design tokens, color palette, typography, Base UI/shadcn primitives, and layout shells.
* **Phase 3:** Build the R3F Dotted Sphere engine, particle states, GSAP ScrollTrigger timeline bindings, and fallback states.
* **Phase 4:** Assemble public routes, services catalog, industry matrices, contact forms, and static content shells.
* **Phase 5:** Setup Supabase client, database migrations, authentication, RLS policies, and admin management screens.
* **Phase 6:** Accessibility audit (WCAG 2.1 AA), Core Web Vitals optimization, SEO structured data, and production readiness.

---

## 7. Quality Standards & Non-Negotiables

1. **Accessibility (a11y):** Must adhere to WCAG 2.1 Level AA. High contrast ratios on all text elements against cream/brown surfaces. Keyboard navigable with distinct focus indicators.
2. **Core Web Vitals:**
   * **LCP (Largest Contentful Paint):** $\le 2.0\text{s}$
   * **INP (Interaction to Next Paint):** $\le 150\text{ms}$
   * **CLS (Cumulative Layout Shift):** $\le 0.05$
3. **No Synthetic Content:** When data is pending, it must be marked with `[REQUIRES COMPANY INFORMATION]`. No placeholder lorem ipsum or fabricated case studies.
4. **Resilient 3D Canvas:** The Canvas container must catch WebGL context losses gracefully and failover to a lightweight SVG/CSS dot matrix without breaking page flow.
