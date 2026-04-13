import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppThemeProvider } from "./AppThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("dark"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("persists theme preference using knowlab-theme storage key", async () => {
    render(
      <AppThemeProvider>
        <ThemeToggle />
      </AppThemeProvider>,
    );

    const toggleButton = await screen.findByRole("button", { name: /mode/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const stored = localStorage.getItem("knowlab-theme");
      expect(stored === "light" || stored === "dark").toBe(true);
    });
  });
});
