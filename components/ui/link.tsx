import * as React from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center gap-1 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xs",
  {
    variants: {
      variant: {
        default:
          "text-primary underline-offset-4 hover:underline font-medium hover:text-primary/85",
        nav: "text-foreground/80 hover:text-foreground text-sm font-medium py-1 px-1.5 transition-colors",
        subtle: "text-muted-foreground hover:text-foreground text-sm",
        arrow:
          "text-primary font-medium group/link hover:text-primary/85 inline-flex items-center gap-1",
        footer:
          "text-muted-foreground hover:text-foreground text-sm transition-colors py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    NextLinkProps,
    VariantProps<typeof linkVariants> {
  external?: boolean;
  showExternalIcon?: boolean;
}

export function Link({
  href,
  variant,
  external,
  showExternalIcon = false,
  className,
  children,
  ...props
}: LinkProps) {
  const isExternal =
    external ??
    (typeof href === "string" &&
      (href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")));

  if (isExternal) {
    return (
      <a
        href={href.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkVariants({ variant, className }))}
        {...props}
      >
        {children}
        {showExternalIcon && (
          <ArrowUpRight
            className="size-3.5 opacity-70 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={cn(linkVariants({ variant, className }))}
      {...props}
    >
      {children}
      {variant === "arrow" && (
        <ArrowUpRight
          className="size-3.5 opacity-70 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </NextLink>
  );
}
