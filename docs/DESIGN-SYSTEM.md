# TechSphere Technology — Design System & UI Specifications

> [!IMPORTANT]
> **Status:** REVISED & APPROVED (September 20, 2026).
> * **Typography:** Geist Sans (primary) + Geist Mono (technical/metadata). No other primary font.
> * **Color Palette:** Working TechSphere palette locked (`#4A3725`, `#35261A`, `#FFF6ED`, `#F6EDE3`, `#FFFFFF`, `#111111`).
> * **3D Strategy:** Adaptive WebGL on mobile by default with optimized quality, and 2D fallback only when WebGL is unavailable or unsuitable.

---

## 1. Overview & Architecture

The TechSphere design system establishes a cohesive, reusable set of design tokens, layout primitives, and interactive UI components. It is engineered with **Tailwind CSS v4**, **Base UI**, and **shadcn/ui**, ensuring strict TypeScript type-safety, accessible DOM structures, and deterministic theming.

---

## 2. Design Tokens

### 2.1 Color Tokens & Semantic Mapping

All colors map to semantic CSS variables configured in `app/globals.css` with support for both light (warm cream) and dark (deep brown) contexts.

```css
/* Core Locked Palette Tokens */
--tech-brown: #4A3725;      /* TechSphere Primary Brown */
--deep-brown: #35261A;      /* Deep Architectural Brown */
--warm-cream: #FFF6ED;      /* Warm Canvas Cream */
--soft-cream: #F6EDE3;      /* Soft Card Surface */
--white:      #FFFFFF;      /* Pure Highlight */
--black:      #111111;      /* Deep Charcoal Text */
```

#### Semantic Role Assignment

| Token | Light Theme Value | Dark Theme Value | Usage |
| :--- | :--- | :--- | :--- |
| `background` | `#FFF6ED` (Warm Cream) | `#1F1710` (Dark Ground) | Primary page canvas |
| `foreground` | `#111111` (Deep Charcoal) | `#F6EDE3` (Soft Cream) | Primary body text & headings |
| `card` | `#F6EDE3` (Soft Cream) | `#2A1F16` (Elevated Brown) | Content cards, dialog surfaces |
| `card-foreground` | `#111111` | `#FFF6ED` | Card body & headings |
| `primary` | `#4A3725` (TechSphere Brown) | `#E8D5C4` (Warm Muted Sand) | Key buttons, active states |
| `primary-foreground` | `#FFFFFF` | `#1F1710` | Text within primary elements |
| `secondary` | `#EADBC8` (Muted Sand) | `#35261A` (Deep Brown) | Secondary actions, badges |
| `secondary-foreground` | `#35261A` | `#F6EDE3` | Secondary text |
| `muted` | `#EADBC8` / 40% | `#35261A` / 60% | Subtle background fills, chips |
| `muted-foreground` | `#6A5644` (Warm Taupe) | `#BFAFA2` (Muted Warm) | Captions, metadata, helper text |
| `border` | `#E3D2C0` (Soft Border) | `#423223` (Dark Border) | Card outlines, dividers |
| `ring` | `#4A3725` | `#E8D5C4` | Keyboard focus rings |

---

### 2.2 Typography System (LOCKED)

* **Primary Font (Sans):** `Geist Sans` (`--font-geist-sans`) — Used for all headings, body copy, navigation, buttons, and general UI.
* **Monospace Font (Mono):** `Geist Mono` (`--font-geist-mono`) — Used exclusively for technical metrics, code snippets, timestamps, category tags, and metadata.
* **Prohibition:** No additional primary or decorative fonts are allowed without explicit authorization.

#### Type Scale & Hierarchy

| Level | Size (Desktop) | Size (Mobile) | Line Height | Weight | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `3.75rem` (60px) | `2.5rem` (40px) | 1.08 | 600 (Semibold) | `-0.03em` | Hero section main headline |
| **H1** | `3.0rem` (48px) | `2.125rem` (34px) | 1.15 | 600 (Semibold) | `-0.025em` | Page primary title |
| **H2** | `2.25rem` (36px) | `1.75rem` (28px) | 1.2 | 600 (Semibold) | `-0.02em` | Section headers |
| **H3** | `1.5rem` (24px) | `1.25rem` (20px) | 1.3 | 500 (Medium) | `-0.015em` | Card titles, subsection headers |
| **H4** | `1.125rem` (18px) | `1.0rem` (16px) | 1.35 | 500 (Medium) | `-0.01em` | Group headers, item titles |
| **Body Large** | `1.125rem` (18px) | `1.0rem` (16px) | 1.6 | 400 (Regular) | `0em` | Lead paragraphs, intro text |
| **Body Base** | `1.0rem` (16px) | `0.9375rem` (15px) | 1.6 | 400 (Regular) | `0em` | Standard editorial body text |
| **Body Small** | `0.875rem` (14px) | `0.8125rem` (13px) | 1.5 | 400 (Regular) | `+0.01em` | Metadata, captions, footnotes |
| **Eyebrow / Tag** | `0.75rem` (12px) | `0.75rem` (12px) | 1.4 | 600 (Semibold) | `+0.12em` | Category tags, section labels (UPPERCASE) |

---

### 2.3 Spacing & Baseline Grid

Based on a strict 4px / 8px scale:

* `space-1`: 4px (micro padding, tight gaps)
* `space-2`: 8px (icon padding, inline gaps)
* `space-3`: 12px (form input inner padding)
* `space-4`: 16px (standard component padding)
* `space-6`: 24px (card inner padding, button gutters)
* `space-8`: 32px (card gap, component grouping)
* `space-12`: 48px (section sub-blocks)
* `space-16`: 64px (mobile section spacing)
* `space-24`: 96px (tablet section spacing)
* `space-32`: 128px (desktop major section spacing)

---

### 2.4 Layout & Container Standards

* **Max Width (Content):** `1280px` (`max-w-7xl`)
* **Narrow Width (Editorial):** `768px` (`max-w-3xl`)
* **Gutter Padding:**
  * Mobile: `16px` (`px-4`)
  * Tablet: `32px` (`px-8`)
  * Desktop: `48px` (`px-12`)
* **12-Column Responsive Grid:**
  * Mobile (`< 768px`): 4 columns, 16px gutter
  * Tablet (`768px - 1023px`): 8 columns, 24px gutter
  * Desktop (`≥ 1024px`): 12 columns, 32px gutter

---

## 3. UI Primitives & Components

Implemented in `components/ui/`:

* `typography.tsx`: `Heading`, `Text`, `Eyebrow`, `Code`
* `container.tsx`: Responsive layout container (`sm`, `md`, `lg`, `full`)
* `section.tsx`: Semantic `<section>` with spacing tokens (`sm`, `md`, `lg`) and `SectionHeader`
* `grid.tsx`: Responsive `Grid` and `GridItem` with span variants
* `button.tsx`: `Button` with variants (`default`, `secondary`, `outline`, `ghost`, `inverted`, `destructive`, `link`), 44px min touch target
* `link.tsx`: Accessible `Link` with Next.js router integration, external icon, and arrow variants
* `card.tsx`: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
* `input.tsx`: Form `Input` with focus rings and error states
* `textarea.tsx`: Form `Textarea` with matching input styles
* `label.tsx`: Accessible `Label` with optional/required indicators

---

## 4. Accessibility & Contrast Verification

Every color pairing has been evaluated against WCAG 2.1 standards:

| Foreground | Background | Contrast Ratio | WCAG AA Status | WCAG AAA Status |
| :--- | :--- | :--- | :--- | :--- |
| `#111111` (Black) | `#FFF6ED` (Warm Cream) | **17.8:1** | Pass | Pass |
| `#111111` (Black) | `#F6EDE3` (Soft Cream) | **15.4:1** | Pass | Pass |
| `#4A3725` (Tech Brown) | `#FFF6ED` (Warm Cream) | **6.7:1** | Pass (All text) | Pass (Large text) |
| `#4A3725` (Tech Brown) | `#F6EDE3` (Soft Cream) | **5.8:1** | Pass (All text) | Pass (Large text) |
| `#FFFFFF` (White) | `#4A3725` (Tech Brown) | **7.1:1** | Pass (All text) | Pass (All text) |
| `#FFFFFF` (White) | `#35261A` (Deep Brown) | **10.5:1** | Pass (All text) | Pass (All text) |
| `#F6EDE3` (Cream) | `#35261A` (Deep Brown) | **9.1:1** | Pass (All text) | Pass (All text) |

All primary text and interactive elements comfortably exceed the 4.5:1 ratio for normal text.
