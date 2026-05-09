import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-[var(--surface-border-strong)] placeholder:text-[var(--text-tertiary)] focus-visible:border-[var(--accent-primary)] focus-visible:ring-[var(--accent-glow)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-[100px] w-full rounded-md border bg-[var(--surface-card)] px-[14px] py-3 text-[15px] leading-[1.6] text-[var(--text-primary)] shadow-xs transition-[color,box-shadow,border-color,background] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
