import { describe, expect, it } from "vitest";
import { EDIT_FORM_INITIAL } from "./fixtures";
import { consolidateSections } from "./consolidateSections";

describe("consolidateSections", () => {
  it("groups flat items into sections with column slots", () => {
    const sections = consolidateSections(EDIT_FORM_INITIAL);
    expect(sections).toHaveLength(2);
    expect(sections[0]!.header.title).toBe("Personal");
    expect(sections[0]!.items[0]![0]!.header.params.name).toBe("Name");
    expect(sections[0]!.items[1]![0]!.header.params.name).toBe("Email");
    expect(sections[1]!.header.title).toBe("Details");
    expect(sections[1]!.items[0]![0]!.header.params.name).toBe("Notes");
  });
});
