import { render, screen } from "@testing-library/react";
import { PixelIcon } from "../PixelIcon";

describe("PixelIcon", () => {
  it("should render with default props", () => {
    render(<PixelIcon name="test-icon" />);
    const img = screen.getByAltText("test-icon");
    expect(img).toBeInTheDocument();
  });

  it("should render with custom variant", () => {
    render(<PixelIcon name="github" variant="brands" />);
    const img = screen.getByAltText("github");
    expect(img).toHaveAttribute("src", "/icons/brands/github.svg");
  });

  it("should render with custom dimensions", () => {
    render(<PixelIcon name="test-icon" width={32} height={32} />);
    const img = screen.getByAltText("test-icon");
    expect(img).toHaveAttribute("width", "32");
    expect(img).toHaveAttribute("height", "32");
  });

  it("should apply custom className", () => {
    render(<PixelIcon name="test-icon" className="custom-class" />);
    const img = screen.getByAltText("test-icon");
    expect(img).toHaveClass("custom-class");
  });

  it("should use solid variant by default", () => {
    render(<PixelIcon name="test-icon" />);
    const img = screen.getByAltText("test-icon");
    expect(img).toHaveAttribute("src", "/icons/solid/test-icon.svg");
  });
});
