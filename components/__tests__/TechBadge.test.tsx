import { render, screen } from "@testing-library/react";
import { TechBadge } from "../TechBadge";

describe("TechBadge", () => {
  it("should render React badge with correct color", () => {
    render(<TechBadge tech="React" />);
    const badge = screen.getByText("React");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-blue-100");
  });

  it("should render TypeScript badge with correct color", () => {
    render(<TechBadge tech="TypeScript" />);
    const badge = screen.getByText("TypeScript");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-blue-100");
  });

  it("should render Node.js badge with correct color", () => {
    render(<TechBadge tech="Node.js" />);
    const badge = screen.getByText("Node.js");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-100");
  });

  it("should apply custom className", () => {
    render(<TechBadge tech="React" className="custom-class" />);
    const badge = screen.getByText("React");
    expect(badge).toHaveClass("custom-class");
  });

  it("should render unknown tech with default color", () => {
    render(<TechBadge tech="UnknownTech" />);
    const badge = screen.getByText("UnknownTech");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-slate-100");
  });
});
