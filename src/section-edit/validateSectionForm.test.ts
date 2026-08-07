import { describe, expect, it } from "vitest";
import { validateSectionForm } from "./validateSectionForm";

const validate = validateSectionForm({
  title: "Title is required",
  description: "Description is required",
});

describe("validateSectionForm", () => {
  it("returns no errors for filled fields", () => {
    expect(
      validate({ title: "Personal", description: "Your info", cols: 2 }),
    ).toEqual({});
  });

  it("rejects an empty or whitespace title", () => {
    expect(validate({ title: "  ", description: "Your info", cols: 1 })).toEqual(
      { title: "Title is required" },
    );
  });

  it("rejects an empty description and reports both errors together", () => {
    expect(validate({ title: "Personal", description: "", cols: 1 })).toEqual({
      description: "Description is required",
    });
    expect(validate({ title: "", description: "", cols: 1 })).toEqual({
      title: "Title is required",
      description: "Description is required",
    });
  });
});
