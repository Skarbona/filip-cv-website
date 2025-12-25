import { getTechColor } from "../techColors";

describe("getTechColor", () => {
  it("should return correct color for React", () => {
    const result = getTechColor("React");
    expect(result).toContain("blue");
  });

  it("should return correct color for TypeScript", () => {
    const result = getTechColor("TypeScript");
    expect(result).toContain("blue");
  });

  it("should return correct color for Node.js", () => {
    const result = getTechColor("Node.js");
    expect(result).toContain("green");
  });

  it("should return default color for unknown technology", () => {
    const result = getTechColor("UnknownTech");
    expect(result).toContain("slate");
  });

  it("should be case-sensitive", () => {
    const result1 = getTechColor("React");
    const result2 = getTechColor("react");
    expect(result1).not.toBe(result2);
  });
});
