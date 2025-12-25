import { render, screen } from "@testing-library/react";
import About from "../About";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("About", () => {
  it("should render About Me heading", () => {
    render(<About />);
    expect(screen.getByText("About Me")).toBeInTheDocument();
  });

  it("should render personal bio", () => {
    render(<About />);
    expect(screen.getByText(/programmer by profession/i)).toBeInTheDocument();
  });

  it("should render experience card", () => {
    render(<About />);
    expect(screen.getByText("13 years")).toBeInTheDocument();
    expect(screen.getByText("Professional Experience")).toBeInTheDocument();
  });

  it("should render major companies card", () => {
    render(<About />);
    expect(screen.getByText("6+")).toBeInTheDocument();
    expect(screen.getByText("Major Companies")).toBeInTheDocument();
  });

  it("should render technologies mastered card", () => {
    render(<About />);
    expect(screen.getByText("20+")).toBeInTheDocument();
    expect(screen.getByText("Technologies Mastered")).toBeInTheDocument();
  });

  it("should have correct structure with cards", () => {
    const { container } = render(<About />);
    const cards = container.querySelectorAll("[class*='card']");
    expect(cards.length).toBeGreaterThan(0);
  });
});
