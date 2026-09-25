import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- Heading Component ---

const headingVariants = cva("font-sans font-semibold tracking-tight text-foreground", {
  variants: {
    size: {
      display:
        "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.08]",
      h1: "text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.025em] leading-[1.15]",
      h2: "text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.02em] leading-[1.2]",
      h3: "text-xl sm:text-2xl font-medium tracking-[-0.015em] leading-[1.3]",
      h4: "text-lg sm:text-xl font-medium tracking-[-0.01em] leading-[1.35]",
      h5: "text-base sm:text-lg font-medium tracking-normal leading-[1.4]",
      h6: "text-sm sm:text-base font-medium tracking-normal leading-[1.4]",
    },
    intent: {
      default: "text-foreground",
      primary: "text-primary",
      muted: "text-muted-foreground",
      inverted: "text-warm-cream",
    },
  },
  defaultVariants: {
    size: "h2",
    intent: "default",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({
  as: Component = "h2",
  size,
  intent,
  className,
  children,
  ...props
}: HeadingProps) {
  // If size is not explicitly passed, infer it from the HTML element
  const resolvedSize = size ?? (Component as VariantProps<typeof headingVariants>["size"]);

  return (
    <Component
      className={cn(headingVariants({ size: resolvedSize, intent, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

// --- Text Component ---

const textVariants = cva("font-sans", {
  variants: {
    variant: {
      lead: "text-lg sm:text-xl font-normal leading-relaxed text-muted-foreground",
      body: "text-base font-normal leading-relaxed text-foreground",
      small: "text-sm font-normal leading-normal text-muted-foreground",
      caption: "text-xs font-normal leading-normal text-muted-foreground",
      mono: "font-mono text-sm tracking-tight text-foreground",
    },
    intent: {
      default: "",
      muted: "text-muted-foreground",
      primary: "text-primary",
      inverted: "text-warm-cream",
      invertedMuted: "text-warm-cream/70",
    },
  },
  defaultVariants: {
    variant: "body",
    intent: "default",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

export function Text({
  as: Component = "p",
  variant,
  intent,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(textVariants({ variant, intent, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

// --- Eyebrow / Label Component ---

const eyebrowVariants = cva(
  "inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.12em] uppercase",
  {
    variants: {
      intent: {
        default: "text-primary",
        muted: "text-muted-foreground",
        inverted: "text-warm-cream/80",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

export interface EyebrowProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof eyebrowVariants> {
  dot?: boolean;
}

export function Eyebrow({
  intent,
  dot = true,
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <span className={cn(eyebrowVariants({ intent, className }))} {...props}>
      {dot && (
        <span
          className="size-1.5 rounded-full bg-current opacity-80"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

// --- Code Component ---

export function Code({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-foreground font-normal",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
