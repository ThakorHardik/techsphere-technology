import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl transition-all duration-200 relative overflow-hidden", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground border border-border",
      outline: "bg-transparent text-foreground border border-border/80",
      elevated:
        "bg-card text-card-foreground border border-border shadow-xs",
      interactive:
        "bg-card text-card-foreground border border-border hover:border-primary/40 hover:shadow-xs cursor-pointer focus-within:ring-2 focus-within:ring-ring",
      surface:
        "bg-warm-cream text-foreground border border-border/60",
    },
    padding: {
      none: "p-0",
      sm: "p-4 sm:p-6",
      default: "p-6 sm:p-8",
      lg: "p-8 sm:p-10",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: "div" | "section" | "article" | "aside";
}

export function Card({
  as: Component = "div",
  variant,
  padding,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-foreground", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex items-center gap-3 pt-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}
