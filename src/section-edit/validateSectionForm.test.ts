import { describe, expect, it } from "vitest";
import { validateSectionForm } from "./validateSectionForm";

const validate = validateSectionForm({
  title: "Title is required",
  description: "Description is required",
});

describe("validateSectionForm", () => {
  it("returns no errors for valid input", () => {
    expect(
      validate({ title: "Personal", description: "Your info", cols: 1 }),
    ).toEqual({});
  });

  it("requires title and description", () => {
    expect(validate({ title: "  ", description: "", cols: 2 })).toEqual({
      title: "Title is required",
      description: "Description is required",
    });
  });
});
