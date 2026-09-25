import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  requiredIndicator?: boolean;
}

export function Label({
  requiredIndicator = false,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "text-xs font-semibold uppercase tracking-wider text-foreground select-none inline-flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      {requiredIndicator && (
        <span className="text-destructive font-normal" title="Required">
          *
        </span>
      )}
    </label>
  );
}
