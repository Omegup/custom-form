import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AllInEditor } from "./AllInEditor";

const libraryPanel = () => {
  const heading = screen.getByText("Library");
  const panel = heading.closest("div");
  if (!panel) throw new Error("Library panel not found");
  return within(panel);
};

describe("AllInEditor", () => {
  it("adds a field from the library after save", async () => {
    const user = userEvent.setup();
    render(<AllInEditor />);

    expect(screen.getAllByText("Name")).toHaveLength(1);
    expect(screen.queryByDisplayValue("New field")).not.toBeInTheDocument();

    await user.click(libraryPanel().getByRole("button", { name: /text field/i }));

    const nameInput = await screen.findByDisplayValue("New field");
    expect(nameInput).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText("New field", { selector: "span" })).toBeInTheDocument();
    expect(screen.queryByDisplayValue("New field")).not.toBeInTheDocument();
    expect(screen.getAllByText("Name")).toHaveLength(1);
  });

  it("adds a field from a column add slot after save", async () => {
    const user = userEvent.setup();
    render(<AllInEditor />);

    const sections = screen.getAllByRole("button", { name: "Edit section" });
    const personal = sections[0]!.closest("section");
    expect(personal).toBeTruthy();

    const addButtons = within(personal!).getAllByRole("button", { name: /text field/i });
    await user.click(addButtons[addButtons.length - 1]!);

    await screen.findByDisplayValue("New field");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(screen.getAllByText("New field", { selector: "span" }).length).toBeGreaterThanOrEqual(1);
  });

  it("does not save when the name is cleared", async () => {
    const user = userEvent.setup();
    render(<AllInEditor />);

    await user.click(libraryPanel().getByRole("button", { name: /text field/i }));
    const nameInput = await screen.findByDisplayValue("New field");
    await user.clear(nameInput);
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    expect(screen.getByText("Add field")).toBeInTheDocument();
    expect(screen.queryByText("New field", { selector: "span" })).not.toBeInTheDocument();
  });
});
