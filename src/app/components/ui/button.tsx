import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex h-[38px] items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-[14px] font-semibold tracking-[-0.01em] transition-all duration-fast ease-smooth disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive:
          "border border-white/15 bg-[linear-gradient(135deg,rgba(255,59,48,0.90),rgba(220,38,30,0.95))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(255,59,48,0.25)] hover:scale-[1.02] active:scale-[0.97] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-[var(--surface-border-strong)] bg-[var(--glass-bg)] text-[var(--text-primary)] shadow-glass backdrop-blur-md hover:bg-[var(--surface-card)] hover:shadow-sm",
        secondary:
          "border border-[var(--surface-border-strong)] bg-[var(--glass-bg)] text-[var(--text-primary)] shadow-glass backdrop-blur-md hover:bg-[var(--surface-card)] hover:shadow-sm",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--surface-base)] hover:text-[var(--text-primary)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[38px] px-[18px] has-[>svg]:px-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 text-[13px] has-[>svg]:px-2.5",
        lg: "h-11 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-sm p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
