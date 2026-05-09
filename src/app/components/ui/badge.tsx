import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-[9px] py-[3px] text-[11px] font-semibold uppercase tracking-[0.04em] transition-[color,box-shadow,background,border-color] before:size-[5px] before:shrink-0 before:rounded-full before:bg-current [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--accent-glow)] text-[var(--accent-blue)] [a&]:hover:bg-[var(--accent-glow)]",
        secondary:
          "border-[var(--surface-border)] bg-[var(--surface-base)] text-[var(--text-secondary)] [a&]:hover:bg-[var(--surface-raised)]",
        destructive:
          "border-transparent bg-[rgba(255,59,48,0.12)] text-[var(--destructive)] [a&]:hover:bg-[rgba(255,59,48,0.16)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-[var(--surface-border)] bg-[var(--surface-base)] text-[var(--text-secondary)] [a&]:hover:bg-[var(--accent-glow)] [a&]:hover:text-[var(--accent-blue)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
