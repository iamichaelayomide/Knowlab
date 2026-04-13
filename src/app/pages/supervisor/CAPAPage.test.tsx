import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CAPA_ITEMS } from "../../data/mockData";
import CAPAPage from "./CAPAPage";

describe("CAPAPage edit mode", () => {
  beforeEach(() => {
    localStorage.removeItem("knowlab_capa_updates_v1");
  });

  it("is read-only by default and only becomes editable after clicking edit", () => {
    const { container } = render(<CAPAPage />);
    const firstTitle = CAPA_ITEMS[0]?.title ?? "";

    const expandButton = screen.getByRole("button", { name: new RegExp(firstTitle, "i") });
    fireEvent.click(expandButton);

    expect(screen.getByText(/Read-only mode/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Edit item/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Save changes/i })).not.toBeInTheDocument();
    expect(container.querySelectorAll("textarea").length).toBe(0);

    fireEvent.click(screen.getByRole("button", { name: /Edit item/i }));

    expect(screen.getByText(/Edit mode enabled/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save changes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(container.querySelectorAll("textarea").length).toBeGreaterThan(0);
  });
});
