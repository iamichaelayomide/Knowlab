import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "kl-input file:text-foreground placeholder:text-[var(--text-tertiary)] selection:bg-[var(--accent-glow)] selection:text-[var(--text-primary)] flex h-[44px] w-full min-w-0 border border-[var(--surface-border-strong)] bg-[var(--surface-card)] px-4 py-1 text-[15px] text-[var(--text-primary)] shadow-xs transition-[color,box-shadow,border-color,background] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[var(--surface-border-strong)] focus-visible:ring-[var(--accent-glow)] focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
