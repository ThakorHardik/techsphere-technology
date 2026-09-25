import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridVariants = cva("grid w-full", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
      12: "grid-cols-12",
    },
    gap: {
      none: "gap-0",
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-10 lg:gap-12",
    },
  },
  defaultVariants: {
    cols: 3,
    gap: "md",
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  as?: "div" | "section";
}

export function Grid({
  as: Component = "div",
  cols,
  gap,
  className,
  children,
  ...props
}: GridProps) {
  return (
    <Component
      className={cn(gridVariants({ cols, gap, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

// --- Grid Item with Spans ---

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 6 | 12 | "full";
  className?: string;
  as?: "div" | "article" | "section";
}

const colSpanClasses: Record<NonNullable<GridItemProps["colSpan"]>, string> = {
  1: "col-span-1",
  2: "col-span-1 md:col-span-2",
  3: "col-span-1 md:col-span-2 lg:col-span-3",
  4: "col-span-1 md:col-span-2 lg:col-span-4",
  6: "col-span-1 md:col-span-3 lg:col-span-6",
  12: "col-span-12",
  full: "col-span-full",
};

export function GridItem({
  as: Component = "div",
  colSpan,
  className,
  children,
  ...props
}: GridItemProps) {
  return (
    <Component
      className={cn(colSpan && colSpanClasses[colSpan], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
