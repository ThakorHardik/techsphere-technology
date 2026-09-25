import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Eyebrow, Heading, Text } from "./typography";

// --- Section Wrapper ---

const sectionVariants = cva("relative w-full overflow-hidden", {
  variants: {
    spacing: {
      none: "py-0",
      sm: "py-10 sm:py-14 lg:py-16",
      md: "py-16 sm:py-20 lg:py-24",
      lg: "py-20 sm:py-28 lg:py-32",
    },
    variant: {
      default: "bg-background text-foreground",
      surface: "bg-card text-card-foreground border-y border-border/50",
      inverted: "bg-deep-brown text-warm-cream border-y border-tech-brown/30",
      transparent: "bg-transparent text-foreground",
    },
  },
  defaultVariants: {
    spacing: "md",
    variant: "default",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "article" | "main";
}

export function Section({
  as: Component = "section",
  spacing,
  variant,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(sectionVariants({ spacing, variant, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

// --- Section Header Component ---

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverted?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
  className,
  ...props
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "mb-12 sm:mb-16",
        isCentered ? "mx-auto text-center max-w-3xl" : "max-w-3xl",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <div className={cn("mb-3", isCentered && "flex justify-center")}>
          <Eyebrow intent={inverted ? "inverted" : "default"}>
            {eyebrow}
          </Eyebrow>
        </div>
      )}
      <Heading
        as="h2"
        size="h2"
        intent={inverted ? "inverted" : "default"}
        className="mb-4"
      >
        {title}
      </Heading>
      {description && (
        <Text
          variant="lead"
          intent={inverted ? "invertedMuted" : "muted"}
          className="text-base sm:text-lg"
        >
          {description}
        </Text>
      )}
    </div>
  );
}
