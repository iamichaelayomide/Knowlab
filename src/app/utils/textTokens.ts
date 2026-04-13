export const TEXT_TOKENS = {
  separator: " | ",
  arrow: "->",
  ellipsis: "...",
} as const;

export function joinWithSeparator(parts: Array<string | number | null | undefined>) {
  return parts.filter((part) => part !== null && part !== undefined && `${part}`.trim().length > 0).join(TEXT_TOKENS.separator);
}
